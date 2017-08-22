define([],
    function() {
  // TODO
  var serverUri = SERVER_URI;
  var Export = {
	  setting:{
	  	appVersion:APP_VERSION
	  }
  };
  function handleApiResponseStatus(url, data) {
    if (!data || (!data.status && !data.code)) {
      console.error(url, data);
      return false;
    }

    if (data.codeText == "RESULT_LOGIN_EXPIRED") { // 登录超时重新登录
      Export.gotoLogin();
      return false;
    } 
    else if (data.codeText == "") { // 权限验证失败
      Export.message("您没有权限进行此操作");
      return false;
    } 

    return true;
  }
  
  Export.message = function(msg) {
    alert(msg);
  };
  
  Export.gotoLogin = function(advanceAuth) {
	  $.cookie('_IDENTIY_KEY_', null, { expires: -1, path: "/"});
	  if (advanceAuth) {
		  location.replace(WECHAT_URL + encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_userinfo&state=wx#wechat_redirect");
	  } else {
		  location.replace(WECHAT_URL + encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_base&state=wx#wechat_redirect");
	  }
  };

  function handleHttpResponseStatus(url, status) {
    var status = Number(status);
    if (status == 404) { // 页面未找到
      Export.message("发生404错误");
    } else if (status >= 500) { // 内部错误
      Export.message("发生系统错误");
//      alert(url + " " + status)
//      window.location.href = ERR_INTERNAL_URI;
    } else { // 其他错误
      Export.message("发生未知错误");
//      alert(url + " " + status)
//      window.location.href = ERR_OTHER;
    }
  }

  Export.ajax = function(url, param, method, skipValidation, useCache, usePlatform) {
    var me = this;
    return me.jqAjax(url, param, method, skipValidation, useCache, usePlatform);
  }
  
  Export.jqAjax = function(url, param, method, skipValidation, useCache, usePlatform) {
    var newDef = $.Deferred();
    if (url) {
      if (url.indexOf("http") == -1) {
          url = serverUri + url;
      }
    } else {
      throw 'no url';
    }
    
    if (method !== "GET") {
      param = (typeof param === "string") ? param : JSON.stringify(param);
    }
    
    $.ajax({  
      url: url,  
      type: method.toUpperCase(),  
      dataType: "json",  
      contentType: "application/json; charset=utf-8",  
      data: param,  
      cache: !!useCache,
      success: function(data) {  
        if (skipValidation) {
          newDef.resolve(data);
        } else if (handleApiResponseStatus(url, data)) {
          newDef.resolve(data);
        }
      },
      error: function(request, textStatus) { 
        handleHttpResponseStatus(url, request.status);
        alert(url);
        alert(JSON.stringify(request));
        alert(JSON.stringify(textStatus));
        console.error(request, textStatus);
      }
    });  

    return newDef.promise();
  };

  Export.post = function(url, param, skipValidation, usePlatform) {
    return Export.ajax(url, param, 'POST', skipValidation, false, usePlatform);
  };

  Export.put = function(url, param, skipValidation, usePlatform) {
    return Export.ajax(url, param, 'PUT', skipValidation, false, usePlatform);
  };

  Export.get = function(url, param, useCache, skipValidation, usePlatform) {
    if (!param) {
      param = "v=" + this.setting.appVersion;
    } else {
      if (typeof param == 'string') {
        param += "&v=" + this.setting.appVersion;
      } else  {
        param.v = this.setting.appVersion;
      }
    }
    return Export.ajax(url, param, "GET", skipValidation, useCache, usePlatform);
  };

  Export.del = function(url, param, skipValidation, usePlatform) {
    return Export.ajax(url, param, "DELETE", skipValidation, false, usePlatform);
  };
  
  Export.createUrlParam = function(para) {
    var uri = [];
    for (var k in para) {
      uri.push(k + "=" + encodeURIComponent(para[k]));
    }
    
    return "?" + uri.join("&");
  };
  
  Export.serializeForm = function(id) {
    var arr = $("#" + id).serializeArray();
  
    var ret = {};
    for (var k in arr) {
      if (ret[arr[k].name]) {
        ret[arr[k].name] = this.toArray(ret[arr[k].name]);
        ret[arr[k].name].push(arr[k].value);
      } else {
        ret[arr[k].name] = arr[k].value;
      }
    }
    
    return ret;
  };
  
  Export.toArray = function(obj) {
    return (!obj || $.isArray(obj)) ? obj : [obj];
  };
  
  Export.inArr = function(arr, val) {
    if (!arr) {
      return false;
    }
    
    for (var i in arr) {
      if (arr[i] == val) {
        return true;
      }
    }
    
    return false;
  };
  
  Export.getUrlParam = function() {
    var hash = window.location.hash;
    var search = window.location.search;
    hash = this._getUrlParam(hash);
    search = this._getUrlParam(search);
    return $.extend({}, search, hash);
  };
    
  Export._getUrlParam = function(query) {
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
  
  Export.startWith = function(str, find){     
    var reg = new RegExp("^"+find);     
    return reg.test(str);        
  };

  Export.endWith = function(str, find){     
    var reg = new RegExp(find+"$");     
    return reg.test(str);        
  };
  
  Export.concat = function(arr1, arr2) {
    if (!arr1 || !arr2) {
      return;
    }
    
    $(arr2).each(function() {
      arr1.push(this);
    });
  };
  
  Export.delHtmlTag = function(str){  
    str = $.trim(str);
    if (!str) return "";
    
    return $.trim(str.replace(/<[^>]+>/g,"").replace(/&[^;]{2,6};/g, ""));//去掉所有的html标记
  }; 
  
  return Export;
});