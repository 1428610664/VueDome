<template>

	<div class="wrapper b">
		<scroll ref="scroll" class="recommend-content" :data="content">
			<div>
				<swiper :list="recommends" @on-index-change="swiperItemChange" auto height="150px" dots-class="custom-bottom" dots-position="center"></swiper>
				<div class="list-wrapper">
					<ul>
						<li v-for="item in content">{{item}}</li>
					</ul>
				</div>
			</div>
			<div class="loading-container" v-show="!content.length">
				<loading></loading>
			</div>
		</scroll>
	</div>

</template>

<script>
	
	import {Swiper} from 'Vux'
	import Slider from 'base/slider/slider'
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'

	export default {
		components: {
			Slider,
			Scroll,
			Loading,
			Swiper
		},
		data() {
			return {
				value: false,
				recommends: [],
				content: []
			}
		},
		methods: {
			swiperItemChange(index){
				// console.log("wiper change "+index)
			}
		},
		created() {
			setTimeout(() => {
				var arr = [];
				for(var i = 0; i < 50; i++) {
					arr.push("模拟数据===" + i)
				}
				this.content = arr
				this.recommends = list
			}, 2000)
		},
		watch: {
			'$route' (to, from) {
				if(to.path == "/home"){
					setTimeout(() => {
						this.$refs.scroll.refresh()
					}, 20)
				}
			}
		}
	}
	
const list = [
	{
		url: 'javascript:void(0)',
		img: 'http://business.cdn.qianqian.com/qianqian/pic/bos_client_62757df99fd1a2a427a83d612edbc0c4.jpg',
	},
	{
		url: 'javascript:void(0)',
		img: 'http://business.cdn.qianqian.com/qianqian/pic/bos_client_a2fda8efe46355da504135c61d21ad13.jpg',
	},
	{
		url: 'javascript:void(0)',
		img: 'http://business.cdn.qianqian.com/qianqian/pic/bos_client_e35ab3630e0913b2ccf10453b90cd908.jpg',
	},
	{
		url: 'javascript:void(0)',
		img: 'http://business.cdn.qianqian.com/qianqian/pic/bos_client_3d5864a061845bf18390545a87a7b66b.jpg',
	}]	

</script>

<style scoped>
	.wrapper {
		position: fixed;
		width: 100%;
		top: 46px;
		bottom: 50px;
	}
	
	.recommend-content {
		height: 100%;
		overflow: hidden;
	}
	
	.slider-wrapper {
		overflow: hidden;
	}
	
	.list-wrapper li{line-height: 46px;text-indent: 20px;border-bottom: 1px solid #d4d4d4;}
	
	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>