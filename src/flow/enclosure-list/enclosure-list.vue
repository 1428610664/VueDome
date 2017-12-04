<template>

	<transition name="move">
		<div class="enclosure-wrapper b">
			<x-header :left-options="{backText: ''}">附件{{isUpload}}<a slot="right" v-if="isUpload" @click="upload">上传</a></x-header>
			<scroll ref="scroll" class="content-wrapper fz14" 
				:data="content" 
				:pullup="true" 
				@scrollToEnd="scrollToEnd">
				<div class="list-wrapper b">
					<swipeout v-show="content.length > 0 && !loadingError">
						<swipeout-item transition-mode="follow" v-for="(item, index) in content" :key="index">
							<div slot="right-menu">
								<swipeout-button @click.stop.native="seeItem(item, index)" type="primary">查看</swipeout-button>
								<swipeout-button  v-show="!item.FlowTaskId" @click.stop.native="delItem(item, index)" type="warn" >删除</swipeout-button>
							</div>
							<div slot="content" class="enclosure-item" @click="seeItem(item, index)">
								<div class="icon-wrapper iconfont" :class="_parseFileType(item.Filename)" :style="{color: _parseFileType(item.Filename, true)}"></div>
								<div class="info">
									<h3 class="name fz16 hzline2">{{item.Filename}}</h3>
									<div class="desc clear fz13">
										<span>大小：<font class="c1">{{_parseFileSize(item.FileSize)}}</font></span>&nbsp;&nbsp;
										<span>创建：<font class="c1">{{item.CreatEmp}}</font></span>
										<span class="fr c2">{{_parseTime(item.CreatTime)}}</span>
									</div>
								</div>
							</div>
						</swipeout-item>
					</swipeout>
					<loading :title="loadText" v-show="isShowPull" :layout="true"></loading>
					<div class="ct fz14 loaded" style="display: none;" v-show="this.content.length >= this.totalCount && isLoadEnd && this.content.length > 10">- 已加载完毕 -</div>
				</div>
				
				<div class="loading-container">
					<loading v-show="!isInitEnd"></loading>
					<error v-show="loadingError"></error>
					<not-result v-show="isInitEnd && !content.length && !loadingError"></not-result>
				</div>
				
				<div class="ct fz14 loaded" v-show="this.content.length >= this.totalCount && isLoadEnd && this.content.length > 10">- 已加载完毕 -</div>
			</scroll>
			<form id="upform1">
				<input type="file" name="file" style="display: none;" id="file1" @change="changeFile1($event)" />
				<!--<input type="file" name="file" style="display: none;" multiple  id="file1" @change="changeFile1($event)" />-->
			</form>
		</div>
	</transition>

</template>

