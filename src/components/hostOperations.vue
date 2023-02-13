<script lang="ts" setup></script>

<template>
	<div class="host-operations">
		<div class="main">
			<button class="operation">确认发车</button>
			<button class="operation">开始发车</button>
			<button class="operation">中场延迟</button>
			<button class="operation">更新段位</button>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.main {
	@apply inline-flex items-center justify-evenly w-full;
}
/* button style */
button.operation {
	@apply w-24 py-0.5 px-1 mx-0.5 my-2 text-center border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700
  transition-all duration-300 ease-in-out select-none;
}
</style>
