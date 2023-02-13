<script lang="ts" setup>
import type { Config } from "@/shared/types"
import { RankLimit } from "@/shared/rankLimit"
import { configStorager } from "@/utils/ConfigStorage"
import { $Bus } from "@/utils/Mitt"
import { debounce } from "ts-debounce"
import { ref, onActivated, computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const config = ref<Config>(configStorager.getConfig())
const $router = useRouter()
const $store = useStore()
onActivated(() => {
	config.value = configStorager.getConfig()
})

function gotoSetting() {
	$router.push("/setting")
}

const JoinTheRoom = debounce(() => {
	$Bus.emit("request-join-room", {
		id: config.value.id,
		type: "HOST",
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

const computedRank = computed(() => {
	let rankText =
		Number(config.value.rank) == 0
			? "学徒魔法师"
			: config.value.rank == 1
			? "初级魔法师"
			: config.value.rank == 2
			? "中级魔法师"
			: config.value.rank == 3
			? "高级魔法师"
			: config.value.rank == 4
			? "魔导士"
			: "圣魔导师"
	let levelText = "I"
	switch (Number(config.value.level)) {
		case 0:
			levelText = "I"
			break
		case 1:
			levelText = "II"
			break
		case 2:
			levelText = "III"
			break
		case 3:
			levelText = "IV"
			break
		case 4:
			levelText = "V"
			break
		default:
			levelText = "I"
			break
	}
	return `${rankText}·${levelText}·${config.value.star}星`
})
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
						{{ computedRank }}
					</span>
				</span>
				<span class="tip">! 以上信息在发车中是十分重要的身份凭证</span>
				<span class="tip">! 在发车过程中请不要更改段位信息</span>
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
