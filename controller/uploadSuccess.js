define(["app"],function (app) {
	app.controller("uploadSuccess",function($scope,$location){
		$scope.returnPage = function(){
			$location.path("/uploadFile");
		}
	});
	
});