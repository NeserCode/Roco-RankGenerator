<script lang="ts" setup>
import { SettingOptionToken } from "@/tokens/settingOption"
import { inject } from "vue"
import { useStore } from "vuex"
import { key } from "@/state"

const { boundValue } = inject(SettingOptionToken, {
	boundValue: { nickname: "" },
})
const $store = useStore(key)
</script>

<template>
	<div class="setting-roco-nickname">
		<div class="roco-nickname">
			<div class="roco-nickname-label">昵称</div>
			<div class="roco-nickname-input">
				<input
					type="text"
					v-model="boundValue.nickname"
					spellcheck="false"
					:disabled="$store.state.isJoinedRoom"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.setting-roco-nickname input {
	@apply w-full px-1 py-0.5 border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400
  rounded text-gray-500 font-medium outline-none
  transition-all duration-300 ease-in-out;
}

/* label style */
.setting-roco-nickname .roco-nickname-label {
	@apply w-full py-0.5 select-none;
}

input:disabled {
	@apply bg-gray-300 dark:bg-gray-700 cursor-not-allowed;
}
</style>
