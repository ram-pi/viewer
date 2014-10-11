var fs = require("fs");
var exec = require("child_process").exec, child;
var path = require("path");

/* If you' re launching this js alone you don' t need to use path and parerntDir */
var __parentDir = path.dirname(process.mainModule.filename);
var jarLocation = __parentDir + "/utils/niftiLabelsFinder.jar";
var imgDir = __parentDir + "/images/";
var niftiName = "T1.nii.gz";
var fsName = "Segmentation/" + niftiName;

// var jarLocation = "./utils/niftiLabelsFinder.jar";
// var imgDir = "/Users/pierpaolo/Desktop/tesi/images/img1";
// var niftiName = "T1.nii.gz";
// var fsName = "Free_Surfer_Seg.nii.gz";

exports.create = function(label, savingDir) {
	child = exec("/usr/bin/java -jar " + jarLocation + " " + label + " " + imgDir + " " + fsName + " " + niftiName + " " + savingDir, 
		function (err, stdout, stderr) {
			if (err !== "null") 
				console.log("Creation of images...");
			else
				console.log(err);
		}
	);
}

exports.createFromFilename = function(label, filename, savingDir) {
	fsName = "Segmentation/" + filename;
	child = exec("/usr/bin/java -jar " + jarLocation + " " + label + " " + imgDir + " " + fsName + " " + filename + " " + savingDir, 
		function (err, stdout, stderr) {
			if (err !== "null") 
				console.log("Creation of images...");
			else
				console.log(err);
		}
	);
}

exports.removeImages = function(dir) {
	child = exec("rm " + dir + "*", function(err, stdout, stderr) {
		if(err !== "null")
			console.log("Folder empty");
		else
			console.log("Error while removing files from storage folder");
	});
}

exports.createGifFolder = function(label, filename) {
	var folderName = __parentDir + "/" + label + "_" + filename + "/";
	child = exec("mkdir " + folderName);
	return folderName;
}

exports.removeFolder = function (name) {
	console.log("Removing folder " + name);
	child = exec("rm -r " + name);
}