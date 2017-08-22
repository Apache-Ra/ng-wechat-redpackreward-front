var SERVER_URI = "";
var SERVER_URI = "http://" + window.location.host + '/mbayRedPacRewardBackend/';
if (window.location.href.indexOf('redPacReward1') > -1) {
	SERVER_URI = "http://" + window.location.host + '/mbayRedPacRewardBackend1/';
}

var WECHAT_URL;
if (window.location.host.indexOf('wechat.mbqianbao.com') > -1) {
	WECHAT_URL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=**********&redirect_uri=";
} else {
	WECHAT_URL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=**********&redirect_uri=";
}

var APP_VERSION = 1.1;

// 開始初始化
(globalInit());

function globalInit() {
    requirejs.config({
        urlArgs : 'v=' + (new Date()).getTime(),
        waitSeconds: 0,
        paths : {
            'ver' : "config/ver"
        }
    });
    
    requirejs([ 'ver' ],
	            function(ver) {
    	APP_VERSION = ver.version;
    	startApp();
    });
}

function startApp() {
	require.config({
	    baseUrl: './',
	    urlArgs : 'v=' + APP_VERSION,
	    waitSeconds: 0,
	    paths: {
	        'angular': 'plugin/angular/angular',
	        'angular-ui-router': 'plugin/angular-ui-router/angular-ui-router.min',
	        'angular-async-loader': 'plugin/angular-async-loader/angular-async-loader.min',
	        'angular-ui-mask': 'plugin/angular-ui-mask/mask.min',
	        'angular-css':'plugin/angular-css/angular-css',
	        'ng-tags-input': 'plugin/ng-tags-input/ng-tags-input.min',
	        'layer': 'plugin/layer/layer',
	        'css' : 'plugin/require/require-css',
	        'iscroll':'plugin/iscrolltime/iscroll',
	        'moment':'plugin/datetimepicker/moment-with-locales',
	        'jquery': 'plugin/jquery/jquery-2.1.1',
	        "webuploader":"plugin/webupload/webuploader",
	        'jQuery-cookie':'plugin/jquery/jQuery-cookie',
	        'app' : 'config/app',
	        'config': 'config/config',
	        'pageList':'config/pageList',
	        'storageUtil':'custom/js/util/storageUtil',
	        'requestUtil':'custom/js/util/requestUtil'
	    },
	    shim: {
	    	  'angular-routes' : ['angular'],
	    	  'datetimepicker':['bootstrap-datetimepicker'],
	          'angular': {exports: 'angular'},
	          'angular-ui-router': {deps: ['angular']},
	          "angular-css": ["angular"]
	    }
	});
	require(['jquery'], function() {
		startLoad();
	});
}

function startLoad() {
	require(['angular', 'layer', 'app','config', 'requestUtil','storageUtil','jQuery-cookie','angular-css'],
			function (angular, layer, app, routes, requestUtil, storageUtil) {
			layer.ready('./plugin/layer/');
		//取出地址栏参数列表
		//注：清除地址栏的code
	    var cookie = $.cookie("_IDENTIY_KEY_");
    	if(cookie){
    		startApp();
    		return;
    	} 
    	
        // 清除Code参数
	    var paras = requestUtil.getUrlParam();
        var param = requestUtil._getUrlParam(window.location.search);
        delete param.code;
        delete param.state;
        window.history.replaceState(null, null, requestUtil.createUrlParam(param));
        
		if(paras.code){
			requestUtil.get("main/wechat/login",{"code":paras.code}).then(function(resp){
        		if (resp.codeText == "OK") {
    				//存储用户信息
    				storageUtil.set("userInfo",resp.data);
    	    		startApp();
        		} else if (resp.codeText == "RESULT_NEED_ADVANCE_AUTH") {
        			requestUtil.gotoLogin(true);
        		} else {
        			layer.msg(resp.message);
        		}
        	});
		} else {
			requestUtil.gotoLogin();
		}
	});
	
	function startApp() {
//	    angular.element(document).ready(function () {
			angular.bootstrap(document, ['app']);
	        angular.element(document).find('html').addClass('ng-app');
//	    });
	}
}