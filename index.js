var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

// require config file
const config = require("./config");

// make a server that responds to request

var server = http.createServer((req, res) => {
  //building the webservice
  //parse url
  var parsedUrl = url.parse(req.url, true);
  //get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //get the query string as an object
  var queryStringObject = parsedUrl.query;
  //get http method
  var method = req.method;
  //get headers from req
  var headers = req.headers;
  //get the payload
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    //send res
    //choose the handler the req should use if not found hit the notFound handler
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    //construct object to send to handler
    var data = {
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
      var payloadString = JSON.stringify(payload);
      //return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response:", statusCode, payloadString);
    });
  });
});

server.listen(config.port, () => {
  console.log(
    `The server is listening on port: ${config.port} in ${config.envName}`
  );
});
//define route handlers
var handlers = {};
//sample handler
handlers.sample = (data, callback) => {
  //callback http status code & payload
  callback(406, { name: "sample handler" });
};
//404 not found handler
handlers.notFound = (data, callback) => {
  //callback http status code & payload
  callback(404);
};
//define a request router
var router = {
  sample: handlers.sample,
  notFound: handlers.notFound
};
