var http = require('http');
var variance = require('./lib/variance');
var config = require('./config.js');

/** Initialize the server **/
var server = http.createServer(variance(config));

server.listen(config.port || 3000);
