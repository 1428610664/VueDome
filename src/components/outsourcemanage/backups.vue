<template>
	
	<div class="outsourcem-wrapper b3">
		<header class="b1 fbox">
			<div class="head-lef"></div>
			<div class="head-cont ct fz16 c">外包服务管理</div>
			<div class="head-rig c fz14" @click="$router.goBack()">取消</div>
		</header>
		
		<div class="content fz14">
			<div class="content-wrapper b">
				<div class="line-cont">
					<div class="line-tit c4 ">外包单位：</div>
					<div class="line-info"><input type="text" v-model="Outsrcunit" /></div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">合同名称：</div>
					<div class="line-info"><input type="text" v-model="Outsrctitle" /></div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">合同金额：</div>
					<div class="line-info"><input type="text" v-model="Outsrcamt" /></div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">开始时间：</div>
					<div class="line-info" @click="showDateTime(0)">
						<input type="text" disabled="disabled" v-model="OutsrcStdate" />
						<i class="icon iconfont icon-jiantou1"></i>
					</div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">结束时间：</div>
					<div class="line-info" @click="showDateTime(1)">
						<input type="text" disabled="disabled" v-model="OutsrcEddate" />
						<i class="icon iconfont icon-jiantou1"></i>
					</div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">紧急程度：</div>
					<div class="line-info" @click="showDegree">
						<input type="text" disabled="disabled" v-model="Urgenlevel" />
						<i class="icon iconfont icon-jiantou1"></i>
					</div>
					<!--<div class="line-info hzradios ">
						<div class="hzlabel"><div mark="1" class="hzradio radio"><span class="rad"></span></div>平等</div>
						<div class="hzlabel"><div mark="0" class="hzradio radio"><span class="rad"></span></div>急件</div>
						<div class="hzlabel"><div mark="0" class="hzradio radio"><span class="rad"></span></div>加急</div>
					</div>-->
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">流程主题：</div>
					<div class="line-info"><input type="text" v-model="Flowtitle" /></div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">联系人：</div>
					<div class="line-info"><input type="text" v-model="Conman" /></div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">联系电话：</div>
					<div class="line-info"><input type="text" v-model="Conphone" /></div>
				</div>
				<div class="line-cont">
					<div class="line-tit c4 ">备注：</div>
					<div class="line-info"><input type="text" v-model="Descs" /></div>
				</div>
				<div class="line-cont describe-wrapper">
					<div class="line-tit c4 ">服务描述：</div>
					<div class="line-info">
						<textarea class="describe" v-model="Outsrcdescs" ></textarea>
					</div>
				</div>
			</div>
			<div class="content-wrapper b">
				<div class="desc-wrapper">
					<div class="desc-item" @click="editDesc(item, index)" v-for="(item, index) in OutSrcDetails">
						<div class="desc-info">
							<div class="desc-head fbox">
								<div class="flex">
									<p class="hzline1"><span class="c4">费用类型：</span> {{item.OutsrcProp}}</p>
									<p class="hzline1"><span class="c4">完成是否：</span>{{item.Isoutsrcend?'是':'否'}}</p>
								</div>
								<div class="flex">
									<p class="hzline1"><span class="c4">支付金额：</span>{{item.Payam}}</p>
									<p class="hzline1"><span class="c4">支付日期：</span>{{item.Paydatet}}</p>
								</div>
							</div>
							<p class="remarks hzline1"><span class="c4">备注：</span>{{item.Descs}}</p>
						</div>
						<i class="icon iconfont icon-jiantou1"></i>
					</div>
				</div>
				<div class="add">
					<a href="javascript:void(0)" @click="shwoEditDesc" class="c1 fz15"> <span class="fz18">+</span> 添加明细</a>
					<!--<router-link href="javascript:void(0)" :to="{path:'/apply/outsourcemanage/outsourceDesc',query: {type: 0}}" tag="a" class="c1 fz15"> <span class="fz18">+</span> 添加明细</router-link>-->
				</div>
			</div>
			<div class="content-wrapper b">
				<div class="line-cont">
					<div class="line-tit c4 ">快速意见：</div>
					<div class="line-info" @click="showOpinion">
						<input type="text" disabled="disabled" />
						<i class="icon iconfont icon-jiantou1"></i>
					</div>
					<!--<div class="line-info hzradios ">
						<div class="hzlabel"><div mark="1" class="hzradio radio"><span class="rad"></span></div>同意</div>
						<div class="hzlabel"><div mark="0" class="hzradio radio"><span class="rad"></span></div>拟办</div>
					</div>-->
				</div>
				<div class="line-cont describe-wrapper">
					<div class="line-tit c4 ">处理意见：</div>
					<div class="line-info">
						<textarea class="describe" v-model="Opinion" ></textarea>
					</div>
				</div>
			</div>
		</div>
	
		<footer class="b">
			<ul class="fbox fz16 c4">
				<li class="flex" @click="send">发送</li>
				<li class="flex">保存</li>
				<li class="flex">回退</li>
				<li class="flex" onclick="page.more.toggle()">更多</li>
			</ul>
		</footer>
		
		<div class="more-wrapper fz15 c4 b">
			<ul>
				<li>终止</li>
				<li>回溯</li>
				<li>指派</li>
			</ul>
		</div>
		<div class="more-bg" onclick="page.more.toggle()"></div>
		
		<router-view></router-view>
		
		<popup-radio :list="opinionList" ref="opinion" @select="opinionSelect" :currentIndex="opinionIndex"></popup-radio>
		<popup-radio :list="degreeList" ref="degree" @select="degreeSelect" :currentIndex="degreeIndex"></popup-radio>
		<outsource-desc ref="editDesc" @add="addDesc" @adit="aditDesc" @del="delDessc"></outsource-desc>
		
	</div>
	
