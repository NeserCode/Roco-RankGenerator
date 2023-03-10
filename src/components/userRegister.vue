<script lang="ts" setup>
import type { Config } from "@/shared/types"
import { configStorager } from "@/utils/ConfigStorage"
import { computedRank } from "@/utils/rank"
import { $Bus } from "@/utils/Mitt"

import { debounce } from "ts-debounce"
import { ref, onActivated, computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { key as StateKey } from "@/state"

const config = ref<Config>(configStorager.getConfig())
const $router = useRouter()
const $store = useStore(StateKey)

onActivated(() => {
	config.value = configStorager.getConfig()
})

function gotoSetting() {
	$router.push("/setting")
}

const JoinTheRoom = debounce(() => {
	$Bus.emit("request-join-room", {
		id: config.value.id,
		type: key.value == "" ? "JOIN" : "HOST",
		timestamp: Date.now(),
		hostKey: key.value,
	})
	$store.commit("updateUserNickname", {
		id: config.value.id,
		nickname: config.value.nickname,
	})
	localStorage.setItem("roco.host.key", key.value)
}, 1500)

// key
const key = ref(localStorage.getItem("roco.host.key") || "")

const computedRankText = computed(() =>
	computedRank(config.value.rank, config.value.level, config.value.star)
)
</script>

<template>
	<div class="user-register">
		<div class="user-register-container">
			<div class="operation">
				<button class="btn btn-primary" @click="gotoSetting">修改信息</button>
				<button
					class="btn btn-primary"
					@click="JoinTheRoom"
					:disabled="$store.state.isJoinedRoom"
				>
					加入房间
				</button>
			</div>

			<div class="user-info">
				<span class="nickname-wrapper">
					<span class="label">昵称</span>
					<span class="nickname">
						{{ config.nickname }}
					</span>
				</span>
				<span class="rank-wrapper">
					<span class="label">段位</span>
					<span class="rank">
						{{ computedRankText }}
					</span>
				</span>
				<span class="tip"
					>! 与服务器相连的功能模块都使用了防抖<br />即操作存在唯一的延迟而重复操作会重置延时</span
				>
				<span class="tip"
					>! 在发车过程中请不要更改昵称<br />请不要更改本应用配置文件<br />一般这些操作将会导致用户的身份凭证失效</span
				>
			</div>

			<div class="room-id-input">
				<div class="room-id-input-label label">
					房间密钥
					<sup title="决定是否成为房主">[可选?]</sup>
				</div>
				<input
					type="text"
					v-model="key"
					:disabled="$store.state.isJoinedRoom"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
/* input style */
input {
	@apply py-px px-1 text-center border-2 mx-1
  border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700 font-medium
  transition-all duration-300 ease-in-out select-none;
}
/* button style */
.operation button {
	@apply w-24 py-0.5 px-1 mr-1.5 my-2 text-center border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700
  transition-all duration-300 ease-in-out select-none;
}

/* disabled style */
button:disabled {
	@apply bg-gray-300 dark:bg-gray-700 cursor-not-allowed;
}
input:disabled {
	@apply bg-gray-300 dark:bg-gray-700 cursor-not-allowed;
}

.room-id-input input {
	@apply w-60 m-0;
}

.label {
	@apply select-none m-0;
}

.user-info {
	@apply inline-flex flex-col w-full py-2
	select-none;
}

.nickname-wrapper,
.rank-wrapper {
	@apply mr-4;
}

.nickname,
.rank {
	@apply inline-block select-none mx-1 px-2 my-1.5 border-2
	bg-gray-200 dark:bg-gray-800 border-gray-500 dark:border-gray-400;
}

.tip {
	@apply text-sm text-gray-500 dark:text-gray-400;
}
</style>
