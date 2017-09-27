var apiurl="http://192.168.11.226/api/app/data";
var apihost="http://192.168.11.226";
var honey={
	page:1,
	total:0,
	pageSize:10,
	contentinit: '<font style="font-size:12px;color:#999">上拉显示更多</font>',
    contentdown: '<font style="font-size:12px;color:#999">上拉显示更多</font>',
    contentrefresh: '<font style="font-size:12px;color:#999">正在加载...</font>',
	contentnomore:'<font style="font-size:12px;color:#999">亲,已经到底啦！</font>',
	ajaxTimeout:60000,
}

Element.prototype.hasClass = function(className){
    var i,len,temp = this.className.split(" ");
    for(i = 0,len = temp.length; i < len; i++){
        if(className == temp[i]){
            return true;
        }
    }
    return false;
}

function preloadGoodsDetail(extras){
	//商品详情头部
	honey.detailHeader =  mui.preload({
		id:'goods-header',
		url:'goods/goods-header.html',
			styles:{
			top:'0px',
			bottom:'0px'
		},
		extras:extras
	})
	honey.detailHeader.hide()
	//商品详情内容
	honey.detailSubpage =  mui.preload({
		id:'goods-detail',
		url:'goods/goods-detail.html',
		styles:{
			top: '44px',
			bottom: 0,
			bounce: 'vertical',
			bounceBackground:'#f8f8f8',
			scrollIndicator:'none'
		},
		extras:extras
	})
	honey.detailSubpage.hide()
	//遮罩层头部
//	honey.maskHeader=mui.preload({
//		id:'mask-header',
//		url:'goods/mask-header.html',
//		styles:{
//			top:0,
//			scrollIndicator:'none',
//			opacity:0.6
//		}
//	})
//	
//	honey.maskHeader.hide();
//	
//	//优惠券内容页面
//	honey.detailQuan=mui.preload({
//		id:'goods-quan',
//		url:'goods/goods-quan.html',
//		styles:{
//			top:'220px',
//			bottom:0,
//			scrollIndicator:'none',
//			bounceBackground:'#f8f8f8',
//		},
//	})
//	honey.detailQuan.hide()
//	//产品参数页面
//	honey.detailParam=mui.preload({
//		id:'goods-param',
//		url:'goods/goods-param.html',
//		styles:{
//			top:'220px',
//			bottom:0,
//			scrollIndicator:'none',
//			bounceBackground:'#f8f8f8',
//		},
//	})
//	honey.detailParam.hide()
//	
//	honey.detailParam.addEventListener('hide',function(){
//		honey.maskHeader.hide()
//	})
//	
//	honey.detailQuan.addEventListener('hide',function(){
//		honey.maskHeader.hide()
//	});
	//父页面隐藏的时候子页面也隐藏
	honey.detailHeader.addEventListener('hide',function(){
		honey.detailSubpage.hide();
//		honey.maskHeader.hide()
//		honey.detailQuan.hide()
//		honey.detailParam.hide()
	});
	
	honey.detailHeader.addEventListener('show',function(){
		honey.detailSubpage.show();
	})
	
	honey.detailHeader.append(honey.detailSubpage)
}


/**
 * 显示商品列表
 * @param {Object} data
 * @param {String} id 选择器
 * @param {Boolean}} append 是否追加
 * @param {Object} ad 广告图片
 */
function showGoodsList(data,id,append,ad){
	var obj = document.getElementById(id);
//	!append&&(obj.innerHTML='')
	if(ad){
		var li=document.createElement('li');
		li.className="ad";
		li.innerHTML='<img src="'+ad.src+'"/>';
		obj.appendChild(li);
	}
	mui.each(data,function(i,v){
		var li=document.createElement('li');
		li.className="mui-table-view-cell mui-media mui-col-xs-6 goods-list";
		li.innerHTML='<div class="goods-list-item"><a href="#" number="' + i + '" goods_id="'+v.goods_id
		+'"><img class="mui-media-object goods-lphoneogo" src="../images/default.png" data-lazyload="' + apihost
		+ v.sub_image + '_150_150.jpg"/><div class="mui-media-body goods-info"><p class="goods-title">'
		+v.goods_name +'</p><p><span class="goods-price-one">￥'+v.shop_price+'</span><p>'
		+(v.market_price?'<p><span class="goods-price-one">￥'+v.market_parice+'</span><p>':'')+'</div></a></div>';
        obj.appendChild(li);
	})
	mui('#'+id).imageLazyload({
		placeholder: '../images/default.gif'
	});
}

/**
 * 显示评价列表
 * @param {Object} list 数组对象
 * @param {String} id  选择器
 */
function showCommentList(list,id){
	var obj=mui('#'+id);
	mui.each(list, function(i,v) {
		var li=document.createElement('li');
		li.className="evaluate-list-item";
		var str=[];
		str.push('<p><span class="user-name"><img src="../images/profile.png" data-lazyload="'+v.head_pic+'"/><font>'
		+(v.is_anonymous?"匿名用户":v.nickname)+'</font></span>'
		+getCommentStar(((v.deliver_rank+v.goods_rank+v.service_rank)/3).toFixed(2))
		+'<span class="user-time">'+getYmdTime(v.add_time)+'</span></p><p class="comment-content">'+v.content+'</p>')
		if(v.img && v.img.length>0){
			str.push('<p><div class="user-photo">');
			for(var j=0;j<v.img.length;j++){
				str.push('<img class="photos" data-lazyload="'+apihost+v.img[j]+'"  data-preview-src="'+apihost+v.img[j]+'" data-preview-group="'+i+'"  />')
			}
			str.push('</div></p>')
		}
		li.innerHTML=str.join('');
		document.getElementById(id).appendChild(li)
	});
	document.body.removeAttribute('data-imagelazyload');
	obj.imageLazyload({
		placeholder: '../images/default.png'
	});
	
	mui('.user-photo').off('tap','img').on('tap','img',function(){
		mui.previewImage()
	})
}
/**
 * 返回评价星级 
 * @param {Number} s 平均得分
 */
