<template>

	<transition name="confirm-fade">
		<div class="confirm" v-show="showFlag">
			<div class="confirm-wrapper">
				<div class="confirm-content">
					<h3 v-show="title">{{title}}</h3>
					<p class="text">{{text}}</p>
					<div class="operate">
						<a href="javascript:void(0)" @click="select(index)" class="operate-btn" v-for='(item, index) in confirmBtn'>{{item}}</a>
					</div>
				</div>
			</div>
		</div>
	</transition>

</template>

<script>
	export default {
		props: {
			title:{
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			confirmBtn: {
				type: Array,
				default: null
			}
		},
		data() {
			return {
				showFlag: false
			}
		},
		methods: {
			show() {
				this.showFlag = true
			},
			hide() {
				this.showFlag = false
			},
			select(index) {
				this.$emit("select",index)
				this.hide()
			}
		}
	}
</script>

<style scoped>

.confirm{position:fixed;left:0;right:0;top:0;bottom:0;z-index:998;background-color:rgba(0, 0, 0, 0.5);}

.confirm.confirm-fade-enter-active,.confirm.confirm-fade-leave-active{transition: opacity 0.3s}
.confirm.confirm-fade-enter,.confirm.confirm-fade-leave-to{opacity: 0}

.confirm.confirm-fade-enter-active .confirm-content,.confirm.confirm-fade-leave-active .confirm-content{transition: all 0.3s}
.confirm.confirm-fade-enter .confirm-content,.confirm.confirm-fade-leave-to .confirm-content{transform: translate3d(0, 30px, 0)}

/*
.confirm.confirm-fade-enter-active{animation:fadeIn .6s}
.confirm.confirm-fade-leave-active{animation:fadeOut .6s}
.confirm.confirm-fade-enter-active .confirm-content{animation:fadeInUp 0.4s}
.confirm.confirm-fade-leave-active .confirm-content{animation:fadeOutDown 0.4s}
*/
.confirm .confirm-wrapper{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999;}
.confirm .confirm-wrapper .confirm-content{width:270px;border-radius: 10px;background: #fff;overflow: hidden;}
.confirm .confirm-wrapper .confirm-content h3{line-height: 20px;padding: 15px 0 5px;font-weight: 500;font-size: 15px;text-align: center;color: #3D5C99;}
.confirm .confirm-wrapper .confirm-content .text{padding:24px 15px;line-height:22px;text-align:center;font-size:16px;color: #000;}
.confirm .confirm-wrapper .operate{display:flex;align-items:center;text-align:center;font-size:14px;box-shadow: 0 -1px 0 #f4f4f4;}
.confirm .confirm-wrapper .operate .operate-btn{flex:1;line-height:22px;padding:10px 0;color: #3D5C99;}
.confirm .confirm-wrapper .operate .operate-btn:nth-child(n+2){border-left: 1px solid #f4f4f4;}
.confirm .confirm-wrapper .operate .operate-btn:active{background: #f4f4f4;}


@keyframes fadeIn{
	0%{opacity:0}
	100%{opacity:1}
}

@keyframes fadeOut{
	0%{opacity:1}
	100%{opacity:0}
}

@keyframes fadeInUp{
	0% {transform: translateY(30px)}
	100% {transform: translateY(0)}
}

@keyframes fadeOutDown {
	0% {transform: translateY(0)}
	100% {transform: translateY(30px)}
}

</style>