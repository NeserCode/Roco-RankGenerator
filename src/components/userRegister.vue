<script lang="ts" setup>
import type { Config } from "@/shared/types"
import { RankLimit } from "@/shared/rankLimit"
import { configStorager } from "@/utils/ConfigStorage"
import { $Bus } from "@/utils/Mitt"
import { debounce } from "ts-debounce"
import { ref, onActivated } from "vue"
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
</script>

<template>
	<div class="user-register">
		<div class="user-register-container">
			<div class="user-register-nickname-label label">昵称</div>
			<div class="user-register-nickname-input">
				<input type="text" v-model="config.nickname" disabled />
			</div>

			<div class="user-register-rank-label label">段位</div>
			<div class="user-register-rank-selection">
				<select v-model="config.rank" disabled>
					<option :value="0">学徒魔法师</option>
					<option :value="1">初级魔法师</option>
					<option :value="2">中级魔法师</option>
					<option :value="3">高级魔法师</option>
					<option :value="4">魔导士</option>
					<option :value="5">圣魔导师</option>
				</select>
				<select v-model="config.level" disabled>
					<option :value="0">一段</option>
					<option :value="1">二段</option>
					<option :value="2">三段</option>
					<option :value="3">四段</option>
					<option :value="4">五段</option>
				</select>
				<input
					type="number"
					:max="RankLimit.Star"
					min="0"
					v-model="config.star"
					disabled
				/>星
			</div>
			<div class="room-id-input">
				<div class="room-id-input-label label">
					房间密钥
					<label title="决定是否成为房主">[可选]</label>
				</div>
				<input
					type="text"
					v-model="key"
					:disabled="$store.state.isJoinedRoom"
				/>
			</div>

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
		</div>
	</div>
</template>

<style lang="postcss" scoped>
input {
	@apply py-px px-1 text-center border-2 mx-1
  border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700 font-medium
  transition-all duration-300 ease-in-out select-none;
}

.user-register-nickname-input input,
.room-id-input input {
	@apply w-full m-0;
}

.user-register-nickname-input {
	@apply w-full;
}

/* select style */
.user-register-rank-selection select {
	@apply w-32 py-0.5 px-1 mx-0.5 text-center border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700 font-medium
  transition-all duration-300 ease-in-out;
}

.user-register-rank-selection {
	@apply select-none;
}

/* label style */
.user-register-nickname-label,
.user-register-rank-label {
	@apply w-full py-0.5 select-none;
}

.label {
	@apply mt-2;
}

/* button style */
.operation button {
	@apply w-24 py-0.5 px-1 mx-0.5 my-2 text-center border-2 border-gray-300 bg-gray-200
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
</style>
