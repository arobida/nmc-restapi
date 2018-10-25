// Just helpers for various task

// Dependencies
const crypto = require('crypto')
const config = require('./config')

// Container for helpers
const helpers = {}

// Create a SHA256 hash
helpers.hash = str => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex')
    return hash
  } else {
    return false
  }
}

// Export container
modules.exports = helpers
