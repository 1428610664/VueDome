<template>
	<transition name="move">
		<div class="outsourcem-desc-wrapper b" v-show="showFlag">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="hide">{{title}}</x-header>
	
			<div class="content fz14">
				<group label-width="5em" label-margin-right="1em" label-align="right">
					<selector title="费用类型：" :options="costEnum" v-model="OutsrcProp"></selector>
					<x-input novalidate :icon-type="novalidate.Payamt" ref="Payamt" @on-change="PayamtFn" title="支付金额："  type="number" v-model="Payamt"></x-input>
					<datetime title="支付日期："  clear-text="手动输入" @on-clear="manualInput()" :required="novalidate.Paydate" v-model="Paydate" value-text-align="left"></datetime>
					<x-switch title="是否完成：" v-model="Isoutsrcend"></x-switch>
					<x-input novalidate :icon-type="novalidate.Descs"  ref="Descs" @on-change="DescsFn" title="明细备注：" v-model="Descs"></x-input>
				</group>
				
				<div class="wrapper b">
					<button class="btn addbtn b1 c fz14 btn-active" v-show="type === 0" @click="add">添加</button>
					<button class="btn b1 c fz14 btn-active" v-show="type === 1" @click="edit">修改</button>
					<button class="btn c btnR fz14 btn-active" v-show="type === 1" @click="del">删除</button>
				</div>
			</div>
			
			<div v-transfer-dom>
			    <popup v-model="novalidate.CustomTime" position="bottom"  :hide-on-blur="false">
			    	<header class="b fbox">
						<div class="head-lef fz14 c2" @click="closeCustomTime">取消</div>
						<div class="head-cont ct fz16 c1">支付日期</div>
						<div class="head-rig fz14 c1" @click="confirmCustomTime">确定</div>
					</header>
			        <group label-width="5em" label-margin-right="1em" label-align="right">
		           		<x-input title="年：" type="number" :min="4" :max="4" v-model="novalidate.year" @on-blur="yearChange" />
		           		<x-input title="月：" type="number" :max="2" v-model="novalidate.mouth" @on-blur="mouthChange" />
		           		<x-input title="日：" type="number" :max="2" v-model="novalidate.day" @on-blur="dayChange" />
			        </group>
			    </popup>
			</div>
			
		</div>
	</transition>
</template>

