const assert = require('assert')
const api = require("./../api")
let app = {}

const MOCK_NEW_HERO = { name: 'Volverine', power: 'Adamantium skull' }
const MOCK_UPDATE_HERO = { name: 'Capitão America', power: 'Shield' }
const headers = {}
let MOCK_LAST_INSERT_ID = 0

describe('Api test suite', function () {
  this.beforeAll(async () => {
    app = await api

    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'test.user',
        password: '12345'
      }
    })

    const data = JSON.parse(result.payload)
    this.headers = { authorization: data.token }
  })

  it('should list heroes', async () => {
    const headers = this.headers
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
      headers
    })

    const data = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(data))
  })

  it('should list ten heroes', async () => {
    const headers = this.headers
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?skip=30&limit=10',
      headers
    })

    const data = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepEqual(statusCode, 200)
    assert.ok(data.length === 10)
  })

  it('should filter a hero', async () => {
    const headers = this.headers
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?query=Black%20Bird',
      headers
    })

    const data = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.ok(data.length > 0)
  })

  it('should create a new hero', async () => {
    const headers = this.headers
    const result = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: MOCK_NEW_HERO,
      headers
    })

    const { message, _id } = JSON.parse(result.payload)
    MOCK_LAST_INSERT_ID = _id

    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.notEqual(_id, undefined)
    assert.deepEqual(message, 'Heroi cadastrado com sucesso!')
  })

  it('should update our hero', async () => {
    const headers = this.headers
    const _id = MOCK_LAST_INSERT_ID
    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      payload: JSON.stringify(MOCK_UPDATE_HERO),
      headers
    })

    const { message, acknowledged } = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.equal(acknowledged, true)
    assert.deepEqual(message, 'Heroi atualizado com sucesso!')
  })

  it('should delete our hero', async () => {
    const headers = this.headers
    const _id = MOCK_LAST_INSERT_ID
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${_id}`,
      headers
    })

    const { message, acknowledged } = JSON.parse(result.payload)
    const statusCode = result.statusCode
    assert.deepEqual(statusCode, 200)
    assert.equal(acknowledged, true)
    assert.deepEqual(message, 'Heroi removido com sucesso!')
  })
})