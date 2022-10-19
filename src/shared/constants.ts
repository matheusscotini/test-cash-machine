/* eslint-disable @typescript-eslint/indent */
export const constants = Object.freeze({
    moneyValueIsNotPositiveError: 'Valor da cédula deve ser um número positivo.',
    moneyValueIsNotIntergerError: 'Valor da cédula deve ser um número inteiro.',
    moneyValueIsNotPossibleValuesError: 'Valor da cédula deve ser um dos seguintes valores: [100, 50, 20, 10]',
    moneyQuantityInvalidError: 'Quantidade de cédulas deve ser um número maior ou igual a zero.',
    moneyQuantityIsNotIntergerError: 'Quantidade de cédulas deve ser um número positivo.',
    moneyQuantityExceededLimitError: 'Quantidade de cédulas a serem retiradas excedeu o limite de cédulas disponíveis.',
    moneyToWithdrawIsRequired: 'Campo \'valueToWithdraw\' é obrigatório!',
    moneyValueToWithdrawIsNotPositiveError: 'Valor a ser sacado deve ser um número positivo.',
    moneyValueToWithdrawIsNotIntergerError: 'Valor a ser sacado deve ser um número inteiro.',
    notExistsEnoughOrFeasibleMoneyInCashMachine: 'Não existe notas suficientes ou factíveis para atender seu pedido neste caixa!',
    availablesMoneyIsNotRepeated: 'Lista com valores de cédulas a serem atualizados não podem estar repetidos.',
    configAvailablesMoneysIsNotArray: 'O body da request deve ser um array onde cada elemento é um objeto com essa estrutura { "value": any_value, "quantity": any_quantity }',
    successConfigAvailablesMoney: 'Cédulas de dinheiro disponíveis atualizadas com sucesso!'
  })
