<template>
	
	<div>
		<div>
			<div class="desc-item" @click="editDesc(item, index)" v-for="(item, index) in OutSrcDetails">
				<div class="desc-info">
					<div class="desc-head fbox">
						<div class="flex">
							<p class="hzline1"><span class="c4">费用类型：</span> {{item.OutsrcProp == '01' ? '物业服务费' : '卫生消杀费'}}</p>
							<p class="hzline1"><span class="c4">完成是否：</span>{{item.Isoutsrcend?'是':'否'}}</p>
						</div>
						<div class="flex">
							<p class="hzline1"><span class="c4">支付金额：</span>{{item.Payamt}}</p>
							<p class="hzline1"><span class="c4">支付日期：</span>{{item.Paydate}}</p>
						</div>
					</div>
					<p class="remarks hzline1"><span class="c4">备注：</span>{{item.Descs}}</p>
				</div>
				<i class="icon iconfont icon-jiantou1"></i>
			</div>
		</div>
		<div class="add">
			<a href="javascript:void(0)" v-show="editable == 1" @click="shwoEditDesc" class="c1 fz15"> <span class="fz18">+</span> 添加明细</a>
		</div>
		
		<outsource-desc ref="editDesc" @add="addDesc" @adit="aditDesc" @del="delDessc"></outsource-desc>
		
	</div>
	
	
</template>

<script>
	
	import OutsourceDesc from 'components/outsource-desc/outsource-desc'
	import { delDetailById } from 'api/commonFlow'
	import { Toast } from 'common/js/H5Utils'
	
	
	export default {
		props: {
			OutSrcDetails: {
				type: Array,
				default: []
			},
			UrlPrefix: {
				type: String,
				default: ''
			},
			editable: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
			}
		},
		methods: {
			shwoEditDesc(){
				this.$refs.editDesc.show(null, 0)
			},
			editDesc(item, index){
				if(this.editable == 1){
					this.$refs.editDesc.show(item, 1, index)
				}
			},
			addDesc(data){
				this.OutSrcDetails.push(data)
				this.$emit("changeOutSrcDetails",this.OutSrcDetails)
			},
			delDessc(index){
				if(this.OutSrcDetails[index].Prikeyid){
					delDetailById(this.UrlPrefix, this.OutSrcDetails[index].Prikeyid).then((data) => {
						console.log("delDetailById："+JSON.stringify(data))
						if(data.Result){
							this.OutSrcDetails.splice(index, 1)
							this.$emit("changeOutSrcDetails",this.OutSrcDetails)
						}else{
							Toast("删除失败")
						}
					}, (error) => {
						
					})
				}else{
					this.OutSrcDetails.splice(index, 1)
					this.$emit("changeOutSrcDetails",this.OutSrcDetails)
				}
			},
			aditDesc(data, index){
				this.OutSrcDetails.splice(index, 0, data)
				this.OutSrcDetails.splice(index+1, 1)
				this.$emit("changeOutSrcDetails",this.OutSrcDetails)
			}
		},
		components: {
			OutsourceDesc
		}
	}
	
	
</script>

<style scoped>
	
.add a{width: 100%;height: 46px;line-height: 46px;display: block;text-align: center;}
.desc-wrapper .desc-item{position: relative;padding: 5px 5% 5px 3%;border-bottom: 1px solid #d4d4d4;}
.desc-wrapper .desc-item p{text-align: left;font-size: 13px;line-height: 24px;}
.desc-wrapper .desc-item .icon{position: absolute;top: 31px;right: 3%;width: 20px;height: 20px;text-align: center;line-height: 20px;}	
	
</style>