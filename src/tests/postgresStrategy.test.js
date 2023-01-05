const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const Context = require('./../db/strategies/base/contextStrategy')
const HeroSchema = require('./../db/strategies/postgres/schemas/heroesSchema')

let context = {}

const MOCK_NEW_HERO = { name: 'Black Bird', power: 'Magic Arrows' }
const MOCK_UPDATE_HERO = { name: 'Green Light', power: 'Power Ring' }

describe('Postgres Strategy', function () {
  this.timeout(Infinity)
  this.beforeAll(async function () {
    const [connection, schema] = await Postgres.connect(HeroSchema)
    context = new Context(new Postgres(connection, schema))
  })
  it('check if the database is connected', async function () {
    const result = await context.isConnected()
    assert.equal(result, true)
  })
  it('should create a new hero', async function () {
    const { dataValues: { name, power } } = await context.create(MOCK_NEW_HERO)
    assert.deepEqual({ name, power }, MOCK_NEW_HERO)
  })
  it('should read', async function () {
    const [result] = await context.read({ name: MOCK_NEW_HERO.name })
    delete result.id
    assert.deepEqual(result, MOCK_NEW_HERO)
  })
  it('should update a hero', async function () {
    const [item] = await context.read({ name: MOCK_NEW_HERO.name })
    const updated = {
      ...item,
      ...MOCK_UPDATE_HERO
    }

    delete updated.id
    const result = await context.update(item.id, updated)
    assert.ok(result, true)

    const [afterUpdate] = await context.read({ id: item.id })
    assert.equal(afterUpdate.name, MOCK_UPDATE_HERO.name)
  })
  it('should delete a hero', async function () {
    const results = await context.read({ name: MOCK_UPDATE_HERO.name })
    const ids = results.map(item => item.id)

    const result = await context.delete(ids)
    assert.equal(result, ids.length)
  })
})