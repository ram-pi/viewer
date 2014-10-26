var fs = require('fs');
var path = require("path");

/* If you' re launching this js alone you don' t need to use path and parerntDir */
var __parentDir = path.dirname(process.mainModule.filename);
var lines = fs.readFileSync(__parentDir + '/utils/labels.html', 'utf8').split("\n");

/* Uncomment this if you are launching this app alone */
// var lines = fs.readFileSync('../utils/labels.html', 'utf8').split("\n");

exports.finder = function(color) {
	//console.log("labelsReader.js:You are searching for " + color);
	var labels = "";
	var count = 0;
	for (var l in lines) {
		var line = lines[l];
		if (line.indexOf(color) > -1) {
			var n = lines[l-6];	
			var splitted = n.split("> ");
			//console.log(splitted[1]);

			//console.log("The id you found is " + splitted[1]);
			if (count == 0) 
				labels = splitted[1];
			else
				labels = labels + "_" + splitted[1];

			count++;
		}
	}

	//console.log("The labels list is : " + labels);
	return labels;
}

exports.findByRegion = function(region) {
	//console.log("labelsReader.js:You are searching for " + region);
	for (var l in lines) {
		var line = lines[l];
		if (line.indexOf(region) > -1) {
			var n = lines[l-3];	
			var splitted = n.split("> ");
			//console.log(splitted[1]);
			// Special case fot corpus_callosus
			if (splitted[1] == 86)
				return 255;
			return splitted[1];
		}
	}
}

/* Examples */
// var label = this.findByRegion("left lateral ventricle");
// var label =  this.finder("245,245,245");