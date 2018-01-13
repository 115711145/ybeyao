//(function($, window, document) {
//	window.getImgName = function(url) {
//		var arr1 = url.split('.');
//		var arr2 = arr1[0].split('/');
//		var len = arr2.length;
//		return arr2[len - 1] + '.' + arr1[1];
//	}
//	var lazyLoad = {
//		options: {
//			placeholder: '../images/default.png',
//		},
//		imageList: [],
//		/**
//		 * 异步加载
//		 * @param {Object} el
//		 */
//		load: function(el) {
//			var name = getImgName(el.getAttribute('data-lazyload'));
//			lazyLoad.imageList.push({
//				name: name,
//				el: el
//			})
//			lazyLoad.loadImg()
//		},
//		/**
//		 * 加载图片
//		 * @param {Object} el
//		 */
//		loadImg: function(el) {
//			if(lazyLoad.imageList.length > 0) {
//				var item = lazyLoad.imageList[0];
//				var img = new Image();
//				img.src = item.el.getAttribute('data-lazyload');
//				img.onload = function() {
//					item.el.setAttribute('src', img.src)
//					downLoader.down(img.src, function(localUrl) {
//						if(localUrl) {
//							lazyLoad.saveImageLocalUrl(item.name, localUrl)
//						}
//						lazyLoad.imageList.shift();
//						lazyLoad.loadImg();
//					})
//				};
//				img.onerror = function() {
//					item.el.setAttribute('src', lazyLoad.options.placeholder)
//					lazyLoad.imageList.shift();
//					lazyLoad.loadImg();
//				}
//			}
//		},
//		/**
//		 * 存储图片本地路径
//		 * @param {Object} name
//		 * @param {Object} imglocalUrl
//		 */
//		saveImageLocalUrl: function(name, imglocalUrl) {
//			myStroage.setItem('image_' + name, imglocalUrl)
//		},
//		/**
//		 * 获取图片本地路径
//		 * @param {Object} name
//		 */
//		getImageLocalUrl: function(url) {
//			var name = 'image_' + lazyLoad.getImageName(url);
//			return myStroage.getItem(name) || name;
//		},
//		getImageName: function(url) {
//			var arr1 = url.split('.');
//			var arr2 = arr1[0].split('/');
//			var len = arr2.length;
//			return arr2[len - 1] + '.' + arr1[1];
//		}
//	};
//	var downLoader = {
//		options: {
//			path: '_downloads/',
//			method: 'GET',
//		},
//		set: function(options) {
//			downLoader.options.extend({
//				options
//			})
//		},
//		/**
//		 * 获取图像名称
//		 * @param {Object} url
//		 */
//		//			getImgName: function(url) {
//		//				var arr1 = url.split('.');
//		//				var arr2 = arr1[0].split('/');
//		//				var len = arr2.length;
//		//				return arr2[len - 1] + '.' + arr1[1];
//		//			},
//		/**
//		 * 创建下载
//		 * @param {Object} url
//		 * @param {Object} cbFn
//		 * @param {Object} changeFn
//		 */
//		down: function(url, cbFn, changeFn) {
//			var task = plus.downloader.createDownload(url, downLoader.options, function(d, status) {
//				// 下载完成
//				if(status == 200) {
//					plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
//						cbFn(entry.toLocalURL()); //获取当前下载路径
//					});
//				} else {
//					cbFn()
//				}
//			});
//			task.addEventListener("statechanged", function(task, status) {
//				if(status == 404) {
//					cbFn()
//				} else {
//					changeFn && changeFn(task)
//				}
//			})
//			task.start();
//			return task;
//		},
//	};
//	window.lazyLoad = lazyLoad;
//	window.downloader = downLoader;
//})(mui, window, document);