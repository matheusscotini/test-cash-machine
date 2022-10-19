import { prompt } from 'inquirer'
import { formatMoneysOutput, formatMessageError, formatCurrencyBr, validateInputNumber } from './console-util'
import { CashMachine } from '../../domain/cash-machine'
import { memoryMoneyRepository } from '../../infra/repositories/memory-money-repository'
import { Money } from '../../domain/money'

const cashMachine = new CashMachine(memoryMoneyRepository)

const withdraw = async (): Promise<void> => {
  let again: boolean
  do {
    console.clear()
    console.log('SACAR \n')

    const { val }: { val: string } = await prompt([{
      type: 'input',
      name: 'val',
      message: 'Qual valor deseja sacar?',
      validate: validateInputNumber
    }])

    try {
      const valueToWithdraw = Number(val)
      const moneys = await cashMachine.withdraw(valueToWithdraw)
      console.log(formatMoneysOutput(moneys))
    } catch (err) {
      console.log(formatMessageError(err.message))
      again = true
    }

    const result = await prompt([{
      type: 'confirm',
      name: 'again',
      message: 'Deseja sacar algum outro valor?'
    }])
    again = result.again
  } while (again)
}

const configAvailablesMoney = async (): Promise<void> => {
  console.clear()
  console.log('PARAMETRIZAÇÃO DE NOTAS\n')

  const moneys: Money[] = []
  try {
    console.log('Informe a quantidade disponível para cada valor de cédula:')

    for (const moneyValue of Money.possibleValues) {
      const { qtd }: { qtd: string } = await prompt([{
        type: 'input',
        name: 'qtd',
        message: `${formatCurrencyBr(moneyValue)}:`,
        validate: validateInputNumber
      }])

      const quantity = Number(qtd)
      moneys.push(new Money(moneyValue, quantity))
    }

    await cashMachine.configAvailablesMoney(moneys)
    console.log('Cédulas disponíveis atualizadas com sucesso!')
  } catch (err) {
    await prompt([{
      type: 'confirm',
      name: 'again',
      message: `${formatMessageError(err.message)}\nAperte qualquer botão para voltar ao menu inicial`
    }])
  }
}

export const initConsole = async (): Promise<void> => {
  let option: number
  do {
    console.clear()
    console.log('CAIXA ELETRÔNICO\n')

    const result = await prompt([{
      type: 'rawlist',
      name: 'option',
      message: 'Selecione uma opção:',
      choices: [
        { name: 'Sacar', value: 1 },
        { name: 'Configurar cédulas disponíveis', value: 2 },
        { name: 'Sair', value: 3 }
      ]
    }])
    option = result.option

    switch (option) {
      case 1:
        await withdraw()
        break
      case 2:
        await configAvailablesMoney()
        break
      case 3:
        console.clear()
        process.exit(0)
    }
  } while (option !== 3)
}
