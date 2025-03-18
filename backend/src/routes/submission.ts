import { FastifyInstance } from 'fastify'

import { SourceData } from '@prisma/client'
import { submissionSchema, getSubmissionsSchema } from './schemas/submission_schemas';

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ApiError } from '../errors'

async function submissionRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'submissionRoutes' })

  /**
   * get a submission by a formId
   */
  app.get<{
    Params: IEntityId
    Reply: SourceData[]
  }>('/form/:id', {
    schema: getSubmissionsSchema,
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get all submissions by a formId')

      try {
        // all sourceData (submissions) related to a form, by the relation of sourceRecord and formId
        const submissions = await prisma.sourceData.findMany({
          where: {
            sourceRecord: {
              formId: {
                equals: id
              }
            }
          }
        })


        reply.send(submissions)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch all submissions by a formId', 400)
      }
    },
  })

  /**
   * Create a new submission
   */
  app.post<{
    Body: {
      formId: string
      answers: Record<string, string>;
    };
    Reply: {
      message: string;
      sourceData: Object;
    };
  }>('', {
    schema: submissionSchema,
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
          sourceData: sourceDataEntries,
        });
      } catch (err: any) {
        log.error({ err }, err.message);
        throw new ApiError('failed to create a submission', 400);
      }
    },
  });  
}

export default submissionRoutes
