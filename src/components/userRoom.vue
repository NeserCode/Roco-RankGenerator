<script lang="ts" setup></script>

<template>
	<div class="room">
		<div class="room-container">
			<div class="player-list">player-list</div>
			<div class="screen">screen</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.room {
	@apply inline-flex flex-col items-center w-full py-4
	bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}

.room-container {
	@apply inline-flex flex-row items-center w-full py-4 justify-center;
}

.player-list,
.screen {
	@apply inline-flex flex-col items-center py-4;
}
.player-list {
	@apply w-1/4 bg-blue-200;
}

.screen {
	@apply w-1/2 bg-red-200;
}
</style>
