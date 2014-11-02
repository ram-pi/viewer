var labelsReader = require("./labelsReader.js");

// var formula = "(60,140,180OR13,0,250OR220,60,220OR140,20,60)OR26,60,150";

// var pieces = formula.split(/[()'AND''OR']/);
// var colors = [];
// for (var i = 0; i < pieces.length; i++) {
// 	if (pieces[i] != "") {
// 		//console.log(pieces[i]);
// 		colors.push(pieces[i]);
// 	}
// };

// for (var i = 0; i < colors.length; i++) {
// 	var label = labelsReader.finder(colors[i]);
// 	formula = formula.replace(colors[i], label);
// };

// console.log(formula);

exports.translateQueryParenthesized = function(formula) {
	var pieces = formula.split(/[()'AND''OR']/);
	var colors = [];
	for (var i = 0; i < pieces.length; i++) {
		if (pieces[i] != "") {
			//console.log(pieces[i]);
			colors.push(pieces[i]);
		}
	};

	for (var i = 0; i < colors.length; i++) {
		var label = labelsReader.finder(colors[i]);
		formula = formula.replace(colors[i], label);
	};
	return formula;
}

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

