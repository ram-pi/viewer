var Hapi = require('hapi');
var fs = require('fs');
var path = require("path");
var querystring = require('querystring');
var _url = require("url");
var labelsReader = require("./lib/labelsReader.js");
var creator = require("./lib/imageCreator.js");
var translator = require("./lib/translator.js");

/* Load local libs */
var surfaceLabelFinder = require("./lib/surfaceLabelFinder.js");

/* __parentDir take the dirname of the app is running */
var __parentDir = path.dirname(process.mainModule.filename);
var gifDir = __parentDir + "/gif/";

// Create Server
var server = new Hapi.Server('localhost', 8080);

var BBpath = "public/brainbrowser/";


server.route({
	method: 'GET',
	path: '/',
	handler: {
		file: BBpath + "viewer_simple.html"
	}
});

server.route({
	method: 'GET',
	path: '/simple',
	handler: {
		file: BBpath + "viewer_simple.html"
	}
});

server.route({
	method: 'GET',
	path: '/query',
	handler: {
		file: BBpath + "viewer_query.html"
	}
});

server.route({
	method: 'GET',
	path: '/parenthesized',
	handler: {
		file: BBpath + "viewer_parenthesized.html"
	}
});

server.route({
	method: 'GET',
	path: '/multi',
	handler: {
		file: BBpath + "viewer_multi.html"
	}
});

server.route({
	method: 'GET',
	path: '/upload',
	handler: {
		file: BBpath + "upload.html"
	}
});

server.route({
	method: 'GET',
	path: '/core.js',
	handler: {
		file: "./lib/core.js"
	}
});

server.route({
	method: 'GET',
	path: '/css/{typing*}',
	handler: {
		file: function(req) {
			console.log(req.url.pathname);
			return BBpath + req.url.pathname;
		}
	}
});

server.route({
	method: 'GET',
	path: '/js/{typing*}',
	handler: {
		file: function(req) {
			console.log(req.url.pathname);
			return BBpath + req.url.pathname;
		}
	}
});

server.route({
	method: 'GET',
	path: '/surface-viewer-demo.config.js',
	handler: {
		file: BBpath + '/surface-viewer-demo.config.js'
	}
});

server.route({
	method: 'GET',
	path: '/surface-viewer-settings.js',
	handler: {
		file: BBpath + '/surface-viewer-settings.js'
	}
});

server.route({
	method: 'GET',
	path: '/{name}.nii.gz.min.gif',
	handler: {
		file: function(req) {
			console.log(req.url.pathname + " -> " + "./images/Miniature/" + req.url.pathname);
			return './images/Miniature/' + req.url.pathname;
		}
	}
});

server.route({
	method: 'GET',
	path: '/{name}.nii.min.gif',
	handler: {
		file: function(req) {
			console.log(req.url.pathname + " -> " + "./images/Miniature/" + req.url.pathname);
			return './images/Miniature/' + req.url.pathname;
		}
	}
});


server.route({
	method: 'GET',
	path: '/models/surfaces/ASCII_surfaces/{surfacename}',
	handler: {
		file: function(req) {
			console.log(req.url.pathname);
			return BBpath + req.url.pathname;
		}
	}
});

/* Handling the results display i.e. axial.gif sagital.gif */
server.route({
	method: 'GET',
	path: __parentDir + '/{name}/{perspective}.gif',
	handler: {
		file: function(req) {
			console.log(req.url.pathname);
			return req.url.pathname;
		}
	}
});

server.route({
	method: 'GET',
	path: '/uploadFile',
	handler: 
		function(req, res) {
			//TODO
		}
});

server.route({
	method: 'GET',
	path: '/niftiList',
	handler: 
		function(req, res) {
			var files = fs.readdirSync(__parentDir + "/images/");
			//console.log(files);
			var content = "";
			for (var i = 0; i < files.length; i++) {
				if (!files[i].match("DS") && !files[i].match("Segmentation"))
					content += files[i] + "!";
			};
			res({"list" : content});
		}
});

