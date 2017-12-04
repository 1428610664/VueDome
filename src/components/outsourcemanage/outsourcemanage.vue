<template>
	<transition name="move">
		<div class="outsourcem-wrapper b3">
			<x-header :left-options="{backText: '',preventGoBack: true}" @on-click-back="back">{{Flowid ? '外包服务管理' : $route.query.title}}<a v-show="Flowid" @click="toProcess" slot="right">处理过程</a></x-header>
			<div  id="content" class="content fz14" :class="{posFooter: FlowActions.length == 0}">
				<div v-show="flowInfoData">
					<group label-width="5em" label-margin-right="1em" label-align="right">
						<x-input title="单据编码：" :readonly="true" v-show="Flowid" v-model="RentOutsrccode"></x-input>
						<datetime :required="novalidate.RentOutsrcdate" clear-text="手动输入" @on-clear="manualInput(2)" title="业务日期：" :readonly="_check(FormShow.dscRentoutsrcdate)" v-show="_check(FormShow.dscRentoutsrcdate, true)" v-model="RentOutsrcdate" value-text-align="left"></datetime>
						<x-input title="经办人：" :readonly="true" v-show="Flowid" v-model="CreatEmp"></x-input>
						<x-input novalidate :icon-type="novalidate.Outsrcunit" ref="novalidate" @on-change="OutsrcunitFn" title="外包单位：" :readonly="_check(FormShow.txtOutsrcunit)" v-show="_check(FormShow.txtOutsrcunit, true)" v-model="Outsrcunit"></x-input>
						<x-input novalidate :icon-type="novalidate.Outsrctitle" ref="Outsrctitle" @on-change="OutsrctitleFn" title="合同名称：" :readonly="_check(FormShow.txtoutsrctitle)" v-show="_check(FormShow.txtoutsrctitle, true)" v-model="Outsrctitle"></x-input>
						<x-input title="合同编码：" :readonly="_check(FormShow.txtOutsrcbillcode)" v-show="_check(FormShow.txtOutsrcbillcode, true)" v-model="Outsrcbillcode"></x-input>
						<x-input novalidate :icon-type="novalidate.Outsrcamt" ref="Outsrcamt" @on-change="OutsrcamtFn" title="合同金额：" :readonly="_check(FormShow.txtoutsrcamt)" v-show="_check(FormShow.txtoutsrcamt, true)" type="number" v-model="Outsrcamt"></x-input>
						<datetime :required="novalidate.OutsrcStdate" clear-text="手动输入" @on-clear="manualInput(0)" title="开始时间：" :readonly="_check(FormShow.dscoutsrc_stdate)" v-show="_check(FormShow.dscoutsrc_stdate, true)" @on-change="sDateChange" v-model="OutsrcStdate" value-text-align="left"></datetime>
						<datetime :required="novalidate.OutsrcEddate" clear-text="手动输入" @on-clear="manualInput(1)" title="结束时间：" :readonly="_check(FormShow.dscoutsrc_eddate)" v-show="_check(FormShow.dscoutsrc_eddate, true)" @on-change="eDateChange" v-model="OutsrcEddate" value-text-align="left"></datetime>
						<selector v-model="urgenlevel" :options="novalidate.urgenlevelList" title="紧急程度：" :readonly="_check(FormShow.ddlurgenlevel)" v-show="_check(FormShow.ddlurgenlevel, true)"></selector>
						<x-input novalidate :icon-type="novalidate.Flowtitle" ref="Flowtitle" @on-change="FlowtitleFn" title="流程主题：" :readonly="_check(FormShow.txtflowtitle)" v-show="_check(FormShow.txtflowtitle, true)" v-model="Flowtitle"></x-input>
						<x-input novalidate :icon-type="novalidate.Conman" ref="Conman" @on-change="ConmanFn" title="联系人：" :readonly="_check(FormShow.txtConman)" v-show="_check(FormShow.txtConman, true)" v-model="Conman" :max="10"></x-input>
						<x-input novalidate :icon-type="novalidate.Conphone" ref="Conphone" @on-change="ConphoneFn" title="联系电话："  :readonly="_check(FormShow.txtConphone)" v-show="_check(FormShow.txtConphone, true)" v-model="Conphone" :max="11"></x-input>
						<x-input novalidate :icon-type="novalidate.Descs" title="备注：" :readonly="_check(FormShow.txtDescs)" v-show="_check(FormShow.txtDescs, true)" v-model="Descs"></x-input>
						<x-textarea title="服务描述：" :readonly="_check(FormShow.txtOutsrcdescs)" v-show="_check(FormShow.txtOutsrcdescs, true)" v-model="Outsrcdescs" placeholder="请填写服务描述" :show-counter="false" :rows="3" :max="100"></x-textarea>
					</group>
					<div class="b desc-wrapper" v-show="_check(FormShow.tblDetail, true)">
						<add-desc @changeOutSrcDetails="changeOutSrcDetails" :editable="FormShow.tblDetail ? FormShow.tblDetail.edittable : 0" :UrlPrefix="UrlPrefix" :OutSrcDetails="DetailList"></add-desc>
					</div>
					<group label-width="5em" label-margin-right="1em" label-align="right">
						<selector v-model="novalidate.Opinion" title="快速意见：" @on-change="OpinionChange" :readonly="_check(FormShow.txtopinion)" v-show="_check(FormShow.txtopinion, true)" :options="['同意','拟办']"></selector>
						<x-textarea :readonly="_check(FormShow.txtopinion)" v-show="_check(FormShow.txtopinion, true)" title="处理意见：" v-model="Opinion" placeholder="请填写处理意见" :show-counter="false" :rows="3" :max="100"></x-textarea>
					</group>
					<div class="enclosure b" v-show="_check(FormShow.linkattact, true)" @click="toEnclosureList(_check(FormShow.linkattact))">
						<enclosure :FlowAttListSize="cptUpLoadListSize"></enclosure>
					</div>
				</div>
				<div class="loading-container" v-show="!flowInfoData">
					<loading></loading>
				</div>
			</div>
			<out-footer ref="outFooter" :FlowActions="FlowActions" @event="event"></out-footer>
			<assign ref="assign" @confirm="selectUser"></assign>
			<select-user ref="CoUser" :selete="false" @confirm="selectCoUser"></select-user>
			
			<select-link ref="selectLink" @confirm="selectLink"></select-link>
			<form id="upform0">
				<input type="file" name="file" style="display: none;" id="file0" @change="changeFile0" />
			</form>
			<router-view></router-view>
			
			<div v-transfer-dom>
			    <popup v-model="novalidate.CustomTime" position="bottom"  :hide-on-blur="false">
			    	<header class="b fbox">
						<div class="head-lef fz14 c2" @click="closeCustomTime">取消</div>
						<div class="head-cont ct fz16 c1">{{novalidate.isStartTime == 0 ? "开始时间" : novalidate.isStartTime == 1 ? "结束时间" : "业务日期"}}</div>
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
	
	import Loading from 'base/loading/loading'
	import Assign from 'flow/assign/assign'
	import SelectUser from 'flow/select-user/select-user'
	import SelectLink from 'flow/select-link/select-link'
	import AddDesc from 'base/add-desc/add-desc'
	import OutFooter from 'flow/out-footer/out-footer'
	
	import { formMixin } from "flow/mixin/mixin"
	import Enclosure from 'flow/enclosure/enclosure'
	import { Group, XInput, XHeader, XTextarea, Popup, TransferDom, Selector, Datetime, PopupPicker } from 'vux'
	import utils from 'common/js/utils'
	import { Toast } from 'common/js/H5Utils'
	
	import 'common/js/jquery.form'
	
	export default {
		directives: {
		    TransferDom
		},
		mixins: [formMixin],
		data() {
			return {
				novalidate: {
					urgenlevelList: [],			// 紧急程度列表
					RentOutsrcdate: false,
					Outsrcunit: '',
					Outsrctitle: '',
					Outsrcbillcode: '',
					Outsrcamt: '',
					OutsrcStdate: false,
					OutsrcEddate: false,
					Flowtitle: '',
					Conman: '',
					Conphone: '',
					Descs: '',
					year: '',
					mouth: '',
					day: '',
					txtopinion: '',
					CustomTime: false,
					isStartTime: 0
					
				},
				UrlPrefix: 'outsrc', 		// 页面请求前缀
				CreatEmp: '',				// 经办人
				
				RentOutsrccode: '',			// 单据编码
				RentOutsrcdate: utils.getCurrentDate(),			// 业务日期
				Outsrcunit: '', 			// 外包单位
				Outsrctitle: '', 			// 合同名称
				Outsrcbillcode: '',			// 合同编码
				Outsrcamt: '', 				// 合同金额
				OutsrcStdate: utils.getCurrentDate(), 			// 开始时间
				OutsrcEddate: '', 			// 结束时间
				urgenlevel: '', 			// 紧急程度
				Flowtitle: '', 				// 流程主题
				Conman: '', 				// 联系人
				Conphone: '', 				// 联系电话
				Descs: '', 					// 备注
				Outsrcdescs: '', 			// 服务描述
				DetailList: [], 			// 明细列表
				Opinion: '', 				// 处理意见
				UpLoadList: [],				// 附件列表
			}
		},
		methods: {
			manualInput(val){
				this.novalidate.isStartTime =  val
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
				if(this.novalidate.isStartTime == 0){
					this.OutsrcStdate = date
				}else if(this.novalidate.isStartTime == 1){
					this.OutsrcEddate = date
				}else{
					this.RentOutsrcdate = date
				}
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
			
			
			OutsrcunitFn(val){
				this.novalidate.Outsrcunit = utils.isEmpty(val) ? "error": ""
			},
			OutsrctitleFn(val){
				this.novalidate.Outsrctitle = utils.isEmpty(val) ? "error": ""
			},
			OutsrcamtFn(val){
				this.novalidate.Outsrcamt = utils.isEmpty(val) ? "error": ""
			},
			FlowtitleFn(val){
				this.novalidate.Flowtitle = utils.isEmpty(val) ? "error": ""
			}, 
			ConmanFn(val){
				this.novalidate.Conman = utils.isEmpty(val) ? "error": ""
			}, 
			ConphoneFn(val){
				this.novalidate.Conphone = utils.isPhone(this.Conphone) ? "": "error"
			},
			changeOutSrcDetails(data) {
				this.DetailList = data
			},
			sDateChange(val) {
				let date = val.replace("-", "").replace("-", "") * 1
				if(this.OutsrcEddate) {
					let eTiem = this.OutsrcEddate.replace("-", "").replace("-", "") * 1
					if(date > eTiem) {
						Toast('开始时间不能大于结束时间')
						setTimeout(() => {
							this.OutsrcStdate = ''
						}, 10)
						return
					}
				}
				this.OutsrcStdate = val
			},
			eDateChange(val) {
				let date = val.replace("-", "").replace("-", "") * 1
				if(this.OutsrcStdate) {
					let sTiem = this.OutsrcStdate.replace("-", "").replace("-", "") * 1
					if(date < sTiem) {
						Toast('结束时间不能小于开始时间')
						setTimeout(() => {
							this.OutsrcEddate = ''
						}, 10)
						return
					}
				}
				this.OutsrcEddate = val
			},
			OpinionChange(val){
				this.Opinion += val
			},
			_validate() {
				if(utils.isEmpty(this.RentOutsrcdate)){
					if(this.FormShow.dscRentoutsrcdate.edittable == 1){
						Toast('请选择业务日期')
						this.novalidate.RentOutsrcdate = true
						return
					}
				}
				if(utils.isEmpty(this.Outsrcunit)) {
					if(this.FormShow.txtOutsrcunit.edittable == 1){
						Toast('请输入外包单位')
						this.novalidate.Outsrcunit = "error"
						this.$refs.novalidate.focus()
						return
					}
				}
				if(utils.isEmpty(this.Outsrctitle)) {
					if(this.FormShow.txtoutsrctitle.edittable == 1){
						Toast('请输入合同名称')
						this.novalidate.Outsrctitle = "error"
						this.$refs.Outsrctitle.focus()
						return
					}
				}
				if(utils.isEmpty(this.Outsrcamt)) {
					if(this.FormShow.txtoutsrcamt.edittable == 1){
						Toast('请输入合同金额')
						this.novalidate.Outsrcamt = "error"
						this.$refs.Outsrcamt.focus()
						return
					}
				}
				if(!utils.isNumber(this.Outsrcamt)){
					Toast('请输入合同金额')
					this.$refs.Outsrcamt.focus()
					this.novalidate.Outsrcamt = "error"
					return
				}
				if(utils.isEmpty(this.OutsrcStdate)) {
					if(this.FormShow.dscoutsrc_stdate.edittable == 1){
						this.novalidate.OutsrcStdate = true
						Toast('请选择开始时间')
						return						
					}
				}
				if(utils.isEmpty(this.OutsrcEddate)) {
					if(this.FormShow.dscoutsrc_eddate.edittable == 1){
						this.novalidate.OutsrcEddate = true
						Toast('请选择结束时间')
						return
					}
				}

				if(utils.isEmpty(this.urgenlevel)) {
					if(this.FormShow.ddlurgenlevel.edittable == 1){
						Toast('请选择紧急程度')
						return						
					}
				}
				if(utils.isEmpty(this.Flowtitle)) {
					if(this.FormShow.txtflowtitle.edittable == 1){
						this.novalidate.Flowtitle = "error"
						Toast('请输入流程主题')
						this.$refs.Flowtitle.focus()
						return						
					}
				}
				if(utils.isEmpty(this.Conman)) {
					if(this.FormShow.txtConman.edittable == 1){
						Toast('请输入联系人')
						this.novalidate.Conman = "error"
						this.$refs.Conman.focus()
						return						
					}
				}
				if(this.FormShow.txtConphone.edittable == 1){
					if(utils.isEmpty(this.Conphone)) {
						Toast('请输入联系电话')
						this.novalidate.Conphone = "error"
						this.$refs.Conphone.focus()
						return
					}
					if(!utils.isPhone(this.Conphone)) {
						Toast('联系电话错误')
						this.$refs.Conphone.focus()
						return			
					}					
				}
				if(this.DetailList.length == 0){
					if(this.FormShow.tblDetail.edittable == 1){
						Toast('请添加明细')
						return						
					}
				}
				if(utils.isEmpty(this.Opinion)){
					if(this.FormShow.txtopinion.edittable == 1){
						Toast('请输入处理意见')
						return						
					}
				}
				
				return true
			}
		},
		components: {
			Loading,
			Assign,
			SelectUser,
			SelectLink,
			AddDesc,
			OutFooter,
			Enclosure,
			
			Group,
			XInput,
			XHeader,
			XTextarea,
			Selector,
			Datetime,
			PopupPicker,
			Popup
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
	.outsourcem-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 22;
		overflow-y: auto;
	}
	
	.content {
		position: absolute;
		top: 46px;
		left: 0;
		bottom: 45px;
		width: 100%;
		overflow-y: auto;
	}
	.content.posFooter{bottom: 0px;}
	
	.enclosure{margin-top: 6px;}
	
	.desc-wrapper {
		margin-top: 6px;
	}
	
	.loading-container,
	.not-result-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>