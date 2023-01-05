const Mongoose = require('mongoose')

Mongoose.connect(process.env.MONGODB_URL, {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  useNewUrlParser: true
}, err => {
  console.log(err)
})

const connection = Mongoose.connection
connection.once('open', () => console.log('database rodando!'))

// const state = connection.readyState
// console.log('state', state)

const heroSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  power: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const model = Mongoose.model('heroes', heroSchema)

async function main() {
  const result = await model.create({
    name: 'Batman',
    power: 'Money'
  })
  console.log('result', result)

  // const drop = await model.collection.drop()
  // console.log('drop', drop)
}

main()