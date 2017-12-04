<template>
	<header class="b1 fbox">
		<div class="head-lef c" @click="toLogin">login</div>
		<div class="head-cont ct fz16 c">{{title}}</div>
		<div class="head-rig c"></div>
	</header>
</template>

<script>
	import { mapMutations } from 'vuex'

	export default {
		data() {
			return {
				title: ''
			}
		},
		methods: {
			toLogin() {
				this.setLogin(false)
			},
			_changeTitle(path) {
				switch(path) {
					case "/home":
						this.title = "首页"
						break
					case "/apply":
						this.title = "申请"
						break
					case "/pending":
						this.title = "待办"
						break
					case "/me":
						this.title = "我"
						break
				}
			},
			...mapMutations({
				setLogin: 'SET_ISLOGIN'
			})
		},
		watch: {
			'$route' (to, from) {
				this._changeTitle(to.path)
				if(window.plus)console.log("【watch】$route："+to.path)
			}
		}
	}
</script>

<style scoped>

</style>