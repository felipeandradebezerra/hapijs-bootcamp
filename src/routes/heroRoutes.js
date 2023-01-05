const BaseRoute = require("./base/BaseRoute")
const Joi = require("joi")
const Boom = require('boom')

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown()

const failAction = (request, headers, error) => {
  console.log('failAction:error', error)
  throw error
}

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this._db = db
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      config: {
        description: 'Get heroes',
        notes: 'Returns a list of heroes',
        tags: ['api'],
        validate: {
          headers,
          failAction,
          query: Joi.object({
            query: Joi.string().optional(),
            skip: Joi.number().optional(),
            limit: Joi.number().optional(),
          })
        }
      },
      handler: (request, headers) => {
        try {
          let { skip, limit, query } = request.query
          if (typeof (query) == 'string') {
            query = { name: query }
          }
          return this._db.read(query, skip, limit)
        } catch (error) {
          return "Erro interno ao listar"
        }
      }
    }
  }

  update() {
    return {
      path: '/heroes/{id}',
      method: 'PATCH',
      config: {
        description: 'Update a hero',
        notes: 'Update a hero by id',
        tags: ['api'],
        validate: {
          headers,
          failAction,
          params: {
            id: Joi.string().required()
          },
          payload: Joi.object({
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(3).max(100),
          })
        }
      },
      handler: async (request) => {
        try {
          const { id } = request.params
          const { name, power } = request.payload
          const _id = id
          const result = await this._db.update({ _id }, { name, power })
          return { message: 'Heroi atualizado com sucesso!', acknowledged: result.acknowledged }
        } catch (e) {
          console.log('handler', e)
          return 'Internal error server'
        }
      }
    }
  }

  delete() {
    return {
      path: '/heroes/{id}',
      method: 'DELETE',
      config: {
        description: 'Delete a hero',
        notes: 'Delete a hero by id',
        tags: ['api'],
        validate: {
          headers,
          failAction,
          params: Joi.object({
            id: Joi.string().required(),
          })
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params
          const _id = id
          const result = await this._db.delete({ _id })
          return { message: 'Heroi removido com sucesso!', acknowledged: result.acknowledged }
        } catch (e) {
          console.log('handler', e)
          return 'Internal error server'
        }
      }
    }
  }

  create() {
    return {
      path: '/heroes',
      method: 'POST',
      config: {
        description: 'Create a hero',
        notes: 'Create a hero',
        tags: ['api'],
        validate: {
          headers,
          failAction,
          payload: Joi.object({
            name: Joi.string().min(3).max(100).required(),
            power: Joi.string().min(3).max(100).required(),
          })
        }
      },
      handler: async (request) => {
        try {
          const { name, power } = request.payload
          const result = await this._db.create({ name, power })
          return { message: 'Heroi cadastrado com sucesso!', _id: result._id }
        } catch (e) {
          console.log('handler', e)
          return 'Internal error server'
        }
      }
    }
  }
}

module.exports = HeroRoutes