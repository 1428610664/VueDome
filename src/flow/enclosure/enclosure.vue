<template>

	<div class="enclosure-wrapper">
		<div class="enclosure-tit c4 ">附件：</div>
		<div class="enclosure-info">
			<div class="info-wrapper c4 hide">
				<div class="file-icon iconfont icon-xlsx" style="color: #84C139;"></div>
				<div class="file-icon iconfont icon-doc1" style="color: #4CABFF;"></div>
				<div class="file-icon iconfont icon-image" style="color: #37BB91;"></div>
			</div>
			<p class="not-enclosure" v-show="FlowAttListSize == 0">暂无附件</p>
			<p class="not-enclosure" v-show="FlowAttListSize > 0">共有{{FlowAttListSize}}个附件</p>
			<i class="icon iconfont icon-jiantou1"></i>
		</div>
	</div>

</template>

<script>

	

	export default {
		props: {
			FlowAttListSize: {
				type: Number,
				default: 0
			}
		}
	}

</script>

<style scoped>
	.enclosure-wrapper {
		display: flex;
		padding: 0 15px;
		position: relative;
	}
	
	.enclosure-wrapper:nth-child(n+2) {
		border-top: 1px solid #f8f9fd;
	}
	
	.enclosure-wrapper .enclosure-tit {
		flex: 0 0 6em;
		line-height: 46px;
		text-align: right;
	}
	
	.enclosure-wrapper .enclosure-info {
		flex: 1;
		height: 46px;
		margin: 0 20px 0 3px;
		color: #999;
	}
	
	.enclosure-wrapper .enclosure-info .not-enclosure {
		line-height: 46px;
	}
	
	.enclosure-wrapper .enclosure-info .info-wrapper {
		padding: 5px 0;
		font-size: 0px;
	}
	
	.enclosure-wrapper .enclosure-info .info-wrapper .file-icon {
		width: 36px;
		height: 36px;
		line-height: 36px;
		text-align: center;
		display: inline-block;
		font-size: 26px;
	}
	
	.enclosure-wrapper .enclosure-info .icon {
		position: absolute;
		top: 13px;
		right: 3%;
		display: block;
		width: 20px;
		height: 20px;
		line-height: 24px;
		text-align: center;
	}
</style>