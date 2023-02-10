<script setup lang="ts">
import SettingOption from "@/components/settingOption.vue"
import SettingServerAddress from "@/components/settingServerAddress.vue"
import { configStorager } from "@/utils/ConfigStorage"
import { watch, ref } from "vue"

import type { ServerInfo, Config } from "@/shared/types"

const serverInfo = ref<ServerInfo>({
	server: "127.0.0.1",
	port: "8888",
})

watch(
	serverInfo,
	(newVal, oldVal) => {
		const config: Config = configStorager.getConfig()
		config.server = newVal.server
		config.port = newVal.port
		configStorager.setConfig(config)
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
