<template>

	<transition name="move">
		<div class="select-user-wrapper b" v-show="showFlag">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">{{title}}
				<div @click="toSearch" slot="right" class="fz22 iconfont icon-search"></div>
			</x-header>
			<div class="content fz14" v-show="options.length > 0">
				<div class="list-wrapper">
					<div class="checker-wrapper">
						<h-checker @seleChange="seleChange" @delChange="delChange" :list="list"></h-checker>
					</div>
					<checklist :options="options" v-model="checklist"></checklist>
				</div>
				<div class="btn-wrapper">
					<button class="btn addbtn b1 c fz14 btn-active" @click="confirm">确认</button>
				</div>
			</div>
			<div class="loading-container" v-show="options.length == 0">
				<loading></loading>
			</div>
		</div>
	</transition>

</template>

<script>
	import Loading from 'base/loading/loading'
	import HChecker from 'base/h-checker/h-checker'
	import { XHeader, Group, Checklist } from 'vux'
	import utils from 'common/js/utils'
	import { searchjob } from 'api/search'
	import { Toast } from 'common/js/H5Utils'
	
	import {mapGetters, mapMutations} from 'vuex'

	let originalList = [] // 原始数据

	export default {
		data() {
			return {
				showFlag: false,
				title: '选择岗位',

				options: [],
				checklist: [],

				list: []
			}
		},
		computed: {
			...mapGetters([
				'postList',
			])
	   },
		methods: {
			...mapMutations({
				setPostList: 'SET_POST_LIST'
			}),
			toSearch() {
				let path = this.$route.path
				this.$router.push({
					path: path + '/search',
					query: {
						mark: true
					}
				})
			},
			searchjob() {
				searchjob({
					key: ''
				}).then((data) => {
					originalList = data.Data
					this.options = this._parseData(data.Data)
				})
			},
			insetChecklist(data){
				if(data){
					this.checklist = []
					for(let i = 0, ilen = data.length; i < ilen; i++){
						this.checklist.push(data[i].name)
					}
				}
			},
			seleChange(index, val) {
				this.list[index].isSel = val
			},
			delChange(index) {
				let delVal = this.list[index]
				this.checklist.splice(this.checklist.indexOf(delVal.value), 1)
				this.list.splice(index, 1)
			},
			show(data) {
				this.showFlag = true
				this.setPostList([])
				if(this.options.length == 0)this.searchjob()
				this.insetChecklist(data)
				setTimeout(() => {
					this.stateChange(data)
				}, 20)
			},
			hide() {
				this.showFlag = false
			},
			_parseData(data) {
				let arr = []
				for(let i = 0, ilen = data.length; i < ilen; i++) {
					arr.push(data[i].Postjobname)
				}
				return arr
			},
			_parseCheck(ndata){
				let arr = []
				for(let i = 0, ilen = ndata.length; i < ilen; i++){
					if(this._isExistList(ndata[i]) == -1) {
						arr.push({value: ndata[i], isSel: false})
					}
				}
				return arr
			},
			_isExistList(val){
				return this.list.findIndex( (item) => {
					return item.value == val
				})
			},
			_findIndex(list, val){
				return list.findIndex((item) => {
					return item.Postjobname == val
				})
			},
			_findIndex2(val){
				return this.list.findIndex((item) => {
					return item.value == val
				})
			},
			_getParma(list){
				let Parma = []
				for(let i = 0, ilen = this.list.length; i < ilen; i++){
					let index = this._findIndex(originalList, this.list[i].value)
					Parma.push({
						key: originalList[index].Postjobcode,
						value: this.list[i].isSel ? 1 : 0,
						name: originalList[index].Postjobname
					})
				}
				return Parma
			},
			stateChange(data){
				for(let i = 0, ilen = data.length; i <ilen; i++){
					let index = this._findIndex2(data[i].name)
					this.list[index].isSel = data[i].value == 1
				}
			},
			confirm() {
				if(this.list.length == 0){
					Toast("请选择岗位")
					return
				}
				let parma = this._getParma(this.list)
				this.$emit("confirm", parma, 1)
				this.hide()
			},
		},
		watch: {
			checklist: {
				handler(ndata, odata) {
					if(ndata.length > odata.length || ndata.length == odata.length){
						this.list = this.list.concat(this._parseCheck(ndata))
					}else{
						for(let i = 0, ilen = odata.length; i < ilen; i++){
							if(ndata.indexOf(odata[i]) == -1){
								this.list.splice(this._isExistList(odata[i]), 1)
							}
						}
					}
				},
				deep: true
			},
			postList:{
				handler(ndata) {
					for(let i = 0, ilen = ndata.length; i < ilen; i++){
						let _i = this.checklist.indexOf(ndata[i].value)
						if(_i == -1){
							this.checklist.push(ndata[i].value)
						}
					}
				},
				deep: true
			}
		},
		components: {
			Loading,
			HChecker,

			XHeader,
			Group,
			Checklist
		}
	}
</script>

<style scoped>
	.select-user-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	
	.list-wrapper {
		height: calc( 100vh - 107px);
		overflow-y: auto;
		border-bottom: 1px solid #3D5C99;
	}
	
	.btn-wrapper {
		padding: 9px 5%;
	}
	
	.btn {
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
		padding: 6px 10px;
	}
</style>