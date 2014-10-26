var app = angular.module('viewerModule', []);

app.controller("viewerController", ["$scope", "$http", "$q", function($scope, $http, $q) {

	$scope.index = "index";
	$scope.color = "color";
	$scope.region = "region";
	$scope.coordinates = "coordinates";
	$scope.colorsList = "list of selected colors";
	$scope.regionsList = "list of selected regions";
	$scope.andColors = "required colors";
  $scope.orColors = "optional colors";
  $scope.query = "T";

	/* Calling this function to display the list of nifti */
	$http.get("/niftiList")
		.success(function(data) {
			console.log("Controller: /niftiList SUCCESS " + data.list);
			var parts = data.list.split("!");
			
			/* Cleaning the list of nifti deleting with splice the elements are not .nii.gz */
			angular.forEach(parts, function(value, key) {
				var index = value.indexOf("nii.gz");
				//console.log(value + " in position " + key + " " + index);
				if (index < 0) {
					//console.log("We are deleting " + value);
					parts.splice(key, 1);
				}

			}, this);

			$scope.list = parts;
		})
		.error(function(error) {
			console.log("Controller: /niftiList ERROR " + error);
		});

	/* Starting brainbrowser  and brainbrowser settings */
	BrainBrowser.SurfaceViewer.start("brainbrowser", function(viewer) {
  
  		//Add an event listener.
  		BrainBrowser.events.addEventListener("displaymodel", function(model) {
    		console.log("We have a model!");
  		});
 
  		// Start rendering the scene.
  		viewer.render();
 
		// Load a model into the scene.
  		// viewer.loadModelFromURL("/models/brain-surface.obj");
    	viewer.loadModelFromURL("/models/surfaces/ASCII_surfaces/rh.pial.asc", {
      		format: "freesurferasc",
      		complete: function() {
        		console.log("Image has been loaded!");
      		}
    	});

    	/* Get info after clicking on the brain */ 
    	$("#brainbrowser").click(function(event) {
      		var pick_info = viewer.pick();
      		if (pick_info) {
        		var x = pick_info.point.x.toPrecision(3);
        		var y = pick_info.point.y.toPrecision(3);
        		var z = pick_info.point.z.toPrecision(3);
        		var index = pick_info.index;
        		console.log(pick_info);
        		var vertex = {x:x, y:y, z:z, index:index};
        		//alert("You clicked on vertex with index: " + vertex.index);
        		
        		$http.get("givemethelabel?index="+index).success(function(data) {
        			console.log("CONTROLLER SUCCESS on givemethelabel");
        			var splitted = data.label.split(".");
        			var region = splitted[1];
        			$scope.color = data.color;
        			$scope.region = region;
        			$scope.coordinates = x + " " + y + " " + z;
        			$scope.index = index;
        		});
      		}
    	}); 
  	
  });

  $scope.multiSearch = function() {
  	var filename = $("#selectNii:checked").val();
  	if (typeof filename === 'undefined') {
  		alert("Please check at least one of the image!");
  	}
  	else {
  		var w = window.open("");
  		$http.get("multiLabels?colors=" + $scope.colorsList + "&filename=" + filename + "&onlyStructure=" + 0)
  			.success(function(response) {
  				w.document.write(response);
  			});
  	}
  }

  $scope.onlyStructure = function() {
  	var filename = $("#selectNii:checked").val();
  	if (typeof filename === 'undefined') {
  		alert("Please check at least one of the image!");
  	}
  	else {
  		var w = window.open("");
  		$http.get("multiLabels?colors=" + $scope.colorsList + "&filename=" + filename + "&onlyStructure=" + 1)
  			.success(function(response) {
  				w.document.write(response);
  			});
  	}
  }

  $scope.complexSearch = function() {
  	var filename = $("#selectNii:checked").val();

  	if ($scope.andColors.indexOf("required") > -1) {
  	  	alert("You have to select at least one required color!");
  		return;
  	}

  	if (typeof filename === 'undefined') {
  		alert("Please check at least one of the image!");
  	}
  	else {
  		var w = window.open("");
  		$http.get("complexSearch?andColors=" + $scope.andColors + "&orColors=" + $scope.orColors + "&filename=" + filename + "&onlyStructure=" + 1)
  			.success(function(response) {
  				w.document.write(response);
  			});
  	}
  }

  $scope.submit = function() {
  	console.log("Called submit");
  }

  $scope.clearScope = function() {
  	$scope.index = "index";
  	$scope.color = "color";
  	$scope.region = "region";
  	$scope.coordinates = "coordinates";
  	$scope.colorsList = "list of selected colors";
  	$scope.regionsList = "list of selected regions";
  	$scope.andColors = "colors required";
  	$scope.orColors = "colors optional";
    $scope.query = "T";
  }

  $scope.add = function() {
  	var splitted = $scope.color.split(" ");
  	var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
  	if ($scope.colorsList.indexOf(color) > -1) 
  		alert("You have already insert this color!");
  	else {
  		if ($scope.colorsList.indexOf("list") > -1) {
  			$scope.colorsList = color;
  			$scope.regionsList = $scope.region;
  		} else {
  			$scope.colorsList = $scope.colorsList + " " + color;
  			$scope.regionsList = $scope.regionsList + "\n" + $scope.region;
  		}
  	}
  }

  $scope.and = function() {
  	var splitted = $scope.color.split(" ");
  	var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
  	if ($scope.andColors.indexOf(color) > -1 || $scope.orColors.indexOf(color) > -1) 
  		alert("You have already insert this color!");
  	else {
  		$scope.query = $scope.query + " && " + $scope.region;
      if ($scope.andColors.indexOf("required") > -1) {
  			$scope.andColors = color;
  		} else {
  			$scope.andColors = $scope.andColors + " " + color;
  		}
  	}
  }

  $scope.or = function() {
  	var splitted = $scope.color.split(" ");
  	var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
  	if ($scope.orColors.indexOf(color) > -1 || $scope.andColors.indexOf(color) > -1) 
  		alert("You have already insert this color!");
  	else {
      $scope.query = $scope.query + " || " + $scope.region;
  		if ($scope.orColors.indexOf("optional") > -1) {
  			$scope.orColors = color;
  		} else {
  			$scope.orColors = $scope.orColors + " " + color;
  		}
  	}
  }



}]);