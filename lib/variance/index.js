var http = require('http');
var url = require('url');

var variance = function(config){
	var normalizeHeaders = function(headersIn){
		var headers = {};
		for(var header in headersIn){
			switch(header.toLowerCase()){
				case 'content-length':
					headers[header.toLowerCase()] = parseInt(headersIn[header]);
				default:
					headers[header.toLowerCase()] = headersIn[header];
			}
		}
		return headers;
	};
	var stripHeaders = function(headers){
		return headers;
	};
	var stripBody = function(body){
	
	};
	var reverseProxy = function(request, response, hiddenResponse){
		var req = http.request({
			'hostname':config.forward.host || '127.0.0.1',
			'port':config.forward.port || 80,
			'method': request.method,
			'headers': stripHeaders(request.headers),
			'path': request.url,
		}, function(res){
			var headers = normalizeHeaders(res.headers);
			if(headers['location']){
				// Dont redirect
				delete headers['location'];
			}
			if(hiddenResponse){
				delete headers['content-length']; //Let the client figure this out
			}
			var canClose = false;
			response.writeHead(res.statusCode, headers);
			hiddenResponse.headers.status = hiddenResponse.statusCode;
			response.write('<script type="text/variancescript">' + (new Buffer(JSON.stringify(hiddenResponse.headers))).toString('base64') + '</script>');
			hiddenResponse.on('data', function(chunk){
				response.write('<script type="text/variancescript">' + chunk.toString('base64') + '</script>');
			});
			hiddenResponse.on('end', function(){
				if(canClose){
					response.end();
				}else{
					canClose = true;
				}
			});
			res.on('data', function(chunk){
				response.write(chunk);
			});
			res.on('end', function(){
				if(canClose){
					response.end();
				}else{
					canClose = true;
				}
			});
		});
		req.on('error', function(e){
			response.writeHead(500, {});
			response.write("Error: Internal Server Error");
			response.end();
		});
		req.end();
	};
	return function(request, response){
		var proxy = true;
		if(request.method == 'POST'){
			var header = '';
			request.on('data', function(data){
				header += data;
			});
			request.on('end', function(){
				// Build the header
				var size = header.split('|')[0];
				var hdd = header.substring(size.length + 1,size.length + 1 + parseInt(size));
				var hdref = JSON.parse(hdd);
				console.log('[PROXY] ' + hdref['method'] + " " + hdref['host'] + " - " + hdref['path']);
				// Send out a request for this page
				var r = http.request({
					'host': hdref['host'],
					'path': hdref['path'],
					'method': hdref['method'],
					'port': hdref['port'],
					'headers': hdref['headers']
				}, function(res){
					reverseProxy(request, response, res);
				});
				r.on('error', function(){
					response.writeHead(500);
					response.write('<!--Internal Server Error');
					response.end();
				});
				r.end();
			});
		}else{
			reverseProxy(request, response);
		}
	}
};
module.exports = variance;
