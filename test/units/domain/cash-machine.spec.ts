import { Money, MoneyValue } from '../../../src/domain/money'
import { CashMachine } from '../../../src/domain/cash-machine'
import { ValidationError } from '../../../src/domain/errors/validation-error'
import { constants } from '../../../src/shared/constants'
import { PersistenceError } from '../../../src/domain/errors/persistence-error'

describe('Money', () => {
  const mockMoneyRepository = {
    getAvailableMoney: jest.fn(),
    update: jest.fn()
  }

  const resetMocks = (): void => {
    mockMoneyRepository.getAvailableMoney.mockResolvedValue([
      new Money(MoneyValue.ONE_HUNDRED, 10),
      new Money(MoneyValue.FIFTY, 20),
      new Money(MoneyValue.TWENTY, 50),
      new Money(MoneyValue.TEN, 100)
    ])
    mockMoneyRepository.update.mockResolvedValue(undefined)
  }

  beforeEach(async () => {
    resetMocks()
  })

  describe('Withdraw', () => {
    describe('Success', () => {
      test('Withdraw money from cash machine', async () => {
        const cashMachine = new CashMachine(mockMoneyRepository)
        // Valor Total em notas: R$ 4.000,00

        expect(await cashMachine.withdraw(30)).toEqual([
          new Money(20, 1),
          new Money(10, 1)
        ])
        // Valor Total em notas: R$ 3.970,00

        expect(await cashMachine.withdraw(80)).toEqual([
          new Money(50, 1),
          new Money(20, 1),
          new Money(10, 1)
        ])
        // Valor Total em notas: R$ 3.890,00

        expect(await cashMachine.withdraw(190)).toEqual([
          new Money(100, 1),
          new Money(50, 1),
          new Money(20, 2)
        ])
        // Valor Total em notas: R$ 3.700,00

        expect(await cashMachine.withdraw(3690)).toEqual([
          new Money(100, 9),
          new Money(50, 18),
          new Money(20, 46),
          new Money(10, 97)
        ])
        // Valor Total em notas: R$ 10,00

        expect(await cashMachine.withdraw(10)).toEqual([
          new Money(10, 1)
        ])
      // Valor Total em notas: R$ 00,00
      })
    })

    describe('Throws ValidationError', () => {
      const cashMachine = new CashMachine(mockMoneyRepository)
      // Valor Total em notas: R$ 4.000,00

      test('Not send a valid value when withdraw money', async () => {
        await expect(async () => await cashMachine.withdraw(-10))
          .rejects
          .toThrowError(new ValidationError(constants.moneyValueToWithdrawIsNotPositiveError))

        await expect(async () => await cashMachine.withdraw(0))
          .rejects
          .toThrowError(new ValidationError(constants.moneyValueToWithdrawIsNotPositiveError))

        await expect(async () => await cashMachine.withdraw(10.5))
          .rejects
          .toThrowError(new ValidationError(constants.moneyValueToWithdrawIsNotIntergerError))
      })

      test('Not exists enough money', async () => {
        await expect(async () => await cashMachine.withdraw(5000))
          .rejects
          .toThrowError(new ValidationError(constants.notExistsEnoughOrFeasibleMoneyInCashMachine))
      })

      test('Not exists feasible money', async () => {
        await expect(async () => await cashMachine.withdraw(15))
          .rejects
          .toThrowError(new ValidationError(constants.notExistsEnoughOrFeasibleMoneyInCashMachine))
      })

      test('Avaliables moneys is empty array', async () => {
        mockMoneyRepository.getAvailableMoney.mockResolvedValue([])
        await expect(async () => await cashMachine.withdraw(10))
          .rejects
          .toThrowError(new ValidationError(constants.notExistsEnoughOrFeasibleMoneyInCashMachine))
      })
    })

    describe('Throws PersistenceError', () => {
      const cashMachine = new CashMachine(mockMoneyRepository)
      // Valor Total em notas: R$ 4.000,00

      test('Throw error to next step', async () => {
      // O comportamento que desejo testar aqui, é que se o 'update' do repositório, lançar uma exceção ao persistir
      // os dados, desejo passar para frente, para que quem chamou o 'withdraw' trate.
        const msgError = 'any_message_error'
        mockMoneyRepository.update.mockImplementation(() => { throw new PersistenceError(msgError) })
        await expect(async () => await cashMachine.withdraw(10))
          .rejects
          .toThrowError(new PersistenceError(msgError))
      })
    })
  })

  describe('Configurate Availables Money', () => {
    describe('Success', () => {
      test('Withdraw money from cash machine', async () => {
        const cashMachine = new CashMachine(mockMoneyRepository)
        expect(await cashMachine.configAvailablesMoney([
          new Money(20, 1),
          new Money(10, 1)
        ])).toBeUndefined()
      })
    })
  })

  describe('Throws ValidationError', () => {
    const cashMachine = new CashMachine(mockMoneyRepository)
    test('Send an array of money invalid (repeated values)', async () => {
      await expect(async () => await cashMachine.configAvailablesMoney([
        new Money(100, 1),
        new Money(50, 1),
        new Money(20, 1),
        new Money(10, 1),
        new Money(20, 1)
      ]))
        .rejects
        .toThrowError(new ValidationError(constants.availablesMoneyIsNotRepeated))
    })

    test('Send an array of money invalid (invalid value of money)', async () => {
      await expect(async () => await cashMachine.configAvailablesMoney([
        new Money(3, 1) // Cédula de três reais é um valor inválido
      ]))
        .rejects
        .toThrowError(new ValidationError(constants.moneyValueIsNotPossibleValuesError))
    })

    test('Send an array of money invalid (invalid value of money)', async () => {
      await expect(async () => await cashMachine.configAvailablesMoney([
        new Money(10, -1) // Quantidade negativa é um valor inválido
      ]))
        .rejects
        .toThrowError(new ValidationError(constants.moneyQuantityInvalidError))
    })
  })
})