server.route({
	method: 'GET',
	path: '/givemethelabel',
	handler: 
		function(req, res) {
			var index = req.url.query.index;
			if (index != undefined) {
				var label = surfaceLabelFinder.findSurfaceLabel(index);
				var color = surfaceLabelFinder.findColorInAnnotation(label);
				res(({"label":label, "color":color}));
			}
		}
});

server.route({
	method: 'GET',
	path: '/simpleSearch',
	handler: 
		function(req, res) {
			var color = req.url.query.color;
			var filename = req.url.query.filename;
			var labels = labelsReader.finder(color);
			console.log("SERVER: labels are " + labels);
			var savingDir = creator.createGifFolder(labels, filename);
			var files = creator.createFromFilenameOnlyStructure(labels, filename, savingDir, function(files) {
				// Create HTML page for the result
				exports.createHTMLpage(files, savingDir, res);
			});
		}
});

server.route({
	method: 'GET',
	path: '/querySearch',
	handler: 
		function(req, res) {
			var query = req.url.query.query;
			var filename = req.url.query.filename;
			// Deleting spaces
			query = query.replace(/\s+/g, '');
			query = translator.translateQuery(query);
			console.log("SERVER: querySearch on -> " + query + " and " + filename);

			// Perform the search for the relative slices
			var savingDir = creator.createGifFolder(query, filename);
			creator.createFromFilenameQuery(query, filename, savingDir,
					function(files) {
						// Create HTML page for the result
						exports.createHTMLpage(files, savingDir, res);
					}
				);
		}
});

server.route({
	method: 'GET',
	path: '/queryParenthesized',
	handler: 
		function(req, res) {
			var query = req.url.query.query;
			var filename = req.url.query.filename;
			// Deleting spaces
			query = query.replace(/\s+/g, '');
			query = translator.translateQueryParenthesized(query);
			console.log("SERVER: querySearch on -> " + query + " and " + filename);


			// unable to create folder with ()
			var query2 = query.replace(/\(/g, "P");
			var query2 = query2.replace(/\)/g, "P");
			// Perform the search for the relative slices
			var savingDir = creator.createGifFolder(query2, filename);
			creator.createFromFilenameQueryParenthesized(query, filename, savingDir,
				function(files) {
					// Create HTML page for the result
					exports.createHTMLpage(files, savingDir, res);
				});
		}
});

server.route({
	method: 'GET',
	path: '/multiParameters',
	handler: 
		function(req, res) {
			var query = req.url.query.query;
			var filename = req.url.query.filename;
			var fa = req.url.query.fa;
			var lr = req.url.query.lr;
			// Deleting spaces
			query = query.replace(/\s+/g, '');
			query = translator.translateQueryParenthesized(query);
			console.log("SERVER: querySearch on -> " + query + " and " + filename + " and " + fa + " and " + lr);


			// unable to create folder with ()
			var query2 = query.replace(/\(/g, "P");
			var query2 = query2.replace(/\)/g, "P");
			// Perform the search for the relative slices
			var savingDir = creator.createGifFolder(query2, filename);
			creator.createFromMultiParameters(query, filename, fa, lr, savingDir,
				function(files) {
					// Create HTML page for the result
					exports.createHTMLpage(files, savingDir, res);
				});
		}
});

server.start(function() {
	console.log("Server running at", server.info.uri);
});


exports.createHTMLpage = function(files, savingDir, res) {
	var content = "<html><head><title>Results Page</title></head><body>";

	fs.readdir(savingDir, function (err, files) {
		if (err !== "null") {
			console.log("SERVER: Reading list of files...");
			for (var i = 0; i < files.length; i++) {
				if (!files[i].match("DS") && !files[i].match("result")) {
					//console.log(files[i]);
					content += "<img src='" + savingDir + files[i] + "' />";
				}
			};
			var niftiDir = savingDir + "result.nii";
			content += "</br><p>Please <a href='" + niftiDir + "'>download </a> the result as nifti.</p>";
			content += "</body></html>";
			res(content);
		} else 
			console.log("Error -> " + err);
	});	

	setTimeout(function() {
		creator.removeFolder(savingDir);
	}, 480000);	
}