</template>

<script>
	
	import PopupRadio from 'base/popup-radio/popup-radio'
	import OutsourceDesc from 'components/outsource-desc/outsource-desc'
	import { getFlowinfo, send } from 'api/outSrc'
	
	export default {
		data(){
			return {
				subMark: false, 	// 节流处理
				opinionList: [{text:'同意',value: '01'}, {text:'拟办',value: '02'}],
				opinionIndex: -1,
				degreeList: [{text:'平等',value: '01'}, {text:'急件',value: '02'}, {text:'加急',value: '03'}],
				degreeIndex: 0,
				
				Outsrcunit: '',	// 外包单位
				Outsrctitle: '',	// 合同名称
				Outsrcamt: '',	// 合同金额
				OutsrcStdate: '',	// 开始时间
				OutsrcEddate: '',	// 结束时间
				Urgenlevel: '',	// 紧急程度
				Flowtitle: '',	// 流程主题
				Conman: '',	// 联系人
				Conphone: '',	// 联系电话
				Descs: '',	// 备注
				Outsrcdescs: '',	//服务描述
				OutSrcDetails: [],	// 明细列表
				Opinion: '', //处理意见
			}
		},
		computed : {
			_nowDate(){
				let d = new Date()
				return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
			}
		},
		methods : {
			showDateTime(flag){
				let defaultDate = this._nowDate
				if(flag == 0){
					if(this.OutsrcStdate){
						defaultDate = this.OutsrcStdate
					}
				}else{
					if(this.OutsrcEddate){
						defaultDate = this.OutsrcEddate
					}
				}
				let _this = this
				this.$vux.datetime.show({
			        cancelText: '取消',
			        confirmText: '确定',
			        format: 'YYYY-MM-DD',
			        value: defaultDate,
			        onConfirm (val) {
			        	let date = val.replace("-","").replace("-","") * 1;
			        	if(flag == 0){
			        		if(_this.OutsrcEddate){
			        			let eTiem = _this.OutsrcEddate.replace("-","").replace("-","") * 1;
			        			if(date >= eTiem){
			        				_this.$vux.toast.text('开始时间不能大于结束时间', 'middle')
			        				return
			        			}
			        		}
			        		_this.OutsrcStdate = val
			        	}else{
			        		if(_this.OutsrcStdate){
			        			let sTiem = _this.OutsrcStdate.replace("-","").replace("-","") * 1;
			        			if(date <= sTiem){
			        				_this.$vux.toast.text('结束时间不能小于开始时间', 'middle')
			        				return
			        			}
			        		}
			        		_this.OutsrcEddate = val
			        	}
			        }
			    })
			},
			opinionSelect(index){
				this.opinionIndex = index
				this.Opinion = this.opinionList[index].text
			},
			showOpinion(){
				this.$refs.opinion.show()
			},
			degreeSelect(index){
				this.degreeIndex = index
				this.Urgenlevel = this.degreeList[index].text
			},
			showDegree(){
				this.$refs.degree.show()
			},
			shwoEditDesc(){
				this.$refs.editDesc.show(null, 0)
			},
			editDesc(item, index){
				this.$refs.editDesc.show(item, 1, index)
			},
			addDesc(data){
				this.OutSrcDetails.push(data)
			},
			aditDesc(data, index){
				this.OutSrcDetails.splice(index, 0, data)
				this.OutSrcDetails.splice(index+1, 1)
			},
			delDessc(index){
				this.OutSrcDetails.splice(index, 1)
			},
			send(){
				let reqData = this.$data
				delete reqData.opinionList
				delete reqData.opinionIndex
				delete reqData.degreeList
				delete reqData.degreeIndex
				
				console.log(JSON.stringify(reqData))
				if(this.subMark){
					return
				}
				this.subMark = true
				
				this.$vux.loading.show({text: '登陆中...'})
				send(reqData).then((data) => {
					this.subMark = false
					this.$vux.loading.hide()
					if(!data.Result){
						this.$vux.toast.text(data.Message, 'middle')
						return
					}
					console.log(JSON.stringify(data))
				}, (error) => {
					this.subMark = false
					this.$vux.loading.hide()
					console.log(JSON.stringify(error))
				})
				
			},
			getFlowinfo(){
				getFlowinfo({flowModelId:1330}).then((data) => {
					console.log(JSON.stringify(data))
				}, (error) => {
					console.log(JSON.stringify(error))
				})
			}
		},
		created(){
			setTimeout(() => {
				this.getFlowinfo()
				if(this.degreeIndex != -1){
					this.Urgenlevel = this.degreeList[this.degreeIndex].text
				}
				if(this.opinionIndex != -1){
					this.Opinion = this.opinionList[this.opinionIndex].text
				}
			},20)
		},
		components:{
			PopupRadio,
			OutsourceDesc
		}
	}
	
