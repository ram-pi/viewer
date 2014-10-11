var fs = require('fs');
var path = require("path");

var __parentDir = path.dirname(process.mainModule.filename);
var dir_labels_lh = __parentDir + "/public/brainbrowser/models/surfaces/labels/lh_a2009s";
var dir_labels_rh = __parentDir + "/public/brainbrowser/models/surfaces/labels/rh_a2009s";
var annot_ctab = __parentDir + "/public/brainbrowser/models/surfaces/labels/aparc.annot.ctab";
var annot_ctab_a2009s = __parentDir + "/public/brainbrowser/models/surfaces/labels/aparc.annot.a2009s.ctab";

exports.findSurfaceLabel = function(index) {
	//console.log("surfaceLabelFinder.js:You are searching for " + index);
	var files = fs.readdirSync(dir_labels_rh);
	for (var f in files) 
	{
		//console.log(files[f]);
		var res = findInFile(index, files[f]);
		if (res)
		{
			var label = files[f];
			//console.log("surfaceLabelFinder.js:You have found the index in the label file " + files[f]);
			//var color = findColorInAnnotation(label);
			return label;
		}
	}
	return null;
}

findInFile = function(index, filename) {
	var path = dir_labels_rh + "/" + filename;
	//console.log("Opening " + path);
	
	var data = fs.readFileSync(path, "utf8");
	var lines = data.split("\n"); 
	for (var l in lines) {
		// console.log(lines[l]);
		var s = lines[l].split(" ");
		// console.log(s[0]);
		if (s[0] == index) {
			return true;
		}
	}

	return false;
}

exports.findColorInAnnotation = function(label) {
	//console.log("surfaceLabelFinder.js:Find color annotation for label " + label);
	var data = fs.readFileSync(annot_ctab_a2009s, "utf8");

	var splitted = label.split(".");
	var region = splitted[1];
	//console.log("The region is " + region);
	var lines = data.split("\n");
	for (var l in lines) {
		if (lines[l].match(region)) {
			lines[l] = lines[l].replace(/\s+/g, ' ');
			//console.log(lines[l]);
			var splitted = lines[l].split(" ");
			var r = splitted[3];
			var g = splitted[4];
			var b = splitted[5];
			var color = r + " " + g + " " + b;
			//console.log(color);
			return color;
		}
	}
}


/* Examples */
// var label = this.findSurfaceLabel(5289);
// var color = this.findColorInAnnotation(label);

