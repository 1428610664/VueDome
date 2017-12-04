<template>
	<div class="checker-wrapper">
		<div class="checker-item" v-for="(item, index) in list" @click="select(index)">
			<i class="delete" @click.stop="del(index)">X</i>
			<i v-if="selete" class="selete iconfont icon-dui c" :style="{background: item.isSel ? '#3D5C99': '#fff', border: item.isSel ? '1px solid #3D5C99': '1px solid #ccc'}"></i> {{item.value}}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: []
			},
			selete: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			del(index) {
				this.$emit("delChange", index)
			},
			select(index) {
				this.$emit("seleChange", index, !this.list[index].isSel)
			}
		}
	}
</script>

<style scoped>
	.checker-item {
		position: relative;
		margin: 0 10px 10px 0;
		display: inline-block;
		padding: 10px 10px 10px 5px;
		min-width: 74px;
		text-align: center;
		border-radius: 3px;
		border: 1px solid #ccc;
		background-color: #fff;
		color: #95A6C2;
	}
	
	.checker-item .delete {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 20px;
		height: 20px;
		line-height: 20px;
		background: #ea2b47;
		color: #fff;
		text-align: center;
		border-radius: 50%;
		font-size: 12px;
	}
	
	.checker-item .selete {
		/*position: absolute;
		top: 50%;
		left: 7px;*/
		overflow: hidden;
		line-height: 16px;
		text-align: center;
		font-size: 14px;
		transform: translateY(-8px);
		width: 14px;
		height: 14px;
		border: 1px solid #ccc;
		
	}
</style>