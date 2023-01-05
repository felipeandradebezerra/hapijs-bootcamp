const ICrud = require("../interfaces/interfaceCrud")
const Sequelize = require("sequelize")

class Postgres extends ICrud {
  constructor(connection, schema) {
    super()
    this._connection = connection
    this._schema = schema
  }

  async isConnected() {
    try {
      this._connection.authenticate()
      return true
    } catch (error) {
      console.log('Postgres fail connecting', error)
      return false
    }
  }

  static async connect(schema) {
    const connection = new Sequelize(
      'heroes',
      process.env.POSTGRES_USER,
      process.env.POSTGRES_PASSWORD,
      {
        host: process.env.POSTGRES_URL,
        dialect: 'postgres',
        logging: false,
        quoteIdentifiers: false
      }
    )

    const model = connection.define(
      schema.name,
      schema.schema,
      schema.options)

    this._schema = await model.sync();

    return [connection, this._schema]
  }

  create(item) {
    return this._schema.create(item)
  }

  read(query = {}) {
    return this._schema.findAll({ where: query, raw: true })
  }

  delete(id) {
    return this._schema.destroy({ where: { id } })
  }

  update(id, item, upsert) {
    const fn = upsert ? 'upsert' : 'update'
    return this._schema[fn](item, {
      where: {
        id
      }
    })
  }
}

module.exports = Postgres