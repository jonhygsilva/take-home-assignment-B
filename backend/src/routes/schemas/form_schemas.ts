/**
 * Swagger schemas for form routes
 */

const getFormSchema = {
    description: 'Fetch a form by its ID',
    tags: ['forms'], 
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          fields: { type: 'array', items: { type: 'object' } }
        }
      }
    }
}

const getAllFormsSchema = {
    description: 'Fetch all forms',
    tags: ['forms'], 
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            fields: { type: 'array', items: { type: 'object' } } 
          }
        }
      }
    }
}

const createFormSchema = {
    description: 'Create a new form',
    tags: ['forms'], 
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' }, 
        fields: { 
          type: 'object', 
          items: { type: 'object' }
        }
      },
      required: ['name', 'fields'] 
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          fields: { type: 'object', items: { type: 'object' } }
        }
      }
    }
}
  
export { createFormSchema, getAllFormsSchema, getFormSchema }