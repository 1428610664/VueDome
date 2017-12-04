<template>

	<transition name="move">
		<div class="select-user-wrapper b" v-show="showFlag">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">{{title}}
				<div @click="toSearch" slot="right" class="fz22 iconfont icon-search"></div>
			</x-header>
			<div class="content fz14" v-show="deptList.length > 0">
				<group>
					<popup-picker title="协办部门：" :data="deptList" v-model="dept"></popup-picker>
					<cell title="选择协办职员：" is-link @click.native="showPopup = true" v-show="dept.length > 0"></cell>
					
				</group>
				<div class="checker-wrapper">
					<h-checker @seleChange="seleChange" @delChange="delChange" :selete="selete" :list="list"></h-checker>
				</div>
				<div class="btn-wrapper">
					<button class="btn addbtn b1 c fz14 btn-active" @click="confirm">确认</button>
				</div>
			</div>
			<div class="loading-container" v-show="deptList.length == 0">
				<loading></loading>
			</div>
			
			<div v-transfer-dom>
	      		<popup v-model="showPopup" height="350px" :hide-on-blur="false">
			        <popup-header left-text="取消" right-text="确定" title="协办职员" :show-bottom-border="false" @on-click-left="close" @on-click-right="confirmPopup"></popup-header>
			        <group>
			        	<div style="max-height: 300px;overflow-y: auto;">
			        		<checklist :options="staffList.length > 0 ? staffList[0] : []" v-model="selStaff"></checklist>
			        	</div>
			        </group>
		      </popup>
			</div>
		</div>
	</transition>

</template>

