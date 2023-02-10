<script lang="ts" setup>
import { SettingOptionToken } from "@/tokens/settingOption"
import { defineProps, reactive, provide } from "vue"

import type { BoundType } from "@/shared/types"

const props = defineProps<{
	boundValue: BoundType
}>()

provide(SettingOptionToken, reactive({ ...props }))
</script>

<template>
	<div class="setting-option">
		<slot></slot>
	</div>
</template>

<style lang="postcss" scoped>
.setting-option {
	@apply inline-flex flex-col justify-center items-center w-full py-4;
}
</style>
