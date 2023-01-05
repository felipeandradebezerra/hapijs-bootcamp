const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require("assert")

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "invalid env")

const configPath = join(__dirname, './config', `.env.${env}`)
config({
  path: configPath
})

const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema')

const Postgres = require('./db/strategies/postgres/postgres')
const UserSchema = require('./db/strategies/postgres/schemas/userSchema')

const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')
const Pack = require('../package')
const Joi = require("joi")

const HapiJwt = require('hapi-auth-jwt2')
const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const JWT_SECRET = process.env.JWT_KEY

const app = Hapi.Server({
  port: process.env.PORT
})

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]())
}

async function main() {
  const connection = MongoDB.connect()
  const contextMongoDB = new Context(new MongoDB(connection, HeroSchema))

  const [connectionPostgres, schema] = await Postgres.connect(UserSchema)
  const contextPostgres = new Context(new Postgres(connectionPostgres, schema))

  await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'API Heroes #ImersaoNodeBR',
          version: Pack.version,
        },
        documentationPath: '/docs',
      }
    }
  ])

  app.validator(Joi)

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    options: {
      expires: 20
    },
    validate: async (data, request) => {
      const result = await contextPostgres.read({
        username: data.username.toLowerCase(), id: data.id
      })

      if (!result) {
        return {
          isValid: false
        }
      }

      return {
        isValid: true
      }
    }
  })

  app.auth.default('jwt')

  app.route([
    ...mapRoutes(new HeroRoute(contextMongoDB), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
  ])

  try {
    await app.start()
    console.log('Server running on port:', app.info.uri, app.info.port)
  } catch (err) {
    console.log(err);
  }

  return app
}

module.exports = main()