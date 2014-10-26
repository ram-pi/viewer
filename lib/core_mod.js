var app = angular.module('viewerModule', []);

app.controller("viewerController", ["$scope", "$http", "$q", function($scope, $http, $q) {

	$scope.index = "index";
	$scope.color = "color";
	$scope.region = "region";
	$scope.coordinates = "coordinates";
  $scope.query = "";
  $scope.lastSymbol = "";

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

  $scope.simpleSearch = function() {
  	var filename = $("#selectNii:checked").val();
    var splitted = $scope.color.split(" ");
    var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
  	if (typeof filename === 'undefined') {
  		alert("Please check at least one of the image!");
  	}
  	else {
  		var w = window.open("");
  		$http.get("simpleSearch?color=" + color +"&filename=" + filename)
  			.success(function(response) {
  				w.document.write(response);
  			});
  	}
  }

  $scope.querySearch = function() {
    if (checkOperator()) {
      var filename = $("#selectNii:checked").val();
      if (typeof filename === 'undefined') {
          alert("Please check at least one of the image!");
          return;
      }

      if ($scope.query == "") 
      {
        alert("Build a valid query please! ");
        return;
      }

      var w = window.open("");
          $http.get("querySearch?query=" + $scope.queryColors + "&filename=" + filename)
            .success(function(response) {
              w.document.write(response);
            })
            .error(function() {
              alert("There is some server' s problem :(");
            });
    }
  }

  $scope.clearScope = function() {
  	$scope.index = "index";
  	$scope.color = "color";
  	$scope.region = "region";
  	$scope.coordinates = "coordinates";
    $scope.queryColors = "";
    $scope.query = "";
  }

  $scope.add = function() {
    if ($scope.lastSymbol == "" || $scope.lastSymbol == "AND" || $scope.lastSymbol == "OR") {
    	var splitted = $scope.color.split(" ");
    	var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
      console.log("CORE: color -> " + color);
    	if ($scope.query.indexOf(color) > -1) 
    		alert("You have already insert this color!");
    	else {
    		if ($scope.query == "") {
          $scope.query = $scope.region;
          $scope.queryColors = color;
    		} else {
    		  $scope.query += $scope.region;
          $scope.queryColors += color;
        }
    	}

      $scope.lastSymbol = "REGION";
    } else {
      alert("You should insert an operator!");
    }
  }

  function checkOperator() {
    var pieces =  $scope.query.split(" ");
    var last = pieces[pieces.length-1];
    if ($scope.query == "" || last == "") {
        alert("You cannot insert an operator here!");
        return false;
    }
    return true; 
  }

  $scope.and = function() {
    if (checkOperator()) {
      $scope.query += " AND ";
      $scope.queryColors += " AND ";
      $scope.lastSymbol = "AND";
    }
  }

  $scope.or = function() {
    if (checkOperator()) {
      $scope.query += " OR ";
      $scope.queryColors += " OR ";
      $scope.lastSymbol = "OR";
    }
  }


}]);