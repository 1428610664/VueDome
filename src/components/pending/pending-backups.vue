<template>

	<div class="content">
		<div class="waitfor-head b">
			<tab :line-width="1">
				<tab-item :selected="currentIndex == 0" @on-item-click="onTabItemClick">默认时间</tab-item>
				<tab-item :selected="currentIndex == 1" @on-item-click="onTabItemClick">一周内</tab-item>
				<tab-item :selected="currentIndex == 2" @on-item-click="onTabItemClick">上周</tab-item>
				<tab-item :selected="currentIndex == 3" @on-item-click="onTabItemClick">自定义</tab-item>
			</tab>
		</div>

		<scroll class="waitfor-wrapper" ref="scrollView" :data="content" :pullup="true" @scrollToEnd="scrollToEnd"
			 :listenScroll="true"
			 @pullRefresh="pullRefresh">
			<ul class="waitfor-list">
				<li class="waitfor-item b" v-for="(item, index) in content">
					<div class="item-info" @click="onItemClick(item)">
						<div class="pic-wrapper"><img v-lazy="loadImg" width="100%" height="100%" /></div>
						<div class="info">
							<p class="title fz16 hzline1">{{item.Title}}</p>
							<div class="sundry clear">
								<div class="launch hzline1">发起：<span class="c1">{{item.ApplyName}}</span></div> <span class="status" :class="_parseState(item.State)">{{_parseState(item.State, true)}}</span><span class="time fr c2">{{_parseTime(item.CreatTime)}}</span></div>
						</div>
						<div class="more"  @click.stop="toggleClick($event)"><i class="icon c4 fz14 iconfont icon-arrow_top"></i></div>
					</div>
					<div class="item-desc fz13">
						<p class="desc-line"><span class="c4">主题：</span>{{item.FlowModelName}}</p>
						<p class="desc-line"><span class="c4">流程类别：</span>{{item.PageName}}</p>
						<p class="desc-line"><span class="c4">当前环节：</span>{{item.NodeNames}}</p>
						<p class="desc-line"><span class="c4">请求日期：</span>{{_parseTime(item.ApplyDate)}}</p>
						<p class="desc-line"><span class="c4">紧急程度：</span>{{_parseDegree(item.UrgenLevel)}}</p>
						<a href="javascript:void(0)" @click="onItemClick(item)" class="btn-active item-btn b1 c fz16">前往处理</a>
					</div>
				</li>
				<loading :title="loadText" v-show="isShowPull" :layout="true"></loading>
			</ul>
			
			<div class="loading-container">
				<loading v-show="!isInitEnd"></loading>
				<error v-show="loadingError"></error>
				<not-result v-show="isInitEnd && !content.length && !loadingError""></not-result>
			</div>
			
			<div class="ct fz14 loaded" v-show="this.content.length >= this.totalCount && isLoadEnd && this.content.length > 10">- 已加载完毕 -</div>
		</scroll>
		
		<div v-transfer-dom>
		    <popup v-model="selCustomTime" position="bottom"  :hide-on-blur="false">
		    	<header class="b fbox">
					<div class="head-lef fz14 c2" @click="closeCustomTime">取消</div>
					<div class="head-cont ct fz16 c1"></div>
					<div class="head-rig fz14 c1" @click="confirmCustomTime">确定</div>
				</header>
		        <group label-width="6em" label-margin-right="1em" label-align="right">
		           		<datetime title="开始时间：" v-model="customStartDate" @on-change="sDateChange" value-text-align="left"></datetime>
						<datetime title="结束时间：" v-model="customEndDate" @on-change="eDateChange" value-text-align="left"></datetime>
		        </group>
		        <div style="height: 46px;" class="b"></div>
		    </popup>
		</div>
		
		<router-view></router-view>
	</div>

</template>

