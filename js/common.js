Element.prototype.hasClass = function(className) {
	var i, len, temp = this.className.split(" ");
	for(i = 0, len = temp.length; i < len; i++) {
		if(className == temp[i]) {
			return true;
		}
	}
	return false;
}

/**
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 * @link
 */
var common =
	(function($) {
		var com = {};
		/**
		 * @description 获取当前DOM的所有同类型兄弟结点
		 * @param {Object} obj
		 * @param {Object} arr
		 */
		var getAllDomBrothers = function(obj, arr) {
			var arr = arr || [];
			var pre = obj.previousElementSibling;
			var nex = obj.nextElementSibling;
			if(obj && !arr.Contains(obj)) {
				arr.push(obj);
			}
			if(pre && pre.tagName == obj.tagName && !arr.Contains(pre)) {
				getAllDomBrothers(pre, arr);
			}
			if(nex && nex.tagName == obj.tagName && !arr.Contains(nex)) {
				getAllDomBrothers(nex, arr);
			}
			return arr;
		};
		com.getAllDomBrothers = getAllDomBrothers;
		/**
		 * 通过递归实现异步阻塞
		 * @param {Object} list
		 * @param {Object} cb_exec
		 * @param {Object} cb_end
		 */
		function myasync(list, cb_exec, cb_end) {
			var each = function(_list, cb) {
				if(_list.length < 1) {
					return cb_end && cb_end();
				}
				cb(_list.shift(), function() {
					each(list, cb);
				})
			}
			each(list, cb_exec)
		};
		com.myasync = myasync;
		/**
		 * @description 生成一个随机数
		 */
		com.hashCode = function(str) {
			var hash = 0;
			if(!str || str.length == 0) return hash.toString();
			for(i = 0; i < str.length; i++) {
				char = str.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash.toString();
		};

		/**
		 * @description 产生一个随机数
		 */
		com.getUid = function() {
			return Math.floor(Math.random() * 100000000 + 10000000).toString();
		};
		/**
		 * @author liuyf 2015-4-30
		 * @description 获取系统信息
		 */
		com.GetDeviceInfo = function() {
			var device = {
				IMEI: plus.device.imei,
				IMSI: '',
				Model: plus.device.model,
				Vendor: plus.device.vendor,
				UUID: plus.device.uuid,
				Screen: plus.screen.resolutionWidth * plus.screen.scale + 'x' + plus.screen.resolutionHeight * plus.screen.scale + '',
				DPI: plus.screen.dpiX + 'x' + plus.screen.dpiY,
				OS: new Object()
			};
			for(var i = 0; i < plus.device.imsi.length; i++) {
				device.IMSI += plus.device.imsi[i];
			}
			var types = {};
			types[plus.networkinfo.CONNECTION_UNKNOW] = '未知网络';
			types[plus.networkinfo.CONNECTION_NONE] = '未连接网络';
			types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络';
			types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络';
			types[plus.networkinfo.CONNECTION_CELL2G] = '2G蜂窝网络';
			types[plus.networkinfo.CONNECTION_CELL3G] = '3G蜂窝网络';
			types[plus.networkinfo.CONNECTION_CELL4G] = '4G蜂窝网络';
			device.NetworkInfo = types[plus.networkinfo.getCurrentType()];
			device.OS = {
				Language: plus.os.language,
				Version: plus.os.version,
				Name: plus.os.name,
				Vendor: plus.os.vendor
			};
			return device;
		};

		/**
		 * @description 安卓创建快捷键方式
		 *
		 */
		com.createShortcut = function(name, iconUrl) {
			if(mui.os.android) {
				// 导入要用到的类对象
				var Intent = plus.android.importClass("android.content.Intent");
				var BitmapFactory = plus.android.importClass("android.graphics.BitmapFactory");
				// 获取主Activity
				var main = plus.android.runtimeMainActivity();
				// 创建快捷方式意图
				var shortcut = new Intent("com.android.launcher.action.INSTALL_SHORTCUT");
				// 设置快捷方式的名称
				shortcut.putExtra(Intent.EXTRA_SHORTCUT_NAME, name);
				// 设置不可重复创建
				shortcut.putExtra("duplicate", false);
				// 设置快捷方式图标
				var iconPath = plus.io.convertLocalFileSystemURL(iconUrl); // 将相对路径资源转换成系统绝对路径
				var bitmap = BitmapFactory.decodeFile(iconPath);
				shortcut.putExtra(Intent.EXTRA_SHORTCUT_ICON, bitmap);
				// 设置快捷方式启动执行动作
				var action = new Intent(Intent.ACTION_MAIN);
				action.setComponent(main.getComponentName());
				shortcut.putExtra(Intent.EXTRA_SHORTCUT_INTENT, action);
				// 广播创建快捷方式
				main.sendBroadcast(shortcut);
			}
		};
		/**
		 * @description 双击返回键退出
		 */
		com.bindQuit = function() {
			if(mui.os.android) {
				var backButtonPress = 0;
				mui.back = function(event) {
					backButtonPress++;
					if(backButtonPress > 1) {
						plus.runtime.quit();
					} else {
						plus.nativeUI.toast('再按一次退出应用');
					}
					setTimeout(function() {
						backButtonPress = 0;
					}, 1000);
					return false;
				};
			}
		};
		com.androidMarket = function(pname) {
			plus.runtime.openURL("market://details?id=" + pname);
		};

		com.iosAppstore = function(url) {
			plus.runtime.openURL("itms-apps://" + url);
		};
		return com;
	}(mui));

(function(win, com, mui) {
	/**
	 * @link http://www.cnblogs.com/phillyx
	 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	 * @description 本地存储
	 */
	var myStorage = {};

	function getItem(k) {
		var jsonStr = window.localStorage.getItem(k.toString());
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};

	function getItemPlus(k) {
		var jsonStr = plus.storage.getItem(k.toString());
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};
	myStorage.getItem = function(k) {
		return getItem(k) || getItemPlus(k);
	};
	myStorage.setItem = function(k, value) {
		value = JSON.stringify({
			data: value
		});
		k = k.toString();
		try {
			window.localStorage.setItem(k, value);
		} catch(e) {
			//			console.log(e);
			//TODO 超出localstorage容量限制则存到plus.storage中
			//且删除localStorage重复的数据
			removeItem(k);
			plus.storage.setItem(k, value);
		}
	};

	function getLength() {
		return window.localStorage.length;
	};
	myStorage.getLength = getLength;

	function getLengthPlus() {
		return plus.storage.getLength();
	};
	myStorage.getLengthPlus = getLengthPlus;

	function removeItem(k) {
		return window.localStorage.removeItem(k);
	};

	function removeItemPlus(k) {
		return plus.storage.removeItem(k);
	};
	myStorage.removeItem = function(k) {
		window.localStorage.removeItem(k);
		return plus.storage.removeItem(k);
	}
	myStorage.clear = function() {
		window.localStorage.clear();
		return plus.storage.clear();
	};

	function key(index) {
		return window.localStorage.key(index);
	};
	myStorage.key = key;

	function keyPlus(index) {
		return plus.storage.key(index);
	};
	myStorage.keyPlus = keyPlus;

	function getItemByIndex(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = key(index);
		item.keyvalue = getItem(item.keyname);
		return item;
	};
	myStorage.getItemByIndex = getItemByIndex;

	function getItemByIndexPlus(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = keyPlus(index);
		item.keyvalue = getItemPlus(item.keyname);
		return item;
	};
	myStorage.getItemByIndexPlus = getItemByIndexPlus;
	/**
	 * @author liuyf 2015-05-04
	 * @description 获取所有存储对象
	 * @param {Object} key 可选，不传参则返回所有对象，否则返回含有该key的对象
	 */
	myStorage.getItems = function(k) {
		var items = [];
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		var i = 0;
		if(k) {
			for(; i < numKeys; i++) {
				if(key(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndex(i));
				}
			}
			for(i = 0; i < numKeysPlus; i++) {
				if(keyPlus(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndexPlus(i));
				}
			}
		} else {
			for(i = 0; i < numKeys; i++) {
				items.push(getItemByIndex(i));
			}
			for(i = 0; i < numKeysPlus; i++) {
				items.push(getItemByIndexPlus(i));
			}
		}
		return items;
	};
	/**
	 * @description 清除指定前缀的存储对象
	 * @param {Object} keys
	 * @default ["filePathCache_","ajax_cache_"]
	 * @author liuyf 2015-07-21
	 */
	myStorage.removeItemByKeys = function(keys, cb) {
		if(typeof(keys) === "string") {
			keys = [keys];
		}
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		//TODO plus.storage是线性存储的，从后向前删除是可以的 
		//稳妥的方案是将查询到的items，存到临时数组中，再删除  
		var tmpks = [];
		var tk,
			i = numKeys - 1;
		for(; i >= 0; i--) {
			tk = key(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if(tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItem(k);
		});
		for(i = numKeysPlus - 1; i >= 0; i--) {
			tk = keyPlus(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if(tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItemPlus(k);
		})
		cb && cb();
	};
	com.myStorage = myStorage;
	win.myStorage = myStorage;
}(window, common, mui));

(function($, window, document) {
	$.ready(function(){
		/**
		 * 图片延迟加载并缓存
		 */
		var lazyLoad = {
			options: {
				placeholder: '../images/default.png',
			},
			imageList: [],
			/**
			 * 异步加载
			 * @param {Object} el
			 */
			load: function(el) {
				var name = lazyLoad.getImageName(el.getAttribute('data-lazyload'));
				el.setAttribute('src', el.getAttribute('default-src') || lazyLoad.options.placeholder);
				lazyLoad.imageList.push({
					name: name,
					el: el
				})
				lazyLoad.loadImg()
			},
			/**
			 * 加载图片
			 * @param {Object} el
			 */
			loadImg: function() {
				if(lazyLoad.imageList.length > 0) {
					var item = lazyLoad.imageList[0];
					var img = new Image();
					img.src = item.el.getAttribute('data-lazyload');
					img.onload = function() {
						item.el.setAttribute('src', img.src)
						downLoader.down(img.src, function(localUrl) {
							if(localUrl) {
								lazyLoad.saveImageLocalUrl(item.name, localUrl)
								var preview_src = item.el.getAttribute('data-preview-src');
								if(preview_src && preview_src == img.src) {
									item.el.setAttribute('data-preview-src', localUrl)
								}
							}
							lazyLoad.imageList.shift();
							lazyLoad.loadImg();
						})
					};
					img.onerror = function() {
						//					item.el.setAttribute('src',item.el.getAttribute('default-src')||lazyLoad.options.placeholder);
						lazyLoad.imageList.shift();
						lazyLoad.loadImg();
					}
				}
			},
			/**
			 * 存储图片本地路径
			 * @param {Object} name
			 * @param {Object} imglocalUrl
			 */
			saveImageLocalUrl: function(name, imglocalUrl) {
				if(imglocalUrl) {
					var arr = name.split('.');
					plus.storage.setItem(arr[0], imglocalUrl)
				}
			},
			/**
			 * 获取图片本地路径
			 * @param {Object} name
			 */
			getImageLocalUrl: function(url) {
				var name = lazyLoad.getImageName(url);
				var arr = name.split('.');
				return plus.storage.getItem(arr[0]) || name;
			},
			getImageName: function(url) {
				var arr1 = url.split('.');
				var arr2 = arr1[arr1.length - 2].split('/');
				return arr2[arr2.length - 1] + '.' + arr1[arr1.length - 1];
			}
		};
		/**
		 * 文件下载
		 */
		var downLoader = {
			options: {
				path: '_downloads/',
				method: 'GET',
			},
			set: function(options) {
				options.path=options.path||downLoader.options.path;
				options.method=options.method||downLoader.options.method;
				downLoader.options=options;
			},
			/**
			 * 创建下载
			 * @param {Object} url  下载地址
			 * @param {Object} cbFn 完成回调函数
			 * @param {Object} statusChangeFn 状态变化监听函数
			 */
			down: function(url, cbFn, statusChangeFn) {
				var dtask = plus.downloader.createDownload(url, downLoader.options, function(d, status) {
					// 下载完成
					if(status == 200) {
						plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
							cbFn(entry.toLocalURL()); //获取当前下载路径
						});
					} else {
						cbFn()
					}
				});
				dtask.addEventListener("statechanged", function(task, status) {
					if(status == 404) {
						cbFn()
					} else {
						statusChangeFn && statusChangeFn(task)
					}
				},false)
				dtask.start();
				return dtask;
			},
		};
		window.lazyLoad = lazyLoad;
		window.downloader = downLoader;
	})
	
})(mui, window, document);

var honey = (function(win, $) {
	var h = {
		apiurl: "https://www.ybeyao.com/api/app/data/",
		apihost: "https://www.ybeyao.com",
		sharehost:"http://ybeyao.com",
		//		apiurl : "http://192.168.11.226/api/app/data/",
		//		apihost : "http://192.168.11.226",
		page: 1,
		total: 0,
		pageSize: 10,
		contentinit: '<font style="font-size:12px;color:#999">上拉显示更多</font>',
		contentdown: '<font style="font-size:12px;color:#999">上拉显示更多</font>',
		contentrefresh: '<font style="font-size:12px;color:#999">正在加载...</font>',
		contentnomore: '<font style="font-size:12px;color:#999">亲,已经到底啦！</font>',
		ajaxTimeout: 60000,
	};

	/**
	 * 预加载商品列表
	 */
	h.preloadGoodsListWin = function() {
		//商品列表头部
		h.goodsListHeader = $.preload({
			id: 'goods-list-header',
			url: 'goods/goods-list-header.html',
			styles: {
				top: '0px',
				bottom: '0px',
			},
		})
		h.goodsListHeader.hide()

		//商品列表内容
		h.goodsList = $.preload({
			id: 'goods-list',
			url: 'goods/goods-list.html',
			styles: {
				top: '79px',
				bottom: 0
			},
		})
		h.goodsList.hide()

		h.goodsListHeader.addEventListener('hide', function() {
			h.goodsList.hide()
		})

		h.goodsListHeader.append(h.goodsList)
	}

	/**
	 * 预加载购物车
	 */
	h.preloadCartWin = function() {
		//商品列表头部
		h.cartHeader = $.preload({
			id: 'cart',
			url: 'cart/cart-header.html',
			styles: {
				top: '0px',
				bottom: '0px',
			},
		})
		h.cartHeader.hide()

		//商品列表内容
		h.cartContent = $.preload({
			id: 'cart-content',
			url: 'cart/cart-content.html',
			styles: {
				top: '44px',
				bottom: 0
			},
		})
		h.cartContent.hide()

		h.cartHeader.addEventListener('hide', function() {
			h.cartContent.hide()
		})

		h.cartHeader.addEventListener('show', function() {
			h.cartContent.show()
		})

		h.cartHeader.append(h.cartContent)
	}

	/**
	 * 加载详情页
	 * @param {Object} extras
	 */
	h.preloadGoodsDetail = function(extras) {
		//商品详情头部
		h.detailHeader = $.preload({
			id: 'goods-header',
			url: 'goods/goods-header.html',
			styles: {
				top: '0px',
				bottom: '0px'
			},
			extras: extras
		})
		h.detailHeader.hide()
		//商品详情内容
		h.detailSubpage = $.preload({
			id: 'goods-detail',
			url: 'goods/goods-detail.html',
			styles: {
				top: '44px',
				bottom: 0,
				bounce: 'none',
				bounceBackground: '#f8f8f8',
				scrollIndicator: 'none'
			},
			extras: extras
		})
		h.detailSubpage.hide()
		//服务说明
		h.servicePage = $.preload({
			id: 'service',
			url: 'goods/service.html',
			styles: {
				top: '180px',
				bottom: 0,
				scrollIndicator: 'none',
				bounceBackground: '#f8f8f8',
			},
		})
		h.detailHeader.addEventListener('hide', function() {
			h.detailSubpage.hide()
		})

		h.detailHeader.append(h.detailSubpage)
	}
	
	h.getOrderBtn=function(order){
		var li=[];
		var btn_return=((order.return_status==0 ||order.return_status==2)&&(order.confirm_time==0||(order.confirm_time>0&&(order.time_now-order.confirm_time)<24*3600*parseInt(h.config.auto_service_date))));
		if(order.order_status>=3){//已完成、已取消、已作废
    		if(order.return_status>0){
    			li.push('<span class="mui-btn mui-btn-nav btn-return" type="show-order">退款详情</span>')
    		}
    		li.push('<span class="mui-btn mui-btn-link" type="del-order">删除订单</span></div></li>');
    	}else{
    		if(order.pay_status>0){
    			btn_return&&li.push('<span class="mui-btn mui-btn-warning" type="return-order">申请退款</span>');
    			if(order.return_status>0){
					li.push('<span class="mui-btn mui-btn-nav btn-return" type="show-order">退款详情</span>')
    				if(order.return_status<3 || (order.return_status>2&&order.return_status<5&&order.return_info&&order.return_info.type==0)){
    					if(order.order_status==2){
	        				li.push('<span class="mui-btn mui-btn-nav" type="comment-order">评价订单</span>');
	        			}else{
	        				if(order.shipping_status>0){
	        					li.push('<span class="mui-btn mui-btn-success" type="confirm-order">确认收货</span>')
	        				}
	        			}
    				}else{
    					if(order.return_status==4){
							li.push('<span class="mui-btn mui-btn-link" type="del-order">删除订单</span></div></li>');
    					}
    				}
    			}else{
        			if(order.order_status==2){
        				li.push('<span class="mui-btn mui-btn-nav" type="comment-order">评价订单</span>');
        			}else{
        				if(order.shipping_status>0){
        					li.push('<span class="mui-btn mui-btn-success" type="confirm-order">确认收货</span>')
        				}
        			}			        				
    			}
        	}else{
        		if(order.pay_code=='cod'){
        			if(order.shipping_status>0){
        				li.push('<span class="mui-btn mui-btn-success" type="confirm-order">确认收货</span>')
        			}
        		}else{
        			li.push('<span class="mui-btn mui-btn-red" type="pay-order">立即付款</span>');
        		}
        		li.push('<span class="mui-btn mui-btn-grey" type="cansel-order">取消订单</span>');
        	}
    	}
    	return li.join('');
	}

	$.plusReady(function() {
		/**
		 * 显示商品列表
		 * @param {Object} data
		 * @param {Object} append
		 * @param {Object} ad
		 */
		h.showGoodsList = function(data, id, ad, f) {
			//		var box=document.getElementById(id);
			var leftBoxDom = document.getElementById('BoxLeft')
			var rightBoxDom = document.getElementById('BoxRight')
			if(ad) {
				$.each(ad, function(i, v) {
					var li = document.createElement('li');
					li.className = "ad";
					li.setAttribute('ad_link', v.link);
					li.setAttribute('ad_type', v.type);
					li.setAttribute('f', f ? f + '-ad' : 'ad');
					var img = v.src.indexOf('http://') >= 0 ? v.src : h.apihost + v.src;
					var src = lazyLoad.getImageLocalUrl(img)
					li.innerHTML = '<p class="product_picture"><img class="lazy" src="' + src + '" data-lazyload="' + (img) + '" default-src="../images/default.png" onerror="lazyLoad.load(this)"/></p>' +
						'<p class="product_ie">' + v.name + '</p>';
					if(leftBoxDom.offsetHeight < rightBoxDom.offsetHeight) {
						leftBoxDom.appendChild(li)
					} else {
						rightBoxDom.appendChild(li)
					}
				});
			}
			$.each(data, function(i, v) {
				var li = document.createElement('li');
				li.className = "goods-list";
				li.setAttribute('goods_id', v.goods_id)
				li.setAttribute('f', f);
				var img = h.getGoodsImgUrl(v.goods_id, v.img_id);
				var src = lazyLoad.getImageLocalUrl(img)
				if(h.keyword) {
					v.goods_name = v.goods_name.replace(eval('/' + h.keyword + '/g'), '<font color="red">' + h.keyword + '</font>')
					v.goods_remark = v.goods_remark.replace(eval('/' + h.keyword + '/g'), '<font color="red">' + h.keyword + '</font>')
				}
				li.innerHTML = '<p class="product_picture"><img class="lazy" src="' + src + '" data-lazyload="' + (img) + '" onerror="lazyLoad.load(this)" default-src="../images/default.png"/></p>' +
					'<p class="product_np"><a>' + v.goods_name + '</a><a class="price">￥' + v.shop_price + '</a></p>' +
					'<p class="product_ie">' + v.goods_remark + '</p>';
				if(leftBoxDom.offsetHeight < rightBoxDom.offsetHeight) {
					leftBoxDom.appendChild(li)
				} else {
					rightBoxDom.appendChild(li)
				}
			});
		}
		/**
		 * 打开广告页
		 * @param {Object} type
		 * @param {Object} link
		 * @param String name
		 */
		h.openAd = function(type, link, name, f) {
			if(!type || !link) {
				return
			}
			switch(parseInt(type)) {
				case 0: //产品
					if(!h.detailWebView) {
						h.detailWebView = plus.webview.getWebviewById('goods-header');
					}
					if(!h.detailSubpage) {
						h.detailSubpage = plus.webview.getWebviewById('goods-detail');
					}
					$.fire(h.detailWebView, 'goodsId', {
						goods_id: link,
						f: f
					})
					h.detailWebView.show('slide-in-right', 300)
					break;
				case 1: //文章
					h.openWin('../mine/article.html', 'article', {
						article_id: link,
						f: f
					});
					break;
				case 2: //分类
					if(!h.goodsListHeader) {
						h.goodsListHeader = plus.webview.getWebviewById('goods-header')
					}
					$.fire(h.goodsListHeader, 'cateId', {
						name: name,
						cid: link,
						f: f
					})
					h.goodsListHeader.show('slide-in-right', 300)
					break;
			}
		}
		/**
		 * 显示收藏商品列表
		 * @param {Object} data
		 * @param {String} id 选择器
		 * @param {Boolean}} append 是否追加
		 * @param {Object} ad 广告图片
		 */
		h.showGoodsList1 = function(data, id, append, ad) {
			var obj = document.getElementById(id);
			//	!append&&(obj.innerHTML='')
			if(ad) {
				var li = document.createElement('li');
				li.className = "ad";
				li.innerHTML = '<img src="' + ad.src + '"/>';
				obj.appendChild(li);
			}
			$.each(data, function(i, v) {
				var li = document.createElement('li');
				li.className = "mui-table-view-cell mui-media mui-col-xs-6 goods-list";
				var img = h.getGoodsImgUrl(v.goods_id, v.img_id);
				var src = lazyLoad.getImageLocalUrl(img);
				li.innerHTML = '<div class="goods-list-item"><a href="#" number="' + i + '" goods_id="' + v.goods_id +
					'"><img class="mui-media-object goods-lphoneogo" src="' + src + '" data-lazyload="' + img + '" onerror="lazyLoad.load(this)"/><div class="mui-media-body goods-info"><p class="goods-title">' +
					v.goods_name + '</p><p><span class="goods-price-one">￥' + v.shop_price + '</span><p>' +
					(v.market_price ? '<p><span class="goods-price-one">￥' + v.market_parice + '</span><p>' : '') + '</div></a></div>';
				obj.appendChild(li);
			})
		}

		/**
		 * 显示评价列表
		 * @param {Object} list 数组对象
		 * @param {String} id  选择器
		 */
		h.showCommentList = function(list, id, showReply) {
			var obj = $('#' + id);
			$.each(list, function(i, v) {
				h.lastId = v.comment_id;
				var li = document.createElement('li');
				li.className = "evaluate-list-item";
				var str = [];
				var src = lazyLoad.getImageLocalUrl(v.head_pic);
				str.push('<p><span class="user-name"><img src="' + src + '" data-lazyload="' + v.head_pic + '" default-src="../images/profile.png" onerror="lazyLoad.load(this)"/><font>' +
					(v.is_anonymous ? "匿名用户" : v.nickname) + '</font></span>' +
					h.getCommentStar(((v.deliver_rank + v.goods_rank + v.service_rank) / 3).toFixed(2)) +
					'<span class="user-time">' + h.getYmdTime(v.add_time) + '</span></p><p class="comment-content">' + v.content + '</p>')
				if(v.img && v.img.length > 0) {
					str.push('<p><div class="user-photo">');
					for(var j = 0; j < v.img.length; j++) {
						var img = h.apihost + v.img[j];
						var src = lazyLoad.getImageLocalUrl(img);
						str.push('<img class="photos" src="' + src + '" data-lazyload="' + img + '"  data-preview-src="' + img + '" data-preview-group="' + i + '" onerror="lazyLoad.load(this)" />')
					}
					str.push('</div></p>')
				}
				if(showReply) {
					if(v.replyList) {
						for(var j = 0; j < v.replyList.length; j++) {
							var reply = v.replyList[j];
							str.push('<p class="reply"><span>' + (reply.user_id > 0 ? "<font>客服</font> 回复" : (reply.is_anonymous > 0 ? "<a>匿名用户</a>" : reply.username) + ' 追加') + '：</span><span>' + reply.content + '</span></p>');
						}
					}
				}
				//			str.push('<p class="zan"><span class="zan_num" comment_id="' + v.comment_id + '"><img src="../images/zan.png"/> ' + v.zan_num + '</span></p>')
				li.innerHTML = str.join('');
				document.getElementById(id).appendChild(li)
			});
			$('.user-photo').off('tap', '.photos').on('tap', '.photos', function() {
				$.previewImage()
			})
		}
		/**
		 * 获取设备信息
		 * model 型号
		 * vender 厂商
		 * imei
		 * uuid
		 * screen 分辨率 
		 * imsi
		 */
		h.getDeviceInfo = function() {
			h.deviceInfo = {
				model: plus.device.model,
				vender: plus.device.vendor,
				imei: plus.device.imei,
				uuid: plus.device.uuid,
				screen: plus.screen.resolutionWidth * plus.screen.scale + '*' + plus.screen.resolutionHeight * plus.screen.scale,
				dpi: plus.screen.dpiX + '*' + plus.screen.dpiY,
				imsi: ''
			}
			for(i = 0; i < plus.device.imsi.length; i++) {
				h.deviceInfo.imsi += plus.device.imsi[i];
			}
		}
		/**
		 * 获取系统信息
		 * name 系统名称
		 * version 系统版本
		 * language 系统语言
		 * vender 厂商
		 * network 网络状态
		 */
		h.getSysInfo = function() {
			var types = {};
			types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
			types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
			types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
			types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
			types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
			types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
			types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
			h.systemInfo = {
				name: plus.os.name,
				version: plus.os.version,
				language: plus.os.language,
				vendor: plus.os.vendor,
				network: types[plus.networkinfo.getCurrentType()]
			};
		}
		// 获取本地应用资源版本号
		h.wgtVersionService=function(wgtVer,callback){
			if(wgtVer){
				plus.runtime.getProperty(plus.runtime.appid,function(inf){
			    	if(wgtVer!=inf.version){
			    		callback&&callback(inf.version);
			    	}
			    });
			}
		}
		/**
		 * 获取系统配置信息
		 */
		h.getSystemConfig=function(){
			h.getDeviceInfo();
			h.getSysInfo();
			h.deviceInfo.name=h.systemInfo.name;
			$.ajax(h.apiurl,{
				type:"post",
				async:true,
				data:{
					m:'get_system_config',
					token:h.token,
					device:h.deviceInfo
				},
				dataType:'json',
				success:function(ret){
					if(ret.code==0){
						if(ret.data.loadSwitch){
							h.wgtVersionService(ret.data.version,function(version){
								if(ret.data.wgt){//安装补丁
									h.loadApp(ret.data.wgt,h.installApp)
								}else{//安装主程序
									if(plus.os.name=='iOS'){
										h.loadApp(ret.data.url,h.installApp)
									}else{
										$.confirm('检测到有新版本,是否下载安装?','更新提示',['确定','取消'],function(e){
											if(e.index==0){
												var w=plus.nativeUI.showWaiting('正在下载安装包')
												h.loadApp(ret.data.url,h.installApp,function(task){
													if(task.state==3){
														var a = task.downloadedSize / task.totalSize * 100;
							                            w.setTitle("已下载" + parseInt(a) + "%");
													}
												})
											}
										})
									}
								}
							})
						}
					}
				},
			});
		}
		/**
		 * 加载app
		 * @param {Object} url
		 * @param {Object} callback
		 * @param {Object} stutasChangeFn 
		 */
		h.loadApp=function(url,callback,stutasChangeFn){
			if(url){
				var options={
					path: '_doc/update/',
					method: 'GET',
				}
				var dtask = plus.downloader.createDownload(url, options, function(d, status) {
					if(status == 200) {
						plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
							callback&&callback(entry.toLocalURL());
						})
					}
				});
				dtask.addEventListener("statechanged", function(task, status) {
					if(status == 404) {
						callback()
					} else {
						stutasChangeFn && stutasChangeFn(task)
					}
				},false)
				dtask.start();
			}
		}
		/**
		 * 安装补丁
		 * @param {Object} path
		 */
		h.installApp=function(path){
			plus.runtime.install(path,{},function(){
//			 	console.log('install success')
		    },function(e){
//		    	console.log('install fail')
		    });
		}
		/**
		 * 拨打电话
		 * @param {Object} number
		 */
		h.call = function(number) {
			if(plus.os.name == "Android") {
				var Intent = plus.android.importClass("android.content.Intent");
				var Uri = plus.android.importClass("android.net.Uri");
				var main = plus.android.runtimeMainActivity();
				var uri = Uri.parse("tel:" + number);
				var call = new Intent("android.intent.action.CALL", uri);
				main.startActivity(call);
			} else {
				//plus.device.dial(number, false);
				var UIAPP = plus.ios.importClass("UIApplication");
				var NSURL = plus.ios.importClass("NSURL");
				var app = UIAPP.sharedApplication();
				app.openURL(NSURL.URLWithString("tel://" + number));
			}
		}
		/**
		 * 发送短信
		 * @param {Object} number
		 * @param {Object} text
		 */
		h.sms = function(number, text) {
			if(plus.os.name == "Android") {

				var Intent = plus.android.importClass("android.content.Intent");
				var Uri = plus.android.importClass("android.net.Uri");

				var uri = Uri.parse("smsto:" + number);

				var intent = new Intent(Intent.ACTION_SENDTO, uri);
				intent.putExtra("sms_body", "");

				plus.android.runtimeMainActivity().startActivity(intent);
			} else {
				var UIAPP = plus.ios.importClass("UIApplication");
				var NSURL = plus.ios.importClass("NSURL");
				var app = UIAPP.sharedApplication();
				app.openURL(NSURL.URLWithString("sms://" + number));
			}
		}
		h.logoutFire = function() {
			if(!honey.indexWin) {
				honey.indexWin = plus.webview.getLaunchWebview()
			}
			if(!honey.cartContent) {
				honey.cartContent = plus.webview.getWebviewById('cart-content')
			}
			if(!honey.buyContent) {
				honey.buyContent = plus.webview.getWebviewById('buy-content')
			}
			if(!honey.detailSubpage) {
				honey.detailSubpage = plus.webview.getWebviewById('goods-detail')
			}
			$.fire(honey.indexWin, 'logout')
			$.fire(honey.cartContent, 'logout')
			$.fire(honey.buyContent, 'logout')
			$.fire(honey.detailSubpage, 'logout')
		}

		h.loginFire = function(show) {
			if(!honey.mineWin) {
				honey.mineWin = plus.webview.getWebviewById('mine')
			}
			if(!honey.detailSubpage) {
				honey.detailSubpage = plus.webview.getWebviewById('goods-detail')
			}
			$.fire(honey.mineWin, 'login', {
				show: show
			})
			$.fire(honey.detailSubpage, 'login')
			
		}

		h.getchannel = function() {
			// 获取支付通道
			plus.payment.getChannels(function(channels) {
				for(var i in channels) {
					var channel = channels[i];
					if(channel.id == 'alipay' || channel.id == 'wxpay') {
						if(!h.paychannel) {
							h.paychannel = {}
						}
						h.paychannel[channel.id] = channel;
					}
				}
			}, function(e) {
				$.toast('获取支付通道失败：' + e.message);
			});
		}

		// 检测是否安装支付服务
		h.checkServices = function(pc) {
			if(!pc.serviceReady) {
				var txt = null;
				switch(pc.id) {
					case 'alipay':
						txt = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？';
						break;
					default:
						txt = '系统未安装“' + pc.description + '”服务，无法完成支付，是否立即安装？';
						break;
				}
				plus.nativeUI.confirm(txt, function(e) {
					if(e.index == 0) {
						pc.installService();
					}
				}, pc.description);
			}
		}
		h.pay_waitting = null;
		h.pay = function(ajaxData, callback) {
			//			console.log(h.token)
			if(h.pay_waitting) {
				callback({
					status: false,
					msg: '已有订单在支付'
				})
				return;
			}
			//			console.log('开始获取支付通道')
			//获取支付通道
			//			h.getchannel();
			//			console.log(JSON.stringify(h.paychannel))
			if(!h.paychannel[ajaxData.pay_type]) {
				return
			}
			//检测是否安装服务
			h.checkServices(h.paychannel[ajaxData.pay_type]);
			//请求支付
			if(ajaxData.pay_type != 'alipay' && ajaxData.pay_type != 'wxpay') {
				callback({
					status: false,
					msg: '不支持此类型支付'
				})
				return
			}
			var appid = plus.runtime.appid;
			if(navigator.userAgent.indexOf('StreamApp') >= 0) {
				appid = 'Stream';
			}

			//			console.log(JSON.stringify(data))
			h.pay_waitting = plus.nativeUI.showWaiting();
			$.ajax(h.apiurl, {
				type: "post",
				async: true,
				data: ajaxData,
				dataType: 'text',
				success: function(ret) {
					h.pay_waitting.close()
					h.pay_waitting = null;
					//					console.log(ret)
					ret = JSON.parse(ret);
					if(!ret.data) {
						callback({
							status: false,
							msg: '请求支付失败'
						})
						return
					}
					var order = ret.data;
					plus.payment.request(h.paychannel[ajaxData.pay_type], order, function(result) {
						console.log(result)
						callback({
							status: true,
							msg: '支付成功'
						})
					}, function(e) {
						switch(e.code) {
							case 62001:
							case -2:
								msg = '取消支付';
								break;
							default:
								msg = '支付失败';
						}
						callback({
							status: false,
							msg: msg
						})
					})
				},
				error: function(ret) {
					console.log(ret.responseText)
					h.pay_waitting.close()
					h.pay_waitting = null;
					callback({
						status: false,
						msg: '订单请求失败'
					})
				}
			});
		}
	})

	/**
	 * 获取商品图片地址
	 * @param {Object} goodsId
	 * @param {Object} imgId
	 * @param {Object} px
	 */
	h.getGoodsImgUrl = function(goodsId, imgId, px) {
		var px = px ? px : 400;
		return h.apihost + '/public/upload/goods/thumb/' + goodsId + '/goods_sub_thumb_' + imgId + '_' + px + '_' + px + '.jpg';
	}

	/**
	 * 返回评价星级 
	 * @param {Number} s 平均得分
	 */
	h.getCommentStar = function(s) {
		var star = [];
		for(var i = 0; i < 5; i++) {
			star.push('<i class="mui-icon mui-icon ' + (s > i ? (s < (i + 1) ? 'mui-icon-starhalf' : 'mui-icon-star-filled') : 'mui-icon-star') + '"></i>')
		}
		return '<span class="user-star">' + star.join('') + '</span>';
	}

	/**
	 * 预加载页面
	 * @param {String} url
	 * @param {String} id
	 * @param {Array} data
	 * @param {Array} styles
	 */
	h.preloadWin = function(url, id, data, styles) {
		return $.preload({
			id: id,
			url: url,
			styles: styles || {
				top: '0px',
				bottom: '0px',
				popGesture: 'close'
			},
			extras: data
		})
	}

	/**
	 * 打开新页面
	 * @param {Object} url
	 * @param {Object} winId
	 * @param {Object} data
	 * @param {Object} styles
	 * @param {Object} show
	 * @param {Object} wait
	 */
	h.openWin = function(url, winId, data, styles, show, wait) {
		var show = show || {}
		var wait = wait || {}
		return $.openWindow({
			url: url,
			id: winId,
			styles: styles,
			extras: data,
			createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			show: {
				autoShow: show.autoShow || true, //页面loaded事件发生后自动显示，默认为true
				aniShow: show.aniShow || 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
				duration: show.duration || 200, //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				event: show.event || 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: show.extras || {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: wait.autoShow || false, //自动显示等待框，默认为true
				title: wait.title || '正在加载...', //等待对话框上显示的提示内容
			}
		})
	}

	/**
	 * 关闭窗口
	 * @param {Object} id
	 */
	h.closeWin = function(id, timeOut) {
		var w = plus.webview.getWebviewById(id);
		if(w) {
			setTimeout(function() {
				w.close()
			}, timeOut ? timeOut : 10)
		}
	}

	/**
	 * 滚动
	 * @param string id 选择器
	 * @param int time 时间
	 */
	h.mySrcollTo = function(id, time) {
		var y = (id ? document.getElementById(id).offsetTop - 38 : 0);
		$.scrollTo(y, (time ? time : 10));
	}

	/**
	 * 根据PHP时间戳获取年月日时间
	 * @param time
	 * @returns {String}
	 */
	h.getYmdTime = function(time, showTime) {
		if(time > 0) {
			time = time * 1000;
			var dateStr = new Date(time);
			var m = (dateStr.getMonth() < 9 ? "0" : "") + (dateStr.getMonth() + 1)
			var d = (dateStr.getDate() < 10 ? "0" : "") + dateStr.getDate()
			if(showTime) {
				var H = (dateStr.getHours() < 10 ? "0" : "") + dateStr.getHours()
				var i = (dateStr.getMinutes() < 10 ? "0" : "") + dateStr.getMinutes()
				var s = (dateStr.getSeconds() < 10 ? "0" : "") + dateStr.getSeconds()
			}
			return dateStr.getFullYear() + '-' + m + '-' + d +
				(showTime ? (' ' + H + ':' + i + ':' + s) : '');
		} else {
			return '末知时间';
		}
	}

	/**
	 * 转义html
	 * @param {Object} str
	 */
	h.escape2Html = function(str) {
		var arrEntities = {
			'lt': '<',
			'gt': '>',
			'nbsp': ' ',
			'amp': '&',
			'quot': '"'
		};
		return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
			return arrEntities[t];
		});
	}

	/**
	 * 判断是否为电话号码
	 * @param {Object} str
	 */
	h.isPhone = function(str) {
		var myreg = /^1[34578]\d{9}$/;
		return str ? (myreg.test(str) ? str : false) : false;
	}
	/**
	 * 判断是否为邮箱
	 * @param {Object} str
	 */
	h.isEmail = function(str) {
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		return reg.test(str);
	}

	/**
	 * 去除空格
	 * @param {string} str
	 * @param {Boolean} isAll 是否全部去除
	 */
	h.trim = function(str, isAll) {
		var result;
		if(str) {
			result = str.replace(/(^\s+)|(\s+$)/g, "");
			if(isAll) {
				result = result.replace(/\s/g, "");
			}
		}
		return result;
	}

	/**
	 * 加密
	 * @param {string} str
	 */
	h.encryptString = function(str) {
		var pub_key = "-----BEGIN PUBLIC KEY-----\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1VZfzb8V7amcvBSr4TyA\
pSP0Ndj43d6MK1/rXPIoLZ9+hnLzGBuBXwzi//cp9uBt61/b7YzZa4BlaQvNjqc8\
4yttRo3eHyH7Y2W0mAiPiSJELxTsFqEKBfFDHs68VNKEbZ/uL51farm9hQxuaFqw\
0GiwwKlYmkuO9ioUOjG80AninMmG2HalutL3zPOn3e1N3ed95Wt3thoRSAfPRclI\
CUnqV8RFY933ylSI6TkUxXT07/1kVKaHLvuOZ9T/TSGamvcP+DrpvErsRA6/9DmR\
yQ+jUd99+uMBkvA4SScssRB2J5uqesaeCgrBjY7hzpqiQNfTBBQnQ1qJl3TcItNW\
WwIDAQAB\
-----END PUBLIC KEY-----\
";
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(pub_key);
		return encrypt.encrypt(str);
	}

	/**
	 * 解密
	 * @param {string} str
	 */
	h.decryptString = function(str) {
		var pri_key = "-----BEGIN RSA PRIVATE KEY-----\
MIIEogIBAAKCAQEA1VZfzb8V7amcvBSr4TyApSP0Ndj43d6MK1/rXPIoLZ9+hnLz\
GBuBXwzi//cp9uBt61/b7YzZa4BlaQvNjqc84yttRo3eHyH7Y2W0mAiPiSJELxTs\
FqEKBfFDHs68VNKEbZ/uL51farm9hQxuaFqw0GiwwKlYmkuO9ioUOjG80AninMmG\
2HalutL3zPOn3e1N3ed95Wt3thoRSAfPRclICUnqV8RFY933ylSI6TkUxXT07/1k\
VKaHLvuOZ9T/TSGamvcP+DrpvErsRA6/9DmRyQ+jUd99+uMBkvA4SScssRB2J5uq\
esaeCgrBjY7hzpqiQNfTBBQnQ1qJl3TcItNWWwIDAQABAoIBADDLttIKmOtpVi42\
1DGKcypSlPMUE6g71Pe+0sjJoqL8ziXWeP/Umryw5+MAF5seLkYeAOHOy5QpJAjo\
6DVuzyBuuGng3SNl1GghxTLZEmudaNcUBAQRBYfibSXIx47nL98bK5G8fyycG1sp\
Qr+frr2clIEcuuVfzu1DJqlA4xz6GqW0+ofxrrSBa4LnAZ9tKcNHrRxN2ANcfsZU\
v+cY9BdTcF+D16sWxfdSVpC3WaJAePLEJay4NyYTmtpmCPAnJTW4d8ayenOQaemO\
LKqeW5MVC53fSv85xzYFhdI8wfyB9oP6GikHSjNAZ0/mNJ3KAXanwvEAvMuBolyk\
LVGWdHECgYEA+69tJNuFwrqsk+J00bQkYK/iTUnfpWCqvk74PBJuXZ9PtelyHX47\
PtXCO/eX9/ALO8ItEio6SlJ2TMlhI6zwz423LLFRhoDjnMmDvMSTcFLyV9sbRMw1\
BqCvy+JnincujBB8gNj/T5uDki73ssenTEMPWRnbQ9cTYUHDi/uqt+0CgYEA2P6m\
dppCpTV/6cStAbRx+ph11H0qRDCJnzq3jPyfWB5dIEM2VSNQY2SHrhDZdtd+o/sk\
PCeFezm4PEphFViqkhCIt5sIp64ef6OqXSyF883ikYldtMARo+uCp6HUKF6io8xP\
LwsgF1zkqSF+V+l/UgSX6cNbqakrxECta4QZ7mcCgYBb2oQsxWklzlcZibY0qlf0\
aXxf1KwogQUPe2ahFeDtjizbKR2aoe0hW4YNuKjftd2Dq7QjQwIPCdVe5Mfs6zrf\
pMrLJtOoEPYAzJKlm+BrR/pmEfL7wsM/bfl6oWBEaoa0W3f01j0nYow8F6QSvUbT\
UE4TqJobQi0ye3vQZMLDaQKBgGrH1S6j9ovJ6eolaGVgYH5KrCEmfrgTkoWSpWRx\
pA/+0SDhMklvGU3v2Hyluf2rSZx0J36ajCr5WloA2AljGnzKOhzv47BwFH4HEfzL\
vhcdh5LKoBwkMAoUCLVpAzfiafJkxcqGlQIqKjO4Ua39LzQzInZcNi0lHG50zWIN\
HZ2dAoGAexALRmsEJilLIosLkGDWMMBOlB+q9qWPi+vuWEz7roeamBC1BkG++DEI\
dsAozIooupPz5FDz0DwB1U23JExXjFNUAmJtruBg+fs3EjqMCs6trC2qbkOVPs9Z\
HZq3Xezel+pSNIImRLPFi40EFZzswZ6tQJXDw04Z8IiQdH3MJQI=\
-----END RSA PRIVATE KEY-----\
";
		var encrypt = new JSEncrypt();
		encrypt.setPrivateKey(pri_key);
		return encrypt.decrypt(str);
	}

	/**
	 * 获取数据
	 * @param {string} item
	 */
	h.getStorage = function(item) {
		return plus.storage.getItem(item);
	}

	/**
	 * 存储数据
	 * @param {string} item
	 * @param {Object} value
	 */
	h.setStorage = function(item, value) {
		return plus.storage.setItem(item, value);
	}
	/**
	 * 格式化金额
	 * @param {Number} 金额
	 * @param {Number} 小数点位数
	 */
	h.fmoney = function(s, n) {
		n = n > 0 && n <= 20 ? n : 2;
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		var l = s.split(".")[0].split("").reverse(),
			r = s.split(".")[1];
		t = "";
		for(i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		return t.split("").reverse().join("") + "." + r;
	}

	h.getStrLength = function(str) {
		///<summary>获得字符串实际长度，中文2，英文1</summary>
		///<param name="str">要获得长度的字符串</param>
		var realLength = 0,
			len = str.length,
			charCode = -1;
		for(var i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if(charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
		}
		return realLength;
	};

	//js截取字符串，中英文都能用  
	//如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。  
	//字符串，长度  

	/** 
	 * js截取字符串，中英文都能用 
	 * @param str：需要截取的字符串 
	 * @param len: 需要截取的长度 
	 */
	h.cutstr = function(str, len, tag) {
		if(!str) {
			return '';
		}
		var str_length = 0;
		var str_len = 0;
		len = len || 56;
		str_cut = new String();
		str_len = str.length;
		for(var i = 0; i < str_len; i++) {
			a = str.charAt(i);
			str_length++;
			if(escape(a).length > 4) {
				//中文字符的长度经编码之后大于4  
				str_length++;
			}
			str_cut = str_cut.concat(a);
			if(str_length >= len) {
				str_cut = str_cut.concat(tag || "...");
				return str_cut;
			}
		}
		//如果给定字符串小于指定长度，则返回源字符串；  
		if(str_length < len) {
			return str;
		}
	}
	/**
	 * 获取地址名称
	 * @param {Object} p 地址对象{province:'',city:'',district:''}
	 * @param {Object} data 地址数组
	 * @param {Object} type 当前类型
	 * @param {Object} tag 地址中间间隔符号
	 */
	h.getAddressText = function(p, data, type, tag) {
		var tag = tag || '';
		for(var i = 0; i < data.length; i++) {
			switch(type) {
				case 1:
					if(data[i].value == p.city) {
						return tag + data[i].text + h.getAddressText(p, data[i].children, 2, tag)
					}
					break;
				case 2:
					if(data[i].value == p.district) {
						return tag + data[i].text;
					}
					break;
				default:
					if(data[i].value == p.province) {
						return data[i].text + h.getAddressText(p, data[i].children, 1, tag)
					}
			}
		}
		return ''
	}

	h.fixFooter = function(id,top) {
		document.getElementById(id || 'footerBar').style.top = (plus.display.resolutionHeight - (top?top:95)) + "px";
	}

	h.swipeClose = function(_win) {
		_win.addEventListener('swiperight', function(e) {
			var angle = Math.abs(e.detail.angle);
			if(angle < 6) {
				$.back()
			}
		})
	}

	h.countCartGoodsNum = function(cart) {
		if(!cart) {
			cart = myStorage.getItem('cart');
		}
		var num = 0;
		if(cart && cart.length > 0) {
			for(var i = 0; i < cart.length; i++) {
				num += parseFloat(cart[i].num)
			}
		}
		if(!honey.goodsHeader) {
			honey.goodsHeader = plus.webview.getWebviewById('goods-header');
		}
		mui.fire(honey.goodsHeader, 'showCartNum', {
			num: num
		})
	}

	/*1.用正则表达式实现html转码*/
	h.htmlspecialchars_encode = function(str) {
			var s = "";
			if(str.length == 0) return "";
			s = str.replace(/&/g, "&amp;");
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/ /g, "&nbsp;");
			s = s.replace(/\'/g, "&#39;");
			s = s.replace(/\"/g, "&quot;");
			return s;
		},
		/*2.用正则表达式实现html解码*/
		h.htmlspecialchars_decode = function(str) {
			var s = "";
			if(str.length == 0) return "";
			s = str.replace(/&amp;/g, "&");
			s = s.replace(/&lt;/g, "<");
			s = s.replace(/&gt;/g, ">");
			s = s.replace(/&nbsp;/g, " ");
			s = s.replace(/&#39;/g, "\'");
			s = s.replace(/&quot;/g, "\"");
			return s;
		}
	return h;
}(window, mui))