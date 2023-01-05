const assert = require('assert')
const Context = require('./../db/strategies/base/contextStrategy')
const HeroSchema = require('./../db/strategies/mongodb/schemas/heroesSchema')
const MongoDB = require('../db/strategies/mongodb/mongodb')

let context = {}

const MOCK_NEW_HERO = { name: 'Black Bird', power: 'Magic Arrows' }
const MOCK_UPDATE_HERO = { name: 'Green Light', power: 'Power Ring' }
let MOCK_LAST_INSERT_ID = 0

describe('MongoDB Strategy', function () {
  this.timeout(Infinity)
  this.beforeAll(async function () {
    const connection = await MongoDB.connect()
    context = new Context(new MongoDB(connection, HeroSchema))
  })
  it('check if the database is connected', async function () {
    const result = await context.isConnected()
    assert.equal(result, true)
  })
  it('should create a new hero', async function () {
    const { name, power } = await context.create(MOCK_NEW_HERO)
    assert.deepEqual({ name, power }, MOCK_NEW_HERO)
  })
  it('should read', async function () {
    const [{ name, power }] = await context.read({ name: MOCK_NEW_HERO.name })
    const item = { name, power }
    assert.deepEqual(item, MOCK_NEW_HERO)
  })
  it('should update a hero', async function () {
    const [{ name, power, _id }] = await context.read({ name: MOCK_NEW_HERO.name })
    const item = { name, power, _id }

    const updated = {
      ...item,
      ...MOCK_UPDATE_HERO
    }

    delete updated._id
    const result = await context.update(item.id, updated)
    assert.ok(result.acknowledged, true)
    MOCK_LAST_INSERT_ID = item._id

    const [afterUpdate] = await context.read({ id: item._id })
    assert.equal(afterUpdate.name, MOCK_UPDATE_HERO.name)
  })
  it('should delete a hero', async function () {
    let _id = MOCK_LAST_INSERT_ID
    const result = await context.delete({ _id })
    const resultRead = await context.read({ _id })

    assert.equal(resultRead.length, 0)
    assert.ok(result.acknowledged, true)
  })
})