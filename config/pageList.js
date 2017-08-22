define(['requestUtil'], function (requestUtil) {
	var pageList = {};
	//取出模板名称
	var paras = requestUtil.getUrlParam();
	var template;
	if(!paras.template){
		template = "default/";
	} else {
		template = paras.template;
	}

	pageList['uploadFile'] = {
        url: '/uploadFile',
        templateUrl:'page/' + template+'/upload/uploadFile.html',
        controllerUrl: 'controller/uploadFile.js',
        controller: 'uploadFile',
        css: 'custom/css/'+template+'/upload/uploadFile.css'
    };
	
    pageList['uploadSuccess'] = {
        url: '/uploadSuccess',
        templateUrl:'page/' + template+'/upload/uploadSuccess.html',
        controllerUrl: 'controller/uploadSuccess.js',
        controller: 'uploadSuccess',
        css:'custom/css/' + template+'/upload/uploadSuccess.css'
    };
    
    pageList['uploadList'] = {
        url: '/uploadList',
        templateUrl:'page/' + template+'/upload/uploadList.html',
        controllerUrl: 'controller/uploadList.js',
        controller: 'uploadList',
        css:'custom/css/'+template+'/upload/uploadList.css'
    }; 

    pageList['uploadDetail'] = {
        url: '/uploadDetail',
        templateUrl:'page/' + template+'/upload/uploadDetail.html',
        controllerUrl: 'controller/uploadDetail.js',
        controller: 'uploadDetail',
        css:'custom/css/'+template+'/upload/uploadDetail.css'
    };
    
    return pageList;
});
