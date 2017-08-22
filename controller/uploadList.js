define(["app"],function (app) {
	app.controller("uploadList",function($scope,$location,httpService,storageService){
		httpService.get("redPacReward/applyList",function(resp){
			//console.log(resp);
			$scope.orderList = resp.data;
			for(var i = 0 ; i < resp.data.length;i++){
				$scope.createTimeData = resp.data[i].createTime.substr(0,10); 
			}
		})
		//
		$scope.orderDetail = function(applyId){
			//清除旧数据
			storageService.removeKey("uploadList_applyId");
			//存储最新的applyId
			storageService.setKey("uploadList_applyId",applyId);
			//跳转到详情页面
			$location.path("/uploadDetail");
		}
	});
	
});