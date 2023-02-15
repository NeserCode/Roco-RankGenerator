<script lang="ts" setup>
import { debounce } from "ts-debounce"
import { ref, computed } from "vue"
import { useStore } from "vuex"

import { $Bus } from "@/utils/Mitt"

const $store = useStore()

const readyText = ref("确认发车")

const toggleReadyState = debounce(() => {
	if (!$store.state.isReady && $store.state.isJoinedRoom) {
		$store.commit("getReady")
		readyText.value = "取消确认"
	} else {
		$store.commit("cancelReady")
		readyText.value = "确认发车"
	}
}, 2000)

const btnClass = computed(() => {
	return !$store.state.isReady ? "primary" : "danger"
})

const updateOwnRank = debounce(() => {
	$Bus.emit("update-own-rank")
}, 2000)

const startRound = debounce(() => {
	$Bus.emit("start-round")
}, 2000)

const nextRoundStart = debounce(() => {
	$Bus.emit("next-round", {
		round: $store.state.room.round,
	})
}, 3000)

const ableToStart = computed(() => {
	return !($store.state.room.round < 12)
})
</script>

<template>
	<div class="host-operations">
		<div class="main">
			<button
				:class="['operation', btnClass]"
				@click="toggleReadyState"
				:disabled="!$store.state.isJoinedRoom"
			>
				{{ readyText }}
			</button>
			<button class="operation" v-if="$store.state.isHost" @click="startRound">
				开始发车
			</button>
			<button
				class="operation"
				v-if="$store.state.isHost"
				:disabled="ableToStart"
				@click="nextRoundStart"
			>
				下一轮开始
			</button>
			<button
				class="operation"
				@click="updateOwnRank"
				:disabled="!$store.state.isJoinedRoom"
			>
				更新段位
			</button>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.main {
	@apply inline-flex items-center justify-evenly w-full flex-wrap;
}
/* button style */
button.operation {
	@apply relative w-24 py-0.5 px-1 mx-0.5 my-2 text-center border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700
  transition-all duration-300 ease-in-out select-none;
}

button.primary {
	@apply bg-blue-500 dark:bg-blue-500 text-gray-200 dark:text-gray-200;
}
button.danger {
	@apply bg-red-500 dark:bg-red-500 text-gray-200 dark:text-gray-200;
}
button:disabled {
	@apply bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-500
	cursor-not-allowed;
}
</style>
