<template>
	<transition name="move">
		<div class="notice-wrapper b">
			<x-header :left-options="{backText: ''}">公告通知</x-header>
			
			<scroll class="content-wrapper" ref="scroll" :data="content"  :pullup="true" @scrollToEnd="scrollToEnd"
				 :listenScroll="true"
				 @pullRefresh="pullRefresh">
				<div class="list-wrapper b">
					<ul v-show="content.length > 0 && !loadingError">
						<li class="item" @click="showDesc(item)" v-for="item in content">
							<div class="icon">
								<img width="80" height="80" v-lazy="loadImg"/>
							</div>
							<div class="info"> 
								<p class="title hzline1 fz16">{{item.Bulletintitle}}</p>
								<p class="desc hzline2 fz14 c4">{{item.Bulletincontent}}</p>
								<p class="time fz13 c4">{{_parseTime(item.CreatTime)}}</p>
							</div>
						</li>
						<loading :title="loadText" v-show="isShowPull" :layout="true"></loading>
					</ul>
				</div>
				
				<div class="loading-container">
					<loading v-show="!isInitEnd"></loading>
					<error v-show="loadingError"></error>
					<not-result v-show="isInitEnd && !content.length && !loadingError"></not-result>
				</div>
				
				<div class="ct fz14 loaded" v-show="this.content.length >= this.totalCount && isLoadEnd && this.content.length > 10">- 已加载完毕 -</div>
				
			</scroll>
	
			<router-view></router-view>
	
		</div>
	</transition>
</template>

<script>
	
	import { XHeader } from 'vux'
	import Loading from 'base/loading/loading'
	import Scroll from 'base/scroll/scroll2'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'
	import { getList } from 'api/notice'
	import utils from 'common/js/utils'
	import { Toast } from 'common/js/H5Utils'
	
	export default {
		data() {
			return {
				loadImg: "http://192.168.0.188:8081/UpLoads/49D7CC924CC548AEA4EB60677AB75318/test.png",
				
				pageNo: 1,
				pageSize: 10,
				totalCount: 0,
				
				content: [],
				// 是否上拉数据加载中
				isPullLoaded : false,
				// 是否显示加载更多
				isShowPull : false,
				// 是否加载完毕数据
				isLoadEnd : false,
				// 是否初始化
				isInitEnd : false,
				// 加载失败
				loadingError: false,
				loadText : "加载更多..."
			}
		},
		created() {
			setTimeout(() => {
				this.getList()
			}, 800)
		},
		methods: {
			pullRefresh(){
				setTimeout(() => {
					this.getList(true)
				},800)
			},
			getList(mark){
				if(mark){
					this.pageNo = 1
					this.pageSize = 10
				}
				
				getList({pageindex : this.pageNo,pagesize: this.pageSize}).then((data) => {
					if(mark){
						this.isLoadEnd = false
						this.$refs.scroll.endPullDowmToRefresh()
						this.isShowPull = true
					}
					if(data.Result){
						this.totalCount = data.Data.PageInfo.TotalCount
						this.content = mark ? data.Data.List : this.content.concat(data.Data.List)
						
						if(this.content.length > 0)this.isShowPull = true
						this.isInitEnd = true
						this.isPullLoaded = false
						
						if(this.content.length >= this.totalCount){	
							this.isLoadEnd = true
							this.isShowPull = false
						}
					}
				},(error) => {
					Toast("请求失败")
					this.loadingError = true
					this.isInitEnd = true
					if(mark)this.$refs.scroll.endPullDowmToRefresh()
				})
			},
			showDesc(item) {
				this.$router.push({
					path: `/me/notice/${item.Bulletinid}`
				})
			},
			scrollToEnd(){
				if(this.content.length == 0 || this.isLoadEnd){
					return
				}
				if(this.isPullLoaded){
					return
				}
				this.isPullLoaded = true
				this.pageNo++
				this.getList()
			},
			_parseTime(data){
				return utils.getDate(data)
			}
		},
		components: {
			Loading,
			Scroll,
			NotResult,
			XHeader,
			Error
		}
	}
</script>

<style scoped>
	
	.notice-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 22;
		overflow-y: auto;
	}
	
	.content-wrapper {
		position: fixed;
		top: 46px;
		bottom: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
	}
	
	.content-wrapper .item{
		display: flex;
		padding: 3px 3%;
		height: 80px;
		border-bottom: 1px solid #d4d4d4;
	}
	.content-wrapper .item:nth-child(1){border-top: 1px solid #d4d4d4;}
	.item .icon{
	    flex: 0 0 80px;
		width: 80px;
		height: 80px;
	}
	.item .info{
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
		padding-left: 6px;
		height: 80px;
	}
	
	.item .info .title{line-height: 26px;}
	.item .info .time{text-align: right;}
	
</style>