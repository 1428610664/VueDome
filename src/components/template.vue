<template>

	<transition name="move">
		<div class="wrapper b">
			<x-header :left-options="{backText: ''}">附件</x-header>
			<div class="content-wrapper fz14">
				
			</div>
			<div class="loading-container hide">
				<loading></loading>
			</div>
		</div>
	</transition>

</template>

<script>

	import Loading from 'base/loading/loading'
	import { XHeader} from 'vux'
	import { Toast } from 'common/js/H5Utils'
	
	export default {
		data(){
			return {
				
			}
		},
		components: {
			XHeader,
			Loading
		}
	}

</script>

<style scoped>

	.wrapper{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 26;
		overflow-y: auto;
	}
	.content-wrapper {
		position: fixed;
		top: 46px;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		overflow-y: auto;
	}


</style>