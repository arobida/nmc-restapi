//* Library for storing and editing data
const fs = require('fs')
const path = require('path')

//* Container for the module
const lib = {}
//* Base dir of the data folder
lib.baseDir = path.join(__dirname, '/../.data/')
//* Write data to a file
lib.create = (dir, file, data, callback) => {
  //* Open the file for writing
  fs.open(
    lib.baseDir + dir + '/' + file + '.json',
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //* Convert data to string
        const stringData = JSON.stringify(data)
        //* Write to file & close
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false)
              } else {
                callback('Error closing new file...')
              }
            })
          } else {
            callback('Error writing to new file')
          }
        })
      } else {
        callback('Could not create new file, it may already exist...')
      }
    }
  )
}

//* Read the data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
    callback(err, data)
  })
}

//* Update the data insided of a file
lib.update = (dir, file, data, callback) => {
  //* Open file for editing
  fs.open(
    lib.baseDir + dir + '/' + file + '.json',
    'r+',
    (err, fileDescriptor) => {
      //* Convert data into string
      const stringData = JSON.stringify(data)
      //* Truncate the file
      fs.ftruncate(fileDescriptor, err => {
        if (!err) {
          //* Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false)
                } else {
                  callback('Error closing existing file')
                }
              })
            } else {
              callback('Error writing to existing file')
            }
          })
        } else {
          callback('Error truncating file')
        }
      })
    }
  )
}

lib.delete = (dir, file, callback) => {
  //* Unlink the file
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', err => {
    if (!err) {
      callback(false)
    } else {
      callback('Error deleting the file')
    }
  })
}

// Export the file
module.exports = lib
