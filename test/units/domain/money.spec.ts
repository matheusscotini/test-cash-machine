import { constants } from '../../../src/shared/constants'
import { ValidationError } from '../../../src/domain/errors/validation-error'
import { Money } from '../../../src/domain/money'

describe('Money', () => {
  describe('Success', () => {
    test('Create object with valid values passed in constructor', () => {
      const money = new Money(10, 10)
      expect(money.value).toBe(10)
      expect(money.getQuantity()).toBe(10)
    })

    test('Remove quantity of money', () => {
      const money = new Money(10, 10)
      money.remove(1)
      expect(money.getQuantity()).toBe(9)
      money.remove(9)
      expect(money.getQuantity()).toBe(0)
    })

    test('Get Possible values of Money', () => {
      expect(Money.possibleValues).toEqual([10, 20, 50, 100])
    })
  })

  describe('Throws ValidationError', () => {
    test('Not send a valid value when creating the object', () => {
      expect(() => new Money(-10, 10)).toThrowError(new ValidationError(constants.moneyValueIsNotPositiveError))
      expect(() => new Money(0, 10)).toThrowError(new ValidationError(constants.moneyValueIsNotPositiveError))
      expect(() => new Money(10.5, 10)).toThrowError(new ValidationError(constants.moneyValueIsNotIntergerError))
      expect(() => new Money(2, 10)).toThrowError(new ValidationError(constants.moneyValueIsNotPossibleValuesError))
    })

    test('Not send a valid quantity when creating the object', () => {
      expect(() => new Money(10, -10)).toThrowError(new ValidationError(constants.moneyQuantityInvalidError))
      expect(() => new Money(10, 10.5)).toThrowError(new ValidationError(constants.moneyQuantityIsNotIntergerError))
    })

    test('Not send a valid quantity when remove quantity of money', () => {
      const money = new Money(10, 10)
      expect(() => money.remove(-10)).toThrowError(new ValidationError(constants.moneyQuantityInvalidError))
      expect(() => money.remove(10.5)).toThrowError(new ValidationError(constants.moneyQuantityIsNotIntergerError))
      expect(() => money.remove(11)).toThrowError(new ValidationError(constants.moneyQuantityExceededLimitError))
    })
  })
})
