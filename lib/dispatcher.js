var fs = require('fs');
var path = require("path");
var querystring = require('querystring');
var _url = require("url");
var labelsReader = require("./labelsReader.js");
var creator = require("./imageCreator.js");
var translator = require("./translator.js");

/* Load local libs */
var surfaceLabelFinder = require("./surfaceLabelFinder.js");

/* __parentDir take the dirname of the app is running */
var __parentDir = path.dirname(process.mainModule.filename);
var gifDir = __parentDir + "/gif/";

exports.dispatchGET = function(req, res) {
	
	var BBpath = "public/brainbrowser/";
	var path = req.url.pathname;
	//console.log(path + " " + req.params.path);

	/* Loading BB files */
	if (path == "/") {
		console.log("SERVER: Loading BB page...");
		res.file(BBpath + "viewer_simple.html");
	}

	else if (path == "/simple") {
		console.log("SERVER: Loading new viewer...");
		res.file(BBpath + "viewer_simple.html");
	}

	else if (path == "/query") {
		console.log("SERVER: Loading new viewer...");
		res.file(BBpath + "viewer_query.html");
	}

	else if (path == "/parenthesized") {
		console.log("SERVER: Loading new viewer...");
		res.file(BBpath + "viewer_parenthesized.html");
	}

	// Load angular module
	else if (path == "/core.js") {
		console.log("SERVER: Loading core.js");
		res.file("./lib/core.js");
	}

	// Load angular module
	else if (path == "/core_mod.js") {
		console.log("SERVER: Loading core_mod.js");
		res.file("./lib/core_mod.js");
	}

	else if (path == "/core_parenthesized.js") {
		console.log("SERVER: Loading core_parenthesized.js");
		res.file("./lib/core_parenthesized.js");
	}


	// Find the list of nifti
	else if (path == "/niftiList") {
		var files = fs.readdirSync(__parentDir + "/images/");
		//console.log(files);
		var content = "";
		for (var i = 0; i < files.length; i++) {
			if (!files[i].match("DS") && !files[i].match("Segmentation"))
				content += files[i] + "!";
		};
		res({"list" : content});
	}

	// Find the miniatures
	else if (path.match("min.gif")) {
		console.log("SERVER: Loading miniatures...");
		res.file("./images/Miniature/" + req.params.path);
	}

	// Load coronal.gif axial.gif sagital.gif
	else if (path.match("gif") || path.match("nii")) {
		console.log("SERVER: Loading gif " + path);
		res.file(path);
	}

	// Find the label when surface is clicked
	else if (path.match("givemethelabel")) {
		var index = req.url.query.index;
		if (index != undefined) {
			var label = surfaceLabelFinder.findSurfaceLabel(index);
			var color = surfaceLabelFinder.findColorInAnnotation(label);
			res(({"label":label, "color":color}));
		}
	}

	else if (path.match("simpleSearch")) {
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

	else if (path.match("querySearch")) {
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

	else if (path.match("queryParenthesized")) {
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

	// Loading BB resources
	else {
		res.file(BBpath + path);
	}
}

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
