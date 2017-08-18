function preloadGodosDetail(){
	honey.detailHeader =  mui.preload({
		id:'goods-header',
		url:'goods/goods-header.html',
			styles:{
			top:'0px',
			bottom:'0px'
		},
		extras:{
			mtype:'main_first'
		}
	})
	honey.detailHeader.hide()
	
	honey.detailSubpage =  mui.preload({
		id:'goods-sub',
		url:'goods/goods-detail.html',
		styles:{
			top: '44px',
			bottom: '51px',
			bounce: 'vertical',
			bounceBackground:'#f8f8f8',
			scrollIndicator:'none'
		},
		extras:{
			mtype:'sub_first'
		}
	})
	honey.detailSubpage.hide()
	
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
	
	honey.detailQuan=mui.preload({
		id:'goods-quan',
		url:'goods/goods-quan.html',
		styles:{
			top:'220px',
			bottom:0,
			scrollIndicator:'none',
		},
	})
	honey.detailQuan.hide()
	
	honey.detailQuan.addEventListener('hide',function(){
		honey.maskHeader.hide()
	});
	honey.maskHeader.addEventListener('hide',function(){
		honey.detailQuan.hide('slide-in-bottom',500)
	});
	honey.maskHeader.addEventListener('show',function(){
		honey.detailQuan.show('slide-in-bottom',500)
	});
	//父页面隐藏的时候子页面也隐藏
	honey.detailHeader.addEventListener('hide',function(){
		honey.detailSubpage.hide();
		honey.maskHeader.hide()
		honey.detailQuan.hide()
	});
	honey.detailHeader.append(honey.detailSubpage)
}
