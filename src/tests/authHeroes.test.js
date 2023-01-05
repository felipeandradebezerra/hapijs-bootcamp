const assert = require('assert')
const api = require("./../api")

const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('./../db/strategies/postgres/postgres')
const UserSchema = require('./../db/strategies/postgres/schemas/userSchema')

let app = {}
let context = {}

const USER = {
  username: 'test.user',
  password: '12345'
}

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: '$2b$04$SSKSf.8lMK6.rQcaUZF4heelLuWhv/FKSH4YgCez59tYyBUVpi48i'
}

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api

    const [connection, schema] = await Postgres.connect(UserSchema)
    context = new Context(new Postgres(connection, schema))
    await context.update(null, USER_DB, true)
  })

  it('should get a new token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER
    })

    const statusCode = result.statusCode
    const data = JSON.parse(result.payload)
    assert.deepEqual(statusCode, 200)
    assert.ok(data.token.length > 10)
  })

  it('should return unauthorized', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'fake',
        password: '123'
      }
    })

    const statusCode = result.statusCode
    const data = JSON.parse(result.payload)
    assert.deepEqual(statusCode, 401)
    assert.deepEqual(data.error, "Unauthorized")
  })
})