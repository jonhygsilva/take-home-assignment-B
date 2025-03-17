import { FastifyInstance } from 'fastify'

import { SourceData, SourceRecord } from '@prisma/client'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ApiError } from '../errors'

async function submissionRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'submissionRoutes' })

  app.get<{
    Params: IEntityId
    Reply: SourceData[]
  }>('/:id/submissions', {
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get all submissions by a formId')

      try {
        const form = await prisma.sourceData.findMany({
          where: {
            sourceRecord: {
              formId: {
                equals: id
              }
            }
          },
          include: {
            sourceRecord: true,

          }
        })
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch all submissions by a formId', 400)
      }
    },
  })

  app.post<{
    Body: {
      formId: string
      answers: Record<string, string>;
    };
    Reply: {
      message: string;
      sourceRecord: SourceRecord;
    };
  }>('/submission', {
    async handler(req, reply) {
      const { formId, answers } = req.body
  
      try {
        // create a new SourceRecord
        const sourceRecord = await prisma.sourceRecord.create({
          data: {
            formId: formId,  // relate the source to form by formId
          },
        });
  
        // Maps responses to the required format
        const sourceDataEntries = Object.entries(answers).map(([question, answer]) => ({
          question,
          answer,
          sourceRecordId: sourceRecord.id,  // Relates responses to SourceRecord
        }));
  
        
        await prisma.sourceData.createMany({
          data: sourceDataEntries,
        });
  
        
        reply.status(201).send({
          message: 'Form submission created successfully!',
          sourceRecord,
        });
      } catch (err: any) {
        
        log.error({ err }, err.message);
        throw new ApiError('failed to create a submission', 400);
      }
    },
  });  
}

export default submissionRoutes
