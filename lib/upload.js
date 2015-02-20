var app = angular.module('uploadViewerModule', []);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, file2, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('name', file.name);
        fd.append("file2", file2);
        fd.append("name2", file2.name);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
     	   .success(function(){
     	   	alert("Upload Done!");
        })
        	.error(function(){
        });
    }
}]);

app.controller('uploadController', ['$scope', 'fileUpload', function($scope, fileUpload){
    
    $scope.uploadFile = function(){
        var file = $scope.volume;
        var file2 = $scope.aseg;
        console.log('volume is ' + JSON.stringify(file) + " " + file.name);
        console.log('aseg is ' + JSON.stringify(file) + " " + file2.name);
        var uploadUrl = "/fileUpload";
        fileUpload.uploadFileToUrl(file, file2, uploadUrl);
    };
    
}]);