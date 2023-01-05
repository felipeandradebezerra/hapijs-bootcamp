const BaseRoute = require('./base/BaseRoute')
const Boom = require('boom')
const Joi = require("joi")
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelper')

const failAction = (request, headers, error) => {
  console.log('failAction:error', error)
  throw error
}

const USER = {
  username: 'test.user',
  password: '12345'
}

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super()
    this.secret = secret
    this._db = db
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ["api"],
        description: "Get token",
        notes: "Authenticate by using username and password",
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          }
        }
      },
      handler: async (request) => {
        try {
          const { username, password } = request.payload

          const [user] = await this._db.read({
            username: username.toLowerCase()
          })

          if (!user) {
            return Boom.unauthorized('User not found')
          }

          const match = await PasswordHelper.comparePassword(password, user.password)
          if (!match) {
            return Boom.unauthorized('Invalid user or password')
          }

          const token = Jwt.sign({
            username: username,
            id: user.id
          }, this.secret)

          return { token }
        } catch (e) {
          console.log('handler', e)
          return 'Internal error server'
        }
      }
    }
  }
}

module.exports = AuthRoutes