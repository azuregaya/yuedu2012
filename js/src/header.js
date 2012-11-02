/**
 * 通用调用模块
 *
 * @creator hzliyan@corp.netease.com
 */
 define(function(require,exports){
 	var w = require('./widgets'),
 		$ = require('../sea-modules/jquery/1.7.2/jquery'),
 		s = require('./switch');


 	var searchText = '搜索资讯源、书籍';

	/**
	 * 导航鼠标移入移出
	 *
	 */
 	var navHover = function(id){
		$(id).mouseenter(function(){
			if(!$(this).hasClass('j-crt')){
				$(this).addClass('hover');
			}
		});
		$(id).mouseleave(function(){
			$(this).removeClass('hover');
		});
	};

	/**
	 * 反馈弹窗
	 *
	 */
	var addServNum = function(){
		var html = '\
			<div id="J_ServiceNum" class="m-layer m-layer-5" style="display:none;">\
				<div class="inner">\
					<div class="up"><a href="javascript:void(0);"></a></div>\
					<div class="down">\
						<p>购买书籍后无法阅读等问题<br /></p>\
						<p>可拨打：020-83568090-7-6</p>\
					</div>\
				</div>\
			</div>';
		var clicked = false;
		$('#J_Service').click(function(e){
			if(clicked){
				$('#J_ServiceNum').show();
			}else{
				var top = $(this).offset().top - 120, left = $(this).offset().left;
				$('.g-doc').append(html);
				$('#J_ServiceNum').css({'top': top, 'left' : left})
				$('#J_ServiceNum').show();
				clicked = true;
				$('#J_ServiceNum .up a').click(function(){
					$('#J_ServiceNum').hide();
				});
			}
		});
	};

	/**
	 * 搜索提示弹窗
	 *
	 */
	var searchOps = function(){
		var ts = $('#topsearch'),
			setDelay,
			crtPosition,
			list,
			listLength,
			storeText,
			typedWord,
			box = $('#J_SearchOps'),
			hideIpt = $('#J_SearchType'),
			isOverAllSearch = $('<input name="overallSearch" type="hidden" value="true" />').insertAfter(hideIpt);

		var keyArr = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,8,186,187,188,189,190,191,32,108,13],
      		isTheKey;

		var setStringHighLight = function(str,key){
			var _str = str, _key = key, _length = _key.length, _return;

			if(_str.indexOf(_key) >= 0){
				var pos = _str.indexOf(_key);
				var a = _str.slice(0,pos),
					b = _str.slice(pos,(pos+_length)),
					c = _str.slice((pos+_length)),
					_return = a + '<em>' + b + '</em>' + c;
				
				return _return;
			}else{
				return _str;
			}
		};

		var filterKey = function(num){
	      for (var i = 0; i < keyArr.length; i++) {
	        if(num == keyArr[i]){
	          isTheKey = true;
	          break;
	        }
	      };
	    };

	    var cutWords = function(str){
	    	var _word = str;
	    	if(_word.length > 6){
	    		var cutted = _word.slice(0,6) + '..';
				$('#J_SearchOps li.parent em').text(cutted);
	    	}
	    };

		var createSearchContent = function(data){
			var _data = data, innerHTML = '',kw,processedStr;

			kw = _data.keyword;
			if(_data.source.length > 0){
				innerHTML += '<li class="parent topli"><a href="javascript:;" type="0">搜"<em>' + kw +'</em>"资讯源</a></li>';
				for(var i=0; i< _data.source.length; i++){
					var sourceName = _data.source[i].name;
					processedStr = setStringHighLight(sourceName,kw);
					if(i == _data.source.length -1){
						innerHTML += '<li class="children children-last"><a href="javascript:;" type="0">' + processedStr + '</a></li>';
					}else{
						innerHTML += '<li class="children"><a href="javascript:;" type="0">' + processedStr + '</a></li>';
					}
				}
			}else{
				innerHTML += '<li class="parent topli parent-s"><a href="javascript:;" type="0">搜"<em>' + kw +'</em>"资讯源</a></li>';
			}
			if(_data.book.length > 0){
				innerHTML += '<li class="parent"><a href="#" type="4">搜"<em>' + kw + '</em>"书籍</a></li>';
				for (var j = 0; j < _data.book.length; j++) {
					var bookName = _data.book[j].name;
					processedStr = setStringHighLight(bookName,kw);
					if(j == _data.book.length-1){
						innerHTML += '<li class="children children-last"><a href="javascript:;" type="4">' + processedStr + '</a></li>';
					}else{
						innerHTML += '<li class="children"><a href="javascript:;" type="4">' + processedStr + '</a></li>';
					}
				}
			}else{
				innerHTML += '<li class="parent parent-s"><a href="#" type="4">搜"<em>' + kw + '</em>"书籍</a></li>';
			}

			//console.log('inner is',innerHTML);
			box.empty().append(innerHTML).show();
			crtPosition = -1;
			cutWords(kw);
			list = $('#J_SearchOps li');
			listLength = $('#J_SearchOps li').length;
			$('#J_SearchOps li a').click(function(e){
				if($(this).parent().hasClass('parent')){
					ts.val(kw);
				}else{
					ts.val($(this).text());
				}
				hideIpt.val($(this).attr('type'));
				isOverAllSearch.val('');
				$('#J_Form').submit();
				e.preventDefault();
			});
		}

		var searchValueSet = function(pos){
			var _pos = pos;
			hideIpt.val($('#J_SearchOps li a').eq(_pos).attr('type'));
			if(list.eq(_pos).hasClass('parent')){
				ts.val(typedWord);
			}else{
				ts.val(list.eq(_pos).text());
			}
		};

		var sendReq = function(kw){
			if($.trim(kw).length > 0){
				$.ajax({
					type : 'GET',
					url	 : s.retrieveData('querySearchHints'),
					data : {"keyword": kw},
					dataType : 'json',
					success : function(data){
						if(data){
							w.resultCode(data.resultCode,createSearchContent,data);
						}else{
							YD.popTip('出错了，请稍候再试');
						}
					},
					error : function(){

					}
				});
			}
		};

		ts.keydown(function(e){//按下取消计时
			var ifClear = false;
			
			for(var i=0;i<keyArr.length;i++){
				if(e.keyCode === keyArr[i]){
					ifClear = true;
					storeText = ts.val();
					break;
				}
			}
			if(ifClear){
				if(setDelay){
					clearTimeout(setDelay);
				}
			}
			
		});	

		ts.keyup(function(e){
			if(ts.val().length > 0){
				isTheKey = false;
				filterKey(e.keyCode);
				if(isTheKey){//正常键位输入
					setDelay = setTimeout(function(){//设置按键发送请求延时,200毫秒
						var n = ts.val();
						var kw = $.trim(ts.val());
						typedWord = kw;
						if(e.keyCode === 13 || e.keyCode === 108 || e.keyCode === 32){//当时空格回车，判断值是否变化
							if(n !== storeText){
								sendReq(kw);
							}
						}else{
							sendReq(kw);
						}
					},200);
				}

				if(e.keyCode === 40){//向下键
					if(list.length > 0){
						crtPosition ++;
						if(crtPosition > (listLength -1)) crtPosition = listLength - 1;
						list.each(function(){
							$(this).removeClass('crt');
						});
						list.eq(crtPosition).addClass('crt');
						searchValueSet(crtPosition);
					}
				}

				if(e.keyCode === 38){//向上键
					if(list.length > 0){
						crtPosition --;
						if(crtPosition < 0) crtPosition = 0;
						list.each(function(){
							$(this).removeClass('crt');
						});
						list.eq(crtPosition).addClass('crt');
						searchValueSet(crtPosition);
					}
				}

				if(e.keyCode === 27){//ESC键
					box.hide();
				}

			isOverAllSearch.val(hideIpt.val() == ''? 'true' : '');

			}else if(ts.val().length == 0){
				box.hide();
			}
		});

	};
	/**
	 * 菜单下拉列表
	 *
	 */
	var menuRollOverOut = function(btn,box){
		var btn = $(btn),fSec = $(box), onTarget = false,selectItem = $('#J_Select');
		
		btn.mouseenter(function(){
			onTarget = true;
			fSec.toggleClass('f-dn');
			if($.browser.msie){
					if($.browser.version === '6.0'){
						if(selectItem.length != 0){
							selectItem.hide();
						}
					}
			}
		});
		btn.mouseleave(function(){
			onTarget = false;
			var testTarget = setTimeout(function(){
				if(!onTarget){
					if(!fSec.hasClass('f-dn')) fSec.addClass('f-dn');
					if($.browser.msie){
						if($.browser.version === '6.0'){
							if(selectItem.length != 0){
								selectItem.show();
							}
						}
					}
				}
			},500);
		});
		
		fSec.mouseenter(function(){
			onTarget = true;
		});
		fSec.mouseleave(function(){
			onTarget = false;
			fSec.toggleClass('f-dn');
			if($.browser.msie){
				if($.browser.version === '6.0'){
					if(selectItem.length != 0){
						selectItem.show();
					}
				}
			}
		});
	};

 	function init(){
 		w.msgInput('#topsearch','s-fc4',searchText);
 		w.testEmpty('#topsearch',searchText);
 		navHover('#J_Nav li');
 		menuRollOverOut('#J_tb .name','.openbox');
 		addServNum();
 		searchOps();
 	}

 	init();
 })