<template>

	<transition name="move">
		<div class="modify-wrapper b">
			
			<x-header :left-options="{backText: ''}">修改密码</x-header>
			
			<div class="wrapper">
				<div class="line-wrapper inp">
					<i class="icon iconfont icon-mima c4 fz20"></i>
					<input type="password" v-show="oldPswMark" v-model="oldPsw" maxlength="11" placeholder="旧密码">
					<input type="text" v-show="!oldPswMark" v-model="oldPsw" maxlength="11" placeholder="旧密码">
					<div class="hzlabel1">
						<div class="hzradio radio fz22 iconfont icon-yanjing-copy-copy" :class="{c1: !oldPswMark, c4: oldPswMark}" @click="showpsw(0)"></div>
					</div>
				</div>
				<div class="line-wrapper inp">
					<i class="icon iconfont icon-mima c4 fz20"></i>
					<input type="password" v-show="newPswMark" v-model="newPsw" maxlength="12" placeholder="新密码">
					<input type="text" v-show="!newPswMark" v-model="newPsw" maxlength="12" placeholder="新密码">
					<div class="hzlabel1">
						<div class="hzradio radio fz22 iconfont icon-yanjing-copy-copy" :class="{c1: !newPswMark, c4: newPswMark}" @click="showpsw(1)"></div>
					</div>
				</div>
				<div class="line-wrapper">
					<button class="login b1 c fz14 btn-active">修改</button>
				</div>
			</div>

		</div>
	</transition>

</template>

<script>
	
	import {XHeader} from 'vux'
	import hz_util from 'common/js/utils'

	export default {
		data() {
			return {
				oldPswMark: true,
				newPswMark: true,
				oldPsw : '',
				newPsw : ''
			}
		},
		methods: {
			showpsw(e) {
				e == 0 ? this.oldPswMark = !this.oldPswMark : this.newPswMark = !this.newPswMark
			}
		},
		components: {
			XHeader
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
	
	.modify-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	
	.wrapper {
		margin-top: 50px;
		padding: 0 5%;
	}
	
	.line-wrapper.inp {
		position: relative;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #EBEEF5;
	}
	
	.line-wrapper .icon {
		margin: 0 10px 0 5px;
		width: 24px;
		height: 24px;
		line-height: 24px;
		text-align: center;
		display: inline-block;
		vertical-align: middle;
	}
	
	.line-wrapper input {
		border: none;
		width: calc( 100% - 80px);
		height: 42px;
		vertical-align: middle;
	}
	
	.line-wrapper .login {
		margin: 10px 0 15px;
		width: 100%;
		height: 42px;
		border: none;
		border-radius: 5px;
	}
	
	footer {
		padding: 10px 0;
	}
	
	.hzlabel1 {
		position: absolute;
		top: 0;
		right: 10px;
	}
</style>