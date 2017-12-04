<template>
	<transition name="move">
		<div class="flowpage b">
			<x-header :left-options="{backText: ''}">{{title}}</x-header>
			<div class="content-wrapper ">
				<group v-show="result.length > 0 && loaderEnd">
			    	<cell :title="item.FlowModelName" is-link v-for="(item, index) in result" :key="index" @click.native="onItemClick(item)"></cell>
			    </group>
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
	
	import { XHeader } from 'vux'
	import Loading from 'base/loading/loading'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'
	import { getModelByPageId } from 'api/flowPage'
	import { Cell, Group} from 'vux'

	export default {
		data() {
			return {
				loadingError: false,
				loaderEnd: false,
				flowmodelid: this.$route.params.id | '',
				result: []
			}
		},
		created(){
			this.title = this.$route.query.title
			setTimeout(() => {
				this.getModelByPageId(this.$route.params.id)
			}, 800)
		},
		methods: {
			onItemClick(data){
				let path = this.$route.path
				this.$router.push({path: path + '/outsourcemanage',query:{flowmodelid: data.FlowModelId,title: data.FlowModelName,flowpageid: this.flowmodelid}})
			},
			getModelByPageId(id){
				getModelByPageId({flowPageId: id}).then((data) => {
					if(data.Result){
						this.loaderEnd = true
						this.result = data.Data
					}
				},(error) => {
					this.loaderEnd = true
					this.loadingError = true
				})
			}
		},
		components: {
			XHeader,
			Loading,
			NotResult,
			Error,
			Cell, 
			Group
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
		z-index: 22;
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