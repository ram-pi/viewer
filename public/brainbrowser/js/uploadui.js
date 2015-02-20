"use strict"

$(document).ready(function() {
        $("#uploadBtn").change(function() {
            $("#uploadFile").val($("#uploadBtn").val());
        });

        $("#send").click(function() {
            var file = document.getElementById("uploadBtn");
            alert(file.files[0]);

            $.ajax({
                url: "uploadFile",
                type: "GET",
                data: new FormData(file.files[0]),
                contentType: fileType
            });
        });
    });