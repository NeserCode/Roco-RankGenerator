<script lang="ts" setup>
import PlayerItem from "./playerItem.vue"
import { useStore } from "vuex"
import { ref } from "vue"
import { $Bus } from "@/utils/Mitt"

import type {
	Ws_RankPackage,
	Ws_HostPackage,
	BasicMessage,
} from "@/shared/types"

const $store = useStore()

// Update Client Number
$Bus.on("update-client-number", (data) => {
	$store.commit("updateClientSum", data)
})

// Join Room Message
$Bus.on("update-join-player", (data) => {
	$store.commit("updateRoomPlayers", data)

	welcomeJoinPlayer(data)
})

// Host Room Message
$Bus.on("ensure-host-room", (data) => {
	noticeHostPlayer(data)
})

const messageQueue = ref<BasicMessage[]>([])
const welcomeWord = ref("欢迎")
const oneWord = ref("")

function welcomeJoinPlayer(data: Ws_RankPackage) {
	welcomeWord.value = `欢迎 ${data.nickname} 加入了房间`

	players.value = $store.state.room.players.slice(1)
	messageQueue.value.push({
		type: "JOIN",
		message: welcomeWord.value,
		timestamp: Date.now(),
	})
}

function noticeHostPlayer(data: Ws_HostPackage) {
	oneWord.value = `${data.nickname} 成为了房主`
	messageQueue.value.push({
		type: "HOST",
		message: oneWord.value,
		timestamp: Date.now(),
	})
}

const players = ref<Ws_RankPackage[]>($store.state.room.players.slice(1))

const getComputedTime = (timestamp: number) => {
	// fix zero
	const date = new Date(timestamp)
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
	const minute =
		date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
	const second =
		date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
	return `${hour}:${minute}:${second}`
}
</script>

<template>
	<div class="room">
		<div class="room-container">
			<div class="player-list">
				<div class="top-info">
					<span class="sum">玩家数 {{ $store.state.room.clientSum }}</span>
				</div>
				<div class="list">
					<div class="item" v-for="player in players" :key="player.id">
						<player-item :player="player" />
					</div>
				</div>
			</div>
			<div class="screen">
				<div class="message-container">
					<div
						:class="['item', message.type]"
						v-for="message in messageQueue"
						:key="message.timestamp"
					>
						<span class="prefix timestamp"
							>[{{ getComputedTime(message.timestamp) }}]</span
						>
						<span class="message-item">{{ message.message }}</span>
					</div>
				</div>
			</div>
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
	@apply inline-flex flex-col items-center h-96
	border-2 border-slate-300 dark:border-slate-500;
}
.player-list {
	@apply w-1/4 rounded-l;
}

.player-list .top-info {
	@apply inline-flex items-center justify-center w-full py-0.5 border-b-2
	border-slate-300 dark:border-slate-500;
}

.player-list .list {
	@apply inline-flex flex-col items-center w-full h-full overflow-y-auto;
}

.player-list .item {
	@apply inline-flex flex-col justify-center items-center w-full;
}

.screen {
	@apply w-1/2 py-2 rounded-r;
}

/* Message */
.message-container {
	@apply inline-flex flex-col items-center w-full h-full overflow-y-auto;
}

.message-container .item {
	@apply inline-flex flex-row items-center justify-start w-full;
}

.message-container .prefix {
	@apply inline-flex items-center justify-center w-1/4 py-0.5;
}

.message-container .message-item {
	@apply inline-flex items-center w-3/4 py-0.5;
}

.message-container .JOIN {
	@apply text-green-400 dark:text-green-500;
}

.message-container .HOST {
	@apply text-blue-400 dark:text-blue-500;
}
</style>
