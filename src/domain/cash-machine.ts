import { isIntegerOrFail, isPositiveOrFail } from '../shared/validations-util'
import { ValidationError } from '../domain/errors/validation-error'
import { IMoneyRespository } from './interfaces/IMoney-repository'
import { Money } from '../domain/money'
import { constants } from '../shared/constants'

export class CashMachine {
  constructor (
    private readonly moneyRepository: IMoneyRespository
  ) {}

  async withdraw (valueToWithdraw: number): Promise<Money[]> {
    this.validateValueToWithdrawOrFail(valueToWithdraw)

    const availableMoney = await this.moneyRepository.getAvailableMoney('DESC')

    const moneyToWithdraw = this.recursiveWithdraw(valueToWithdraw, availableMoney)
    const sumMoney = this.sumMoney(moneyToWithdraw)

    if (sumMoney !== valueToWithdraw) {
      throw new ValidationError(constants.notExistsEnoughOrFeasibleMoneyInCashMachine)
    }

    for (const money of moneyToWithdraw) {
      const idx = availableMoney.findIndex((m) => m.value === money.value)
      availableMoney[idx].remove(money.getQuantity())
    }

    await this.moneyRepository.update(availableMoney)

    return moneyToWithdraw
  }

  private validateValueToWithdrawOrFail (value: number): void {
    isPositiveOrFail(value, constants.moneyValueToWithdrawIsNotPositiveError)
    isIntegerOrFail(value, constants.moneyValueToWithdrawIsNotIntergerError)
  }

  private recursiveWithdraw (valueToWithdraw: number, [currentMoney, ...availableMoney]: Money[]): Money[] {
    if (valueToWithdraw <= 0 || !currentMoney) return []

    const idealQuantity = Math.floor(valueToWithdraw / currentMoney.value)
    const effectiveQuantity = Math.min(idealQuantity, currentMoney.getQuantity())
    const effectiveMoneyValue = (currentMoney.value * effectiveQuantity)

    return effectiveQuantity
      ? [
          new Money(currentMoney.value, effectiveQuantity),
          ...this.recursiveWithdraw((valueToWithdraw - effectiveMoneyValue), availableMoney)
        ]
      : this.recursiveWithdraw((valueToWithdraw - effectiveMoneyValue), availableMoney)
  }

  private sumMoney (money: Money[]): number {
    if (!money.length) {
      return 0
    }

    return money
      .map((money) => money.value * money.getQuantity())
      .reduce((prev, curr) => prev + curr)
  }

  async configAvailablesMoney (money: Money[]): Promise<void> {
    this.validateIfValuesNotRepeatedOrFail(money)
    await this.moneyRepository.update(money)
    return await Promise.resolve()
  }

  private validateIfValuesNotRepeatedOrFail (money: Money[]): void {
    const isUniqueMoneyValues = money.length === new Set(money.map((money) => money.value)).size
    if (!isUniqueMoneyValues) {
      throw new ValidationError(constants.availablesMoneyIsNotRepeated)
    }
  }
}
