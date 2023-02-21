<script lang="ts" setup>
import ContainerDialog from "./containerDialog.vue"
import { debounce } from "ts-debounce"
import { ref } from "vue"
import { useStore } from "vuex"
import { key } from "@/state"

import { $Bus } from "@/utils/Mitt"
import { buildSlots } from "@vue/compiler-core"

const $store = useStore(key)

const readyText = ref("等待连接服务器")

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

// ws state
$Bus.on("update-ws-state", (data) => {
	if (data.state === 1) readyText.value = "已连接服务器"
	else if (data.state === -1) readyText.value = "连接服务器时出错"
	else if (data.state === 0) readyText.value = "与服务器断开连接"
})

function closeDialog() {
	$Bus.emit("dialog-container-close")
}
</script>

<template>
	<div class="host-operations">
		<div class="main">
			<span class="state">
				{{ readyText }}
			</span>
			<button class="operation" v-if="$store.state.isHost" @click="startRound">
				开始发车
			</button>
			<button
				class="operation"
				v-if="$store.state.isHost"
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
		<container-dialog>
			<template #title>
				<span>正在进行第 {{ $store.state.room.round }} 回合</span>
			</template>
			<template #details>details</template>
			<template #options>
				<button class="btn primary" @click="closeDialog">确认</button>
			</template>
		</container-dialog>
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

button:disabled {
	@apply bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-500
	cursor-not-allowed;
}

/* inner dialog */
.btn {
	@apply inline-flex justify-center px-4 py-2 text-sm font-medium 
	text-blue-900 bg-blue-100 border border-transparent
	rounded-md hover:bg-blue-200 focus:outline-none select-none
	focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2;
}
.btn.primary {
	@apply bg-blue-500 text-white;
}
.btn.danger {
	@apply bg-red-500 text-white;
}

.state {
	@apply flex items-center justify-center px-2
	text-gray-500 dark:text-gray-500 text-sm
	select-none;
}
</style>
