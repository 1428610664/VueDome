<template>
	
	<div class="notice-wrapper b">
		<x-header :left-options="{backText: ''}">公告通知</x-header>
		
		<scroller class="content-wrapper" ref="scroll" 
			:data="content"  
			:totalCount="totalCount"
			:pullup="true" 
			:pulldown="true"
			:listenScroll="true"
			@scrollToEnd="scrollToEnd"
			@loadingStateChange="loadingStateChange"
			@pullRefresh="pullRefresh">
			<div class="list-wrapper b">
				<ul v-show="LoadingState == 1">
					<li class="item" v-for="item in content">{{item.Bulletintitle}}</li>
				</ul>
			</div>
		</scroller>
	</div>
	
</template>

<script>
	
	import { XHeader } from 'vux'
	import Scroller from 'base/scroll/scroller'
	import { getList } from 'api/notice'
	import utils from 'common/js/utils'
	import { Toast } from 'common/js/H5Utils'
	
	export default {
		data() {
			return {
				LoadingState: 2,
				
				pageNo: 1,
				pageSize: 10,
				totalCount: 0,
				content: []
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
					this.getList(false, true)
				},800)
			},
			getList(isUpload, pullRefresh){
				if(pullRefresh){
					this.pageNo = 1
					this.pageSize = 10
				}
				getList({pageindex : this.pageNo,pagesize: this.pageSize}).then((data) => {
					if(data.Result){
						this.isPullLoaded = false
						this.totalCount = data.Data.PageInfo.TotalCount
						this.content = pullRefresh ? data.Data.List : this.content.concat(data.Data.List)
					}else{
						Toast("请求失败")
					}
					this.$refs.scroll.requestSuccess(data.Result, isUpload, pullRefresh, this.content, this.totalCount)
				},(error) => {
					Toast("请求失败")
					this.$refs.scroll.requestError(isUpload, pullRefresh)
				})
			},
			scrollToEnd(){
				if(this.content.length == 0 || this.content.length >= this.totalCount || this.isPullLoaded){
					return
				}
				this.isPullLoaded = true
				this.pageNo++
				this.getList(true)
			},
			loadingStateChange(LoadingState){
				this.LoadingState = LoadingState
			}
		},
		components: {
			XHeader,
			Scroller
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
		padding: 30px 3%;
		border-bottom: 1px solid red;
	}
	.content-wrapper .item:nth-child(1){border-top: 1px solid red;}
	
	
</style>