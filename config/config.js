define(['pageList','app'], function (pageList,app) {

    app.run(['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
	
	//配置常量TODO
	app.constant("http", SERVER_URI);
	app.constant("errorMessage", "服务器异常,请稍后重试!")
	
	if (window.location.host.indexOf('wechat.mbqianbao.com') > -1) {
		app.constant("wxUrl", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4453e33d9edf7859&redirect_uri=");
	} else {
		app.constant("wxUrl", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx80e93f0ed4a043c8&redirect_uri=");
	}
	
	//配置路由
    app.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    	//去掉URL的#
    	//$locationProvider.html5Mode(true);
    	//默认的首页
        $urlRouterProvider.otherwise('/uploadFile');

        //禁用ajax请求缓存
        if(!$httpProvider.defaults.headers.get){
        	$httpProvider.defaults.headers.get = {};
        }
        //配置http发送模式
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
        $httpProvider.defaults.transformRequest = function(data){
        	//当参数不为空的时候
        	if(data){
        		return JSON.stringify(data);
        	}
        }
        
        // 页面配置初始化
        for (var k in pageList) {
        	pageList[k].templateUrl += "?v=" + APP_VERSION;
        	pageList[k].controllerUrl += "?v=" + APP_VERSION;
        	pageList[k].css += "?v=" + APP_VERSION;
        	$stateProvider.state(k, pageList[k]);
        }
    }]);
    
   
   //httpService
   
   app.service("httpService",function($http, http, errorMessage){
        //带错误参数的POST请求
        this.post = function(url, params, success, error){
            showLoadding().then(function(){
                $http.post(http + url, params).success(function(resp){
                    hideLoadding();
                    success && success(resp);
                }).error(function(resp){
                    hideLoadding();
                    layer.msg(errorMessage);
                });
            })
        };

       //带错误参数的GET请求
       this.get = function(url, params, success, error){
    	   //参数等于function的时候，所有参数向前移一个位置
    	   if (typeof params == "function") {
    		   success = params;
    		   error = success;
    	   }
    	   
    	   url += "?" + urlEncode(params);
           showLoadding().then(function() {
               $http.get(http + url ,{data:params}).success(function (resp) {
                   hideLoadding();
                   success && success(resp);
               }).error(function (resp) {
                   hideLoadding();
                   layer.msg(errorMessage);
               });
           });
       };

       //带错误参数的PUT请求
       this.put = function(url, params, success, error){
           showLoadding().then(function() {
               $http.put(http + url).success(function (resp) {
                   hideLoadding();
                   success && success(resp);
               }).error(function () {
                   hideLoadding();
                   layer.msg(errorMessage);
               });
           });
       };
       
       //JS对象转URL参数
       function urlEncode(param, key) {
		   var paramStr="";
		   if(param instanceof String||param instanceof Number||param instanceof Boolean){
			   paramStr+="&"+key+"="+encodeURIComponent(param);
		   }else{
			   $.each(param,function(i){
				   var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
				   paramStr+='&'+urlEncode(this, k);
			   });
		   }
		   return paramStr.substr(1);
	   };

       //StartLoadding
       function showLoadding(){
    	   var def = $.Deferred();
    	   layer.load(2, {shade: [0.2, '#CCC'], time: 10000});
    	   def.resolve();
    	   return def.promise();
       }
       //EndLoadding
       function hideLoadding(){
    	   layer.closeAll('loading');
       }
   })

   //storageService
    app.service("storageService", function() {
        var me = this;
        me.getKey = function(key) {
            var val = localStorage.getItem(key);
            if (val) return JSON.parse(val);
            else return {};
        }
        me.setKey = function(key, val) {
            if (val) localStorage.setItem(key, JSON.stringify(val));
        }
        me.removeKey = function(key) {
            localStorage.removeItem(key);
        }
        me.groupSet = function(gKey, key, val) {
            var obj = me.getKey(gKey);
            if (!obj) {
                obj = {};
            }

            obj[key] = val;

            me.setKey(gKey, obj);
        }
        me.groupGet = function(gKey, key) {
            var obj = me.getKey(gKey);

            return (obj) ? obj[key] : "";
        }
        me.groupRemove = function(gKey, key) {
            var obj = me.getKey(gKey);
            if (obj && obj[key]) {
                delete obj[key];
                me.setKey(gKey, obj);
            }
        }
    });
   function getAllUrlParam() {
	    var hash = window.location.hash;
	    var search = window.location.search;
	    hash = _getUrlParam(hash);
	    search = _getUrlParam(search);
	    return $.extend({}, search, hash);
   }
   
   function _getUrlParam(query) {
	    var start = query.indexOf('?');
	    if (start > -1) {
	    	query = query.substring(start + 1);
	    }

	    var paras = {};
	    if (query) {
		    var queryParams = query.split('&');
		    for ( var k in queryParams) {
		    	  if (!queryParams[k]) continue;
		          var param = queryParams[k].split('=');
		          paras[param[0]] = decodeURIComponent(param[1] || "");
		    }
	    }
	    return paras;
    };
   //urlParamService
   app.service("urlParamService", function() {
	   this.getUrlParam = function() {
		   return getAllUrlParam();
	   };
	   
   });
   
   var para = getAllUrlParam();
   var GLOBAL_PARA = {
		   campaignId: para.campaignId,
		   template: para.template
   }
   
   function createUrlParam(para) {
       var uri = [];
       for (var k in para) {
           uri.push(k + "=" + encodeURIComponent(para[k]));
       }
       
       return uri.join("&");
   };
   
	function replace(url){
		location.replace(url);
	}   
   //页面跳转封装
//   app.service("pageLocationService",function(){
//	  this.moveTo = function(pageId){
//		  if (pageId.indexOf("?") > -1) {
//			  pageId += "&";
//		  } else {
//			  pageId += "?";
//		  } 
//		  pageId += createUrlParam(GLOBAL_PARA);
//		  var pathUrl = "index.html#/";
//		  location.replace(pathUrl+pageId);
//	  };
//   });
});
