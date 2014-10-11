$(function() {
  "use strict";

  BrainBrowser.SurfaceViewer.start("brainbrowser", function(viewer) {
  
  	//Add an event listener.
  	BrainBrowser.events.addEventListener("displaymodel", function(model) {
    	console.log("We have a model!");
  	});
 
  	// Start rendering the scene.
  	viewer.render();
 
	// Load a model into the scene.
  	// viewer.loadModelFromURL("/models/brain-surface.obj");
    viewer.loadModelFromURL("/models/surfaces/ASCII_surfaces/lh.pial.asc", {
      format: "freesurferasc",
      complete: function() {
        alert("Image has been loaded");
        /*
        viewer.loadIntensityDataFromURL("models/freesurfer-thickness.asc", {
          format: "freesurferasc",
          name: "Cortical Thickness"
        });
      */
      }
    }); 

  	// Load a color map (required for displaying intensity data).
  	viewer.loadColorMapFromURL(BrainBrowser.config.get("color_maps")[0].url);

    $("#brainbrowser").click(function(event) {
      var pick_info = viewer.pick();
      if (pick_info) {
        var x = pick_info.point.x;
        var y = pick_info.point.y;
        var z = pick_info.point.z;
        var index = pick_info.index;
        console.log(pick_info);
        var vertex = {x:x, y:y, z:z, index:index};
        //alert("You clicked on vertex with index: " + vertex.index);
        $.get("givemethelabel", {index: index}, function(data) {
          //alert(data.label + data.color); 
          var splitted = data.label.split(".");
          var region = splitted[1];
          $("#vertex-data").append("<p id='vertex'>" + vertex.index + ' ' + region + ' ' + data.color +"</p>");
        });      
      }
    }); 
  	
  });

});