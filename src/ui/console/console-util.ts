import { Money } from '../../domain/money'

export const formatCurrencyBr = (value: number): string => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  return formatter.format(value)
}

export const formatMoneysOutput = (money: Money[]): string => money
  .reduce((prev, curr) => `${prev}- ${curr.getQuantity()} nota${curr.getQuantity() > 1 ? 's' : ''} de ${formatCurrencyBr(curr.value)}\n`, '')

export const formatMessageError = (message: string): string => `${message}\n`

export const validateInputNumber = (value: string): boolean | string => {
  if (!value) {
    return 'Informe algum valor!'
  }

  const matched = value.match(/^[0-9]*$/)
  if (!matched) {
    return 'Digite algum valor numérico!'
  }

  return true
}
