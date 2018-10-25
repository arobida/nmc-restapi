/*
	! create and export config enviroment
	? how will i export these config enviroments?
	TODO: make a container for all the enviroments
*/

const environments = {};

// Staging environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging"
};

// Production enviroment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production"
};

// TODO: determine which env was passed to the cli
const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// check that the current environment is one of the above or default to staging area
const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

// TODO export these modules
module.exports = environmentToExport;
