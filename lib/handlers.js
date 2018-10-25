//* Request handlers

//* Dependencies
const _data = require('./data')
const helpers = require('./helpers')
//* define route handlers
const handlers = {}

//* Users
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback)
  } else {
    callback(405)
  }
}

// Container for the users submethods
handlers._users = {}
// Users Post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  const firstName =
    typeof data.payload.firstName === 'string' &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim
      : false
  const lastName =
    typeof data.payload.lastName === 'string' &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim
      : false
  const phone =
    typeof data.payload.phone === 'string' &&
    data.payload.phone.trim().length > 10
      ? data.payload.phone.trim
      : false
  const password =
    typeof data.payload.password === 'string' &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim
      : false
  const tosAgreement = !!(
    typeof data.payload.tosAgreement === 'boolean' &&
    data.payload.tosAgreement == true
  )

  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure user is not preexisting
    _data.read('users', phone, (err, data) => {
      if (err) {
        // Hash the password
        const hashedPassword = helpers.hash(password)
        // Create the user object
        if (hashedPassword) {
          const userObject = {
            firtName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: true
          }
          // Store the user
          _data.create('users', phone, userObject, err => {
            if (!err) {
              callback(200)
            } else {
              console.log(err)
              callback(500, { Error: 'Could not create the new user' })
            }
          })
        } else {
          callback(500, { Error: "Could not hash the user's password" })
        }
      } else {
        // User already exists
        callback(400, { Error: 'A user with that phone number already exists' })
      }
    })
  } else {
    callback(400, { Error: 'Missing required fields' })
  }
}
// Users Get
handlers._users.get = (data, callback) => {}
// Users Put
handlers._users.put = (data, callback) => {}
// Users Delete
handlers._users.delete = (data, callback) => {}

//* Entry handler
handlers.home = (data, callback) => {
  callback(200, { name: 'Welcome to my api!' })
}
//* Ping handler
handlers.ping = (data, callback) => {
  callback(200, { status: "It's Alive!" })
}
//* 404 not found handler
handlers.notFound = (data, callback) => {
  //* callback http status code & payload
  callback(404, { name: 'Are you lost?' })
}

//* Export the module
module.exports = handlers
