;(function($){

	var Tab = function(tab){
		
		var _this_ = this;//

		//保存传过来的tab对象
		this.tab = tab;

		//默认配置参数
		this.config = {
			"triggerType" : "click",		//用来定义鼠标的出发类型
			"effect" : "default",			//用来定义切换效果
			"invoke" : 1,					//默认展示第几个tab
			"auto" : false					//用来定义自动切换
		}

		//如果配置参数存在，就扩展到默认的参数
		if( this.getConfig() ){
			$.extend( this.config,this.getConfig() );
		}

		//保存tab标签列表、保存对应的内容列表
		this.tabItems = this.tab.find('ul.tab-nav li');
		this.contentItems = this.tab.find('div.content-wrap div.content-item');

		//保存定义的config
		var config = this.config;

		//判读页面传过来的配置（triggerType）
		if( config.triggerType === 'click' || config.triggerType != 'mouseover'){
			this.tabItems.bind('click',function(){
				_this_.invoke($(this));
			});
		}else if(config.triggerType === 'mouseover' ){
			this.tabItems.bind(config.triggerType,function(){
				_this_.invoke($(this));
			});
		}

		// 自动切换功能 可以根据指定的实践进行切换
		if( config.auto ){
			// 定义一个全局的定时器
			this.timer = null;

			//定义一个计数器
			this.loop = 0;

			this.autoPlay();

			this.tab.hover(function(){
				window.clearInterval(_this_.timer);
			},function(){
				_this_.autoPlay();
			})
		};

		// 设置默认显示第几个tab
		if( config.invoke > 1 ){
			this.invoke( this.tabItems.eq(config.invoke-1));
		}
	};

	Tab.prototype = {

		//自动间隔时间切换
		autoPlay:function(){

			var _this_ = this;

			tabItems = this.tabItems;			//临时保存tab列表
			tabLength = tabItems.size();		//tab个数
			config = this.config;

			this.timer = window.setInterval(function(){
				
				_this_.loop++;		//计数器++

				if( _this_.loop >= tabLength ){
					_this_.loop = 0;
				};
				tabItems.eq(_this_.loop).trigger(config.triggerType);
			},config.auto);
		},
		
		//事件驱动函数
		invoke:function( currentTab ){
			
			var _this_ = this;

			var index = currentTab.index();//索引

			//要执行Tab的选中状态，当前选中的加上active（标记为白底）
			//切换对应的tab内容，要根据配置参数的effect是default还是fade
			
			//tab选中状态
			currentTab.addClass('actived').siblings().removeClass('actived');

			//根据效果切换页面的内容区域
			var effect = this.config.effect;
			var conItems = this.contentItems;

			if( effect === 'fade'){
				conItems.eq(index).fadeIn().siblings().fadeOut();
			}else if( effect === 'default' || effect != 'fade'){
				conItems.eq(index).addClass('current').siblings().removeClass('current');
			};

			//
			if(this.config.auto){
				this.loop = index;
			}
		},

		//获取配置参数
		getConfig:function(){
			//拿一下tab elements节点传过来的data-config
			var config = this.tab.attr("data-config");
			//确保有配置参数传过来
			if( config && config != ""){
				return $.parseJSON(config);
			}else{
				return {};
			}
		},

		
	}

	window.Tab = Tab;

})(jQuery);