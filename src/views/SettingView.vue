<script setup lang="ts">
import SettingOption from "@/components/settingOption.vue"
import SettingServerAddress from "@/components/settingServerAddress.vue"
import SettingNickname from "@/components/settingNickname.vue"
import SettingRankLevel from "@/components/settingRankLevel.vue"
import SettingRound from "@/components/settingRound.vue"

import { configStorager } from "@/utils/ConfigStorage"
import { watch, ref } from "vue"
import { useStore } from "vuex"

import { createHmac } from "crypto"

import type {
	ServerInfo,
	Nickname,
	RankLevel,
	Config,
	RoundInfo,
} from "@/shared/types"

const $store = useStore()

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
		config.id = createHmac("sha256", newVal.nickname)
			.update(new Date().toString())
			.digest("hex")
		configStorager.setConfig(config)
		// update user info
		$store.commit("updateUserNickname", {
			id: config.id,
			nickname: config.nickname,
		})
	},
	{ deep: true }
)

function getRankLevel(): RankLevel {
	return {
		rank: configStorager.getConfig().rank,
		level: configStorager.getConfig().level,
		star: configStorager.getConfig().star,
	}
}

const rankLevel = ref<RankLevel>(getRankLevel())

watch(
	rankLevel,
	(newVal) => {
		const config: Config = configStorager.getConfig()
		config.rank = newVal.rank
		config.level = newVal.level
		config.star = newVal.star
		$store.commit("updateUserRank", {
			rank: config.rank,
			level: config.level,
			star: config.star,
		})
		configStorager.setConfig(config)
	},
	{ deep: true }
)

function getRoundInfo(): RoundInfo {
	return {
		roundCount: configStorager.getConfig().roundCount,
		roundLimit: configStorager.getConfig().roundLimit,
		beforeRoundCount: configStorager.getConfig().beforeRoundCount,
		beforeStartCount: configStorager.getConfig().beforeStartCount,
	}
}

const roundInfo = ref<RoundInfo>(getRoundInfo())

watch(
	roundInfo,
	(newVal) => {
		const config: Config = configStorager.getConfig()
		config.roundCount = newVal.roundCount
		config.roundLimit = newVal.roundLimit
		config.beforeRoundCount = newVal.beforeRoundCount
		config.beforeStartCount = newVal.beforeStartCount
		configStorager.setConfig(config)
	},
	{ deep: true }
)

const tips = [
	`本应用只在填入参数合法时才会保存参数\n例如服务器地址为"256.1.1.1"则不会触发保存`,
	"端口为 0-65535 之间的整数\n通常来说，服务器地址与端口这些信息将由服务端提供",
	"昵称与等级只是暂时储存至本地，为了更方便的登记信息请提前保存",
	"快捷键提示Tips\nCtrl+Q 快速刷新应用\nCtrl+E 打开控制台（开发版专用）\nCtrl+D 快速切换夜间模式\nCtrl+W 快速退出应用",
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
		<setting-option :bound-value="rankLevel">
			<setting-rank-level />
		</setting-option>
		<setting-option :bound-value="roundInfo">
			<setting-round />
		</setting-option>
		<div class="tip-container">
			<span class="tip" v-for="item of tips" :key="item">{{ item }}</span>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.setting {
	@apply inline-flex flex-col items-center w-full py-4
	bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}

.tip-container {
	@apply inline-flex flex-col items-center w-72
	bg-gray-100 dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-600
	transition-all;
}

.tip {
	@apply w-full py-1 px-2 text-sm select-none whitespace-pre-line;
}

.tip:nth-child(odd) {
	@apply bg-gray-200 dark:bg-gray-800
	transition-all;
}
</style>
