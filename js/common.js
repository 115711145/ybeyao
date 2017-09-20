var apiurl="http://192.168.11.226/api/app/data";
var apihost="http://192.168.11.226";
var honey={
	page:1,
	total:0,
	pageSize:10,
	contentnomore:'亲，已经到底了哦！'
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
 * @param string id 选择器
 * @param boole append 是否追加
 */
function showGoodsList(data,id,append){
	var obj = document.getElementById(id);
//	!append&&(obj.innerHTML='')
	mui.each(data,function(i,v){
		var li=document.createElement('li');
		li.className="mui-table-view-cell mui-media mui-col-xs-6 goods-list";
		li.innerHTML='<div class="goods-list-item"><a href="#" number="' + i + '" goods_id="'+v.goods_id
		+'"><img class="mui-media-object goods-logo" src="../images/default.png" data-lazyload="' + apihost 
		+ v.sub_image + '_150_150.jpg"/><div class="mui-media-body goods-info"><p class="goods-title">'
		+v.goods_name +'</p><p><span class="goods-price-one">￥'+v.shop_price+'</span><p>'
		+(v.market_price?'<p><span class="goods-price-one">￥'+v.market_parice+'</span><p>':'')+'</div></a></div>';
        obj.appendChild(li);
	})
	mui('#'+id).imageLazyload({
		placeholder: '../images/default.gif'
	});
}


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


function openWin(url,winId,data,styles){
	mui.openWindow({
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
	      autoShow:true,//自动显示等待框，默认为true
	      title:'正在加载...',//等待对话框上显示的提示内容
	    }
	})
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

