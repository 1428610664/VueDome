<template>

	<div class="content">
		<scroll ref="scroll" :data="commonList" class="recommend-content">
			<div>
				<router-link to="/me/personal" tag="div" class="my-head ct">
					<div class="portrait"><img v-lazy="loadImg" width="100%" height="100%" /></div>
					<p class="name fz14"><span id="dept-dame">{{user.DeptName}}</span>：<span class="c1" id="username">{{user.UserName}}</span></p>
				</router-link>
				<ul class="mlistbox fz16 c4">
					<router-link to="/me/notice" tag="li" class="mlist">
						<i class="icon fz20 c1 iconfont icon-youxiang1"></i>
						<span>公告通知</span>
						<span class="num c btnR fr fz12" v-show="noticeCount > 0">{{noticeCount > 99 ? '99+' : noticeCount}}</span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</router-link>
					<router-link to="/pending" tag="li" class="mlist">
						<i class="icon fz20 c1 iconfont icon-liebiao1"></i>
						<span>我的待办</span>
						<span class="num c btnR fr fz12" v-show="taskCount > 0">{{taskCount > 99 ? '99+' : taskCount}}</span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</router-link>
					<router-link :to="{path:'/me/myapply',query: {id: 0}}" tag="li" class="mlist">
						<i class="icon fz20 c1 iconfont icon-shengqing"></i>
						<span>我的申请</span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</router-link>
					<router-link :to="{path:'/me/myapply',query: {id: 1}}" tag="li" class="mlist">
						<i class="icon fz20 c1 iconfont icon-shenpi"></i>
						<span>我已审批</span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</router-link>
					<router-link :to="{path:'/me/my-process'}" tag="li" class="mlist">
						<i class="icon fz20 c1 iconfont icon-liucheng"></i>
						<span>我的流程</span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</router-link>
				</ul>
				<ul class="mlistbox fz16 c4">
					<li class="mlist">
						<i class="icon fz20 c1 iconfont icon-changyonggongneng"></i>
						<span>常用申请</span>
						<i class="i_more"></i>
					</li>
					<li class="mlist" v-for="item in commonList">
						<span>{{item.FlowModelName}}</span>
						<i class="i_more iconfont icon-jiantou1"></i>
					</li>
				</ul>
			</div>
		</scroll>
		
			<router-view></router-view>
		
	</div>

</template>

<script>
	
	import Scroll from 'base/scroll/scroll'
	import {mapGetters} from 'vuex'
	import {privateTask} from 'api/me'

	export default {
		data() {
			return {
				loadImg: "http://192.168.0.188:8081/UpLoads/49D7CC924CC548AEA4EB60677AB75318/test.png",
				commonList: []
			}
		},
		methods : {
			privateTask(){
				privateTask().then((data) => {
					if(data.Result){
						this.commonList = data.Data
					}
				}, (error) => {
					
				})
			}
		},
		computed: {
			user(){
				return this.userData
			},
			...mapGetters([
				'userData',
				'noticeCount',
				'taskCount',
				'isLogin'
			])
		},
		activated(){
			if(!this.isInit){
				this.isInit = true
				this.privateTask()
			}
		},
		watch: {
			'$route' (to, from) {
				let isBack = this.$router.isBack;
				if(isBack) {
					this.transitionName = 'slide-right'　　　　　
				} else {
					this.transitionName = 'slide-left'　　　　　
				}
				this.$router.isBack = false
				if(to.path == "/me"){
					setTimeout(() => {
						this.$refs.scroll.refresh()
					}, 20)
				}
			},
			isLogin(login){
				if(!login){
					this.commonList = []
					this.isInit = false
				}
			}
		},
		components: {
			Scroll
		}
	}
</script>

<style scoped>
	.content {
		position: fixed;
		top: 46px;
		bottom: 50px;
		left: 0;
		z-index: 15;
		width: 100%;
	}
	
	.recommend-content {
		overflow: hidden;
		height: 100%;
	}
	
	.my-head {
		padding: 40px 0;
		background: #8aa0d0;
	}
	
	.my-head .portrait {
		margin: 0 auto 8px;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
	}
	
	.mlistbox:nth-last-child(1) .mlist:nth-child(n+3):before {
		left: calc(3% + 30px);
	}
	
	.mlistbox .num {
		margin: 14px 0;
		display: inline-block;
		padding: 1px 7px;
		line-height: 18px;
		border-radius: 20px;
	}

</style>