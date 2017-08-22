define(["app"],function (app) {
	app.controller("uploadDetail",function($scope,$location,httpService,storageService){
		var applyId = storageService.getKey("uploadList_applyId");
		//查看详情
		httpService.get("redPacReward/applyDetail",{"applyId":applyId},function(resp){
			console.log(resp.data.images[0].imgUrl);
			$scope.detail = resp.data;
			$scope.screenshotList = resp.data.images;
		});
	});
	
});