<template>
	
	<transition name="move">
		<div class="select-user-wrapper b" v-show="showFlag">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">{{title}}</x-header>
			<div class="content fz14" v-show="linkList.length > 0">
				<group>
					<popup-picker title="环节：" :data="linkList" v-model="link"></popup-picker>
					<popup-picker title="环节处理职员：" :data="linkUserList" v-model="linkUser" v-show="link.length"></popup-picker>
				</group>
				
				<div class="btn-wrapper">
					<button class="btn addbtn b1 c fz14 btn-active" @click="confirm">确认</button>
				</div>
			</div>
			<div class="loading-container" v-show="linkList.length == 0">
				<loading></loading>
			</div>
		</div>
	</transition>
	
</template>

<script>
	
	
	import Loading from 'base/loading/loading'
	import { XHeader, Group, PopupPicker } from 'vux'
	import utils from 'common/js/utils'
	import { getNodeByModelId, getNodeUserList} from 'api/commonFlow'
	import { Toast } from 'common/js/H5Utils'
	
	let linkList = []	// 环节集合 原始数据
	let linkUserList = []	// 环节下职员集合 原始数据
	
	let markVal = ''
	
	export default {
		data(){
			return {
				showFlag : false,
				title: '选择环节处理职员',
				linkList: [],	// 环节集合
				linkUserList: [],	// 环节下职员集合
				link: [],		// 环节
				linkUser: []		// 环节职员
				
			}
		},
		methods: {
			show(data, i){
				this.showFlag = true
				this.eventIndex = i
				setTimeout(() => {
					this.getNodeByModelId(data)
				}, 800)
			},
			hide(){
				this.showFlag = false
				this.linkList = []	// 环节集合
				this.linkUserList = []	// 环节下职员集合
				this.linkUser = []		// 环节职员
				this.link = []		// 环节
				linkList = []	
				linkUserList = []	
			},
			confirm(){
				if(utils.isEmpty(this.link[0])){
					Toast('请选择环节')
					return
				}
				/*if(utils.isEmpty(this.linkUser[0])){
					Toast('请选择环节处理职员')
					return
				}*/
				let index = this._findIndex(linkList, this.link[0])
				let index2 = this._findIndex(linkUserList, this.linkUser[0], true)
				this.$emit("confirm",{
					'Skip.Value': linkList[index].FlowNodeName,
					'Skip.Key': linkList[index].FlowNodeId,
					'Skip.Type': linkList[index].TypeId,
					'Skip.Users': this._getUsers(linkUserList).Users,
					'Skip.UserPks': this._getUsers(linkUserList).Pks
				}, this.eventIndex)
				this.hide()
			},
			// 获取所有环节
			getNodeByModelId(data){
				getNodeByModelId(data).then((data) => {
					if(data.Result){
						linkList = data.Data
						this.linkList.splice(0, 0, this._parse(data.Data))
					}
				})
			},
			// 获取环节下所有的职员
			getNodeUserList(Parma){
				getNodeUserList(Parma).then((data) => {
					if(data.Result){
						linkUserList = data.Data
						if(this.linkUserList.length > 0){
							if(this._parse2(data.Data).length == 0){
								this.linkUserList.splice(0, 1)
							}else{
								this.linkUserList.splice(0, 1, this._parse2(data.Data))
							}
						}else{
							if(this._parse2(data.Data).length == 0){
								this.linkUserList.splice(0, 0)
							}else{
								this.linkUserList.splice(0, 0, this._parse2(data.Data))
							}
						}
					}
				})
			},
			_parse(data){
				let result = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					result.push(data[i].FlowNodeName)
				}
				return result
			},
			_parse2(data){
				let result = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					result.push(data[i].PerName)
				}
				return result
			},
			_findIndex(data, val, flag){
				return data.findIndex((item) => {
					return flag ? item.PerName == val : item.FlowNodeName == val
				})
			},
			_getUsers(data){
				let Users = ''
				let Pks = ''
				for(let i = 0, ilen = data.length; i < ilen; i++){
					Users += data[i].PerArchivePk+","
					Pks += data[i].IsPk+","
				}
				Users = Users.substring(0, Users.length - 1)
				Pks = Pks.substring(0, Pks.length - 1)
				return {Users: Users, Pks: Pks}
			}
		},
		watch: {
			link: {
				handler(newValue, oldValue) {
					if(oldValue[0] != newValue[0]){
						if(!newValue[0]) return
						this.linkUser.splice(0, 1)
						let index = this._findIndex(linkList,newValue[0])
						this.getNodeUserList({flownodeId: linkList[index].FlowNodeId})
					}
				},
				deep: true
			}
		},
		components: {
			XHeader, 
			Group,
			PopupPicker,
			Loading
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
	.select-user-wrapper{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	
	.btn-wrapper{
		padding: 15px 5%;
	}
	.btn {
		margin-top: 80px;
		width: 100%;
		height: 42px;
		border: none;
		border-radius: 5px;
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
	
</style>