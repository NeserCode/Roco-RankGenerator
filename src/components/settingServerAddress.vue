<script lang="ts" setup>
import { SettingOptionToken } from "@/tokens/settingOption"
import { inject } from "vue"
import { useStore } from "vuex"

const { boundValue } = inject(SettingOptionToken, {})
const $store = useStore()
</script>

<template>
	<div class="setting-server-address">
		<div class="server-address">
			<div class="server-address-label">服务器地址</div>
			<div class="server-address-input">
				<input
					type="text"
					v-model="boundValue.server"
					:disabled="$store.state.isJoinedRoom"
				/>
			</div>
		</div>
		<div class="server-port">
			<div class="server-port-label">端口</div>
			<div class="server-port-input">
				<input
					type="text"
					v-model="boundValue.port"
					:disabled="$store.state.isJoinedRoom"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.setting-server-address {
	@apply inline-flex flex-col justify-center items-center w-full py-4;
}

/* input style */
.setting-server-address input {
	@apply w-full px-1 py-0.5 border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400
  rounded text-gray-500 font-medium outline-none
  transition-all duration-300 ease-in-out;
}

/* label style */
.setting-server-address .server-address-label,
.setting-server-address .server-port-label {
	@apply w-full py-0.5 select-none;
}

input:disabled {
	@apply bg-gray-300 dark:bg-gray-700 cursor-not-allowed;
}
</style>
