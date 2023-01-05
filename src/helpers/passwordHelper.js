const Bycript = require('bcrypt')
const {
  promisify
} = require('util')

const hashAsync = promisify(Bycript.hash)
const compareAsync = promisify(Bycript.compare)
const SALT = parseInt(process.env.SALT_PWD)

class PasswordHelper {
  static hashPassword(password) {
    return hashAsync(password, SALT)
  }
  static comparePassword(password, hash) {
    return compareAsync(password, hash)
  }
}
module.exports = PasswordHelper