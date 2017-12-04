<template>

	<transition name="move">
		<div class="enclosure-wrapper b">
			<x-header :left-options="{backText: ''}">{{title}}</x-header>
			<div class="search-wrapper b1">
				<div class="search-box b">
					<i class="icon-search iconfont"></i>
					<input type="text" v-model="val" class="c4" :placeholder="placeholder" />
					<i class="dismiss iconfont icon-shanchu" v-show="val.length > 0" @click="del"></i>
				</div>
			</div>
			<div class="content-wrapper fz14" v-show="list.length">
				<div class="list-wrapper">
					<checklist :options="list" v-model="selList"></checklist>
				</div>
				<div class="continue b1 c ct fz14 btn-active" @click="confirm">确定</div>
			</div>
			<div class="loading-container">
				<not-result v-show="!list.length"></not-result>
			</div>
		</div>
	</transition>

</template>

<script>
	
	import { XHeader,Checklist } from 'vux'
	import { Toast } from 'common/js/H5Utils'
	import utils from 'common/js/utils'
	import NotResult from 'base/not-result/not-result'
	import { searchStandardList, searchjob } from 'api/search'
	import {mapMutations} from 'vuex'
	
	
	export default {
		data() {
			return {
				isJob: this.$route.query.mark,
				title: '',
				val: '',
				placeholder: '',
				list: [],			// 列表数据
				currentList: [],	// 查询原始数据
				selList: []			// 选中数据
			}
		},
		created() {
			setTimeout( () => {
				this.setPostList([])
				this.placeholder = this.isJob ? "搜索岗位..." : "搜索职员..."
				this.title = this.isJob ? "搜索岗位" : "搜索职员"
				if(this.isJob)this.search('')
			}, 20)
			this.$watch('val', utils.debounce((nVal) => {
				nVal.trim() ? this.search(nVal) : this.list = []
			}, 200))
	    },
		methods: {
			...mapMutations({
				setPostList: 'SET_POST_LIST',
				setStaffList: 'SET_STAFF_LIST'
			}),
			del(){
				this.val = ''
			},
			search(v){
				this.currentList = []
				this.selList = []
				
				if(this.isJob){
					searchjob({key: v}).then((data) => {
						this.list = this._parse(data.Data, true)
						this.currentList = data.Data
					})
				}else{
					searchStandardList({key: v}).then((data) => {
						this.list = this._parse(data.Data)
						this.currentList = data.Data
					})
				}
			},
			confirm(){
				let arr = [], i = 0, ilen = this.selList.length
				for( ; i < ilen; i++){
					let index = this._findIndex(this.selList[i])
					arr.push({key: this.currentList[index][this.isJob ? "Postjobcode" : "PerArchivePk"], value: this.selList[i]})
				}
				this[this.isJob ? "setPostList": "setStaffList"](arr)
				window.history.back()
			},
			_parse(data, mark){
				let arr = [], i = 0, ilen = data.length
				for( ; i < ilen; i++){
					arr.push(mark ? data[i].Postjobname : data[i].PerName)
				}
				return arr
			},
			_findIndex(val){
				return this.currentList.findIndex((item) => {
					return item[this.isJob ? "Postjobname" : "PerName"] == val
				})
			}
		},
		components: {
			XHeader,
			NotResult,
			Checklist
		}
	}
</script>

<style scoped>
	.enclosure-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		overflow-y: auto;
	}
	
	.content-wrapper {
		position: fixed;
		top: 96px;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		overflow-y: auto;
	}
	.list-wrapper{
		width: 100%;
		height: calc( 100% - 61px);
		border-bottom: 1px solid #3D5C99;
		overflow-y: auto;
	}
	.search-wrapper {
		padding: 8px 3%;
		margin-top: -1px;
	}
	
	.search-box {
		position: relative;
		border-radius: 4px;
		overflow: hidden;
		padding: 2px 0 2px 25px;
	}
	
	i {
		width: 22px;
		height: 22px;
		line-height: 22px;
		text-align: center;
		position: absolute;
		top: 6px;
	}
	.icon-search{
		left: 3px;
	}
	.dismiss {
		padding: 0 3px;
		right: 3px;
	}
	
	.search-wrapper input {
		border: none;
		height: 26px;
		width: 80%;
	}
	
	.continue {
		margin:9px auto;
		width: 94%;
		height: 42px;
		line-height: 42px;
		border: none;
		border-radius: 5px;
	}
</style>