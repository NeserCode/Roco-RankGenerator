<script setup lang="ts">
import SettingOption from "@/components/settingOption.vue"
import SettingServerAddress from "@/components/settingServerAddress.vue"
import SettingNickname from "@/components/settingNickname.vue"
import { configStorager } from "@/utils/ConfigStorage"
import { watch, ref } from "vue"

import type { ServerInfo, Nickname, Config } from "@/shared/types"

function getServerInfo(): ServerInfo {
	return {
		server: configStorager.getConfig().server,
		port: configStorager.getConfig().port,
	}
}

const serverInfo = ref<ServerInfo>(getServerInfo())

watch(
	serverInfo,
	(newVal) => {
		const config: Config = configStorager.getConfig()
		config.server = newVal.server
		config.port = newVal.port
		verifyServerInfo(config) && configStorager.setConfig(config)
	},
	{ deep: true }
)

function verifyServerInfo(serverInfo: ServerInfo) {
	const serverMatchr = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/
	const portMatchr =
		/^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/

	if (!serverMatchr.test(serverInfo.server)) return false

	if (!portMatchr.test(serverInfo.port)) return false

	return true
}

const nickname = ref<Nickname>(getNickname())

function getNickname(): Nickname {
	return {
		nickname: configStorager.getConfig().nickname,
	}
}

watch(
	nickname,
	(newVal) => {
		const config: Config = configStorager.getConfig()
		config.nickname = newVal.nickname
		configStorager.setConfig(config)
	},
	{ deep: true }
)

const tips = [
	"服务器地址为 IPv4 地址 --一条建议：可以使用 ipconfig 命令获取本机 IPv4 地址",
	"端口为 0-65535 之间的整数 --一条建议：可以使用 netstat 命令获取本机端口",
	"服务器地址和端口不可为空",
	"服务器地址和端口不可重复",
]
</script>

<template>
	<div class="setting">
		<setting-option :bound-value="serverInfo">
			<setting-server-address />
		</setting-option>
		<setting-option :bound-value="nickname">
			<setting-nickname />
		</setting-option>
		<div class="tip-container">
			<span class="tip" v-for="item of tips" :key="item">{{ item }}</span>
		</div>
		<div class="tip-container">
			<span class="tip" v-for="item of tips" :key="item">{{ item }}</span>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.setting {
	@apply inline-flex flex-col justify-center items-center w-full
	bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200
	overscroll-y-auto;
}

.tip-container {
	@apply inline-flex flex-col justify-center w-60 pb-4
	bg-gray-100 dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-600
	transition-all;
}

.tip {
	@apply w-full py-1 px-2 text-sm select-none;
}

.tip:nth-child(odd) {
	@apply bg-gray-200 dark:bg-gray-800
	transition-all;
}
</style>
