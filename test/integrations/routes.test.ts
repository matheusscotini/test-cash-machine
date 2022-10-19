import * as http from 'http'
import request from 'supertest'
import { constants } from '../../src/shared/constants'
import { app, initServer } from '../../src/ui/web/app'

const PATH_WITHDRAW = '/cash-machine/withdraw'
const PATH_CONFIG_AVAILABLES_MONEYS = '/cash-machine/config-availables-moneys'

describe('Routes', () => {
  let server: http.Server
  beforeAll(async () => {
    server = initServer()
  })

  afterAll(async () => {
    await server.close()
  })

  describe(`(POST) ${PATH_WITHDRAW}`, () => {
    describe('200 | Success', () => {
      test('Make many withdrawals', async () => {
        // Valor Total Inicial em notas: R$ 4.000,00

        await request(app)
          .post(PATH_WITHDRAW)
          .send({ valueToWithdraw: 30 })
          .expect(200)
          .expect(({ body }) => expect(body)
            .toEqual([
              { value: 20, quantity: 1 },
              { value: 10, quantity: 1 }
            ]))
          // Valor Total em notas: R$ 3.970,00

        await request(app)
          .post(PATH_WITHDRAW)
          .send({ valueToWithdraw: 80 })
          .expect(200)
          .expect(({ body }) => expect(body)
            .toEqual([
              { value: 50, quantity: 1 },
              { value: 20, quantity: 1 },
              { value: 10, quantity: 1 }
            ]))
          // Valor Total em notas: R$ 3.890,00

        await request(app)
          .post(PATH_WITHDRAW)
          .send({ valueToWithdraw: 190 })
          .expect(200)
          .expect(({ body }) => expect(body)
            .toEqual([
              { value: 100, quantity: 1 },
              { value: 50, quantity: 1 },
              { value: 20, quantity: 2 }
            ]))
          // Valor Total em notas: R$ 3.700,00

        await request(app)
          .post(PATH_WITHDRAW)
          .send({ valueToWithdraw: 3690 })
          .expect(200)
          .expect(({ body }) => expect(body)
            .toEqual([
              { value: 100, quantity: 9 },
              { value: 50, quantity: 18 },
              { value: 20, quantity: 46 },
              { value: 10, quantity: 97 }
            ]))
          // Valor Total em notas: R$ 10,00
      })
    })

    describe('422 | ValidationError', () => {
      test('Not send valueToWithdraw', async () => {
        await request(app)
          .post(PATH_WITHDRAW)
          .send({})
          .expect(422)
          .expect(({ body }) => {
            expect(body.error).toEqual('ValidationError')
            expect(body.message).toEqual(constants.moneyToWithdrawIsRequired)
          })
      })

      // Saldo insuficiente, pois só existe R$ 10,00
      test('Not exists enough money to fulfill the order', async () => {
        await request(app)
          .post(PATH_WITHDRAW)
          .send({ valueToWithdraw: 20 })
          .expect(422)
          .expect(({ body }) => {
            expect(body.error).toEqual('ValidationError')
            expect(body.message).toEqual(constants.notExistsEnoughOrFeasibleMoneyInCashMachine)
          })
      })

      // Não existe notas factíveis para atender o pedido, pois não tem notas de R$ 5,00 reais no caixa eletrônico
      test('Not exists feasible money to fulfill the order', async () => {
        await request(app)
          .post(PATH_WITHDRAW)
          .send({ valueToWithdraw: 5 })
          .expect(422)
          .expect(({ body }) => {
            expect(body.error).toEqual('ValidationError')
            expect(body.message).toEqual(constants.notExistsEnoughOrFeasibleMoneyInCashMachine)
          })
      })
    })
  })

  describe(`(POST) ${PATH_CONFIG_AVAILABLES_MONEYS}`, () => {
    describe('200 | Success', () => {
      test('Configure availables moneys', async () => {
        await request(app)
          .post(PATH_CONFIG_AVAILABLES_MONEYS)
          .send([
            { value: 100, quantity: 10 },
            { value: 50, quantity: 20 },
            { value: 20, quantity: 50 },
            { value: 10, quantity: 100 }
          ])
          .expect(200)
          .expect(({ text }) => expect(text)
            .toBe(constants.successConfigAvailablesMoney))
      })
    })

    describe('422 | ValidationError', () => {
      test('Not send a body array', async () => {
        await request(app)
          .post(PATH_CONFIG_AVAILABLES_MONEYS)
          .send({})
          .expect(422)
          .expect(({ body }) => {
            expect(body.error).toEqual('ValidationError')
            expect(body.message).toEqual(constants.configAvailablesMoneysIsNotArray)
          })
      })
    })
  })
})