<script>
	
	import Loading from 'base/loading/loading'
	import Scroll from 'base/scroll/scroll'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'
	import { XHeader } from 'vux'
	import { Toast, openFile } from 'common/js/H5Utils'
	import { getFlowAttachment, delFile } from 'api/commonFlow'
	import utils from 'common/js/utils'
	import {mapActions, mapMutations, mapGetters} from 'vuex'
	import { downloadPath1 } from 'api/config'

	import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
	import { uploadMixin } from 'flow/mixin/uploadMixin'

	export default {
		mixins: [uploadMixin],
		data() {
			return {
				stopMark: false,
				pageNo: 1,
				pageSize: 10,
				totalCount: 0,

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
		created() {
			setTimeout(() => {
				this.content = this._IsTemp(true)
				if(this.$route.query.flowid) {
					this.getList()
				} else {
					this.isInitEnd = true
				}
			}, 800)
		},
		computed: {
			...mapGetters([
				'upLoadFileList',
				'flowAttListNum',
				'isUpload'
			])
		},
		methods: {
			upload(){
				window.plus ? this._selectFile1() : this._openFiles("file1")
			},
			itemClick(item, index){
				console.log(index)
			},
			...mapMutations({
				setFlowAttListNum: 'SET_FLOW_ARR_LIST_NUM'
			}),
			...mapActions([
				'delUpLoadFileList'
			]),
			pullRefresh(){
				setTimeout(() => {
					this.getList(true)
				},800)
			},
			getList(mark) {
				getFlowAttachment({
					pageindex: this.pageNo,
					pagesize: this.pageSize,
					flowid: this.$route.query.flowid
				}).then((data) => {
					if(data.Result) {
						this.totalCount = data.Data.PageInfo.TotalCount + this._IsTemp()
						this.content = this.content.concat(data.Data.List)
						
						if(this.content.length > 0){
							this.directorName = this.content[0].DirectorName
						}
						
						if(this.content.length > 0) this.isShowPull = true
						this.isInitEnd = true
						this.isPullLoaded = false

						if(this.content.length >= this.totalCount) {
							this.isLoadEnd = true
							this.isShowPull = false
						}
					}
				}, (error) => {
					this.loadingError = true
					this.isInitEnd = true
				})
			},
			seeItem(item) {
				if(this.stopMark)return
				this.stopMark = true
				setTimeout(() => {
					this.stopMark = false
				},20)
				
				console.log("seeItem：" + JSON.stringify(item))
				if(window.plus){
					openFile(item.Url)
				}else{
					Toast("浏览器不支持查看功能")
				}
				
			},
			delItem(item, index) {
				if(this.stopMark)return
				this.stopMark = true
				setTimeout(() => {
					this.stopMark = false
				},20)
				if(item.Prikeyid){
					this.delFile({attId: item.Prikeyid, fileName: item.Filename}, index)
				}else{
					this.delUpLoadFileList(item)
					this.content.splice(index, 1)
				}
			},
			delFile(parma, index){
				delFile(parma).then((data) => {
					if(data.Result){
						Toast("删除成功")
						this.content.splice(index, 1)
						this.setFlowAttListNum(this.flowAttListNum - 1)
					}else{
						Toast("删除失败")
					}
				},(error) => {
					
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
				this.getList()
			},
			_parseTime(data) {
				return utils.getDate(data)
			},
			_parseFileSize(size) {
				return utils.parseFileSize(size)
			},
			_parseFileType(file, mark){
				if(utils.isImg(file)){
					return mark ? "#37BB91" : "icon-image"
				}else if(utils.isWord(file)){
					return mark ? "#4CABFF" : "icon-doc1"
				}else if(utils.isExcel(file)){
					return mark ? "#84C139" : "icon-xlsx"
				}else{
					return mark ? "#4CA9CB" : "icon-youjianxiangqingweizhi"
				}
			},
			_IsTemp(mark){
				let IsTempArr = []
				for(let i= 0, ilen = this.upLoadFileList.length; i < ilen; i++){
					if(!this.upLoadFileList[i].IsTemp)IsTempArr.push(this.upLoadFileList[i])
				}
				return mark ? IsTempArr : IsTempArr.length
			}
		},
		components: {
			Loading,
			Scroll,
			NotResult,
			Error,
			XHeader,
			Swipeout,
			SwipeoutItem,
			SwipeoutButton
		}
	}
</script>

<style scoped>
	.move-enter-active,
	.move-leave-active {
		transition: all .4s ease;
	}
	
	.move-enter,
	.move-leave-active {
		transform: translate3d(100%, 0, 0)
	}
	
	.enclosure-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	
	.content-wrapper {
		position: fixed;
		top: 46px;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: -1;
	}
	
	.enclosure-item {
		padding: 6px 3%;
		border-bottom: 1px solid #d4d4d4;
		display: flex;
	}
	
	.icon-wrapper {
		flex: 0 0 70px;
		width: 70px;
		height: 70px;
		line-height: 70px;
		text-align: center;
		font-size: 64px;
	}
	
	.info {
		flex: 1;
		padding-left: 5px;
		overflow: hidden;
	}
	
	.info .name {
		margin: 7px 0;
		height: 36px;
		line-height: 18px;
		font-weight: 500;
	}
	
	.loading-container,
	.not-result-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>