var Hapi = require('hapi');
var dispatcher = require("./lib/dispatcher.js"); 

// Create Server
var server = new Hapi.Server('localhost', 8080);

var BBpath = "public/brainbrowser/";

// Set a dispatcher var surfaceLabelFinder = require("./surfaceLabelFinder.js");
server.route({
	method: 'GET',
	path: '/{path*}',
	handler: function(req, res) {
		dispatcher.dispatchGET(req, res);
	}
});

server.start(function() {
	console.log("Server running at", server.info.uri);
});
