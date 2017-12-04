<template>
	<transition name="move">
		<div class="noticedesc-wrapper b">
			<x-header :left-options="{backText: ''}">公告通知</x-header>
			<scroll class="content-wrapper" ref="scrollView">
				<div v-show="loaderEnd && !loadingError" class="content">
					<div class="head">
						<h3 class="ct fz20 c1">{{reesult.Bulletintitle}}</h3>
						<p class="fz13 c4"><span>级别：中</span><span class="fr">时间：{{_parseTime(reesult.CreatTime)}}</span></p>
					</div>
					<div class="cont fz15">
						<p>{{reesult.Bulletincontent}}</p>
						<div class="publisher fz13"><span class="fr c1">发布人：{{reesult.DirectEmp}}</span></div>
					</div>
				</div>
				<div class="loading-container">
					<loading v-show="!loaderEnd"></loading>
					<error v-show="loadingError && loaderEnd"></error>
				</div>
			</scroll>
		</div>
	</transition>
</template>

<script>
	
	import {XHeader} from 'vux'
	import Loading from 'base/loading/loading'
	import Error from 'base/error/error'
	import Scroll from 'base/scroll/scroll'
	import utils from 'common/js/utils'
	import { getdetail } from 'api/notice'

	export default {
		data() {
			return {
				loadingError: false,
				loaderEnd: false,
				reesult: {}
			}
		},
		created(){
			setTimeout(() => {
				this.getdetail()
			}, 800)
		},
		computed: {
			title() {
				return "业务公告" + this.$route.params.id
			}
		},
		methods: {
			getdetail(){
				getdetail(this.$route.params.id).then((data) => {
					if(data.Result){
						this.reesult = data.Data
						this.loaderEnd = true
						setTimeout( () => {
							this.$refs.scrollView.refresh()
						},20)
					}
				},()=>{
					this.loaderEnd = true
					this.loadingError = true
				})
			},
			_parseTime(data){
				if(!data){
					return
				}
				return utils.getDate(data)
			}
		},
		components: {
			Scroll,
			XHeader,
			Loading,
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
	
	.noticedesc-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
	}
	
	.content-wrapper {
		position: absolute;
		top: 46px;
		left: 0;
		bottom: 0;
		padding: 0 3%;
		z-index: -1;
		width: 94%;
	}
	
	.head h3 {
		padding: 28px 12%;
		border-bottom: 1px solid #f8f9fd;
	}
	
	.head p {
		padding: 10px 0;
	}
	
	.cont p {
		text-indent: 20px;
		line-height: 24px;
		margin-top: 20px;
	}
	
	.cont img {
		margin: 0 auto;
		display: block;
		max-width: 100%;
	}
	
	.publisher {
		padding: 25px 0;
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>