</script>

<style scoped>
	
.outsourcem-wrapper{position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 22;overflow-y: auto;}
.content{margin: 46px 0 45px;}
.content-wrapper:nth-child(n+2){margin-top: 8px;}
.line-cont{display: -webkit-box;display: -ms-flexbox;display:flex;padding: 0 3%;position: relative;}
.line-cont:nth-child(n+2){border-top: 1px solid #f8f9fd;}
.line-cont .line-tit{-webkit-flex: 0 0 80px;-ms-flex: 0 0 80px;flex:0 0 80px;line-height: 46px;text-align: right;}
.line-cont .line-info{-webkit-flex: 1;-ms-flex: 1;flex: 1;height: 46px;}
.line-cont.describe-wrapper .line-tit{line-height: 116px;}
.line-cont.describe-wrapper .describe{padding: 8px;width: 80%;height: 100px;border: none;}
.line-cont .line-info input{margin-top: 2px;padding-left: 6px;display: block;width: 80%;height: 42px;border: none;background: #fff;}
.line-cont .line-info .icon{position: absolute;top: 13px;right: 3%;display: block;width: 20px;height: 20px;line-height: 24px;text-align: center;}
.add a{width: 1005;height: 46px;line-height: 46px;display: block;text-align: center;}
.desc-wrapper .desc-item{position: relative;padding: 5px 5% 5px 3%;border-bottom: 1px solid #f8f9fd;}
.desc-wrapper .desc-item p{text-align: left;font-size: 13px;line-height: 24px;}
.desc-wrapper .desc-item .icon{position: absolute;top: 31px;right: 3%;width: 20px;height: 20px;text-align: center;line-height: 20px;}

.hzradios .hzlabel{display: inline-block;line-height: 50px;margin-right: 8px;}
.hzradio{width: 16px;height: 16px;border:1px solid #ddd;border-radius: 50%;display: inline-block;vertical-align: text-bottom;margin-right: 3px;}
.hzradio[mark="1"] .rad{width: 10px;height: 10px;border-radius: 50%;display:block;margin:3px auto;}
.hzradio[mark="1"]{border:1px solid #3D5C99;}

.more-wrapper{position: fixed;bottom: 45px;right: 10px;z-index: 12;display: none;width: 110px;line-height: 45px;text-align: center;border-radius: 2px;box-shadow: 0 0 2px #e7e7e7;}
.more-wrapper li:nth-child(n+2):before{content: "";display: block;border-top: 1px solid #ddd;transform: scaleY(.4);}
.more-wrapper li:active{background: #f0f0f0;}
.more-bg{position: fixed;top: 0;left: 0;z-index: 11;width: 100%;height: 100%;display: none;}

footer{position: fixed;bottom: 0;left: 0;z-index: 10;width: 100%;height: 45px;line-height: 45px;}
footer:before{content:"";width: 100%;height: 1px;background: #3D5C99;position: absolute;top: -1px;left: 0;transform: scaleY(.5);}
footer .flex{position: relative;}
footer .flex:active{background: #f0f0f0;}
footer .flex:nth-child(n+2):before{content:"";width: 1px;height: 60%;background: #3D5C99;position: absolute;top: 20%;left: 0;transform: scaleX(.5);}

	
	
</style>