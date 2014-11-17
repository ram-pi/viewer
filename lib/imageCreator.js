var fs = require("fs");
var exec = require("child_process").exec, child;
var path = require("path");

/* If you' re launching this js alone you don' t need to use path and parerntDir */
var __parentDir = path.dirname(process.mainModule.filename);
var jarLocationOnlyStructure = __parentDir + "/utils/SingleStructureFinder.jar";
var jarLocationSimpleQueryHandler = __parentDir + "/utils/SimpleQueryHandler.jar";
var jarLocationParenthesized = __parentDir + "/utils/QueryHandler.jar";
var jarLocationMultiParameters = __parentDir + "/utils/MultiParameters.jar";
var imgDir = __parentDir + "/images/";

exports.createFromFilenameOnlyStructure = function(structure, filename, savingDir, callback) {
	aseg = "Segmentation/" + filename;
	var command = "/usr/bin/java -jar " + jarLocationOnlyStructure + " " + structure + " " + imgDir + " " + aseg + " " + filename + " " + savingDir;
	console.log("CREATOR: " + command);
	child = exec(command, function(err, result) {
		callback(result);
	});
}

exports.createFromFilenameQuery = function(query, filename, savingDir, callback) {
	fsName = "Segmentation/" + filename;
	var command = "/usr/bin/java -jar " + jarLocationSimpleQueryHandler + " '" + query + "' " + imgDir + " " + fsName + " " + filename + " " + savingDir;
	console.log("CREATOR: " + command);
	child = exec(command, function(err, result) {
		callback(result);
	});
}

exports.createFromFilenameQueryParenthesized = function(query, filename, savingDir, callback) {
	fsName = "Segmentation/" + filename;
	var command = "/usr/bin/java -jar " + jarLocationParenthesized + " '" + query + "' " + imgDir + " " + fsName + " " + filename + " " + savingDir;
	console.log("CREATOR: " + command);
	child = exec(command, function(err, result) {
		callback(result);
	});
}

exports.createFromMultiParameters = function(query, filename, fa, lr, savingDir, callback) {
	fsName = "Segmentation/" + filename;
	faName = "FA/" + filename;
	lrName = "LR/" + filename;
	var command = "/usr/bin/java -jar " + jarLocationMultiParameters + " '" + query + "' '" + fa + "' '" + lr + "' " + savingDir + " " + imgDir + " " + filename + " " + fsName + " " + faName + " " + lrName;
	console.log("CREATOR: " + command);
	child = exec(command, function(err, result) {
		callback(result);
	});
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