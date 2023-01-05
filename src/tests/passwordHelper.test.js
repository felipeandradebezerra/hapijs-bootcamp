const assert = require('assert')
const PasswordHelper = require('./../helpers/passwordHelper')

const PASSWORD = "12345"
let PASSWORD_HASH = ""

describe('UserHelper test suite', function () {
  it('should generate a hash', async () => {
    const result = await PasswordHelper.hashPassword(PASSWORD)
    PASSWORD_HASH = result
    assert.ok(result.length > 10)
  })

  it('should compate hash and password', async () => {
    const result = await PasswordHelper.comparePassword(PASSWORD, PASSWORD_HASH)
    assert.ok(result)
  })
})