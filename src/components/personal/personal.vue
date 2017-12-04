<template>
	<transition name="move">
		<div class="personal-wrapper b3">
			<x-header :left-options="{backText: ''}">个人中心</x-header>
			<div class="content-wrapper">
				<!--<div class="portrait-wrapper b" @click="showContent004 = !showContent004">-->
				<div class="portrait-wrapper b">
					<div class="portrait"><img width="100%" height="100%" v-lazy="loadImg" id="portrait" /></div>
					<div class="personal-info">
						<div >
							<p class="name fz14" id="username">{{userData.UserName}}</p>
							<p class="fz15">部门：<span id="dept-dame">{{userData.DeptName}}</span></p>
						</div>
					</div>
				</div>
				<ul class="mlistbox fz16 c4">
					<li class="mlist" @click="tomidifyPSW">
						<i class="icon iconfont icon-xiugai fz20 c1"></i>
						<span>修改密码</span>
						<span class="fr fz15 c3" id="nickname"></span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</li>
				</ul>
				
				<div class="slide" :class="showContent004 ? 'animate' : ''">
					<div>blablabla...</div>
					<div>blablabla...</div>
					<div>blablabla...</div>
					<div>blablabla...</div>
				</div>
			</div>
			<div class="footbtn ct fz14 btnR c  btn-active" @click="quit">退出登录</div>
			
			<confirm ref='confirm' title='提示' text='确认退出？' :confirmBtn="confirmBtn" @select="confirmSelect"></confirm>
			<router-view ></router-view>
		</div>
	</transition>
</template>

<script>
	
	import {XHeader} from 'vux'
	import confirm from 'base/confirm/confirm'
	import {mapGetters, mapMutations} from 'vuex'
	import {logout} from 'api/login'
	import {removeToken} from 'common/js/cache'
	
	
	export default {
		data(){
			return {
				loadImg: "http://192.168.0.188:8081/UpLoads/49D7CC924CC548AEA4EB60677AB75318/test.png",
				confirmBtn: ['取消','确定'],
				showContent004: false
			}
		},
		components : {
			confirm,
			XHeader
		},
		methods : {
			quit(){
				if(window.plus){
					let _this = this
					plus.nativeUI.confirm("确认退出登录？", function(e){
						if(e.index==1){
							_this.logout()
						}
					},"提示",["取消","确定"])
				}else{
					this.$refs.confirm.show()
				}
			},
			logout(){
				logout().then((data) => {
					if(data.Result){
						removeToken()
						this.setLogin(false)
					}
				})
			},
			tomidifyPSW(){
				this.$router.push({path: '/me/personal/modifypsw'})
			},
			confirmSelect(index){
				if(index == 1){
					this.logout()
				}
			},
			...mapMutations({
				setLogin : 'SET_ISLOGIN'
			})
		},
		computed : {
			...mapGetters([
				'userData'
			])
		}
	}
	
</script>

<style scoped>
	
.personal-wrapper{position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 22;}
.footbtn{margin: 25px 3% ;width: 94%;height: 42px;line-height: 42px;border-radius: 5px;}
.portrait-wrapper{display: -webkit-box;display: -ms-flexbox;display:flex;width: 94%;padding: 10px 3%;}
.portrait-wrapper .portrait{-webkit-flex: 0 0 90px;-ms-flex: 0 0 70px;flex:0 0 70px;height:70px;}
.portrait-wrapper .personal-info{-webkit-flex: 1;-ms-flex: 1;flex: 1;margin-left: 10px;}
.portrait-wrapper .personal-info > div{display: table-cell;vertical-align: middle;height:70px;}
.portrait-wrapper .personal-info .name{margin-bottom: 5px;}


.slide {
  padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
}
.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}
</style>