<script>
	import Loading from 'base/loading/loading'
	import Scroll from 'base/scroll/scroll2'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'
	import { Tab, TabItem, TransferDom, Popup, Group, Datetime } from 'vux'
	import $ from 'jquery'
	import utils from 'common/js/utils'
	import GetWeekDate from 'common/js/WeekDate'
	import { getTaskList } from 'api/pending'
	import { Toast } from 'common/js/H5Utils'
	import {mapGetters} from 'vuex'


	let $data = null
	export default {
		directives: {
		    TransferDom
		},
		data() {
			return {
				loadImg: "http://192.168.0.188:8081/UpLoads/49D7CC924CC548AEA4EB60677AB75318/test.png",
				selCustomTime: false,
				customStartDate: '',
				customEndDate: '',
				
				pageNo: 1,
				pageSize: 10,
				beginTime: '',
				endTime: '',
				totalCount: 0,
				oldIndex: 0,
				currentIndex: 0,

				content: [],
				// 是否上拉数据加载中
				isPullLoaded: false,
				// 是否显示加载更多
				isShowPull: false,
				// 是否加载完毕数据
				isLoadEnd: false,
				// 是否初始化
				isInitEnd: false,
				// 加载失败
				loadingError: false,
				loadText: "加载更多..."
			}
		},
		computed: {
			...mapGetters([
				'isLogin',
			])
		},
		methods: {
			pullRefresh(){
				setTimeout(() => {
					this.getTaskList(true)
				}, 800)
			},
			closeCustomTime(){
				this.selCustomTime = false
				this.currentIndex = this.oldIndex
			},
			confirmCustomTime(){
				if(utils.isEmpty(this.customStartDate)){
					Toast("请选择开始时间")
					return
				}
				if(utils.isEmpty(this.customEndDate)){
					Toast("请选择开始时间")
					return
				}
				this.selCustomTime = false
				this.beginTime = this.customStartDate
				this.endTime = this.customEndDate
				this.onTabItemClick()
			},
			sDateChange(val) {
				let date = val.replace("-", "").replace("-", "") * 1
				if(this.customEndDate) {
					let eTiem = this.customEndDate.replace("-", "").replace("-", "") * 1
					if(date >= eTiem) {
						Toast('开始时间不能大于结束时间')
						setTimeout(() => {
							this.customStartDate = ''
						}, 10)
						return
					}
				}
				this.customStartDate = val
			},
			eDateChange(val) {
				let date = val.replace("-", "").replace("-", "") * 1
				if(this.customStartDate) {
					let sTiem = this.customStartDate.replace("-", "").replace("-", "") * 1
					if(date <= sTiem) {
						Toast('结束时间不能小于开始时间')
						setTimeout(() => {
							this.customEndDate = ''
						}, 10)
						return
					}
				}
				this.customEndDate = val
			},
			onTabItemClick(index) {
				this.oldIndex = this.currentIndex
				if(index != 3){
					if(index == this.currentIndex)return
				}
				this.currentIndex = index
				let Week = new GetWeekDate(Date.now())
				if(index == 0){
					this.beginTime = ''
					this.endTime = ''
				}else if(index == 1){
					this.beginTime = Week.getWeekStartDate()
					this.endTime = Week.getWeekEndDate()
				}else if(index == 2){
					this.beginTime = Week.getBeforeWeekStartDate()
					this.endTime = Week.getBeforeWeekEndDate()
				}else if(index == 3){
					this.selCustomTime = true
					return
				}
				this.isLoadEnd = false
				this.pageNo = 1
				this.getTaskList()
			},
			toggleClick(e){
				let _target = e.currentTarget
				let _this = this
				let target = $(_target).parent()
				var flag = target.next().is(":hidden")
				if(flag) {
					target.find(".more .icon").addClass("on")
					target.next().animate({
						height: 'show'
					}, 300, function() {
						setTimeout(() => {
							_this.$refs.scrollView.refresh()
						}, 20)
					}).end().parents("li").siblings().find(".item-desc").hide(300, function() {
						target.prev().find(".more .icon").removeClass("on")
						setTimeout(() => {
							_this.$refs.scrollView.refresh()
						}, 20)
					})
				} else {
					target.find(".more .icon").removeClass("on")
					target.next().animate({
						height: 'hide'
					}, 300, function() {
						setTimeout(() => {
							_this.$refs.scrollView.refresh()
						}, 20)
					})
				}
			},
			onItemClick(item) {
				this.$router.push({path: '/pending/outsourcemanage',query:{flowid: item.FlowId, flowpageid: item.PageId,flowmodelid: item.FlowModelId, title: item.PageName}})
			},
			getTaskList(mark) {
				if(mark){
					this.pageNo = 1
					this.pageSize = 10
				}
				getTaskList({
					pageindex: this.pageNo,
					pagesize: this.pageSize,
					beginTime: this.beginTime,
					endTime: this.endTime
				}).then((data) => {
					if(mark){
						this.isLoadEnd = false
						this.$refs.scrollView.endPullDowmToRefresh()
						this.isShowPull = true
					}
					
					this.totalCount = data.Data.PageInfo.TotalCount
					this.content = this.pageNo == 1 ? data.Data.List : this.content.concat(data.Data.List)

					if(this.content.length > 0) this.isShowPull = true
					this.isInitEnd = true
					this.isPullLoaded = false
					this.loadingError = false

					if(this.content.length >= this.totalCount) {
						this.isLoadEnd = true
						this.isShowPull = false
					}
				}, (error) => {
					this.loadingError = true
					this.isInitEnd = true
					if(mark)this.$refs.scrollView.endPullDowmToRefresh()
				})
			},
			scrollToEnd() {
				if(this.content.length == 0 || this.isLoadEnd) {
					return
				}
				if(this.isPullLoaded) {
					return
				}
				this.isPullLoaded = true
				this.pageNo++
				this.getTaskList()
			},
			_parseTime(data) {
				return utils.getDate(data)
			},
			_parseState(state, mark) {
				switch(state) {
					case 0:
						return mark ? "未开始" : "c2"
						break
					case 1:
						return mark ? "已开始" : "c6"
						break
					case 2:
						return mark ? "已结束" : "c5"
						break
				}
			},
			_parseDegree(state) {
				switch(state) {
					case "01":
						return "平等"
						break
					case "02":
						return "急件"
						break
					case "03":
						return "加急"
						break
					default:
						return state
				}
			}
		},
		activated(){
			if(!this.isInit){
				$data = JSON.parse(JSON.stringify(this.$data))
				this.isInit = true
				setTimeout(() => {
					this.getTaskList()
				}, 800)
			}
		},
		watch: {
			'$route' (to, from) {
				if(to.path == "/pending"){
					setTimeout(() => {
						this.$refs.scrollView.refresh()
					},20)
				}
			},
			isLogin(login){
				if(!login){
					this.isInit = false
					for(var k in this.$data){
						this[k] = $data[k]
					}
				}
			}
		},
		components: {
			Tab,
			TabItem,
			Loading,
			Error,
			Scroll,
			NotResult,
			Popup, Group, Datetime
		}
	}
