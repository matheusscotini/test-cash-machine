import { Money } from '../money'

export type OrderMoneyValue = 'ASC' | 'DESC'

export interface IMoneyRespository {

  getAvailableMoney: (orderValue: OrderMoneyValue) => Promise<Money[]>

  update: (money: Money[]) => Promise<void>
}
