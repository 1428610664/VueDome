<template>

	<transition name="move">
		<div class="wrapper b"  v-show="showFlag">
			<x-header  :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">指派</x-header>
			<div class="content-wrapper fz14">
				<group label-width="5em" label-margin-right="1em" label-align="right">
					<cell title="指派用户" is-link :border-intent="false" @click.native="toSelUser"></cell>
				    <div class="sel-wrapper c4" v-show="userResult.length > 0">
				    	<h-checker @seleChange="seleUserChange" @delChange="delUserChange" :list="userList"></h-checker>
				    </div>
				    <cell title="指派岗位" is-link :border-intent="false" @click.native="toSelPost"></cell>
				    <div class="sel-wrapper c4" v-show="postResult.length > 0">
				    	<h-checker @seleChange="selePostChange" @delChange="delPostChange" :list="postList"></h-checker>
				    </div>
				</group>
				<div class="btn-wrapper">
					<button class="btn addbtn b1 c fz14 btn-active" @click="confirm">确认</button>
				</div>
			</div>
			
			<select-user ref="selectUser" @confirm="select"></select-user>
			<select-post ref="selectPost" @confirm="select"></select-post>
			<router-view></router-view>
		</div>
	</transition>

</template>

<script>
	
	import SelectUser from 'flow/select-user/select-user'
	import SelectPost from 'flow/select-user/select-post'
	import HChecker from 'base/h-checker/h-checker'
	import { XHeader, Cell, Group } from 'vux'
	import { Toast } from 'common/js/H5Utils'
	
	export default {
		data(){
			return {
				showFlag: false,
				eventNo: -1,
				userResult: [],
				postResult: [],
				userList: [],
				postList: []
			}
		},
		methods:{
			seleUserChange(index, val){
				this.userList[index].isSel = val
				this.userResult[index].value = val ? 1 : 0
			},
			delUserChange(index){
				this.userList.splice(index, 1)
				this.userResult.splice(index, 1)
			},
			selePostChange(index, val){
				this.postList[index].isSel = val
				this.postResult[index].value = val ? 1 : 0
			},
			delPostChange(index){
				this.postList.splice(index, 1)
				this.postResult.splice(index, 1)
			},
			show(no){
				this.showFlag = true
				this.eventNo = no
			},
			hide(){
				this.showFlag = false
			},
			toSelUser(){
				this.$refs.selectUser.show(this.userResult)
			},
			toSelPost(){
				this.$refs.selectPost.show(this.postResult)
			},
			select(data, mark){
				if(mark == 0){
					this.userResult = data
					this.userList = this._parseList(data)
				}else{
					this.postResult = data
					this.postList = this._parseList(data)
				}
			},
			confirm(){
				this.$emit("confirm", {userResult: this.userResult, postResult: this.postResult}, this.eventNo, true)
				this.hide()
			},
			_parseList(data){
				let list = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					list.push({
						value: data[i].name,
						isSel: data[i].value ? 1 : 0,
					})
				}
				return list
			}
		},
		components: {
			SelectUser,
			SelectPost,
			HChecker,
			XHeader, 
			Cell,
			Group
		}
	}

</script>

<style scoped>

	.wrapper{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	.content-wrapper {
		position: fixed;
		top: 46px;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		overflow-y: auto;
	}
	
	.sel-wrapper{
		margin-left: 20px;
		padding: 10px;
		border-top: 1px solid #d4d4d4;
	}
	
	.btn-wrapper {
		padding: 15px 5%;
	}
	
	.btn {
		margin-top: 40px;
		width: 100%;
		height: 42px;
		border: none;
		border-radius: 5px;
	}

</style>