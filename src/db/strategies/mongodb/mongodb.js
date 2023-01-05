const ICrud = require("../interfaces/interfaceCrud")
const Mongoose = require('mongoose')

const MONGO_CONNECTION_STATUS = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnected'
}

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super()
    this._connection = connection
    this._schema = schema
  }

  async isConnected() {
    const state = MONGO_CONNECTION_STATUS[this._connection.readyState]
    if (state == 'Connected') return true
    await new Promise(resolve => setTimeout(resolve, 1000))
    return MONGO_CONNECTION_STATUS[this._connection.readyState] == 'Connected'
  }

  static async connect() {
    Mongoose.set('strictQuery', true);

    Mongoose.connect(process.env.MONGODB_URL, {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
      useNewUrlParser: true
    }, err => {
      if (err) console.log(err)
    })

    return Mongoose.connection
  }

  read(query, skip = 0, limit = 10) {
    return this._schema.find(query).skip(skip).limit(limit)
  }

  create(item) {
    return this._schema.create(item)
  }

  update(id, item, upsert = false) {
    return this._schema.updateOne(id, item)
  }

  delete(id) {
    return this._schema.deleteOne(id)
  }
}

module.exports = MongoDB