import fastify from 'fastify'

import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import formRoutes from './routes/form'
import submissionRoutes from './routes/submission'
import errorHandler from './errors'

function build(opts = {}) {
  const app = fastify(opts)

  app.register(swagger, {
    swagger: {
      info: {
        title: 'API Forms Documentation',
        description: 'Forms documentation API',
        version: '1.0.0',
      },
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  })
  
  // Registre o Swagger UI
  app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })

  app.register(formRoutes, { prefix: '/form' })
  app.register(submissionRoutes, { prefix: '/submission' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
