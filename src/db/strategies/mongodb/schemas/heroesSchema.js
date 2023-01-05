const Mongoose = require('mongoose')
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
module.exports = Mongoose.model('heroes', heroSchema)