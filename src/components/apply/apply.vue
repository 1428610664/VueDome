<template>

	<div class="wrapper">
		<div class="content-wrapper ">
			<group v-show="result.length > 0 && loaderEnd">
		    	<cell :title="item.PageName" is-link v-for="(item, index) in result" :key="index" @click.native="onItemClick(item)"></cell>
		    </group>
			<div class="loading-container">
				<loading v-show="result.length == 0 && !loaderEnd"></loading>
				<error v-show="loadingError"></error>
				<not-result v-show="result.length == 0 && loaderEnd"></not-result>
			</div>
		</div>
		<router-view></router-view>
	</div>

</template>

<script>
	
	import Loading from 'base/loading/loading'
	import NotResult from 'base/not-result/not-result'
	import Error from 'base/error/error'
	import { getFlowPage } from 'api/flowPage'
	import { Cell, Group} from 'vux'
	import {mapGetters} from 'vuex'
	
	export default {
		data() {
			return {
				loadingError: false,
				loaderEnd: false,
				result: []
			}
		},
		destroyed(){
			console.log("destroy")
		},
		computed: {
			...mapGetters([
				'isLogin',
			])
		},
		methods: {
			onItemClick(data){
				this.$router.push({path: `/apply/${data.PageId}`, query: {title: data.PageName}})
			},
			getFlowPage(){
				getFlowPage().then((data) => {
					if(data.Result){
						this.result = data.Data
						this.loaderEnd = true
					}
				},(error) => {
					this.loaderEnd = true
					this.loadingError = true
				})
			}
		},
		activated(){
			if(!this.isInit){
				this.isInit = true
				setTimeout(() => {
					this.getFlowPage()
				},800)
			}
		},
		watch : {
			isLogin(nLogin, oLogin){
				if(!nLogin){
					this.result = []
					this.isInit = false
					this.loaderEnd = false
				}
			}
		},
		components: {
			Loading,
			NotResult,
			Error,
			Cell, Group
		}
	}
</script>

<style scoped>
	.wrapper {
		position: fixed;
		width: 100%;
		top: 46px;
		bottom: 50px;
		z-index: 15;
	}
	
	.content-wrapper {
		position: fixed;
		top: 46px;
		bottom: 50px;
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