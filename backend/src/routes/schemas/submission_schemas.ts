/**
 * swagger schemas for submissions routes 
 */
const getSubmissionsSchema = {
  description: 'Fetch all submissions by form ID',
  tags: ['submissions'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Successfully fetched submissions',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          sourceRecordId: { type: 'string' },
        },
      },
    },
  },
};

const submissionSchema = {
  description: 'Submit a new form',
  tags: ['submissions'],  
  body: {
    type: 'object',
    properties: {
      formId: { type: 'string' },
      answers: {
        type: 'object',
        additionalProperties: { type: 'string' }, 
      },
    },
    required: ['formId', 'answers'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        sourceData: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              answer: { type: 'string' },
              sourceRecordId: { type: 'string' },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad Request - Invalid data',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};


export { getSubmissionsSchema, submissionSchema }
