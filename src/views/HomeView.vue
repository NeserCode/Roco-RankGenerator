<script setup lang="ts">
import UserRegister from "@/components/userRegister.vue"
import HostOperations from "@/components/hostOperations.vue"
import UserRoom from "@/components/userRoom.vue"

import { WebSocketProxy } from "@/utils/WebsocketMonitor"
import { configStorager } from "@/utils/ConfigStorage"
import { $Bus } from "@/utils/Mitt"
import { ref, onUnmounted } from "vue"
import { useStore } from "vuex"
import { key } from "@/state"

import type { RoundInfo, Ws_RankPackage } from "@/shared/types"

const $store = useStore(key)
const config = configStorager.getConfig()
const wsUrl = new URL(`ws://${config.server}:${config.port}/base`)

function getUserInfo(): Ws_RankPackage {
	let config2 = configStorager.getConfig()
	return {
		id: config2.id,
		type: "RANK",
		nickname: config2.nickname,
		rank: config2.rank,
		level: config2.level,
		star: config2.star,
		timestamp: Date.now(),
	}
}

function getRoundInfo(): RoundInfo {
	let configx = configStorager.getConfig()
	return {
		roundLimit: configx.roundLimit,
		roundCount: configx.roundCount,
		beforeRoundCount: configx.beforeRoundCount,
		beforeStartCount: configx.beforeStartCount,
	}
}

// 114.115.164.199
const wsProxy = ref<WebSocketProxy>(
	new WebSocketProxy(wsUrl, (message) => {
		if (message.data !== "Heartbeat") {
			const data = JSON.parse(message.data)

			// Join room
			if (data.type === "HOST" || data.type === "JOIN") {
				// self join room
				if (data.id === config.id && !$store.state.isJoinedRoom) {
					console.log("[JOIN_SELF]", data)
					$store.commit("ensureJoinedRoom")
					// send user info
					wsProxy.value.send(JSON.stringify(getUserInfo()))
				}
				// other user join room
				else if (data.id !== config.id && $store.state.isJoinedRoom) {
					console.log("[JOIN_OTHER]", data)
					$store.commit("ensureJoinedRoom")
				}
			}
			// Host Room ID
			else if (data.type === "HOST_ID") {
				$store.commit("updateRoomId", data.hostId)
			}
			// update room player list
			else if (data.type === "RANK") {
				// $store.commit("updateRoomPlayers", data)
				$Bus.emit("update-join-player", data)
			}
			// update own rank
			else if (data.type === "RANK_UPDATE") {
				$Bus.emit("update-rank", data)
				$store.commit("updateRank", data)
			}
			// start round
			else if (data.type === "BEFORE_START") {
				let config3 = configStorager.getConfig()
				console.log("[BEFORE_START]", data)

				configStorager.setConfig({
					...config3,
					roundLimit: data.roundConfig.roundLimit,
					roundCount: data.roundConfig.roundCount,
					beforeStartCount: data.roundConfig.beforeStartCount,
					beforeRoundCount: data.roundConfig.beforeRoundCount,
				})
				$Bus.emit("start-round-count", data)
			}
			// before round start
			else if (data.type === "BEFORE_ROUND") {
				console.log("[BEFORE_ROUND]", data)
				$Bus.emit("next-round-count", data)
			}
			// start next round
			else if (data.type === "START_ROUND") {
				$store.commit("nextRound")
				if (data.isAddon) $store.commit("ensureAddon")
			}
			// update players info
			else if (data.type === "PLAYERS_INFO") {
				console.log("[PLAYERS_INFO]", data)
				$store.commit("updateRoomPlayersFromWs", data)
			}
			// client number
			else if (data.client !== undefined)
				$Bus.emit("update-client-number", data)
			else console.log("[Exception]", data)
		}
	})
)

// Request join room Listener
$Bus.on("request-join-room", (data) => {
	wsProxy.value.send(JSON.stringify(data))
})

// Update User Rank
$Bus.on("update-own-rank", () => {
	let userInfo = getUserInfo()
	wsProxy.value.send(
		JSON.stringify({
			type: "RANK_UPDATE",
			id: userInfo.id,
			nickname: userInfo.nickname,
			rank: userInfo.rank,
			level: userInfo.level,
			star: userInfo.star,
			timestamp: Date.now(),
		})
	)
})

// Start Round
$Bus.on("start-round", () => {
	let roundInfo = getRoundInfo()
	wsProxy.value.send(
		JSON.stringify({
			type: "BEFORE_START",
			id: $store.state.user.id,
			timeCount: roundInfo.beforeStartCount,
			roundLimit: roundInfo.roundLimit,
			roundConfig: roundInfo,
			timestamp: Date.now(),
		})
	)
})

// Next Round
$Bus.on("next-round", ({ round }) => {
	let roundInfo2 = getRoundInfo()
	wsProxy.value.send(
		JSON.stringify({
			type: "BEFORE_ROUND",
			id: $store.state.user.id,
			round,
			timeCount: roundInfo2.beforeRoundCount,
			timestamp: Date.now(),
		})
	)
})

onUnmounted(() => {
	wsProxy.value.send(
		JSON.stringify({
			...getUserInfo(),
			type: "LEAVE",
		})
	)

	wsProxy.value.close()
})
</script>

<template>
	<div class="home">
		<host-operations />
		<user-room />
		<user-register />
	</div>
</template>

<style lang="postcss" scoped>
.home {
	@apply inline-flex flex-col items-center w-full py-4
	bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}
</style>
