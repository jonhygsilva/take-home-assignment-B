import { FastifyInstance } from 'fastify'

import { Form } from '@prisma/client'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ApiError } from '../errors'
import { createFormSchema, getAllFormsSchema, getFormSchema } from './schemas/form_schemas'

async function formRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formRoutes' })

  /**
   * get form by a formId
   */
  app.get<{
    Params: IEntityId
    Reply: Form
  }>('/:id', {
    schema: getFormSchema,
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get form by id')
      try {
        const form = await prisma.form.findUniqueOrThrow({ where: { id } })
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch form', 400)
      }
    },
  })

  /**
   * get all forms
   */
  app.get<{
    Params: IEntityId
    Reply: Form[]
  }>('', {
    schema: getAllFormsSchema,
    async handler(req, reply) {
      log.debug('get all forms')

      try {
        const form = await prisma.form.findMany()
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch all forms', 400)
      }
    },
  })

  /**
   * create a new form
   */
  app.post<{
    Body: {
      name: string,
      fields: any
    },
    Reply: Form
  }>('', {
    schema: createFormSchema,
    async handler(req, reply) {
      const { name, fields } = req.body
      log.debug('create a new form')

      try {
        const form = await prisma.form.create({ 
            data: {
              name: name,
              fields: fields
            } 
          }
        )

        reply.status(201).send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create form', 400)
      }
    },
  })
}

export default formRoutes
