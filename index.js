
var beacon = require('eddystone-beacon');
var shorturl = require('shorturl');
var http = require('http');
var url  = require('url');

var server = http.createServer();

var URL = 'https://www.indybuy.com/';
var PATH = 'tienda/';
var channel;

function control(req, resp) {

	if ( req.method === 'PUT' ) {
		var url_parts = url.parse(req.url);
		handler(resp, url_parts.path.split('/'));
	} else if (req.method === 'GET') {
		resp.writeHead(200, {'content-type': 'text/plain'});
		resp.write('channel: ' + channel);
		resp.end();
	} else {
		resp.writeHead(400, {'content-type': 'text/plain'});
		resp.end();
	}

}

function handler(resp, params) {

	if ( params[1] === 'on' && params[2] && !channel ) {
		console.log('on');
		channel = params[2];
		broadcast(URL + PATH + channel);
		resp.writeHead(200, {'content-type': 'text/plain'});
		resp.end();
	} else if ( params[1] === 'off' && channel ) {
		console.log('off');
		channel = null;
		broadcast(URL)
		resp.writeHead(200, {'content-type': 'text/plain'});
		resp.end();
	} else {
		resp.writeHead(400, {'content-type': 'text/plain'});
		resp.end();
	}

}

function broadcast(url) {

	shorturl(url, 'bit.ly', {
		login: 'jvallelunga',
		apiKey: 'R_e804a0f15e7f7d1dafef23866fdffc76'
	}, function(result) {
		console.log(url + ' -> ' + result);
		beacon.advertiseUrl(result);
	});

}

server.on('request', control);
server.listen(8080);

// TODO: Credentials in a file
// TODO: Build
// TODO: npm start
// TODO: parametrized configuration. ENV or config file
