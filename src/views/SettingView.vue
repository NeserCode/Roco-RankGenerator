<script setup lang="ts">
import SettingOption from "@/components/settingOption.vue"
import SettingServerAddress from "@/components/settingServerAddress.vue"
import { watch, ref } from "vue"

import type { ServerInfo } from "@/shared/types"

const serverInfo = ref<ServerInfo>({
	server: "127.0.0.1",
	port: "8888",
})

watch(
	serverInfo,
	(newVal, oldVal) => {
		console.log("newVal:", newVal)
		console.log("oldVal:", oldVal)
	},
	{ deep: true }
)
</script>

<template>
	<div class="setting">
		<setting-option :bound-value="serverInfo">
			<setting-server-address />
		</setting-option>
	</div>
</template>

<script setup lang="ts"></script>