</script>

<style scoped>
	
	.content {
		margin-top: 46px;
		position: absolute;
		width: 100%;
		min-height: calc( 100% - 96px);
	}
	
	.waitfor-head {
		position: fixed;
		top: 46px;
		left: 0;
		z-index: 8;
		width: 100%;
	}
	
	.waitfor-head li.on {
		color: #3D5C99;
		font-weight: 700;
	}
	
	.waitfor-wrapper {
		position: fixed;
		top: 90px;
		bottom: 50px;
		left: 0;
		width: 100%;
	}
	
	.waitfor-list .waitfor-item {
		border-top: 1px solid #f8f9fd;
	}
	
	.waitfor-list .waitfor-item:nth-child(n+2) {
		margin-top: 6px;
	}
	
	.waitfor-list .waitfor-item .item-info {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		padding: 5px 0 5px 3%;
		border-bottom: 1px solid #f8f9fd;
	}
	
	.waitfor-list .waitfor-item .pic-wrapper {
		-webkit-flex: 0 0 60px;
		-ms-flex: 0 0 60px;
		flex: 0 0 60px;
		height: 60px;
	}
	
	.waitfor-list .waitfor-item .more {
		-webkit-flex: 0 0 20px;
		-ms-flex: 0 0 20px;
		flex: 0 0 20px;
		height: 60px;
		line-height: 60px;
		padding:0 3% 0 5px;
	}
	
	.waitfor-item .more i {
		margin-top: 20px;
		display: block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		-webkit-transition: all .5s;
		transition: all .5s;
	}
	
	.waitfor-item .more i.on {
		-webkit-transform: rotateZ(180deg);
		transform: rotateZ(180deg);
	}
	
	.waitfor-item .item-info .info {
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		height: 60px;
		width: calc( 94% - 60px);
		margin-left: 8px;
		line-height: 20px;
	}
	
	.waitfor-item .item-info .info .title {
		margin: 8px 0;
		height: 20px;
	}
	
	.waitfor-item .item-info .info .sundry .status {
		margin-left: 10px;
	}
	
	.waitfor-item .item-info .info .sundry .launch {
		max-width: 120px;
		display: inline-block;
		vertical-align: bottom;
	}
	
	.waitfor-item .item-info .info .sundry {
		padding-right: 5px;
	}
	
	.waitfor-item .item-desc {
		padding: 8px 3%;
		display: none;
	}
	
	.waitfor-item .item-desc .desc-line {
		line-height: 24px;
	}
	
	.waitfor-item .item-btn {
		display: block;
		width: 94%;
		height: 40px;
		line-height: 40px;
		margin: 8px auto 0;
		text-align: center;
		border-radius: 5px;
	}
	
</style>