var fs = require('fs');
var path = require("path");
var querystring = require('querystring');
var _url = require("url");
var labelsReader = require("./labelsReader.js");
var creator = require("./imageCreator.js");


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
		res.file(BBpath + "viewer.html");
	}

	// Load angular module
	else if (path == "/core.js") {
		console.log("SERVER: Loading core.js");
		res.file("./lib/core.js");
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
	else if (path.match("gif")) {
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

	else if (path.match("multiLabels")) {
		var colors = req.url.query.colors;
		var filename = req.url.query.filename;
		var onlyStructure = req.url.query.onlyStructure;
		console.log("SERVER: multiLabels search with input: " + colors + " " + filename + " " + onlyStructure);
		var colorsSplitted = colors.split(" ");
		var labels;
		for (var i in colorsSplitted) {
			var color = colorsSplitted[i];
			//console.log(color);
			var label = labelsReader.finder(color);
			if (i == 0) {
				labels = label;
			} else {
				labels = labels + "_" + label;
			}
		}
		console.log("SERVER: labels are " + labels);

		// Perform the search for the relative slices
		var savingDir = creator.createGifFolder(labels, filename);
		if (onlyStructure == 0)
			var files = creator.createFromFilename(labels, filename, savingDir);
		else 
			var files = creator.createFromFilenameOnlyStructure(labels, filename, savingDir);

		// Create HTML page for the result
		var content = "<html><head><title>Results Page</title></head><body>";

		// TODO handle the asynchronous execution of jar before execute the things below
		setTimeout(function() {
			fs.readdir(savingDir, function (err, files) {
				if (err !== "null") {
					console.log("SERVER: Reading list of files...");
					for (var i = 0; i < files.length; i++) {
						if (!files[i].match("DS")) {
							//console.log(files[i]);
							content += "<img src='" + savingDir + files[i] + "' />";

						}
					};
					content += "</body></html>";
					res(content);
				} else 
					console.log("Error -> " + err);
			});	
		}, 12000);

		setTimeout(function() {
			creator.removeFolder(savingDir);
		}, 30000);	
	}

	// Loading BB resources
	else {
		res.file(BBpath + path);
	}
}
