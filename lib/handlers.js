//* Request handlers

//* Dependencies

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
