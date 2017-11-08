Element.prototype.hasClass = function(className){
    var i,len,temp = this.className.split(" ");
    for(i = 0,len = temp.length; i < len; i++){
        if(className == temp[i]){
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
			if (obj && !arr.Contains(obj)) {
				arr.push(obj);
			}
			if (pre && pre.tagName == obj.tagName && !arr.Contains(pre)) {
				getAllDomBrothers(pre, arr);
			}
			if (nex && nex.tagName == obj.tagName && !arr.Contains(nex)) {
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
				if (_list.length < 1) {
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
			if (!str || str.length == 0) return hash.toString();
			for (i = 0; i < str.length; i++) {
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
			for (var i = 0; i < plus.device.imsi.length; i++) {
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
		com.createShortcut = function(name,iconUrl) {
			if (mui.os.android) {
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
			if (mui.os.android) {
				var backButtonPress = 0;
				mui.back = function(event) {
					backButtonPress++;
					if (backButtonPress > 1) {
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

		com.iosAppstore = function (url) {
			plus.runtime.openURL("itms-apps://" + url);
		};
		return com;
	}(mui));

(function(win,com, mui) {
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
		} catch (e) {
			console.log(e);
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
		if (k) {
			for (; i < numKeys; i++) {
				if (key(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndex(i));
				}
			}
			for (i = 0; i < numKeysPlus; i++) {
				if (keyPlus(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndexPlus(i));
				}
			}
		} else {
			for (i = 0; i < numKeys; i++) {
				items.push(getItemByIndex(i));
			}
			for (i = 0; i < numKeysPlus; i++) {
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
		if (typeof(keys) === "string") {
			keys = [keys];
		}
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		//TODO plus.storage是线性存储的，从后向前删除是可以的 
		//稳妥的方案是将查询到的items，存到临时数组中，再删除  
		var tmpks = [];
		var tk,
			i = numKeys - 1;
		for (; i >= 0; i--) {
			tk = key(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItem(k);
		});
		for (i = numKeysPlus - 1; i >= 0; i--) {
			tk = keyPlus(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
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
}(window,common, mui));

(function(com) {
	/**
 	* @author 1020450921@qq.com
 	* @link http://www.cnblogs.com/phillyx
 	* @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	 *@description 存储当前下载路径
	 */
	var cache = {};
	cache.options={
		downloadPath:"_downloads/",
		removePrefix:[]
	};

	cache.getFile = function(netPath, cb) {
		var filePathCache = getLocalFileCache(netPath);
		isExist(filePathCache, function(exist) {
			if (exist) {
				//console.log('EXIST_' + filePathCache)
				cb(filePathCache);
			} else {
				//console.log('UNEXIST_' + filePathCache+"_"+netPath)
				Filedownload(netPath, function(localPath) {
					cb(localPath);
				});
			}
		});
	};
	/**
	 * @description 检查文件是否存在
	 */
	var isExist = function(localpath, cb) {
		if (!localpath) {
			return cb(false);
		}
		plus.io.resolveLocalFileSystemURL(localpath, function() {
			cb(true);
		}, function() {
			cb(false);
		});
	}
	var couDwn = 0;
	//下载
	var Filedownload = function(netPath, callback) {
		var dtask = plus.downloader.createDownload(netPath, {}, function(d, status) {
			// 下载完成	`
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
					setLocalFileCache(netPath, entry.toLocalURL());
					callback(entry.toLocalURL()); //获取当前下载路径
				});
			} else {
				//console.log('download.state:' + d.state + "____download.status" + status);
				//下载失败 只递归一次，再次失败返回默认图片
				if (++couDwn <= 1) {
					console.log(couDwn);
					arguments.callee(netPath, callback);
				} else {
					//重置
					couDwn = 0;
					//返回默认图片
					callback();
				}
			}
		});
		//TODO 监听当前下载状态，当云服务器中不存在该文件时，查询的特别慢，估计过了3分钟以上才返回status:404，其他时间一直在刷d.state:2
		//具体的报文格式看这http://wenku.baidu.com/link?url=JtC5q4w4D8DCzid6ahpQGgir2JCxuQq_uHfJ-_G9ZxvySL1oStV6oS447QKLEMFT5JpmQCSl4gmYdotk1JfmcUBLPKO_WbaDirQulDWMK7_
		//		dtask.addEventListener( "statechanged", function(d, status){
		//			console.log(d.state);
		//		}, false );
		dtask.start();
	};

	function getLocalFileCache(netPath) {
		var FILE_CACHE_KEY = "filePathCache_" + common.hashCode(netPath);
		var localUrlObj = myStorage.getItem(FILE_CACHE_KEY);
		return localUrlObj;
	};

	function setLocalFileCache(netPath, localPath) {
		var FILE_CACHE_KEY = "filePathCache_" + common.hashCode(netPath);
		myStorage.setItem(FILE_CACHE_KEY, localPath);
	};
	/**
	 * 清除本地文件及缓存
	 */
	cache.clear = function(cb, waiting) {
		//没有手动设置下载路径，默认的下载路径是"/storage/sdcard0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/",相对路径如下
		//		plus.io.resolveLocalFileSystemURL("_downloads/", function(entry) {
		//			entry.removeRecursively(function() {
		//				myStorage.removeItemByKeys(null, function() {
		//					cb && cb();
		//				});
		//			}, function() {
		//				cb & cb(false);
		//			});
		//		}, function(e) {
		//			cb & cb(false);
		//		});
		waiting = waiting || plus.nativeUI.showWaiting('缓存清除中...');
		plus.io.resolveLocalFileSystemURL(cache.options.downloadPath, function(entry) {
			var tmpcou = 0;
			var dirReader = entry.createReader();
			dirReader.readEntries(function(entries) {
				var flen = entries.length,
					percent;
				//console.log("flen:" + flen);

				com.myasync(entries, function(fl, next) {
					if (fl.isFile) {
						fl.remove(function(en) {
							percent = Math.floor(++tmpcou / flen * 100);
							waiting.setTitle('已清除' + (percent > 99 ? 99 : percent) + '%')
							next();
						}, function(e) {
							console.log(JSON.stringify(e));
							next();
						});
					}
				}, function() {
					var pr=["filePathCache_","ajax_cache_"];
					pr=pr.concat(cache.options.removePrefix);
					myStorage.removeItemByKeys(pr, function() {
						waiting.setTitle('已清除100%');
						setTimeout(function() {
							waiting.close();
						}, 200);
						cb && cb();
					});
				});

			}, function(e) {
				console.log(e);
			});
		}, function(e) {
			console.log(e);
		});
	};
	/**
	 *@description 查看已下载的文件
	 */
	cache.getDownloadFiles = function() {
		plus.io.resolveLocalFileSystemURL(cache.options.downloadPath, function(entry) {
			console.log(entry.toLocalURL());
			var rd = entry.createReader();
			rd.readEntries(function(entries) {
				entries.forEach(function(f, index, arr) {
					console.log(f.name);
				})
			})
		});
	}
	com.cache = cache;
}(common));
/**
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 *@description 将网络图片下载到本地并显示，包括缓存
*/
(function(win, com,$) {

	var makeArray = function(obj) {
		var res = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			res.push(obj[i]);
		}
		return res;
	}

	function lazyLoad(doc, cb) {
		//console.log(lazyImg.pageno);
		var imgs;
		if (lazyImg.pageno) {
			imgs = doc.querySelectorAll("img[data-pageno='" + lazyImg.pageno + "']");
		} else {
			imgs = doc.querySelectorAll('img.lazy');
		}

		com.myasync(/*makeArray(imgs)*/$.slice.call(imgs), function(img, next) {
			var data_src = img.getAttribute('data-src');
			//console.log("data_src: "+data_src);
			if (data_src && data_src.indexOf('http://') >= 0) {
				com.cache.getFile(data_src, function(localUrl) {
					setPath(img, localUrl);
					next();
				});
			} else {
				next();
			}
		}, function() {
			cb && cb();
		});

	};

	function setPath(img, src) {
		img.setAttribute('src', src);
		img.classList.remove("lazy");
	};

	win.lazyImg = {
		lazyLoad: function(doc, cb) {
			lazyLoad(doc ? doc : document, cb);
		},
		pageno: null
	};

})(window, common, mui);


var honey = (function(win, $) {
	var h={
		apiurl : "http://ybuser.ybyiyao.com/api/app/data/",
		apihost : "http://ybuser.ybyiyao.com",
//		apiurl : "http://192.168.11.226/api/app/data/",
//		apihost : "http://192.168.11.226",
		page:1,
		total:0,
		pageSize:10,
		contentinit: '<font style="font-size:12px;color:#999">上拉显示更多</font>',
	    contentdown: '<font style="font-size:12px;color:#999">上拉显示更多</font>',
	    contentrefresh: '<font style="font-size:12px;color:#999">正在加载...</font>',
		contentnomore:'<font style="font-size:12px;color:#999">亲,已经到底啦！</font>',
		ajaxTimeout:60000,
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
				bounce: 'vertical',
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
		//父页面隐藏的时候子页面也隐藏
		h.detailHeader.addEventListener('hide', function() {
			h.servicePage.hide()
			h.detailSubpage.hide('slide-out-right');
		});

		h.detailHeader.addEventListener('show', function() {
			h.detailSubpage.show();
		})

		h.detailHeader.append(h.detailSubpage)
	}

	/**
	 * 显示商品列表
	 * @param {Object} data
	 * @param {String} id 选择器
	 * @param {Boolean}} append 是否追加
	 * @param {Object} ad 广告图片
	 */
	h.showGoodsList = function(data, id, append, ad) {
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
			var img=h.getGoodsImgUrl(v.goods_id,v.img_id);
			li.innerHTML = '<div class="goods-list-item"><a href="#" number="' + i + '" goods_id="' + v.goods_id +
				'"><img class="mui-media-object goods-lphoneogo" data-lazyload="'+ img +'"/><div class="mui-media-body goods-info"><p class="goods-title">' +
				v.goods_name + '</p><p><span class="goods-price-one">￥' + v.shop_price + '</span><p>' +
				(v.market_price ? '<p><span class="goods-price-one">￥' + v.market_parice + '</span><p>' : '') + '</div></a></div>';
			obj.appendChild(li);
		})
		$('#' + id).imageLazyload({
			placeholder: '../images/default.png'
		});
	}
	/**
	 * 获取商品图片地址
	 * @param {Object} goodsId
	 * @param {Object} imgId
	 * @param {Object} px
	 */
	h.getGoodsImgUrl=function(goodsId,imgId,px){
		var px=px?px:150;
		return h.apihost+'/public/upload/goods/thumb/'+goodsId+'/goods_sub_thumb_'+imgId+'_'+px+'_'+px+'.jpg';
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
			str.push('<p><span class="user-name"><img data-lazyload="' + v.head_pic + '"/><font>' +
				(v.is_anonymous ? "匿名用户" : v.nickname) + '</font></span>' +
				h.getCommentStar(((v.deliver_rank + v.goods_rank + v.service_rank) / 3).toFixed(2)) +
				'<span class="user-time">' + h.getYmdTime(v.add_time) + '</span></p><p class="comment-content">' + v.content + '</p>')
			if(v.img && v.img.length > 0) {
				str.push('<p><div class="user-photo">');
				for(var j = 0; j < v.img.length; j++) {
					str.push('<img class="photos" data-lazyload="' + h.apihost + v.img[j] + '"  data-preview-src="' + h.apihost + v.img[j] + '" data-preview-group="' + i + '"  />')
				}
				str.push('</div></p>')
			}
			if(showReply) {
				if(v.replyList) {
					for(var j = 0; j < v.replyList.length; j++) {
						var reply = v.replyList[j];
						str.push('<p class="reply"><span>' +  (reply.user_id>0?"<font>客服</font> 回复":(reply.is_anonymous>0?"<a>匿名用户</a>":reply.username)+' 追加') + '：</span><span>' + reply.content + '</span></p>');
					}
				}
			}
			str.push('<p class="zan"><span class="zan_num" comment_id="' + v.comment_id + '"><img src="../images/zan.png"/> ' + v.zan_num + '</span></p>')
			li.innerHTML = str.join('');
			document.getElementById(id).appendChild(li)
		});
		//	document.body.removeAttribute('data-imagelazyload');

		$('.user-name').imageLazyload({
			placeholder: '../images/profile.png'
		});
		$('.user-photo').imageLazyload({
			placeholder: '../images/default.png'
		});
		$('.user-photo').off('tap', 'img').on('tap', 'img', function() {
			$.previewImage()
		})
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
	h.preloadWin=function(url,id,data,styles){
		return $.preload({
			id: id,
			url: url,
			styles: styles||{
				top: '0px',
				bottom: '0px',
				popGesture: 'close'
			},
			extras:data
		})
	}

	/**
	 * 打开新页面
	 * @param {Object} url
	 * @param {Object} winId
	 * @param {Object} data
	 * @param {Object} styles
	 */
	h.openWin = function(url, winId, data, styles) {
//		var newWindow = $.preload({
//			id: winId,
//			url: url,
//			styles: styles||{
//				top: '0px',
//				bottom: '0px',
//				popGesture: 'close'
//			},
//			extras:data
//		})
//		setTimeout(function() {
//			newWindow.show('slide-in-right');
//		}, 10)
//		return newWindow
		return $.openWindow({
		    url:url,
		    id:winId,
		    styles:styles,
		    extras:data,
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:200,//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		      event:'titleUpdate',//页面显示时机，默认为titleUpdate事件时显示
		      extras:{}//窗口动画是否使用图片加速
		    },
		    waiting:{
		      autoShow:false,//自动显示等待框，默认为true
		      title:'正在加载...',//等待对话框上显示的提示内容
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
	 * @param boolean isGoodsDetail 是否为商品详情页
	 */
	h.mySrcollTo=function (id, time, isGoodsDetail) {
		var y = (id ? document.getElementById(id).offsetTop - 38 : 0) + (isGoodsDetail ? 190 : 0);
		$.scrollTo(y, (time ? time : 10));
	}

	/**
	 * 根据PHP时间戳获取年月日时间
	 * @param time
	 * @returns {String}
	 */
	h.getYmdTime=function (time, showTime) {
		if(time > 0) {
			time = time * 1000;
			var dateStr = new Date(time);
			var m=(dateStr.getMonth()<9?"0":"")+(dateStr.getMonth()+1)
			var d=(dateStr.getDate()<10?"0":"")+dateStr.getDate()
			if(showTime){
				var H=(dateStr.getHours()<10?"0":"")+dateStr.getHours()
				var i=(dateStr.getMinutes()<10?"0":"")+dateStr.getMinutes()
				var s=(dateStr.getSeconds()<10?"0":"")+dateStr.getSeconds()
			}
			return dateStr.getFullYear() + '-' + m + '-' + d +
				(showTime ? (' ' + H+ ':' + i + ':' +  s):'');
		} else {
			return '末知时间';
		}
	}

	/**
	 * 转义html
	 * @param {Object} str
	 */
	h.escape2Html=function (str) {
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
	h.isPhone=function (str) {
		var myreg = /^1[34578]\d{9}$/;
		return str ? myreg.test(str) : false;
	}

	/**
	 * 去除空格
	 * @param {string} str
	 * @param {Boolean} isAll 是否全部去除
	 */
	h.trim=function (str, isAll) {
		var result;
		if(str){
			result = str.replace(/(^\s+)|(\s+$)/g, "");
			if(isAll) {
				result = result.replace(/\s/g, "");
			}
		}
		return result;
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
	h.fmoney=function (s, n) { 
		n = n > 0 && n <= 20 ? n : 2; 
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
		t = ""; 
		for (i = 0; i < l.length; i++) { 
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
		} 
		return t.split("").reverse().join("") + "." + r; 
	} 
	
	h.getStrLength = function (str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
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
    h.cutstr=function (str, len) {
        var str_length = 0;
        var str_len = 0;
        len=len||56;
        str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length < len) {
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
    h.getAddressText=function(p,data,type,tag){
    	var tag=tag||'';
		for(var i=0;i<data.length;i++){
			switch(type){
				case 1:
					if(data[i].value == p.city){
						return tag+data[i].text + h.getAddressText(p,data[i].children,2,tag)
					}
					break;
				case 2:
					if(data[i].value == p.district){
						return tag+data[i].text;
					}
					break;
				default:
					if(data[i].value == p.province){
						return data[i].text + h.getAddressText(p,data[i].children,1,tag)
					}
			}
		}
		return ''
	}
    
    h.fixFooter=function(id){
    	document.getElementById(id||'footerBar').style.top = (plus.display.resolutionHeight - 95) + "px";
    }
    
    h.swipeClose=function(_win){
    	_win.addEventListener('swiperight',function(e){
			var angle = Math.abs(e.detail.angle);
			if(angle<6){
				$.back()
			}
		})
    }
    
    $.plusReady(function(){
    	h.logoutFire=function(){
	    	if(!honey.indexWin){
	    		honey.indexWin=plus.webview.getLaunchWebview()
	    	}
	    	if(!honey.cartContent){
	    		honey.cartContent=plus.webview.getWebviewById('cart-content')
	    	}
	    	if(!honey.buyContent){
	    		honey.buyContent=plus.webview.getWebviewById('buy-content')
	    	}
	    	if(!honey.detailSubpage){
	    		honey.detailSubpage=plus.webview.getWebviewById('goods-detail')
	    	}
	    	$.fire(honey.indexWin,'logout')
	    	$.fire(honey.cartContent,'logout')
	    	$.fire(honey.buyContent,'logout')
	    	$.fire(honey.detailSubpage,'logout')
	    }
    
	    h.loginFire=function(show){
	    	if(!honey.mineWin){
	    		honey.mineWin=plus.webview.getWebviewById('mine')
	    	}
	    	$.fire(honey.mineWin,'login',{show:show})
	    }
    })
    
	return h;
}(window, mui))