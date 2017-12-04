<template>
	
	<div v-transfer-dom>
	    <popup v-model="selCustomTime" position="bottom" height="250px">
	    	<header class="b fbox">
				<div class="head-lef fz14 c2">取消</div>
				<div class="head-cont ct fz16 c1">{{selCustomTime}}</div>
				<div class="head-rig fz14 c1">确定</div>
			</header>
	        <group label-width="6em" label-margin-right="1em" label-align="right">
	           		<datetime title="开始时间：" v-model="OutsrcStdate" value-text-align="left"></datetime>
					<datetime title="结束时间：" v-model="OutsrcEddate" value-text-align="left"></datetime>
	        </group>
	    </popup>
	</div>
	
</template>

<script>
	
	import { TransferDom, Popup, Group, Datetime } from 'vux'
	export default {
		directives: {
		    TransferDom
		},
		props: {
			selCustomTime: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				OutsrcStdate: '',
				OutsrcEddate: ''
			}
		},
		components: {
			Popup, 
			Group, 
			Datetime
		}
	}
	
	
</script>

<style>
</style>