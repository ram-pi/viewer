var app = angular.module('viewerModule', []);

app.controller("viewerController", ["$scope", "$http", "$q", function($scope, $http, $q) {

	$scope.index = "index";
	$scope.color = "color";
	$scope.region = "region";
	$scope.coordinates = "coordinates";
  $scope.tags = [];
  $scope.tagsRegions = [];
  $scope.replaceHolder = -1;
  $scope.lastDelete = "";
  $scope.lastDeleteRegion = "";
  $scope.openParenthesis = 0;

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

      viewer.loadIntensityDataFromURL("color-maps/testcolor.txt", {
                 complete: function () {
                    alert("Colors are loaded");
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

  $scope.querySearch = function() {
    if ($scope.openParenthesis != 0) {
      alert("You must close the parenthesis! "  + " you have another " + $scope.openParenthesis + " open...");
      return
    }

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

      var query = "";
      for (var i = 0; i < $scope.tags.length; i++) {
        query += $scope.tags[i];
      };
      console.log(query);

      var w = window.open("");
          $http.get("queryParenthesized?query=" + query + "&filename=" + filename)
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
    $scope.tags = [];
    $scope.tagsRegions = [];
    $scope.replaceHolder = -1;
    $scope.lastDelete = "";
    $scope.lastDeleteRegion = "";
    $scope.openParenthesis = 0;

  }

  $scope.add = function() {
    var len = $scope.tags.length;
    if ($scope.replaceHolder != -1) {
      if ($scope.lastDelete != "AND" && $scope.lastDelete != "OR") {
        var splitted = $scope.color.split(" ");
        var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
        console.log("CORE: color -> " + color);
        var query = "";
        for (var i = 0; i < $scope.tags.length; i++) {
          query += $scope.tags[i]
        }

        if ($scope.region == "region") {
          alert("You must select a region :(");
        }
        else if (query.indexOf(color) > -1) 
          alert("You have already insert this color!");
        else {
          $scope.tags[$scope.replaceHolder] = color;
          $scope.tagsRegions[$scope.replaceHolder] = $scope.region;
          $scope.replaceHolder = -1;
        }
      } else {
        alert("You should insert an operator! :(");
      }
    }
    else if ($scope.tags.length == 0 || $scope.tags[len-1] == "OR" || $scope.tags[len-1] == "AND" || $scope.tags[len-1] == "(") {
    	var splitted = $scope.color.split(" ");
    	var color = splitted[0] + "," + splitted[1] + "," + splitted[2];
      console.log("CORE: color -> " + color);
      
      var query = "";
      for (var i = 0; i < $scope.tags.length; i++) {
        query += $scope.tags[i]
      }

    	if (query.indexOf(color) > -1) 
    		alert("You have already insert this color!");
      else if($scope.region == "region") {
        alert("You must select a region :(");
      }
    	else {
    		$scope.tags.push(color);
        $scope.tagsRegions.push($scope.region);
    	}

    } else {
      alert("You should insert an operator!");
    }
  }

  function checkOperator() {
    var l = $scope.tags.length;
    if ($scope.tags[l-1] == "AND" || $scope.tags[l-1] == "OR" || l == 0 ) {
        alert("You cannot insert an operator here!");
        return false;
    } else if ($scope.tags[l-1] == "(") {
        alert("You cannot insert an operator before ( !");
        return false;
    }
    return true; 
  }

  $scope.and = function() {
    if ($scope.replaceHolder != -1) {
      if ($scope.lastDelete == "AND" || $scope.lastDelete == "OR") {
        $scope.tags[$scope.replaceHolder] = "AND";
        $scope.tagsRegions[$scope.replaceHolder] = "AND";
        $scope.replaceHolder = -1;
      } else {
        alert("You should add a structure :(");
      }
    }

    else if (checkOperator()) {
      $scope.query += " AND ";
      $scope.queryColors += " AND ";
      $scope.tags.push("AND");
      $scope.tagsRegions.push("AND");
    }
  }

  $scope.or = function() {
    if ($scope.replaceHolder != -1) {
      if ($scope.lastDelete == "AND" || $scope.lastDelete == "OR") {
        $scope.tags[$scope.replaceHolder] = "OR";
        $scope.tagsRegions[$scope.replaceHolder] = "OR";
        $scope.replaceHolder = -1;
      } else {
        alert("You should add a structure :(");
      }
    }

    else if (checkOperator()) {
      $scope.tags.push("OR");
      $scope.tagsRegions.push("OR");
    }
  }

  $scope.open = function () {
    $scope.tags.push("(");
    $scope.tagsRegions.push("(");
    $scope.openParenthesis++;
  }

  $scope.close = function () {
    $scope.tags.push(")");
    $scope.tagsRegions.push(")");
    $scope.openParenthesis--;
  }

  $scope.removeTag = function(el, idx) {
    var l = $scope.tags.length;
    if ($scope.tags[idx] == "(" || $scope.tags[idx] == ")") {
      if (idx == l-1) 
      {
        $scope.lastDelete = $scope.tags.pop();
        $scope.lastDeleteRegion = $scope.tagsRegions.pop();
        $scope.replaceHolder = idx;
      } else {
        alert("You cannot substitute the parenthesis");
      }
      return;
    }

    if ($scope.tags[idx].match("Replaced")) {
      $scope.tags[idx] = $scope.lastDelete;
      $scope.tagsRegions[idx] = $scope.lastDeleteRegion;
      $scope.lastDelete = "";
      $scope.lastDeleteRegion = "";
      return;
    }

    if (idx == l-1) {
      $scope.lastDelete = $scope.tags.pop();
      $scope.lastDeleteRegion = $scope.tagsRegions.pop();
      $scope.replaceHolder = idx;
    } else {
      $scope.replaceHolder = idx;
      $scope.lastDelete = $scope.tags[idx];
      $scope.lastDeleteRegion = $scope.tagsRegions[idx];
      $scope.tags[idx] = "To Be Replaced!";
      $scope.tagsRegions[idx] = "To Be Replaced!";
    }
  }


}]);