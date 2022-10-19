import { Application } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerOpts = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Cash Machine',
      version: process.env.API_VERSION ?? '1.0.0',
      description: 'API de simulação de caixa eletrônico'
    },
    servers: [{ url: process.env.API_URL ?? 'http://localhost:3000' }
    ]
  },
  apis: ['./src/ui/web/routes.ts']
}

const swaggerSpec = swaggerJSDoc(swaggerOpts)
const swaggerOpitions = { customCss: '.swagger-ui section.models, .topbar { display: none; }' }

export const setup = (app: Application): void => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOpitions))
  app.use('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
