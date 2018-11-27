/* This is the sample app that I am working on as part of my assesment with pirpleassignment1
 *
 *
 */


//Dependancies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

//the Server
var server = http.createServer(function(req,res){

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
    //do the things we did before
    // send the response
    res.end('Hello World\n');

    // log the request path
    console.log('Request is recieved on path: ' + trimmedPath);

  });




});

// Start the Server
server.listen(3000,function(){
  console.log("The server is now listening on port 3000");

});
