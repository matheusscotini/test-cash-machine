import { prompt } from 'inquirer'

import { initConsole } from './console'
import { initServer } from '../web/app'

export const initAnswer = async (): Promise<any> => {
  console.clear()
  const { mode } = await prompt([{
    type: 'list',
    name: 'mode',
    message: 'Deseja executar o programa via:',
    choices: [
      { value: 'console' },
      { value: 'swagger' }
    ]
  }])
  switch (mode) {
    case 'console':
      await initConsole()
      break
    case 'swagger':
      initServer()
      break
  }
}
