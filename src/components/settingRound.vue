<script lang="ts" setup>
import { SettingOptionToken } from "@/tokens/settingOption"
import { inject } from "vue"
import { useStore } from "vuex"
import { key } from "@/state"

const { boundValue } = inject(SettingOptionToken, {
	boundValue: {
		roundLimit: 0,
		beforeStartCount: 0,
		beforeRoundCount: 0,
		roundCount: 0,
	},
})
const $store = useStore(key)
</script>

<template>
	<div class="setting-round-info">
		<div class="round-sum">
			<div class="label">发车轮数</div>
			<div class="round-sum-input">
				<input
					type="number"
					v-model="boundValue.roundLimit"
					:disabled="!$store.state.isHost"
				/>
			</div>
		</div>
		<div class="before-start-count">
			<div class="label">发车倒计时</div>
			<div class="before-start-count-input">
				<input
					type="number"
					v-model="boundValue.beforeStartCount"
					:disabled="!$store.state.isHost"
				/>
			</div>
		</div>
		<div class="before-round-count">
			<div class="label">回合开始倒计时</div>
			<div class="before-round-count-input">
				<input
					type="number"
					v-model="boundValue.beforeRoundCount"
					:disabled="!$store.state.isHost"
				/>
			</div>
		</div>
		<div class="round-count">
			<div class="label">匹配倒计时</div>
			<div class="round-count-input">
				<input
					type="number"
					v-model="boundValue.roundCount"
					:disabled="!$store.state.isHost"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.setting-round-info {
	@apply inline-flex flex-col justify-center items-center w-full py-4;
}

/* input style */
.setting-round-info input {
	@apply w-full px-1 py-0.5 border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400
  rounded text-gray-500 font-medium outline-none
  transition-all duration-300 ease-in-out;
}

/* label style */
.setting-round-info .label {
	@apply w-full py-0.5 select-none;
}

input:disabled {
	@apply bg-gray-300 dark:bg-gray-700 cursor-not-allowed;
}
</style>
