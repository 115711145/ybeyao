var apiurl="http://192.168.11.226/api/app/data";
var apihost="http://192.168.11.226";


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
			bottom: '51px',
			bounce: 'vertical',
			bounceBackground:'#f8f8f8',
			scrollIndicator:'none'
		},
		extras:extras
	})
	honey.detailSubpage.hide()
	//遮罩层头部
	honey.maskHeader=mui.preload({
		id:'mask-header',
		url:'goods/mask-header.html',
		styles:{
			top:0,
			scrollIndicator:'none',
			opacity:0.6
		}
	})
	
	honey.maskHeader.hide();
	
	//优惠券内容页面
	honey.detailQuan=mui.preload({
		id:'goods-quan',
		url:'goods/goods-quan.html',
		styles:{
			top:'220px',
			bottom:0,
			scrollIndicator:'none',
			bounceBackground:'#f8f8f8',
		},
	})
	honey.detailQuan.hide()
	//产品参数页面
	honey.detailParam=mui.preload({
		id:'goods-param',
		url:'goods/goods-param.html',
		styles:{
			top:'220px',
			bottom:0,
			scrollIndicator:'none',
			bounceBackground:'#f8f8f8',
		},
	})
	honey.detailParam.hide()
	
	honey.detailParam.addEventListener('hide',function(){
		honey.maskHeader.hide()
	})
	
	honey.detailQuan.addEventListener('hide',function(){
		honey.maskHeader.hide()
	});
	//父页面隐藏的时候子页面也隐藏
	honey.detailHeader.addEventListener('hide',function(){
		honey.detailSubpage.hide();
		honey.maskHeader.hide()
		honey.detailQuan.hide()
		honey.detailParam.hide()
	});
	
	honey.detailHeader.addEventListener('show',function(){
		honey.detailSubpage.show();
	})
	
	honey.detailHeader.append(honey.detailSubpage)
}
