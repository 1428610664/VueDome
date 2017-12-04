<template>
	<div>
		<v-header></v-header>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<v-footer></v-footer>
	</div>
</template>

<script>
	
	import Header from 'components/header/header'
	import Footer from 'components/footer/footer'
	import {mapGetters, mapMutations} from 'vuex'
	import {getInfo} from 'api/me'
	import {setIsLogin, setUserInfo} from 'common/js/cache'
	import { initBack } from 'common/js/H5Utils'
	
	
	export default {
		components: {
			'v-header': Header,
			'v-footer': Footer
		},
		methods: {
			...mapMutations({
				setUserData : 'SET_USERDATA'
			}),
			getInfo(){
				getInfo().then((data) => {
					if(data.Result){
						const udata = Object.assign({}, this.userData, data.Data)
						this.setUserData(udata)
					}
				})
			}
		},
		computed: {
			...mapGetters([
				'isLogin',
				'userData'
			])
		},
		created(){
			initBack()
			if(window.plus)console.log("【created】this.isLogin："+this.isLogin)
			if(this.isLogin){
				this.getInfo()
				this.$router.replace({path:"/home"})
			}else{
				if(window.plus)console.log("【created】To path：/login")
				this.$router.replace({path:"/login"})
			}
		},
		watch : {
			isLogin(login){
				if(login) {
					this.$router.replace({path:"/home"});
					this.getInfo()
				}else{
					this.$router.replace({path:"/login"})
				}
				setIsLogin(login)
				if(window.plus)console.log("【watch】change isLogin："+login)
			},
			userData(newData){
				setUserInfo(newData)
			}
		}
	}
	
</script>