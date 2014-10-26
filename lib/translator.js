var labelsReader = require("./labelsReader.js");

// var formula = "180,20,140AND13,0,250OR25,20,140";

// var pieces = formula.split("OR");
// var res = [];

// for (var i = 0; i < pieces.length; i++) {
// 	var colors = pieces[i].split("AND");
// 	for (var j = 0; j < colors.length; j++) {
// 		console.log(colors[j]);
// 		var label = labelsReader.finder(colors[j]);
// 		console.log(label);
// 		formula = formula.replace(colors[j], label);
// 	}
// }

// console.log(formula);

exports.translateQuery = function(formula) {
	var pieces = formula.split("OR");
	var res = [];

	for (var i = 0; i < pieces.length; i++) {
		var colors = pieces[i].split("AND");
		for (var j = 0; j < colors.length; j++) {
			console.log(colors[j]);
			var label = labelsReader.finder(colors[j]);
			console.log(label);
			formula = formula.replace(colors[j], label);
		}
	}
	return formula;
}