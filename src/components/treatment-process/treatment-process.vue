<template>
	<transition name="move">
		<div class="process-wrapper b">
			<x-header :left-options="{backText: ''}" >流程处理过程
				<a @click="toList" slot="right">列表</a>
			</x-header>

			<div class="content-wrapper fz14">
				<div class="cont-header fz13" v-show="result.length > 0  && loaderEnd">所处环节：{{NodeName}}</div>
				<div class="time-line-wrapper" v-show="result.length > 0  && loaderEnd">
					<div class="item-wrapper" v-for="(items, index) in result">
						<div class="timeline-item" v-for="(item, index) in items">
							<div class="left">
								<div class="line" :class="_clacState(item.NodeState)"></div>
								<div class="conduct b5 c" v-if="item.NodeState == 1">进行中</div>
								<div class="status c" :class="_clacState(item.NodeState)"></div>
								<div class="status-name" :class="item.NodeState == 0 ? 'c2' : ''">{{item.FlowNodeName}}</div>
							</div>
							<div class="right">
								<div class="list-wrapper">
									<ul>
										<li v-for="list in item.ProcessList" v-html="_parseContent(list.Content)"></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="loading-container">
					<loading v-show="result.length == 0 && !loaderEnd"></loading>
					<error v-show="loadingError"></error>
					<not-result v-show="result.length == 0 && loaderEnd"></not-result>
				</div>
			</div>
			
			<router-view></router-view>
		</div>
	</transition>
</template>

<script>
	
	import { XHeader} from 'vux'
	import { getNodeProcess } from 'api/commonFlow'
	import Loading from 'base/loading/loading'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'

	export default {
		data() {
			return {
				loadingError: false,
				loaderEnd: false,
				result: [],
				NodeName: '',
				result1: []
			}
		},
		created(){
			setTimeout(() => {
				this.getNodeProcess()
			}, 800)
		},
		methods: {
			toList(){
				let path = this.$route.path
				this.$router.push({path: path + '/list',query:{flowid: this.$route.query.flowid}})
			},
			getNodeProcess(){
				getNodeProcess({flowid: this.$route.query.flowid}).then((data) => {
					if(data.Result){
						this.loaderEnd = true
						this.NodeName = data.Data.NodeName
						this.result = this._reverse(data.Data.List, true)
						this.result1 = this._reverse(data.Data.List)
					}
				}, (error) => {
					this.loaderEnd = true
					this.loadingError = true
				})
			},
			_reverse(json, mark){
				let arr = []
				for(let k in json){
					arr.unshift(json[k])
				}
				let arr1 = []
				for(let k in json){
					for(let i = 0, ilen = json[k].reverse().length; i < ilen; i++){
						arr1.unshift(json[k][i])
					}
					
				}
				return mark?arr:arr1
			},
			_clacState(state){
				switch(state){
					case 0:
						return "b2"
						break
					case 1:
						return "b4"
						break
					case 2:
						return "b4"
						break
				}
			},
			_parseContent(data){
				return data.replace("/@","<span class='c5'>").replace("@\\","</span>")
			}
		},
		components: {
			XHeader,
			Loading,
			NotResult,
			Error
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
	
	.process-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
	}
	
	.content-wrapper {
		position: fixed;
		top: 46px;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		overflow-y: auto;
	}
	
	.cont-header {
		padding: 0 5%;
		line-height: 40px;
		border-bottom: 1px solid #f8f9fd;
	}
	
	.time-line-wrapper {
		width: 100%;
		padding-top: 10px;
	}
	.item-wrapper{margin-top: -1px;}
	.item-wrapper:nth-child(2n+2){background: #fbfbfb;}
	.time-line-wrapper .timeline-item {
		display: flex;
		
	}
	
	.timeline-item .left {
		position: relative;
		flex: 0 0 96px;
		border-right: 1px dashed #ddd;
	}
	
	.timeline-item .status {
		position: relative;
		z-index: 2;
		margin: 6px 0 0 12px;
		width:16px;
		height: 16px;
		text-align: center;
		border-radius: 50%;
		float: left;
	}
	.status-name{
		margin:6px 0 0 32px;
		line-height: 20px;
	}
	.conduct{
		position: absolute;
		top: 50%;
		left: 26px;
		display: inline-block;
		padding: 2px 4px 0;
		line-height: 14px;
		font-size: 10px;
	}
	.conduct:before{content: "";position: absolute;left: -4px;top: 50%;margin-top: -4px;display: inline-block;border-right:4px solid #ffe26d;border-top:4px solid transparent;border-bottom:4px solid transparent;}
	
	.timeline-item .left .line {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 19px;
		width: 2px;
		height: 100%;
	}
	.b2{background: #E2E2E2;}
	
	.item-wrapper:nth-child(1) .left:before {
		top: 30px;
		height: calc(100% - 27px);
	}
	
	.item-wrapper:nth-last-child(1) .left:before {
		height: 40px;
	}
	
	.timeline-item .right {
		padding: 6px 5% 20px 6px;
		flex: 1;
		min-height: 70px;
		line-height: 20px;
	}
	
	.list-wrapper li:nth-child(n+2) {
		margin-top: 6px;
	}
	
	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>