<script lang="ts" setup>
import PlayerItem from "./playerItem.vue"
import { useStore } from "vuex"
import { ref, computed } from "vue"
import { $Bus } from "@/utils/Mitt"

import type {
	Ws_RankPackage,
	Ws_HostPackage,
	Ws_TimePackage,
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
	scrolltoBottom()
})

// Host Room Message
$Bus.on("ensure-host-room", (data) => {
	noticeHostPlayer(data)
	scrolltoBottom()
})

// Update player rank
$Bus.on("update-rank", () => {
	players.value = $store.state.room.players.slice(1)
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

// get computed class which is selected
const whoChecked = ref("")
const computedClass = computed(() => (playerId: string) => {
	return whoChecked.value === playerId ? "isChecked" : null
})

// scroll to bottom
const messageContainer = ref<HTMLElement>()
function scrolltoBottom() {
	if (messageContainer.value)
		messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

// start round message
function noticeStartRound(data: Ws_TimePackage) {
	oneWord.value = `房主 开始了发车倒计时: ${data.timeCount} 秒`
	messageQueue.value.push({
		type: "BEFORE_START",
		message: oneWord.value,
		timestamp: Date.now(),
	})

	// Start interval Countdown
	const interval = setInterval(() => {
		if (data.timeCount > 0) {
			data.timeCount--
			if (data.timeCount <= 10) {
				oneWord.value = `发车倒计时: ${data.timeCount} 秒 看看废话看看废话看看废话`
				messageQueue.value.push({
					type: "BEFORE_START",
					message: oneWord.value,
					timestamp: Date.now(),
				})
				scrolltoBottom()
			}
		} else clearInterval(interval)
	}, 1000)
}

$Bus.on("start-round-count", (data) => {
	noticeStartRound(data)
	scrolltoBottom()
})
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
						<input
							type="radio"
							name="player"
							:value="player.id"
							:id="player.nickname"
							v-model="whoChecked"
							disabled
						/>
						<label :for="player.nickname" class="label">
							<player-item
								:player="player"
								:class="[computedClass(player.id)]"
							/>
						</label>
					</div>
				</div>
			</div>
			<div class="screen">
				<div class="message-container" ref="messageContainer">
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
	@apply inline-flex flex-col items-center w-full
	bg-gray-50 dark:bg-gray-700 text-gray-800 pt-2 dark:text-gray-200;
}

.room-container {
	@apply inline-flex flex-row items-center w-full justify-center;
}

.player-list,
.screen {
	@apply inline-flex flex-col items-center h-80
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
	@apply inline-flex flex-col w-full h-full overflow-y-auto;
}

.player-list .item {
	@apply inline-flex flex-col justify-center items-center w-full;
}

.screen {
	@apply w-1/2 rounded-r;
}

/* Message */
.message-container {
	@apply inline-flex flex-col items-center w-full h-full pb-12 overflow-y-auto
	scroll-smooth;
}

.message-container .item {
	@apply inline-flex flex-row items-center justify-start w-full;
}
.message-container .item:first-child {
	@apply mt-2;
}
.message-container .item:last-child {
	@apply mb-2;
}

.message-container .prefix {
	@apply inline-flex justify-center w-1/4 h-full py-0.5;
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

.message-container .BEFORE_START {
	@apply text-red-900 dark:text-red-300;
}

/* radio style */
.player-list input[type="radio"] {
	@apply hidden;
}

.player-list input[type="radio"] + .label {
	@apply inline-flex flex-row items-center justify-center w-full
	cursor-pointer;
}
.player-list input[type="radio"]:disabled + .label {
	@apply cursor-auto;
}

.player-list input[type="radio"] + .label .isChecked {
	@apply bg-green-400 dark:bg-blue-400;
}
</style>
