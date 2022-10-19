import { initAnswer } from './src/ui/console/answer'
import { initServer } from './src/ui/web/app'
import { initConsole } from './src/ui/console/console'

(async () => {
  const mode = process.env.EXECUTION_MODE ?? 'answer'
  try {
    switch (mode) {
      case 'answer':
        await initAnswer()
        break
      case 'console':
        await initConsole()
        break
      case 'swagger':
        initServer()
        break
      default:
        console.log(`Não foi possível executar o programa no modo '${mode}'.`)
        process.exit(1)
    }
  } catch (err) {
    console.clear()
    console.log(`Ocorreu um erro ao executar a aplicação\n${
      process.env.NODE_ENV !== 'prod'
        ? `Stack: ${err.stack as string}`
        : ''
    }`)
  }
})()