function getCommentStar(s){
	var star=[];
	for(var i=0;i<5;i++){
		star.push('<i class="mui-icon mui-icon '+(s>i?(s<(i+1)?'mui-icon-starhalf':'mui-icon-star-filled'):'mui-icon-star')+'"></i>')
	}
	return '<span class="user-star">'+star.join('')+'</span>';
}

/**
 * 预加载商品列表
 */
function preloadGoodsListWin(){
	//商品列表头部
	honey.goodsListHeader =  mui.preload({
		id:'goods-list-header',
		url:'goods/goods-list-header.html',
			styles:{
			top:'0px',
			bottom:'0px',
		},
	})
	honey.goodsListHeader.hide()
	
	//商品列表内容
	honey.goodsList =  mui.preload({
		id:'goods-list',
		url:'goods/goods-list.html',
			styles:{
			top:'74px',
			bottom:0
		},
	})
	honey.goodsList.hide()
	
	honey.goodsListHeader.addEventListener('hide',function(){
		honey.goodsList.hide()
	})
	
	honey.goodsListHeader.append(honey.goodsList)
}

/**
 * 打开新页面
 * @param {Object} url
 * @param {Object} winId
 * @param {Object} data
 * @param {Object} styles
 */
function openWin(url,winId,data,styles){
	var newWindow=mui.preload({
		id:winId,
		url:url,
		styles:{
			top:'0px',
			bottom:'0px',
			popGesture:'close'
		},
	})
	setTimeout(function(){
		newWindow.show('slide-in-right');
	},10)
	
//	mui.openWindow({
//	    url:url,
//	    id:winId,
//	    styles:styles,
//	    extras:data,
//	    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
//	    show:{
//	      autoShow:true,//页面loaded事件发生后自动显示，默认为true
//	      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
//	      duration:200,//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
//	      event:'titleUpdate',//页面显示时机，默认为titleUpdate事件时显示
//	      extras:{}//窗口动画是否使用图片加速
//	    },
//	    waiting:{
//	      autoShow:false,//自动显示等待框，默认为true
//	      title:'正在加载...',//等待对话框上显示的提示内容
//	    }
//	})
}

/**
 * 关闭窗口
 * @param {Object} id
 */
function closeWin(id,timeOut){
	var w=plus.webview.getWebviewById(id);
	if(w){
		setTimeout(function(){
			w.close()
		},timeOut?timeOut:10)
	}
}

/**
 * 滚动
 * @param string id 选择器
 * @param int time 时间
 * @param boolean isGoodsDetail 是否为商品详情页
 */
function mySrcollTo(id,time,isGoodsDetail){
	var y=(id?document.getElementById(id).offsetTop:0)+(isGoodsDetail?190:0);
	mui.scrollTo(y,(time?time:10));
}

/**
 * 根据PHP时间戳获取年月日时间
 * @param time
 * @returns {String}
 */
function getYmdTime(time,showTime){
	if(time > 0){
		time=time*1000;
		var dateStr = new Date(time);
		return dateStr.getFullYear() + '-' + (dateStr.getMonth()+1) +'-' + dateStr.getDate() 
		+ (showTime?(' '+ dateStr.getHours() + ':' + dateStr.getMinutes() + ':' + (dateStr.getSeconds()>9?dateStr.getSeconds():'0'+dateStr.getSeconds())):"");
	}else{
		return '末知时间';
	}
}

/**
 * 转义html
 * @param {Object} str
 */
function escape2Html(str) { 
	var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
	return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
} 

/**
 * 判断是否为电话号码
 * @param {Object} str
 */
function isPhone(str){
	var myreg = /^1[34578]\d{9}$/; 
	return str?myreg.test(str):false;
}

/**
 * 去除空格
 * @param {string} str
 * @param {Boolean} isAll 是否全部去除
 */
function trim(str,isAll){ 
	var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(isAll)
    {
        result = result.replace(/\s/g,"");
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
function getDeviceInfo(){
	honey.deviceInfo={
		model:plus.device.model,
		vender:plus.device.vendor,
		imei:plus.device.imei,
		uuid:plus.device.uuid,
		screen:plus.screen.resolutionWidth*plus.screen.scale+'*'+plus.screen.resolutionHeight*plus.screen.scale,
		dpi:plus.screen.dpiX+'*'+plus.screen.dpiY,
		imsi:''
	}
	for ( i=0; i<plus.device.imsi.length; i++ ) {
        honey.deviceInfo.imsi += plus.device.imsi[i];
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
function getSysInfo() {
	var types = {};
    types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
    types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
    types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
    types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
    types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
    types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
    types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
	honey.systemInfo={
		name:plus.os.name,
		version:plus.os.version,
		language:plus.os.language,
		vendor:plus.os.vendor,
		network:types[plus.networkinfo.getCurrentType()]
	};
}

/**
 * 加密
 * @param {string} str
 */
function encryptString(str){
		var pub_key="-----BEGIN PUBLIC KEY-----\
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
function decryptString(str){
		var pri_key="-----BEGIN RSA PRIVATE KEY-----\
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
