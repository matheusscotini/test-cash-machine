import { isIntegerOrFail, isMinOrFail, isPositiveOrFail } from '../shared/validations-util'
import { ValidationError } from './errors/validation-error'
import { constants } from '../shared/constants'

export enum MoneyValue {
  TEN = 10,
  TWENTY = 20,
  FIFTY = 50,
  ONE_HUNDRED = 100
}
export class Money {
  constructor (
    readonly value: MoneyValue,
    private quantity: number
  ) {
    this.validateValueOrFail(value)
    this.validateQuantityOrFail(quantity)
  }

  getQuantity (): number {
    return this.quantity
  }

  static get possibleValues (): number[] {
    const possibleValues: number[] = Object.keys(MoneyValue)
      .filter(key => typeof MoneyValue[key as any] === 'number')
      .map(key => MoneyValue[key as any] as any)
    return possibleValues
  }

  remove (quantity: number): void {
    this.validateQuantityOrFail(quantity)

    const diffQuantity = this.quantity - quantity
    if (diffQuantity < 0) {
      throw new ValidationError(constants.moneyQuantityExceededLimitError)
    }

    this.quantity -= quantity
  }

  private validateValueOrFail (value: number): void {
    isIntegerOrFail(value, constants.moneyValueIsNotIntergerError)
    isPositiveOrFail(value, constants.moneyValueIsNotPositiveError)

    if (!Money.possibleValues.includes(value)) {
      throw new ValidationError(constants.moneyValueIsNotPossibleValuesError)
    }
  }

  private validateQuantityOrFail (quantity: number): void {
    isIntegerOrFail(quantity, constants.moneyQuantityIsNotIntergerError)
    isMinOrFail(0, quantity, constants.moneyQuantityInvalidError)
  }
}
