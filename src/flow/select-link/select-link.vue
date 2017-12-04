<template>
	
	<transition name="move">
		<div class="select-user-wrapper b" v-show="showFlag">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">{{title}}</x-header>
			<div class="content fz14" v-show="linkList.length > 0">
				<group label-width="5em" label-margin-right="1em" label-align="right">
					<popup-picker title="选择环节：" :data="linkList" v-model="link"></popup-picker>
					<cell title="添加用户：" is-link :border-intent="false" @click.native="toSelUser"  v-show="link.length"></cell>
					<!--<popup-picker title="环节处理职员：" :data="linkUserList" v-model="linkUser" v-show="link.length"></popup-picker>-->
				</group>
				<div class="checker-wrapper">
					<h-checker @seleChange="seleUserChange" @delChange="delUserChange" :list="list"></h-checker>
				</div>
				<div class="btn-wrapper">
					<button class="btn addbtn b1 c fz14 btn-active" @click="confirm">确认</button>
				</div>
			</div>
			<div class="loading-container" v-show="linkList.length == 0">
				<loading></loading>
			</div>
			
			
			<select-user ref="seluser" :selete="true" @confirm="selectUser"></select-user>
		</div>
	</transition>
	
</template>

<script>
	
	
	import Loading from 'base/loading/loading'
	import SelectUser from 'flow/select-user/select-user'
	import HChecker from 'base/h-checker/h-checker'
	import { XHeader, Group, Cell, PopupPicker } from 'vux'
	import utils from 'common/js/utils'
	import { getNodeByModelId, getNodeUserList} from 'api/commonFlow'
	import { Toast } from 'common/js/H5Utils'
	
	let linkList = []	// 环节集合 原始数据
	let linkUserList = []	// 环节下职员集合 原始数据
	
	export default {
		data(){
			return {
				showFlag : false,
				title: '选择环节处理职员',
				linkList: [],	// 环节集合
				linkUserList: [],	// 环节下职员集合
				link: [],		// 环节
				linkUser: [],		// 环节职员
				list: []
			}
		},
		methods: {
			seleUserChange(index, val){
				this.list[index].isSel = val
			},
			delUserChange(index){
				this.list.splice(index, 1)
			},
			
			
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
				this.list = []
				linkList = []	
				linkUserList = []	
			},
			confirm(){
				if(utils.isEmpty(this.link[0])){
					Toast('请选择环节')
					return
				}
				let index = this._findIndex(linkList, this.link[0])
				this.$emit("confirm",{
					'Skip.Value': linkList[index].FlowNodeName,
					'Skip.Key': linkList[index].FlowNodeId,
					'Skip.Type': linkList[index].TypeId,
					'Skip.Users': this._getUsers(this._getParma(this.list)).Users,
					'Skip.UserPks': this._getUsers(this._getParma(this.list)).Pks
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
						this.list = []
						linkUserList = linkUserList.concat(data.Data)
						for(let i = 0, ilen = data.Data.length;  i < ilen; i++){
							let _i = this._findIndex1(this.list, data.Data[i].PerName)
							if(_i == -1)this.list.push({value: data.Data[i].PerName, isSel: data.Data[i].IsPk == 1})
						}
						/*linkUserList = data.Data
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
						}*/
					}
				})
			},
			
			toSelUser(){
				this.$refs.seluser.show(null , 0, '选择用户')
			},
			selectUser(data, mark, i){
				this._reverseData(data)
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
			_findIndex1(data, val){
				return data.findIndex((item) => {
					return item.value == val
				})
			},
			_reverseData(data){
				// this.list = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					let index = this._findIndex1(this.list, data[i].name)
					if(index == -1)this.list.push({value: data[i].name, isSel: data[i].value == 1})
					let _i = this._findIndex(linkUserList, data[i].name, true)
					if(_i == -1)linkUserList.push({PerArchivePk: data[i].key,PerName: data[i].name})
				}
			},
			/*_reverseData1(data){
				let arr = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					// 添加至原始数据中
					arr.push({PerArchivePk: data[i].key, PerName: data[i].value})
				}
				return arr
			},*/
			_getUsers(data){
				let Users = ''
				let Pks = ''
				for(let i = 0, ilen = data.length; i < ilen; i++){
					Users += data[i].key+","
					Pks += (data[i].IsPk ? 1 : 0)+","
				}
				Users = Users.substring(0, Users.length - 1)
				Pks = Pks.substring(0, Pks.length - 1)
				return {Users: Users, Pks: Pks}
			},
			_getParma(list){
				let Parma = []
				for(let i = 0, ilen = this.list.length; i < ilen; i++){
					let index = this._findIndex(linkUserList, this.list[i].value, true)
					Parma.push({
						key: linkUserList[index].PerArchivePk,
						value: this.list[i].value,
						IsPk: this.list[i].isSel
					})
				}
				return Parma
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
			Cell,
			PopupPicker,
			SelectUser,
			HChecker,
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
	
	.checker-wrapper {
		padding: 6px 3%;
	}
	
</style>