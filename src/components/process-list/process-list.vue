<template>
	<transition name="move">
		<div class="process-wrapper b">
			<x-header :left-options="{backText: ''}" >流程处理列表
			</x-header>

			<div class="content-wrapper fz14">
				
				<div class="list-wrapper" v-show="result.length > 0 && loaderEnd">
					<ul>
						<li class="list-item" v-for="(item, index) in result">
							<div class="name fz16" v-html="_parseContent(item.Content)"></div>
							<div class="relevant fz12">
								<span>处理人：<font class="c1">{{item.AcceptUser}} [{{item.NodeAttr}} - {{item.AccepterAttr}}]</font></span>&nbsp;&nbsp;
								<span v-show="item.AccreditUser">委托人：<font  class="c1">{{item.AccreditUser}}</font></span>
								<span v-show="!item.AccreditUser" class="time fr c2">{{_parseTime(item.AcceptDate)}}</span>
							</div>
							<div class="relevant fz12 clear"  v-show="item.AccreditUser">
								<span class="time fr c2">{{_parseTime(item.AcceptDate)}}</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="loading-container">
					<loading v-show="result.length == 0 && !loaderEnd"></loading>
					<error v-show="loadingError"></error>
					<not-result v-show="result.length == 0 && loaderEnd"></not-result>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	
	import { XHeader } from 'vux'
	import { getProcess } from 'api/commonFlow'
	import Loading from 'base/loading/loading'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'
	
	import utils from 'common/js/utils'

	export default {
		data() {
			return {
				loadingError: false,
				loaderEnd: false,
				result: []
			}
		},
		methods: {
			_parseTime(time){
				return utils.getDate(time, true)
			},
			_parseContent(data){
				return data.replace("/@","<span class='c5'>").replace("@\\","</span>")
			}
		},
		created(){
			setTimeout(() => {
				getProcess({flowid: this.$route.query.flowid}).then((data) => {
					if(data.Result){
						this.loaderEnd = true
						this.result = data.Data
					}
				}, (error) => {
					this.loaderEnd = true
					this.loadingError = true
				})
			}, 800)
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
		z-index: 28;
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
	.list-item{
		padding: 8px 3%;
		border-bottom: 1px solid #d4d4d4;
	}
	.relevant{margin-top: 5px;}

	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>