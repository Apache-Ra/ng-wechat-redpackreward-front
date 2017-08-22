define(['app','storageUtil','requestUtil',
		"css!plugin/webupload/webuploader.css",
		"css!custom/css/philips/upload/upload.css" ],
function (app,storageUtil,requestUtil) {
	app.controller('uploadFile', function($scope,$location,$interval,httpService) {

		//获取用户信息
		httpService.get("redPacReward/userinfo",function(resp){
			//$scope.uploadData = resp.data.telephone;
			var userTelephone = resp.data.telephone;
			if(!userTelephone){
				$(".inputUserInfo").show();
			}else{
				$(".inputUserInfo").hide();
			}
		})
		
		//验证码间隔时间
		$scope.description = "获取验证码";
		var second = 59;
		//发送验证码
		var timerHandler;
	    $scope.sendCode = function(telNumber){
	    	if(timerHandler){
	    		return;
	    	}
	    	timerHandler = $interval(function(){
	    		if(second <= 0){
	    			$interval.cancel(timerHandler);
	    			second = 59;  
	 	            $scope.description = "获取验证码";
	    		}else{  
	 	            $scope.description = second + "秒后可重发"; 
	 	            second--;  
	 	        }  
	
			}, 1000, 100);
	    	//发送验证码
			httpService.get("redPacReward/phoneCode",{"mobile":$scope.telNumber},function(resp){
				if(resp.codeText == "OK"){
					layer.msg("验证码发送成功</br>("+ second +"秒后可重发)",{icon:1});
				}else{
					layer.msg("验证码发送失败",{icon:5});
				}
			})
	    };	
	    //查询
	    $scope.query = function(){
	    	$location.path("/uploadList");
	    	//pageLocationService.moveTo('uploadList');
	    }
	    //重置
	    $scope.resetting = function(){
	    	location.reload();
	    }
	    
	    //wallet
	    $scope.wallet = function(){
	    	location.href = "http://wechat.mbqianbao.com/wallet0709/load.html?v=1.02";
	    }
	    //上传图片处理	
	    require(["webuploader"], function(webuploader) {
	    	var extendPara = {};
	    	var $wrap = $('#uploader'),
            // 图片容器
            $queue = $( '<ul class="filelist"></ul>' ).appendTo( $wrap.find( '.queueList' ) ),
            // 状态栏，包括进度和控制按钮
            $statusBar = $wrap.find( '.statusBar' ),
            // 文件总体选择信息。
            $info = $statusBar.find( '.info' ),
            // 上传按钮
            $upload = $( '#uploaderForm .uploadBtn' ),
            // 没选择文件之前的内容。
            $placeHolder = $wrap.find( '.placeholder' ),
            $progress = $statusBar.find( '.progress' ).hide(),
            // 添加的文件数量
            fileCount = 0,
            // 添加的文件总大小
            fileSize = 0,
            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,
            // 缩略图大小
            thumbnailWidth = 110 * ratio,
            thumbnailHeight = 110 * ratio,
            // 可能有pedding, ready, uploading, confirm, done.
            state = 'pedding',
            // 所有文件的进度信息，key为file id
            percentages = {},
            supportTransition = (function(){
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                          'WebkitTransition' in s ||
                          'MozTransition' in s ||
                          'msTransition' in s ||
                          'OTransition' in s;
                s = null;
                return r;
            })(),

            // WebUploader实例
            //uploader;

	        // 实例化
	        uploader = webuploader.create({
	            chunked: true,
	            // runtimeOrder: 'flash',
	            // sendAsBinary: true,
	            server: SERVER_URI + '/redPacReward/createApplyImage',
	            //允许选择的图片格式
	            accept: {
	              title: 'Images',
	              extensions: 'gif,jpg,jpeg,bmp,png',
	              mimeTypes: 'image/*'
	            },
	            fileNumLimit: 2,
	            fileSizeLimit: 10 * 1024 * 1024,    // 200 M
	            fileSingleSizeLimit: 3 * 1024 * 1024    // 50 M
	        });
	
	        // 添加“添加文件”的按钮，
	        uploader.addButton({
	            id: '#filePicker',
	            label: ' '
	        });
	        // 当有文件添加进来时执行，负责view的创建
	        function addFile( file ) {
	            var $li = $( '<li id="' + file.id + '">' +
	                    '<p class="imgWrap"></p>'+
	                    '</li>' ),
	
	                $btns = $('<div class="file-panel">' +
	                          '<span class="cancel">删除</span>').appendTo( $li ),
	                $prgress = $li.find('p.progress span'),
	                $wrap = $li.find( 'p.imgWrap' ),
	                $info = $('<p class="error"></p>'),
	
	                showError = function( code ) {
	                    switch( code ) {
	                        case 'exceed_size':
	                            text = '文件大小超出';
	                            break;
	
	                        case 'interrupt':
	                            text = '上传暂停';
	                            break;
	
	                        default:
	                            text = '上传失败，请重试';
	                            break;
	                    }
	
	                    $info.text( text ).appendTo( $li );
	                };
	
	            if ( file.getStatus() === 'invalid' ) {
	                showError( file.statusText );
	            } else {
	                // @todo lazyload
	                $wrap.text( '预览中' );
	                uploader.makeThumb( file, function( error, src ) {
	                    if ( error ) {
	                        $wrap.text( '不能预览' );
	                        return;
	                    }
	
	                    var img = $('<img src="'+src+'">');
	                    $wrap.empty().append( img );
	                }, thumbnailWidth, thumbnailHeight );
	
	                percentages[ file.id ] = [ file.size, 0 ];
	                file.rotation = 0;
	            }
	
	            file.on('statuschange', function( cur, prev ) {
	                if ( prev === 'progress' ) {
	                    $prgress.hide().width(0);
	                } else if ( prev === 'queued' ) {
	                    $li.off( 'mouseenter mouseleave' );
	                    $btns.remove();
	                }
	
	                // 成功
	                if ( cur === 'error' || cur === 'invalid' ) {
	                    console.log( file.statusText );
	                    showError( file.statusText );
	                    percentages[ file.id ][ 1 ] = 1;
	                } else if ( cur === 'interrupt' ) {
	                    showError( 'interrupt' );
	                } else if ( cur === 'queued' ) {
	                    percentages[ file.id ][ 1 ] = 0;
	                } else if ( cur === 'progress' ) {
	                    $info.remove();
	                    $prgress.css('display', 'block');
	                } else if ( cur === 'complete' ) {
	                    $li.append( '<span class="success"></span>' );
	                }
	
	                $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
	            });
	
	            $li.on( 'mouseenter', function() {
	                $btns.stop().animate({height: 30});
	            });
	
	            $li.on( 'mouseleave', function() {
	                $btns.stop().animate({height: 0});
	            });
	
	            $btns.on( 'click', 'span', function() {
	                var index = $(this).index(),
	                    deg;
	
	                switch ( index ) {
	                    case 0:
	                        uploader.removeFile( file );
	                        return;
	
	                    case 1:
	                        file.rotation += 90;
	                        break;
	
	                    case 2:
	                        file.rotation -= 90;
	                        break;
	                }
	
	                if ( supportTransition ) {
	                    deg = 'rotate(' + file.rotation + 'deg)';
	                    $wrap.css({
	                        '-webkit-transform': deg,
	                        '-mos-transform': deg,
	                        '-o-transform': deg,
	                        'transform': deg
	                    });
	                } else {
	                    $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
	
	                }
	
	
	            });
	
	            $li.appendTo( $queue );
	        }
	
	        // 负责view的销毁
	        function removeFile( file ) {
	            var $li = $('#'+file.id);
	
	            delete percentages[ file.id ];
	            updateTotalProgress();
	            $li.off().find('.file-panel').off().end().remove();
	        }
	
	        function updateTotalProgress() {
	            var loaded = 0,
	                total = 0,
	                spans = $progress.children(),
	                percent;
	
	            $.each( percentages, function( k, v ) {
	                total += v[ 0 ];
	                loaded += v[ 0 ] * v[ 1 ];
	            } );
	
	            percent = total ? loaded / total : 0;
	
	            spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
	            spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
	            //updateStatus();
	        }
	
	        function setState( val ) {
	            if ( val === state ) {
	                return;
	            }
	
	            $upload.removeClass( 'state-' + state );
	            $upload.addClass( 'state-' + val );
	            state = val;
	
	            switch ( state ) {
	                case 'pedding':
	                    $placeHolder.removeClass( 'element-invisible' );
	                    $queue.hide();
	                    $statusBar.addClass( 'element-invisible' );
	                    uploader.refresh();
	                    break;
	
	                case 'ready':
	                    $placeHolder.addClass( 'element-invisible' );
	                    $( '#filePicker2' ).removeClass( 'element-invisible');
	                    $queue.show();
	                    $statusBar.removeClass('element-invisible');
	                    uploader.refresh();
	                    break;
	
	                case 'uploading':
	                    $( '#filePicker2' ).addClass( 'element-invisible' );
	                    $progress.show();
	                    $upload.text( '暂停上传' );
	                    break;
	
	                case 'paused':
	                    $progress.show();
	                    $upload.text( '继续上传' );
	                    break;
	
	                case 'confirm':
	                    $progress.hide();
	                    $upload.text( '开始上传' ).addClass( 'disabled' );
	
	                    var stats = uploader.getStats();
	                    if ( stats.successNum && !stats.uploadFailNum ) {
	                        setState( 'finish' );
	                        return;
	                    }
	                    break;
	                case 'finish':
	                    stats = uploader.getStats();
	                    if (stats.successNum) {
	                    	layer.msg("图片上传成功,正在跳转···",{icon:1,time:500},function(){
	                    		$location.path("/uploadSuccess");
	                    		$scope.$apply();
	                    	});
	                    } else {
	                        // 没有成功的图片，重设
	                        state = 'done';
	                        location.reload();
                    		$scope.$apply();
	                    }
	                    break;
	            }
	
	            //updateStatus();
	        }
	        	
	        uploader.onUploadProgress = function( file, percentage ) {
	            var $li = $('#'+file.id),
	                $percent = $li.find('.progress span');
	
	            $percent.css( 'width', percentage * 100 + '%' );
	            percentages[ file.id ][ 1 ] = percentage;
	            updateTotalProgress();
	        };
	
	        uploader.onFileQueued = function( file ) {
	            fileCount++;
	            fileSize += file.size;
	
	            if ( fileCount === 1 ) {
	                $placeHolder.addClass( 'element-invisible' );
	                $statusBar.show();
	            }
	
	            addFile( file );
	            setState( 'ready' );
	            updateTotalProgress();
	        };
	
	        uploader.onFileDequeued = function( file ) {
	            fileCount--;
	            fileSize -= file.size;
	
	            if ( !fileCount ) {
	                setState( 'pedding' );
	            }
	
	            removeFile( file );
	            updateTotalProgress();
	
	        };
	
	        uploader.on( 'all', function( type, data, para ) {
	            switch( type ) {
	                case 'uploadFinished':
	                    setState( 'confirm' );
	                    break;
	
	                case 'startUpload':
	                    setState( 'uploading' );
	                    break;
	
	                case 'stopUpload':
	                    setState( 'paused' );
	                    break;
	                case 'uploadBeforeSend':
	                	$.extend(para, extendPara);
	                	break;
	                default:
	                	break;
	
	            }
	        });
	
	        uploader.onError = function( code ) {
	            
	            if (code == "Q_EXCEED_NUM_LIMIT") {
	            	layer.msg("最多只能上传两张图片",{icon:5});
	            } else if (code == "F_EXCEED_SIZE") {
	            	layer.msg("文件过大,请压缩后在传。",{icon:5});
	            } else {
	            	//layer.msg( 'Eroor: ' + code );
	            	console.log('Eroor: ' + code);
	            }
	        };
	
	        $upload.on('click', function() {
	            if ( $(this).hasClass( 'disabled' ) ) {
	                return false;
	            }
                var campaignId = requestUtil.getUrlParam().campaignId;
                if (!campaignId) {
                	layer.msg("页面参数不正确，打开方式不正确",{incon:6,time:500});
                	return false;
                }
	
	            if ( state === 'ready' ) {
	            	var inputUserInfoHideOrShow = $(".inputUserInfo").is(':hidden');
	                var telephone = $(".telNumber").val();
	                var authCode = $(".requestCode").val();
	                if(!inputUserInfoHideOrShow){
		                if(!telephone || !authCode){
		                	layer.msg("手机号或验证码不能为空!",{incon:6,time:500});
		                	return;
		                }
		                
	                }
	                requestUtil.post("redPacReward/createApply",{"campaignId": campaignId, "telephone":telephone,"authCode":authCode}).then(function(resp){
		            	if (resp.data && resp.data.applyId) {
		            		
		            		$.extend(extendPara, {applyId:resp.data.applyId});
		            		uploader.upload();
		            	} else {
		            		if(resp.codeText == "CAMPAIGN_CLOSED"){
		            			layer.msg("活动已关闭哦！",{incon:6,time:500});
		            		}else{
		            			layer.msg(JSON.stringify(resp.message),{incon:5});
		            		}
		            		//	console.log(resp);
		            		
		            	}
		            });
	            } else if ( state === 'paused' ) {
	                uploader.upload();
	            } else if ( state === 'uploading' ) {
	                uploader.stop();
	            }
	        });
	
	        $info.on( 'click', '.retry', function() {
	            uploader.retry();
	        } );
	
	        $info.on( 'click', '.ignore', function() {
	            layer.msg( 'todo' );
	        } );
	
	        $upload.addClass( 'state-' + state );
	        updateTotalProgress();	    	
	    	
		});
	});
});
