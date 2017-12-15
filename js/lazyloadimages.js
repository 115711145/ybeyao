!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);
/**
 * 图片懒加载
 * @param {Object} obj DOMElement
 * @param {Function} callback 加载完成回调函数
 * 
 * @author fanrong33
 * @version 1.1.0 build 20160107
 */
function lazyload(obj, callback) {
	var debug = true; // 默认打印调试日志
	if(obj.getAttribute('data-loaded')) {
		return;
	}

	var image_url = obj.getAttribute('data-lazyload');
	debug && console.log(image_url);

	// 1. 转换网络图片地址为本地缓存图片路径，判断该图片是否存在本地缓存
	// http://...jpg -> md5
	// 缓存目录 _downloads/image/(md5).jpg
	var image_md5 = md5(image_url);
	var local_image_url = '_downloads/image/' + image_md5 + '.jpg'; // 缓存本地图片url
	var absolute_image_path = ""; // 平台绝对路径
	plus.io.resolveLocalFileSystemURL(local_image_url, function(entry) {
		absolute_image_path = entry.toRemoteURL();
		var temp_img = new Image();
		entry.file(function(file) {
			var totalSize = localStorage.getItem(image_md5 + "totalSize");
			debug && console.log(file.size + " " + totalSize);
			if(file && file.size == totalSize) {
				//此时文件是完整的，可以直接进行展示。
				debug && console.log('存在本地缓存图片文件' + local_image_url + '，直接显示');

				// 1.1 存在，则直接显示（本地已缓存，不需要淡入动画）
				obj.setAttribute('src', absolute_image_path);
				obj.setAttribute('data-loaded', true);
				obj.classList.add('img-lazyload');
				callback && callback(obj);
			} else {
				//文件没有下载完整，进行下载处理。
				debug && console.log('不存在本地缓存图片文件');

				// 1.2 下载图片缓存到本地
				debug && console.log('开始下载图片' + image_url + ' 缓存到本地: ' + local_image_url);
				download_img(image_url, local_image_url, image_md5, obj, callback);
			}
		});
	}, function(Ex) {
		//文件不存在，进行下载处理。
		debug && console.log('不存在本地缓存图片文件');
		// 1.2 下载图片缓存到本地
		debug && console.log('开始下载图片' + image_url + ' 缓存到本地: ' + local_image_url);
		download_img(image_url, local_image_url, image_md5, obj, callback);
	});
}

/**
 * 
 * @param {Object} image_url 文件下载地址
 * @param {Object} local_image_url 文件本地缓存地址
 * @param {Object} image_md5 文件名md5加密
 * @param {Object} obj img对象
 * @param {Object} callback 回调方法
 */
function download_img(image_url, local_image_url, image_md5, obj, callback) {
	var download_task = plus.downloader.createDownload(image_url, {
		filename: local_image_url // filename:下载任务在本地保存的文件路径
	}, function(download, status) {
		localStorage.setItem(image_md5 + "totalSize", download.totalSize);
		if(status != 200) {
			// 下载失败,删除本地临时文件
			debug && console.log('下载失败,status' + status);
			if(local_image_url != null) {
				plus.io.resolveLocalFileSystemURL(local_image_url, function(entry) {
					entry.remove(function(entry) {
						debug && console.log("临时文件删除成功" + local_image_url);
						// 重新下载图片
						download_img();
					}, function(e) {
						debug && console.log("临时文件删除失败" + local_image_url);
					});
				});
			}
		} else if(status === 200) {
			// 把下载成功的图片显示
			// 将本地URL路径转换成平台绝对路径
			obj.setAttribute('src', plus.io.convertLocalFileSystemURL(local_image_url));
			obj.setAttribute('data-loaded', true);
			obj.classList.add('img-lazyload');
			callback && callback(obj);
		}
	});
	download_task.start();
}