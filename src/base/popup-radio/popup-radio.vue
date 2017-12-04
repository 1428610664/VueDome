<template>
	<transition name="popup">
		<div class="popup-radio" v-show="showFlag" @click="hide">
			<div class="radio-wrapper"> 
				<ul>
					<li class="radio-item" @click.stop="select(index)" v-for="(item, index) in list" :class="{c1:currentIndex == index}">
						<span>{{item.text}}</span>
						<div class="icon"><i class="iconfont icon-jian fz18" :class="{c1:currentIndex == index}"></i></div>
					</li>
				</ul>
			</div>
		</div>
	</transition>
</template>

<script>
	
	export default {
		props: {
			list : {
				type: Array,
				default: []
			},
			currentIndex: {
				type: Number,
				default: -1
			}
		},
		data() {
			return {
				showFlag: false
			}
		},
		methods: {
			show(){
				this.showFlag = true
			},
			hide(){
				this.showFlag = false
			},
			select(index){
				this.hide()
				this.$emit("select", index)
			}
		}
	}
	
</script>

<style scoped>
	
.popup-radio{position:fixed;left:0;right:0;top:0;bottom:0;z-index:998;background-color:rgba(0, 0, 0, 0.5);}	

.popup-radio.popup-enter-active,.popup-radio.popup-leave-active{transition: opacity .4s}
.popup-radio.popup-enter,.popup-radio.popup-leave-to{opacity: 0}
.popup-radio.popup-enter-active .radio-wrapper,.popup-radio.popup-leave-active .radio-wrapper{transition: all 0.3s}
.popup-radio.popup-enter .radio-wrapper,.confirm.popup-leave-to .radio-wrapper{transform: translate3d(0, 100%, 0)}

/*
.popup-radio.popup-enter-active{animation:fadeIn .6s}
.popup-radio.popup-leave-active{animation:fadeOut .6s}
.popup-radio.popup-enter-active .radio-wrapper{animation:fadeInUp 0.4s}
.popup-radio.popup-leave-active .radio-wrapper{animation:fadeOutDown 0.4s}
*/
.radio-wrapper{position:absolute;bottom: 0;left: 0;width: 100%;z-index:999;background: #fff;}
.radio-wrapper li{line-height: 24px;font-size: 14px;text-indent: 15px;padding: 10px 0;position: relative;}
.radio-wrapper li:nth-child(n+2){border-top: 1px solid #f4f4f4;}
.icon{position: absolute;top: 50%;right: 20px;width: 20px;height: 20px;text-align: center;line-height: 20px;transform: translate3d(0, -50%, 0);color: #fff;font-weight: 700;}

@keyframes fadeIn{
	0%{opacity:0}
	100%{opacity:1}
}

@keyframes fadeOut{
	0%{opacity:1}
	100%{opacity:0}
}

@keyframes fadeInUp{
	0% {transform: translateY(100%)}
	100% {transform: translateY(0)}
}

@keyframes fadeOutDown {
	0% {transform: translateY(0)}
	100% {transform: translateY(100%)}
}

</style>