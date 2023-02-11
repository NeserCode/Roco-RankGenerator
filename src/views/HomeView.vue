<script setup lang="ts">
import UserRegister from "@/components/userRegister.vue"
import UserRoom from "@/components/userRoom.vue"

import { WebSocketProxy } from "@/utils/WebsocketMonitor"
import { configStorager } from "@/utils/ConfigStorage"
import { $Bus } from "@/utils/Mitt"
import { ref, onUnmounted } from "vue"
import { useStore } from "vuex"

const $store = useStore()
const config = configStorager.getConfig()
const wsUrl = new URL(`ws://${config.server}:${config.port}/base`)
const wsProxy = ref<WebSocketProxy>(
	new WebSocketProxy(wsUrl, (message) => {
		if (message.data !== "Heartbeat") {
			const data = JSON.parse(message.data)
			if (
				data.type === ("HOST" || "JOIN") &&
				!$store.state.isJoiningRoom &&
				data.id === config.id
			) {
				console.log("Join room success")
				$store.commit("ensureJoinedRoom")
			} else console.log(data)
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
		<user-room v-if="$store.state.isJoinedRoom" />
		<user-register />
	</div>
</template>

<style lang="postcss" scoped>
.home {
	@apply inline-flex flex-col items-center w-full py-4
	bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}
</style>
