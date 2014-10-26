/*
Utility function library
 */

$(function() {

	$("#send_region").click(function() {
		var label = $("#pick-label").html();
		alert(label);
	});

	function getList() {
		$.getJSON("niftiList", function(data) {
            var list = "";
            $.each(data, function(i, field) {
                list = field;
            });
            var parts = list.split("!");
            $.each (parts, function (i, field) {
                if (field.match(".nii.gz")) {
                    var min = field + ".min.gif";
                    // var option = $("<option value='" + field + "'>" + field + "</option>");
                    // $("#selectNii").append(option);
                    // var li = $("<li></li>");
                    // var img = $("<img src='" + min + "' height='45' width='45'/>");
                    // li.append(img);
                    // $("#previewImg").append(li);
                    var tr = $("<tr></tr>");
                    var td1 = $("<td></td>");
                    var td2 = $("<td></td>");
                    var td3 = $("<td></td>");
                    var checkbox = $("<input type='checkbox' name='selectNii' id='selectNii' value='" + field + "' />");
                    var name = $("<p> " + field + " </p>");
                    var img = $("<img src='" + min + "' height='45' width='45'/>");
                    td1.append(checkbox);
                    td2.append(name);
                    td3.append(img);
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    $("#niftiTable").append(tr);
                }
            });
        });
	}
});