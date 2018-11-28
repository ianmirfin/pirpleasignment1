/* This is the sample app that I am working on as part of my assesment with pirpleassignment1
 *
 *
 */


//Dependancies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// The HTTP Server
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

// Start the http Server
httpServer.listen(config.httpPort,function(){
  console.log("The server is now listening on port " + config.httpPort + " in " + config.envName + " mode.");
});

// THe HTTPS server
var httpsServerOptions = {
  'key' : fs.readFileSync('https/key.pem').toString(),
  'cert' : fs.readFileSync('https/cert.pem').toString()
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});
// Start the HTTPS Server
httpsServer.listen(config.httpsPort,function(){
  console.log("The server is now listening on port " + config.httpsPort + " in " + config.envName + " mode.");
});

// All the Server logic
var unifiedServer = function(req,res){
  //get the URL and parse interval
  var parsedUrl = url.parse(req.url,true);

  // get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // get the method
  var method = req.method.toLowerCase();

  // get the query string as an object
  var queryStringObject = parsedUrl.query;

  // get the headers as an object
  var headers = req.headers;

  // get the payload, if any.
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();
    // Choose the Handler this request shoudl go to. IF one is not found use the notFound handler
    var chosenHandler =  typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handlers
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data,function(statusCode,payload){
      // default status code called back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use the payload called back by the handler, or use the default empty object
      payload = typeof(payload) == 'object' ? payload : {};

      //Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      // send the response
      res.end(payloadString);

      console.log('Returning this response: ' , statusCode, payloadString);
    });
  });
};

//Define the handlers
var handlers = {};

//Sample handlers
handlers.sample = function(data, callback){
  // Call back a http status code, and a payload object
  callback(406,{'name': 'Sample Handler'});
};

handlers.ping = function(data,callback){
  callback(200);
};
handelers.hello = function(data,callback){
  callback(200,{'WelcomeMessage' : 'Welcome to my pirple Assesment #1 Page'});
};
// Not found Handler ie default
handlers.notFound = function(data, callback){
  callback(404);
};

// Defining a request router
var router = {
  'sample' : handlers.sample,
  'ping' : handlers.ping
};
