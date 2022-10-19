import { Money, MoneyValue } from '../../domain/money'
import { IMoneyRespository, OrderMoneyValue } from '../../domain/interfaces/IMoney-repository'

class MemoryMoneyRepository implements IMoneyRespository {
  private money: Money[]
  constructor () {
    this.money = [
      new Money(MoneyValue.ONE_HUNDRED, 10),
      new Money(MoneyValue.FIFTY, 20),
      new Money(MoneyValue.TWENTY, 50),
      new Money(MoneyValue.TEN, 100)
    ]
  }

  async getAvailableMoney (orderValue: OrderMoneyValue): Promise<Money[]> {
    return await Promise.resolve(this.money
      .sort((a: Money, b: Money) => orderValue === 'ASC' ? (a.value - b.value) : (b.value - a.value)))
  }

  async update (cash: Money[]): Promise<void> {
    for (const money of cash) {
      const idx = this.money.findIndex((m) => m.value === money.value)
      this.money[idx] = money
    }
  }
}

export const memoryMoneyRepository = new MemoryMoneyRepository()
