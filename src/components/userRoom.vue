<script lang="ts" setup>
import { useStore } from "vuex"
import { ref } from "vue"
import { $Bus } from "@/utils/Mitt"

import type { Ws_RankPackage } from "@/shared/types"

const $store = useStore()
$Bus.on("update-client-number", (data) => {
	$store.commit("updateClientSum", data)
})

$Bus.on("update-join-player", (data) => {
	$store.commit("updateRoomPlayers", data)

	welcomeJoinPlayer(data)
})

const welcomeWord = ref("欢迎")
function welcomeJoinPlayer(data: Ws_RankPackage) {
	welcomeWord.value = `欢迎 ${data.nickname} 加入了房间`
}
</script>

<template>
	<div class="room">
		<div class="room-container">
			<div class="player-list">玩家数 {{ $store.state.room.clientSum }}</div>
			<div class="screen">{{ welcomeWord }}</div>
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
	@apply inline-flex flex-col items-center py-4 h-48
	border-2 border-slate-300 dark:border-slate-500;
}
.player-list {
	@apply w-1/4;
}

.screen {
	@apply w-1/2;
}
</style>
