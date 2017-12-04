<template>
	<transition name="move">
		<div class="flowpage b">
			<x-header :left-options="{backText: ''}">申请</x-header>
			<div class="content-wrapper ">
				<group v-show="result.length > 0">
			    	<cell :title="item.PageName" @click.native="onItemClick(item)"></cell>
			    </group>
				<div class="loading-container" v-show="result.length == 0">
					<loading></loading>
				</div>
			</div>
			
			<router-view></router-view>
		</div>
	</transition>
</template>

<script>
	
	import { XHeader } from 'vux'
	import Loading from 'base/loading/loading'
	import { getFlowPage } from 'api/flowPage'
	import { Cell, Group} from 'vux'

	export default {
		data() {
			return {
				result: []
			}
		},
		created(){
			setTimeout(() => {
				this.getFlowPage()
			},800)
		},
		methods: {
			onItemClick(data){
				console.log("PageId:"+data.PageId+"------------PageName:"+data.PageName)
				this.$router.push({path: `/apply/FlowPage/${data.PageId}`})
			},
			getFlowPage(){
				getFlowPage().then((data) => {
					if(data.Result){
						this.result = data.Data
					}
				},(error) => {
					
				})
			}
		},
		components: {
			XHeader,
			Loading,
			Cell, Group
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
	.flowpage {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 21;
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
	.mlistbox{margin-top: 0;}
	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>