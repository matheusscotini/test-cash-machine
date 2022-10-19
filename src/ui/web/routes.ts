/* eslint-disable @typescript-eslint/no-misused-promises */
import { Application } from 'express'
import { CashMachine } from '../../domain/cash-machine'
import { Money } from '../../domain/money'
import { memoryMoneyRepository } from '../../infra/repositories/memory-money-repository'
import { constants } from '../../shared/constants'
import { isArrayOrFail, isNotEmptyOrFail } from '../../shared/validations-util'

/**
* @swagger
*
* components:
*   schemas:
*     Withdraw:
*       type: object
*       required:
*         - valueToWithdraw
*       properties:
*         valueToWithdraw:
*           type: integer
*           example: 100
*
*     Money:
*       type: object
*       required:
*         - value
*         - quantity
*       properties:
*         value:
*           type: integer
*           enum: [100, 50, 20, 10]
*         quantity:
*           type: integer
*           example: 1
*/

export const setup = (app: Application): void => {
  const cashMachine = new CashMachine(memoryMoneyRepository)

  /**
  * @swagger
  *
  * /cash-machine/withdraw:
  *   post:
  *     tags: ['API']
  *     summary: Simulates withdrawal from an cash machine
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Withdraw'
  *     responses:
  *       '200':
  *         description: successful operation
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Money'
  *       '422':
  *         description: Validation Error
  *       '500':
  *         description: internal server error
  */
  app.post('/cash-machine/withdraw', async (req, res, next) => {
    try {
      const { valueToWithdraw } = req.body
      isNotEmptyOrFail(valueToWithdraw, constants.moneyToWithdrawIsRequired)

      const moneyToWithdraw = await cashMachine.withdraw(valueToWithdraw)
      res.json(moneyToWithdraw)
    } catch (err) {
      next(err)
    }
  })

  /**
  * @swagger
  *
  * /cash-machine/config-availables-moneys:
  *   post:
  *     tags: ['API']
  *     summary: Configure availables moneys
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: array
  *             items:
  *               $ref: '#/components/schemas/Money'
  *             example:
  *               - value: 100
  *                 quantity: 10
  *               - value: 50
  *                 quantity: 20
  *               - value: 20
  *                 quantity: 50
  *               - value: 10
  *                 quantity: 100
  *     responses:
  *       '200':
  *         description: successful operation
  *         content:
  *           application/json:
  *             schema:
  *               type: string
  *               example: 'Cédulas de dinheiro disponíveis atualizadas com sucesso!'
  *       '422':
  *         description: Validation Error
  *       '500':
  *         description: internal server error
  */
  app.post('/cash-machine/config-availables-moneys', async (req, res, next) => {
    try {
      isArrayOrFail(req.body, constants.configAvailablesMoneysIsNotArray)

      const money = req.body.map((elem: any) => new Money(elem.value, elem.quantity))

      await cashMachine.configAvailablesMoney(money)
      res.send(constants.successConfigAvailablesMoney)
    } catch (err) {
      next(err)
    }
  })
}
