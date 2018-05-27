const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// require config file
const config = require("./config");
const _data = require("./lib/data");
//testing for data
_data.create("test", "new", { foo: "bar" }, err => {
  console.log("This was an error...", err);
});

// make a server that responds to request
// Instantiating http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Starting http server
httpServer.listen(config.httpPort, () => {
  console.log(
    `The server is listening on port: ${config.httpPort} in ${config.envName}`
  );
});

// Instantiate https server
const httpsOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(httpsOptions, (req, res) => {
  unifiedServer(req, res);
});

// Starting https server
httpsServer.listen(config.httpsPort, () => {
  console.log(
    `The server is listening on port: ${config.httpsPort} in ${config.envName}`
  );
});

const unifiedServer = (req, res) => {
  //building the webservice
  //parse url
  const parsedUrl = url.parse(req.url, true);
  //get path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //get the query string as an object
  const queryStringObject = parsedUrl.query;
  //get http method
  const method = req.method;
  //get headers from req
  const headers = req.headers;
  //get the payload
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    //send res
    //choose the handler the req should use if not found hit the notFound handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    //construct object to send to handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer
    };
    //router request to the handler specified in router
    chosenHandler(data, (statusCode, payload) => {
      //use the status code called by handler or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      //use the payload called by handler or send empty object
      payload = typeof payload == "object" ? payload : {};
      //convert the payload into a string
      const payloadString = JSON.stringify(payload);
      //return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response:", statusCode, payloadString);
    });
  });
};

//define route handlers
const handlers = {};
//sample handler
handlers.sample = (data, callback) => {
  //callback http status code & payload
  callback(406, { name: "sample handler" });
};
// Ping handler
handlers.ping = (data, callback) => {
  callback(200, { status: "It's Alive!" });
};
//404 not found handler
handlers.notFound = (data, callback) => {
  //callback http status code & payload
  callback(404, { name: "Are you lost?" });
};
//define a request router
const router = {
  sample: handlers.sample,
  notFound: handlers.notFound,
  ping: handlers.ping
};