<script>
	import Loading from 'base/loading/loading'
	import HChecker from 'base/h-checker/h-checker'
	import {  PopupHeader, Popup, TransferDom, Cell, XHeader, Group, PopupPicker, Checklist } from 'vux'
	import utils from 'common/js/utils'
	import { getAlldept, getDeptStandardList } from 'api/commonFlow'
	import { Toast } from 'common/js/H5Utils'
	import {mapGetters, mapMutations} from 'vuex'

	let deptList = [] // 部门集合 原始数据
	let staffList = [] // 部门下职员集合 原始数据

	export default {
		directives: {
			TransferDom
		},
		props: {
			selete: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				showFlag: false,
				showPopup: false,
				title: '选择指派人',
				type: 0, 		// type: 0协办 1指派
				deptList: [], 	// 部门集合
				staffList: [], 	// 部门下职员集合
				dept: [], 		// 部门
				selStaff: [],	// 全部职员
				staff: [], 		// 选中职员
				list: [],
				no: null,		// 事件Id
			}
		},
		computed: {
			...mapGetters([
				'searchStaffList',
			])
	   },
		methods: {
			...mapMutations({
				setStaffList: 'SET_STAFF_LIST'
			}),
			toSearch(){
				let path = this.$route.path
				this.$router.push({path: path + '/search',query:{mark: false}})				
			},
			seleChange(index, val){
				this.list[index].isSel = val
			},
			delChange(index){
				this.list.splice(index, 1)
			},
			confirmPopup(){
				this.close()
				for(let i= 0, ilen = this.selStaff.length; i < ilen; i++){
					let index = this._findIndex1(this.list, this.selStaff[i])
					if(index == -1){
						this.list.push({value: this.selStaff[i], isSel: false})
					}
				}
				this.selStaff = []
			},
			close(){
				this.showPopup = false
			},
			show(data, no, title) {
				if(no || no == 0){
					this.no = no
					this.title = title
				}
				this.showFlag = true
				this.setStaffList([])
				setTimeout(() => {
					this.getAlldept()
				}, 800)
				if(data){
					this._reverseData(data)
				}
			},
			hide() {
				this.showFlag = false
				if(this.no || this.no == 0){
					this.deptList = [] // 部门集合
					this.staffList = [] // 部门下职员集合
					this.staff = [] // 职员
					this.dept = [] // 部门
					this.list = []
					deptList = []
					staffList = []					
				}
			},
			confirm() {
				if(this.list.length == 0) {
					Toast('请选择指派部门')
					return
				}
				let parma = this._getParma(this.list)
				this.$emit("confirm", parma, 0, this.no)
				this.hide()
			},
			// 获取所有部门
			getAlldept() {
				getAlldept().then((data) => {
					if(data.Result) {
						deptList = data.Data
						this.deptList = []
						this.deptList.splice(0, 0, this._parse(data.Data))
					}
				})
			},
			// 获取部门下所有的职员
			getDeptStandardList(Parma) {
				this.selStaff = []
				getDeptStandardList(Parma).then((data) => {
					if(data.Result) {
						staffList = staffList.concat(data.Data)
						if(this.staffList.length > 0) {
							this.staffList.splice(0, 1, this._parse2(data.Data))
						} else {
							this.staffList.splice(0, 0, this._parse2(data.Data))
						}
					}
				})
			},
			_parse(data) {
				let result = []
				for(let i = 0, ilen = data.length; i < ilen; i++) {
					result.push(data[i].DeptName)
				}
				return result
			},
			_parse2(data) {
				let result = []
				for(let i = 0, ilen = data.length; i < ilen; i++) {
					result.push(data[i].PerName)
				}
				return result
			},
			_reverseData(data){
				this.list = []
				for(let i = 0, ilen = data.length; i < ilen; i++){
					this.list.push({value: data[i].name, isSel: data[i].value == 1})
				}
			},
			_reverseData1(data){
				for(let i = 0, ilen = data.length; i < ilen; i++){
					// 添加至原始数据中
					staffList.push({PerArchivePk: data[i].key, PerName: data[i].value})
					// 添加至选择列表中
					if(this._isExistList(data[i].value) == -1) {
						this.list.push({value: data[i].value, isSel: false})
					}
				}
			},
			_findIndex(data, val, flag) {
				return data.findIndex((item) => {
					return flag ? item.PerName == val : item.DeptName == val
				})
			},
			_findIndex1(data, val){
				return data.findIndex((item) => {
					return item.value == val
				})
			},
			_isExistList(val){
				return this.list.findIndex( (item) => {
					return item.value == val
				})
			},
			_getParma(list){
				let Parma = []
				for(let i = 0, ilen = this.list.length; i < ilen; i++){
					let index = this._findIndex(staffList, this.list[i].value, true)
					Parma.push({
							key: staffList[index].PerArchivePk,
							value: this.list[i].isSel ? 1 : 0,
							name: this.list[i].value
						})
				}
				return Parma
			}
		},
		watch: {
			dept: {
				handler(newValue, oldValue) {
					if(oldValue[0] != newValue[0]) {
						if(!newValue[0]) return
						this.staff.splice(0, 1)
						let index = this._findIndex(deptList, newValue[0])
						this.getDeptStandardList({
							deptCode: deptList[index].DeptCode
						})
					}
				},
				deep: true
			},
			searchStaffList: {
				handler(newValue, oldValue) {
					this._reverseData1(newValue)
					/*for(let i = 0, ilen = newValue.length; i < ilen; i++){
						// 添加至原始数据中
						staffList.push({PerArchivePk: newValue[i].key, PerName: newValue[i].value})
						// 添加至选择列表中
						if(this._isExistList(newValue[i].value) == -1) {
							this.list.push({value: newValue[i].value, isSel: false})
						}
					}*/
				},
				deep: true
			}
		},
		components: {
			PopupHeader, Popup, TransferDom,
			Cell,
			XHeader,
			Group,
			PopupPicker,
			Loading,
			HChecker,
			Checklist
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
	.select-user-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	
	.btn-wrapper {
		padding: 15px 5%;
	}
	
	.btn {
		margin-top: 80px;
		width: 100%;
		height: 42px;
		border: none;
		border-radius: 5px;
	}
	
	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
	
	.checker-wrapper {
		padding: 6px 3%;
	}
</style>