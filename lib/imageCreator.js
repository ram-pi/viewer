var fs = require("fs");
var exec = require("child_process").exec, child;
var path = require("path");
var execSync = require("exec-sync");

/* If you' re launching this js alone you don' t need to use path and parerntDir */
var __parentDir = path.dirname(process.mainModule.filename);
var jarLocation = __parentDir + "/utils/niftiLabelsFinder.jar";
var jarLocationOnlyStructure = __parentDir + "/utils/niftiLabelsFinderOnlyStructure.jar";
var jarLocationAndOr = __parentDir + "/utils/niftiLabelsFinderAndOr.jar";
var jarLocationQueryHandler = __parentDir + "/utils/NiftiQueryHandler.jar";
var imgDir = __parentDir + "/images/";
var niftiName = "T1.nii.gz";
var fsName = "Segmentation/" + niftiName;

// var jarLocation = "./utils/niftiLabelsFinder.jar";
// var imgDir = "/Users/pierpaolo/Desktop/tesi/images/img1";
// var niftiName = "T1.nii.gz";
// var fsName = "Free_Surfer_Seg.nii.gz";

// exports.create = function(label, savingDir) {
// 	child = exec("/usr/bin/java -jar " + jarLocation + " " + label + " " + imgDir + " " + fsName + " " + niftiName + " " + savingDir, 
// 		function (err, stdout, stderr) {
// 			if (err !== "null") 
// 				console.log("Creation of images...");
// 			else
// 				console.log(err);
// 		}
// 	);
// }

// exports.createFromFilename = function(label, filename, savingDir) {
// 	fsName = "Segmentation/" + filename;
// 	child = exec("/usr/bin/java -jar " + jarLocation + " " + label + " " + imgDir + " " + fsName + " " + filename + " " + savingDir, 
// 		function (err, stdout, stderr) {
// 			if (err !== "null") 
// 				console.log("Creation of images...");
// 			else
// 				console.log(err);
// 		}
// 	);
// }

exports.createFromFilenameOnlyStructure = function(label, filename, savingDir) {
	fsName = "Segmentation/" + filename;
	child = exec("/usr/bin/java -jar " + jarLocationOnlyStructure + " " + label + " " + imgDir + " " + fsName + " " + filename + " " + savingDir, 
		function (err, stdout, stderr) {
			if (err !== "null") 
				console.log("Creation of images...");
			else
				console.log(err);
		}
	);
}

exports.createFromFilenameOnlyStructureSync = function(label, filename, savingDir) {
	fsName = "Segmentation/" + filename;
	var command = "/usr/bin/java -jar " + jarLocationOnlyStructure + " " + label + " " + imgDir + " " + fsName + " " + filename + " " + savingDir;
	console.log("CREATOR: " + command);
	execSync(command);
}

// exports.createFromFilenameAndOr = function(and, or, filename, savingDir) {
// 	fsName = "Segmentation/" + filename;
// 	var command = "/usr/bin/java -jar " + jarLocationAndOr + " '" + and + "' '" + or + "' " + imgDir + " " + fsName + " " + filename + " " + savingDir;
// 	console.log("CREATOR: " + command);
// 	child = exec(command, 
// 		function (err, stdout, stderr) {
// 			if (err !== "null") 
// 				console.log("Creation of images...");
// 			else
// 				console.log(err);
// 		}
// 	);
// }

// exports.createFromFilenameQuery = function(query , filename, savingDir) {
// 	fsName = "Segmentation/" + filename;
// 	var command = "/usr/bin/java -jar " + jarLocationQueryHandler + " '" + query + "' " + imgDir + " " + fsName + " " + filename + " " + savingDir;
// 	console.log("CREATOR: " + command);
// 	child = exec(command, 
// 		function (err, stdout, stderr) {
// 			if (err !== "null") 
// 				console.log("Creation of images...");
// 			else
// 				console.log(err);
// 		}
// 	);
// }

exports.createFromFilenameQuerySync = function(query, filename, savingDir) {
	fsName = "Segmentation/" + filename;
	var command = "/usr/bin/java -jar " + jarLocationQueryHandler + " '" + query + "' " + imgDir + " " + fsName + " " + filename + " " + savingDir;
	console.log("CREATOR: " + command);
	execSync(command);
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
	var command = "mkdir " + folderName;
	console.log("CREATOR: " + command);
	child = exec(command);
	return folderName;
}

exports.removeFolder = function (name) {
	console.log("CREATOR: Removing folder " + name);
	child = exec("rm -r " + name);
}