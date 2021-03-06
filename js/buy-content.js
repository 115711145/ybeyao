(function(win, $, h, ms) {
	$.init();
	h.d = {
		list: document.getElementById('buy-list'),
		amount: document.getElementById('amount'),
		_submit: document.getElementById('submit'),
		_address: document.getElementById('address'),
		_ps: document.getElementById('xz_peisong'),
		psfs: document.getElementById('psfs'),
		xz_quan: document.getElementById('xz_quan'),
		quan: document.getElementById('quan'),
		sum_amount: document.getElementById('sum_amount'),
		sum_ps: document.getElementById('sum_ps'),
		ye: document.getElementById('ye'),
		jf: document.getElementById('jf'),
		qm: document.getElementById('qm'),
		blance: document.getElementById('blance'),
		point: document.getElementById('point'),
		coupon: document.getElementById('coupon'),
		quan_list: document.getElementById('quan-list'),
		yhq: document.getElementById('yhq'),
		address_list: document.getElementById('address-list'),
		address: document.getElementById('address'),
		user_address: document.getElementById('user-address'),
		xz_fdbs: document.getElementById('xz_fdbs'),
		shops_fdbs: document.getElementById('shops-fdbs'),
		fdbs_list: document.getElementById('fdbs-list'),
		fdbs: document.getElementById('fdbs')
	}
	h.order = {}
	h.cityData = JSON.parse(cityData);
	h.address_list = null;
	h.pslist = [{
		id: 1,
		name: '送货上门'
	}, {
		id: 2,
		name: '门店自取'
	}]
	h.getPeisongfs = function() {
		var li = [];
		$.each(h.pslist, function(i, v) {
			if(i == 0) {
				h.psfs = v.id
			}
			li.push('<li class="mui-table-view-cell" psid="' + v.id + '">' + v.name + '</li>')
		})
		h.d.psfs.innerHTML = li.join('')
	}
	/**
	 * 获取购物流程配置
	 */
	h.getShopConfig = function() {
		$.ajax(h.apiurl, {
			data: {
				m: 'get_config'
			},
			type: 'post',
			dataType: 'json',
			success: function(ret) {
				if(ret.code == 0 && ret.data) {
					h.config = ret.data.shopping;
					ms.setItem('conf_shopping', h.config)
				} else {
					$.toast('获取配置失败')
				}
			},
			error: function(ret) {
				$.toast('获取配置异常')
			}
		})
	}
	/**
	 * 显示订单商品列表 
	 * @param {Object} data
	 */
	h.showItemList = function(data) {
		var html = [];
		h._sum = {
			amount: 0,
			exchange_integral: 0
		}
		if(data.length > 0) {
			$.each(data, function(i, v) {
				h._sum.amount += parseFloat(v.price * v.num);
				if(v.exchange_integral) {
					h._sum.exchange_integral += parseInt(v.exchange_integral) * parseFloat(v.num)
				}
				var li = '<li><div class="goods-img fl"><img src="' + v.img + '"></div>\
	                <div class="goods-info fl"><p class="title">' + h.cutstr(v.name, 50) + '</p>\
	                    <p class="weight">' + (v.spec_name ? v.spec_name.join('  ') : '') + '</p></div>\
	                <div class="price-num fr"><p class="price">\
	                        <span>￥</span><span>' + h.fmoney(v.price) + '</span></p><p>\
	                		<span>×</span><span>' + v.num + '</span></p></div></li>';
				html.push(li)
			});
		}
		h.d.list.innerHTML = html.join('')
	}
	/**
	 * 显示金额明细与应付金额
	 */
	h.showPayAmount = function() {
		h.d.sum_amount.innerText = "￥" + h.fmoney(h._sum.amount)
		h.payAmount = h._sum.amount;
		h.conf = {};
		$.each(h.config, function(i, v) {
			h.conf[v.name] = v.value;
		});
		//是否满足免费配送
		//				alert(JSON.stringify(h.c?onfig))
		var psf = 0;
		if(h.psfs == 1) { //送货上门
			alert(JSON.stringify(h.fdbs))
			//不免运费或者未满足要求或者未选择门店或收货地址或者不在配送范围内
			if(h.conf.freight_free == 0 || h.conf.freight_free > h._sum.amount || !h.fdbs || !h.order.address || h.fdbs.district != h.order.address.district) {
				psf = 10
			}
		}
		h.payAmount += psf;
		h.d.sum_ps.innerText = "￥" + (psf > 0 ? h.fmoney(psf) : 0);
		//使用优惠券
		if(h.order.quan_code && h.order.quan_code > 0) {
			//券码
			h.payAmount -= (h.order.quan_code > h.payAmount ? h.payAmount : h.order.quan_code)
			h.d.coupon.innerText = "-￥" + h.fmoney(h.order.quan_code)
			h.d.yhq.innerText = '不使用优惠券';
		} else if(h.order.quan && h.order.quan.money > 0) {
			//优惠券
			var money = parseFloat(h.order.quan.money)
			h.d.qm.value = ''
			h.d.yhq.innerText = money + '元优惠券';
			h.d.coupon.innerText = "-￥" + h.fmoney(money)
			h.payAmount -= (money > h.payAmount ? h.payAmount : money)
		} else {
			h.d.coupon.innerText = "-￥0";
		}
		//使用积分
		if(h.d.jf.value > 0) {
			var totalPayPoint = h.payAmount * h.conf.point_rate;
			if(h.d.jf.value > totalPayPoint) {
				h.d.jf.value = totalPayPoint
			}
			h.use_jf = h.fmoney(parseInt(h.d.jf.value) / parseFloat(h.conf.point_rate));
			h.payAmount -= h.use_jf;
			h.d.point.innerText = "-￥" + h.use_jf;
		} else {
			h.d.point.innerText = "-￥0";
		}
		//使用余额
		if(h.d.ye.value > 0) {
			if(h.d.ye.value > h.payAmount) {
				h.d.ye.value = h.payAmount
			}
			h.payAmount -= h.d.ye.value;
			h.d.blance.innerText = "-￥" + h.fmoney(h.d.ye.value)
		} else {
			h.d.blance.innerText = "-￥0"
		}
		h.d.amount.innerText = "￥" + h.fmoney(h.payAmount > 0 ? h.payAmount : '0.00')
	}
	/**
	 * 获取优惠券列表
	 */
	h.getCouponList = function() {
		h.coupon = []
		$.ajax(h.apiurl, {
			data: {
				m: 'get_coupon_list',
				token: ms.getItem('token')
			},
			type: 'post',
			dataType: 'json',
			success: function(ret) {
				if(ret.code == 0) {
					if(ret.data && ret.data.length > 0) {
						var list = [];
						var time = new Date().getTime() / 1000;
						h.coupon = ret.data;
						$.each(ret.data, function(i, v) {
							if(v.use_start_time <= time && v.use_end_time > time && h._sum.amount >= v.condition) {
								list.push('<div class="quan"><div class="quan-con"><div class="fl title">' +
									'<p class="number"><font>' + parseFloat(v.money) + '</font><span>元(满' + parseFloat(v.condition) + '元可用)</span></p>' +
									'<p class="use-time">有效期至：' + h.getYmdTime(v.use_end_time) + '</p>' +
									'</div><div class="fr getquan"><p class="use-quan" i="' + i + '">立即使用</p></div></div></div>');
							}
						});
						if(list.length > 0) {
							h.d.quan_list.innerHTML = list.join('')
						} else {
							h.d.quan_list.innerHTML = '<div class="no-quan">没有可用的券</div>';
						}
					}
				} else {
					if(ret.code == 1 || ret.code == 3) {
						$.toast(ret.msg)
						honey.openWin('../mine/login.html', 'login')
						return
					}
					h.d.quan_list.innerHTML = '<div class="no-quan">没有可用的券</div>';
				}
			},
			error: function(ret) {
				//						$.toast('优惠券读取失败')
			}
		});
	}
	/**
	 * 获取收货地址列表
	 */
	h.getAddressList = function() {
		$.ajax(h.apiurl, {
			type: "post",
			async: true,
			dataType: 'json',
			data: {
				m: 'address_list',
				token: myStorage.getItem('token')
			},
			success: function(ret) {
				if(ret.code == 0) {
					h.address_list = ret.data;
				}
				h.showAddressList(h.address_list)
			},
		});
	}
	/**
	 * 选择收货地址
	 * @param {Object} v
	 */
	h.selectAddress = function(v) {
		h.order.address = v;
		if(v) {
			var address = h.getAddressText(v, h.cityData) + v.address;
			h.d.address.querySelector('.user').innerHTML = '<p><span class="name">收货人：' + v.consignee + '</span>\
					<span class="phone">电话：' + v.mobile + '</span></p>\
					<p class="address">' + address + v.address + '</p>';
			h.getShopList()
		} else {
			h.d.address.querySelector('.user').innerHTML = '<p id="no-address">添加收货地址</p>';
		}
		h.showPayAmount()
	}
	/**
	 * 显示收货地址列表
	 * @param {Object} data
	 */
	h.showAddressList = function(data) {
		var _default;
		if(data && data.length > 0) {
			var html = []
			_default = data[0];
			$.each(data, function(i, v) {
				var address = h.getAddressText(v, h.cityData) + v.address;
				if(v.is_default > 0) {
					_default = v;
				}
				html.push('<div class="address-item" address_id="' + v.address_id + '">\
                		<p><span class="name">收货人：' + v.consignee + '</span>\
							<span class="phone">电话：' + v.mobile + '</span>\
						</p><p class="address">' + address + '</p>\
						<p class="icon">\
							<span class="mui-icon mui-icon-arrowright"></span>\
						</p></div>')
			});
			h.d.address_list.innerHTML = html.join('')
		} else {
			h.d.address_list.innerHTML = ''
		}
		h.selectAddress(_default)
	}
	/**
	 * 获取门店列表
	 */
	h.getShopList = function(district) {
		h.fdbs = null;
		h.d.fdbs.innerText = "请选择门店";
		$.ajax(h.apiurl, {
			type: "post",
			async: true,
			dataType: 'json',
			data: {
				m: 'shop_list',
				district: district || h.order.address.district
			},
			success: function(ret) {
				h.shop_list = ret.data;
				h.showShopList(ret.data || false)
			},
			error: function(ret) {
				h.showShopList()
			}
		});
	}
	/**
	 * 显示门店列表
	 * @param {Object} data
	 */
	h.showShopList = function(data) {
		if(data && data.length > 0) {
			var html = []
			$.each(data, function(i, v) {
				html.push('<div class="fdbs-item" shop_id="' + v.shop_id + '">\
                		<p class="shop_name"><img src="../images/fdbs.png" height="15" /> ' + v.shop_name + '</p>\
                		<p class="shop_address">地址：' + v.shop_address + '</p></div>')
			});
			h.d.fdbs_list.innerHTML = html.join('')
		} else {
			h.d.fdbs_list.innerHTML = '<div class="no-fdbs">您附近没有可选的门店</div>';
		}
	}
	$.plusReady(function() {
		h.fixFooter()
		/**
		 * 输入余额事件
		 */
		h.d.ye.addEventListener('change', function() {
			if(h.user.ye > 0) {
				h.showPayAmount()
			} else {
				this.value = 0;
				$.toast('无可用余额')
			}
		})
		/**
		 * 输入积分事件
		 */
		h.d.jf.addEventListener('change', function() {
			if(h.user.pay_points > 0 && h._sum.exchange_integral > 0) {
				var use_jf = this.value;
				if(use_jf > h.user.pay_points) {
					use_jf = h.user.pay_points
				}
				if(use_jf > h._sum.exchange_integral) {
					use_jf = h._sum.exchange_integral;
					//		    				$.toast('订单中商品可使用积分上限为'+h._sum.exchange_integral)
				}
				this.value = use_jf;
				h.showPayAmount()
			} else {
				this.value = 0;
				$.toast(h.user.pay_points > 0 ? '订单中的商品不能使用积分兑换' : '无可用积分')
			}
		})
		/**
		 * 输入优惠券码事件
		 */
		h.d.qm.addEventListener('change', function() {
			var that = this;
			var code = that.value;
			if(code.length == 8) {
				$.ajax(h.apiurl, {
					data: {
						m: 'check_coupon_code',
						code: code,
						amount: h._sum.amount
					},
					type: 'post',
					dataType: 'json',
					success: function(ret) {
						if(ret.code == 0) {
							h.order.quan_code = parseFloat(ret.data.result)
							h.order.quan = false
							h.showPayAmount()
						} else {
							if(ret.code == -9) {
								that.value = ''
							}
							$.toast(ret.msg)
						}
					},
					error: function(ret) {
						$.toast('优惠券读取失败')
					}
				});
			} else {
				if(h.order.quan_code) {
					h.order.quan_code = 0
					h.showPayAmount()
				}
				that.value = ''
				$.toast('优惠券码不存在')
			}
		})

		/**
		 * 提交订单
		 */
		h.d._submit.addEventListener('tap', function() {
			//检测数据订单数据
			if(h.psfs == 1 && !h.order.address) {
				$.toast('未选择收货地址')
				return
			}
			if(!h.fdbs) {
				$.toast('请选择门店')
				return
			}
			alert(JSON.stringify(h.order.address))
			return
			plus.nativeUI.showWaiting('正在提交订单...')
			$.ajax(h.apiurl, {
				type: "post",
				dataType: 'json',
				async: true,
				data: {
					m: 'add_order',
					token: h.token,
					goods: h.goods,
					address: h.order.address,
					use_money: h.d.ye.value,
					use_point: h.d.jf.value,
					quan_code: h.d.qm.value,
					quan: h.order.quan
				},
				success: function(ret) {
					alert(JSON.stringify(ret))
				},
				error: function(ret) {
					alert(JSON.stringify(ret))
					$.toast('error')
				}
			});
			//	    			setTimeout(function(){
			plus.nativeUI.closeWaiting()
			alert('aa')
			//	    			},200)
		})

		/**
		 * 初始化提交订单页面
		 */
		win.addEventListener('showBuyList', function(o) {
			h.token = ms.getItem('token')
			h.user = ms.getItem('user')
			h.user.ye = parseFloat(h.user.user_money) - parseFloat(h.user.frozen_money);
			h.d.ye.setAttribute('placeholder', '您的当前余额为' + (h.user.ye || 0))
			h.d.jf.setAttribute('placeholder', '您的当前积分为' + (h.user.pay_points || 0))
			h.d.ye.blur()
			h.d.jf.blur()
			h.d.qm.blur()
			h.d.ye.value = ""
			h.d.jf.value = ""
			h.d.qm.value = ""
			h.d.yhq.innerText = '不使用优惠券';
			h.order = {}
			h.d._address.setAttribute('style', '')
			h.getPeisongfs()
			h.showItemList(h.goods = o.detail)
			h.showPayAmount()
			h.getCouponList()
			h.getAddressList()
		})

		win.addEventListener('reloadAddress', function() {
			h.getAddressList()
		})

		var nowTime = new Date().getTime();
		h.config = ms.getItem('conf_shopping')
		if(!h.config || nowTime - h.config.time > 7200000) { //3小时更新一次
			h.getShopConfig()
		}

		/**
		 * 打开门店列表
		 */
		h.d.xz_fdbs.addEventListener('tap', function() {
			$(h.d.shops_fdbs).popover('toggle')
			$('#shop-wrapper').scroll().scrollTo(0, 0, 0)
		})
		/**
		 * 选择地址
		 */
		$(h.d.address_list).on('tap', '.address-item', function() {
			var address_id = this.getAttribute('address_id')
			for(var i = 0; i < h.address_list.length; i++) {
				if(h.address_list[i].address_id == address_id) {
					h.selectAddress(h.address_list[i])
					break;
				}
			}
			$(h.d.user_address).popover('toggle')
		})

		/**
		 * 选择门店
		 */
		$(h.d.shops_fdbs).on('tap', '.fdbs-item', function() {
			var shop_id = this.getAttribute('shop_id');
			for(var i = 0; i < h.shop_list.length; i++) {
				if(shop_id == h.shop_list[i].shop_id) {
					h.fdbs = h.shop_list[i];
					h.d.fdbs.innerText = h.fdbs.shop_name;
					break;
				}
			}
			$(h.d.shops_fdbs).popover('toggle')
			h.showPayAmount()
		})
		/**
		 * 选择收货地址
		 */
		h.d._address.addEventListener('tap', function() {
			if(h.address_list && h.address_list.length > 0) {
				$(h.d.user_address).popover('toggle')
				$('#address-wrapper').scroll().scrollTo(0, 0, 0)
				h.showPayAmount()
			} else {
				h.openWin('../mine/address.html', 'address', {
					frompage: 'buy-content'
				})
			}

		})

		/**
		 * 打开配送方式列表
		 */
		h.d._ps.addEventListener('tap', function() {
			$('#peisongfs').popover('toggle');
		})

		/**
		 * 选择配送方式
		 */
		$('.psfs').on('tap', 'li', function() {
			var psid = this.getAttribute('psid');
			if(!h.psfs || h.psfs != psid) {
				h.psfs = psid;
				h.d._address.setAttribute('style', h.psfs == 1 ? '' : 'display:none');
				document.getElementById('peisong').innerText = this.innerText;
				//重新加载店铺列表
				h.getShopList(-1)
				h.showPayAmount()
			}
			$(this.parentElement.parentElement).popover('toggle');
		})
		//	    		$('.mui-scroll-wrapper').scroll();
		//打开优惠券列表
		h.d.xz_quan.addEventListener('tap', function() {
			$(h.d.quan).popover('toggle')
			$('#quan-wrapper').scroll().scrollTo(0, 0, 0)
		})

		/**
		 * 使用优惠券
		 */
		$(h.d.quan_list).on('tap', '.use-quan', function() {
			var i = this.getAttribute('i')
			if(h._sum.amount >= h.coupon[i].condition) {
				h.order.quan = h.coupon[i]
				h.order.quan_code = 0
				h.showPayAmount()
			}
			$(h.d.quan).popover('toggle')
		})

		//关闭列表 
		$('.mui-popover').on('tap', '.close-btn', function() {
			$(this.parentElement).popover('toggle')
		})

	})

}(window, mui, honey, myStorage))