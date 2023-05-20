<script lang="ts" setup>
import PlayerItem from "./playerItem.vue"
import MessageDialog from "./messageDialog.vue"

import { useStore } from "vuex"
import { ref, computed } from "vue"
import { $Bus } from "@/utils/Mitt"
import { configStorager } from "@/utils/ConfigStorage"
import { key } from "@/state"

import type {
	Ws_RankPackage,
	Ws_HostPackage,
	Ws_TimePackage,
	BasicMessage,
	Notification,
} from "@/shared/types"

const $store = useStore(key)

// Update Client Number
$Bus.on("update-client-number", (data) => {
	$store.commit("updateClientSum", data)
})

// Join Room Message
$Bus.on("update-join-player", (data) => {
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
	players.value = $store.state.room.players
})

const messageQueue = ref<BasicMessage[]>([])
const welcomeWord = ref("欢迎")
const oneWord = ref("")

function welcomeJoinPlayer(data: Ws_RankPackage) {
	welcomeWord.value = `欢迎 ${data.nickname} 加入了房间`

	players.value = $store.state.room.players
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

const players = ref<Ws_RankPackage[]>($store.state.room.players)

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
			if (data.timeCount <= 10 && data.timeCount > 0) {
				oneWord.value = `发车倒计时: ${data.timeCount} 秒`
				messageQueue.value.push({
					type: "BEFORE_START",
					message: oneWord.value,
					timestamp: Date.now(),
				})
			} else if (data.timeCount === 0) {
				oneWord.value = `开始发车啦！请注意每回合的倒计时哦！`
				messageQueue.value.push({
					type: "BEFORE_START",
					message: oneWord.value,
					timestamp: Date.now(),
				})
			}
		} else clearInterval(interval)
		scrolltoBottom()
	}, 1000)
}

$Bus.on("start-round-count", (data) => {
	noticeStartRound(data)
	scrolltoBottom()
})

// before round message
function getRoundInfo() {
	return {
		roundCount: configStorager.getConfig().roundCount,
		roundLimit: configStorager.getConfig().roundLimit,
	}
}

function noticeBeforeRound(
	data: Ws_TimePackage & {
		round: number
	}
) {
	if ($store.state.isAddon)
		oneWord.value = `第 ${data.round + 1} 回合 [加时赛] 发车倒计时: ${
			data.timeCount
		} 秒`
	else
		oneWord.value = `第 ${data.round + 1}/${
			getRoundInfo().roundLimit
		} 回合发车倒计时: ${data.timeCount} 秒`
	messageQueue.value.push({
		type: "BEFORE_ROUND",
		message: oneWord.value,
		timestamp: Date.now(),
	})

	// Start interval Countdown
	const interval = setInterval(() => {
		if (data.timeCount > 0) {
			data.timeCount--
			if (
				data.timeCount <= getRoundInfo().roundCount &&
				data.timeCount > 0
			) {
				oneWord.value = `准备匹配倒计时: ${data.timeCount} 秒`
				messageQueue.value.push({
					type: "BEFORE_ROUND",
					message: oneWord.value,
					timestamp: Date.now(),
				})
			} else if (data.timeCount === 0) {
				oneWord.value = `请开始匹配`

				messageQueue.value.push({
					type: "BEFORE_ROUND",
					message: oneWord.value,
					timestamp: Date.now(),
				})

				setTimeout(() => {
					$Bus.emit("dialog-container-open")
				}, 1000)
			}
		} else clearInterval(interval)
		scrolltoBottom()
	}, 1000)
}

$Bus.on("next-round-count", (data) => {
	noticeBeforeRound(data)
	scrolltoBottom()
})

const noti_test = ref<Notification>({
	type: "NOTIFY",
	title: "选择胜负注意事项",
	message: [
		"1.选择你的对手，并根据双方的最近胜负决定本回合自己的胜负。做好选择后请更新段位",
		"2.若双方对于胜负有分歧,该次比赛将由对手的决定记录比分",
		"3.自己的选择只会影响到对手的最近胜负，你的对手也是如此",
		"4.若双方没有配对成功，即选择了错误的对手，本场比赛将不会有记录（显示为未定胜负）",
		"5.默认每回合开始时选中的对手为空排，选择胜或者负都不会影响到玩家实际的输赢",
		"6.对手为路人时，你的选择将变为决定自己的战绩，此时查询到的路人战绩不具有参考价值",
		"Thank you for your support :)",
	],
	timestamp: Date.now(),
	options: [
		{
			type: "NOTIFY_OPTIONS_PRIMARY",
			text: "Yes",
			withClose: true,
		},
	],
})
</script>

<template>
	<div class="room">
		<div class="room-container">
			<div class="player-list">
				<div class="top-info">
					<span class="sum"
						>🏃‍♂️ 玩家数 {{ $store.state.room.clientSum }}</span
					>
				</div>
				<div class="list">
					<message-dialog :text-notifaication="noti_test" />
					<div
						class="item"
						v-for="player in players"
						:key="player.id"
					>
						<player-item
							:player="player"
							:class="[computedClass(player.id)]"
						/>
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
	@apply inline-flex flex-col items-center h-96
	border-2 border-slate-300 dark:border-slate-500;
}
.player-list {
	@apply w-1/4 border-r-0;
}

.player-list .top-info {
	@apply inline-flex flex-col items-center justify-center w-full py-0.5 border-b-2
	border-slate-300 dark:border-slate-500;
}

.player-list .list {
	@apply inline-flex flex-col w-full h-full overflow-y-auto;
}

.player-list .item {
	@apply inline-flex flex-col justify-center items-center w-full;
}

.screen {
	@apply w-1/2;
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
</style>
