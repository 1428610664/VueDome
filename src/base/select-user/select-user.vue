<template>
	
	<transition name="move">
		<div class="select-user-wrapper b" v-show="showFlag">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">{{title}}</x-header>
			<div class="content fz14">
				<group>
					<popup-picker title="协办部门：" :data="deptList" v-model="dept"></popup-picker>
					<popup-picker title="协办职员：" :data="staffList" v-model="staff" v-show="dept.length"></popup-picker>
				</group>
				
				<div class="btn-wrapper">
					<button class="btn addbtn b1 c fz14 btn-active" @click="confirm">确认</button>
				</div>
			</div>
		</div>
	</transition>
	
</template>

<script>
	
	
	import Loading from 'base/loading/loading'
	import { XHeader, Group, PopupPicker } from 'vux'
	import utils from 'common/js/utils'
	import { getAlldept, getDeptStandardList} from 'api/outSrc'
	import { TOAST_POS } from 'common/js/config'
	
	let deptList = []	// 部门集合 原始数据
	let staffList = []	// 部门下职员集合 原始数据
	
	let markVal = ''
	
	export default {
		data(){
			return {
				showFlag : false,
				title: '',
				type: 0,	// type: 0协办 1指派
				deptList: [],	// 部门集合
				staffList: [],	// 部门下职员集合
				dept: [],		// 部门
				staff: []		// 职员
				
			}
		},
		methods: {
			show(title, type){ // type: 0协办 1指派
				if(type == 0){
					markVal = "协办"
				}else if(type == 1){
					markVal = "指派"
				}
				this.showFlag = true
				this.type = type
				this.title = title
				this.getAlldept()
			},
			hide(){
				this.showFlag = false
				this.type = 0
				this.deptList = []	// 部门集合
				this.staffList = []	// 部门下职员集合
				this.staff = []		// 职员
				this.dept = []		// 部门
				deptList = []	
				staffList = []	
			},
			confirm(){
				if(utils.isEmpty(this.dept[0])){
					this.$vux.toast.text('请选择'+markVal+'部门', TOAST_POS)
					return
				}
				if(utils.isEmpty(this.staff[0])){
					this.$vux.toast.text('请选择'+markVal+'职员', TOAST_POS)
					return
				}
				let index = this._findIndex(staffList, this.staff[0], true)
				this.$emit("confirm",{id: staffList[index].PerArchivePk, type: this.type})
				this.hide()
			},
			// 获取所有部门
			getAlldept(){
				getAlldept().then((data) => {
					if(data.Result){
						this.$vux.loading.hide()
						deptList = data.Data
						this.deptList.splice(0, 0, this._parse(data.Data))
					}
				})
			},
			// 获取部门下所有的职员
			getDeptStandardList(Parma){
				getDeptStandardList(Parma).then((data) => {
					if(data.Result){
						staffList = data.Data
						if(this.staffList.length > 0){
							this.staffList.splice(0, 1, this._parse2(data.Data))
						}else{
							this.staffList.splice(0, 0, this._parse2(data.Data))
						}
					}
				})
			},
			_parse(data){
				let result = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					result.push(data[i].DeptName)
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
					return flag ? item.PerName == val : item.DeptName == val
				})
			}
		},
		watch: {
			dept: {
				handler(newValue, oldValue) {
					if(oldValue[0] != newValue[0]){
						if(!newValue[0]) return
						this.staff.splice(0, 1)
						let index = this._findIndex(deptList,newValue[0])
						this.getDeptStandardList({deptCode: deptList[index].DeptCode})
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
	
</style>