<script>
	
	import { XHeader, Group, XSwitch, XInput, Popup, TransferDom, XTextarea, Selector, Datetime} from 'vux'
	import utils from 'common/js/utils'
	import { Toast } from 'common/js/H5Utils'
	import { getEnum } from 'api/commonFlow'
	
	let OutsrcProp = ''
	export default {
		directives: {
		    TransferDom
		},
		data() {
			return {
				showFlag: false,
				type: 0,
				currentIndex: -1,
				costEnum: [],
				novalidate: {
					Payamt: '',
					Descs: '',
					Paydate: false,
					year: '',
					mouth: '',
					day: '',
					CustomTime: false
				},
				
				OutsrcProp: '',
				Payamt: '',
				Paydate: utils.getCurrentDate(),
				Descs: '',
				Isoutsrcend: false,
				Prikeyid: null,
				RentOutsrcid: null
			}
		},
		created(){
			setTimeout( () => {
				this.getEnum()
			}, 20)
		},
		methods: {
			PayamtFn(val){
				this.novalidate.Payamt = (utils.isEmpty(val) || !utils.isNumber(val)) ? "error": ""
			},
			DescsFn(val){
				this.novalidate.Descs = utils.isEmpty(val) ? "error": ""
			},
			show(item, type, index){
				this.showFlag = true
				this.type = type
				if(item){
					this.currentIndex = index
					this.OutsrcProp = item.OutsrcProp
					this.Payamt = item.Payamt
					this.Paydate = item.Paydate
					this.Descs = item.Descs
					this.Isoutsrcend = item.Isoutsrcend == 0 ? false : true,
					this.Prikeyid = item.Prikeyid,
					this.RentOutsrcid = item.RentOutsrcid
				}
			},
			hide(){
				this._refresh()
				this.showFlag = false
			},
			add(){
				let flag = this._validate()
				if(flag){
					this.$emit("add",{
						OutsrcProp: this.OutsrcProp,
						Payamt: this.Payamt,
						Paydate: this.Paydate,
						Descs: this.Descs,
						Isoutsrcend: this.Isoutsrcend,
						Prikeyid: null,
						RentOutsrcid: null
					})
					this.hide()
				}
			},
			edit(){
				let flag = this._validate()
				if(flag){
					this.$emit("adit",{
						OutsrcProp: this.OutsrcProp,
						Payamt: this.Payamt,
						Paydate: this.Paydate,
						Descs: this.Descs,
						Isoutsrcend: this.Isoutsrcend,
						Prikeyid: this.Prikeyid,
						RentOutsrcid: this.RentOutsrcid
					}, this.currentIndex)
					this.hide()
				}
			},
			del(){
				this.$emit("del",this.currentIndex)
				this.hide()
			},
			getEnum(){
				getEnum("outsrc_prop").then((data) => {
					if(data.length > 0){
						this.costEnum = this._parseEnum(data)
					}
				},() => {
					
				})
			},
			manualInput(){
				this.novalidate.CustomTime = true
			},
			closeCustomTime(){
				this.novalidate.CustomTime = false
				this.novalidate.year = ''
				this.novalidate.mouth = ''
				this.novalidate.day = ''
			},
			confirmCustomTime(){
				if(utils.isEmpty(this.novalidate.year)){
					Toast("请输入年份")
					return
				}
				if(utils.isEmpty(this.novalidate.mouth)){
					Toast("请输入月份")
					return
				}
				if(utils.isEmpty(this.novalidate.day)){
					Toast("请输入日期")
					return
				}
				let day = utils.getDays(this.novalidate.year, this.novalidate.mouth)
				if(this.novalidate.day > day){
					Toast("请输入正确的日期")
					return
				}
				let date = this.novalidate.year+"-"+this.check(this.novalidate.mouth)+"-"+this.check(this.novalidate.day)
				this.Paydate = date
				this.closeCustomTime()
			},
			check(i){
				if(String(i).length >= 2){
					return i
				}
				return i < 10 ? "0"+i : i
			},
			yearChange(val){
				let year = new Date().getFullYear()
				if(val > (year + 30) || val < (year - 30)){
					Toast("年份请输入在"+(year - 30)+"~"+(year + 30))
					this.novalidate.year = ''
				}
			},
			mouthChange(val){
				if(val > 12 || val <= 0){
					this.novalidate.mouth = ''
					Toast("输入正确的月份")
				}
			},
			dayChange(val){
				if(val > 31 || val <= 0){
					this.novalidate.day = ''
					Toast("输入正确的日期")
				}
			},
			_parseEnum(data){
				let arr = []
				for(let i= 0, ilen = data.length; i < ilen; i++){
					if(i == 0){
						OutsrcProp = data[i].EnumCode
						this.OutsrcProp = data[i].EnumCode
					}
					arr.push({key: data[i].EnumCode, value: data[i].EnumValue})
				}
				return arr
			},
			_validate(){
				if(utils.isEmpty(this.OutsrcProp)){
					Toast('请输入费用类型')
					return
				}
				if(utils.isEmpty(this.Payamt)){
					this.novalidate.Payamt = "error"
					Toast('请输入支付金额')
					this.$refs.Payamt.focus()
					return;
				}
				if(!utils.isNumber(this.Payamt)){
					Toast('请输入正确的支付金额')
					this.$refs.Payamt.focus()
					return
				}
				if(utils.isEmpty(this.Paydate)){
					this.novalidate.Paydate = true
					Toast('请选择支付日期')
					return
				}
				if(utils.isEmpty(this.Descs)){
					this.novalidate.Descs = "error"
					Toast('请输入明细备注')
					this.$refs.Descs.focus()
					return
				}
				return true
			},
			_findIndex(list, val){
				return list.findIndex((item) => {
					return item.text == val
				})
			},
			_refresh(){
				this.OutsrcProp = OutsrcProp
				this.Payamt = ''
				this.Paydate = utils.getCurrentDate()
				this.Descs = ''
				this.Isoutsrcend = false
				setTimeout(() => {
					this.novalidate = {
						Payamt: '',
						Descs: '',
						Paydate: false,
						year: '',
						mouth: '',
						day: '',
						CustomTime: false
					}
				}, 20)
			}
		},
		computed: {
			title(){
				return this.type == 0 ? "添加详细" : "编辑详细"
			},
			_nowDate(){
				let d = new Date()
				return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
			}
		},
		components:{
			XHeader,
			XSwitch, 
			Group,
			XInput, 
			Popup,
			XTextarea, 
			Selector, 
			Datetime
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
	.outsourcem-desc-wrapper{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	
	
	.wrapper:nth-child(n+2) {
		margin-top: 8px;
	}
	
	.wrapper:nth-child(2) {
		padding: 15px 5%;
	}
	
	.line-cont {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		padding: 0 3%;
		position: relative;
	}
	
	.line-cont:nth-child(n+2) {
		border-top: 1px solid #f8f9fd;
	}
	
	.line-cont .line-tit {
		-webkit-flex: 0 0 80px;
		-ms-flex: 0 0 80px;
		flex: 0 0 80px;
		line-height: 46px;
		text-align: right;
	}
	
	.line-cont .line-info {
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		height: 46px;
	}
	
	.line-cont.describe-wrapper .line-tit {
		line-height: 116px;
	}
	
	.line-cont.describe-wrapper .describe {
		padding: 8px;
		width: 80%;
		height: 100px;
		border: none;
	}
	
	.line-cont .line-info input {
		margin-top: 2px;
		padding-left: 6px;
		display: block;
		width: 80%;
		height: 42px;
		border: none;
		background: #fff;
	}
	
	.line-cont .line-info .icon {
		position: absolute;
		top: 13px;
		right: 3%;
		display: block;
		width: 20px;
		height: 20px;
		line-height: 24px;
		text-align: center;
	}
	
	.add a {
		width: 1005;
		height: 46px;
		line-height: 46px;
		display: block;
		text-align: center;
	}
	
	.btn {
		width: 100%;
		height: 42px;
		border: none;
		border-radius: 5px;
	}
	
	.btn:nth-child(n+2) {
		margin-top: 10px;
	}
	
	.mui-switch {
		margin: 8px;
	}
</style>