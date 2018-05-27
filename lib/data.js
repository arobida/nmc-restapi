// Library for storing and editing data
const fs = require("fs");
const path = require("path");

// Container for the module
const lib = {};
// Base dir of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");
// Write data to a file
lib.create = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data);
        // Write to file & close
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file...");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exist...");
      }
    }
  );
};

// Export the file
module.exports = lib;
