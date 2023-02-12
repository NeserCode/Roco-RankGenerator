<script setup lang="ts">
import UserRegister from "@/components/userRegister.vue"
import UserRoom from "@/components/userRoom.vue"

import { WebSocketProxy } from "@/utils/WebsocketMonitor"
import { configStorager } from "@/utils/ConfigStorage"
import { $Bus } from "@/utils/Mitt"
import { ref, onUnmounted } from "vue"
import { useStore } from "vuex"

import type { Ws_RankPackage } from "@/shared/types"

const $store = useStore()
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

const wsProxy = ref<WebSocketProxy>(
	new WebSocketProxy(wsUrl, (message) => {
		if (message.data !== "Heartbeat") {
			const data = JSON.parse(message.data)

			// Join room
			if (data.type === ("HOST" || "JOIN")) {
				// self join room
				if (data.id === config.id && !$store.state.isJoinedRoom) {
					console.log("Join room success")
					$store.commit("ensureJoinedRoom")
					// send user info
					wsProxy.value.send(JSON.stringify(getUserInfo()))
				}
				// other user join room
				else if (data.id !== config.id && $store.state.isJoinedRoom) {
					console.log("Other user join room")
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
			// client number
			else if (data.client !== undefined)
				$Bus.emit("update-client-number", data)
			else console.log(data)
		}
	})
)

// Request join room Listener
$Bus.on("request-join-room", (data) => {
	wsProxy.value.send(JSON.stringify(data))
})

onUnmounted(() => {
	wsProxy.value.close()
})
</script>

<template>
	<div class="home">
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
