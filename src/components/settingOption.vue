<script lang="ts" setup>
import { SettingOptionToken } from "@/tokens/settingOption"
import { defineProps, reactive, provide } from "vue"

import type { ServerInfo } from "@/shared/types"

const props = defineProps<{
	boundValue: ServerInfo
}>()

provide(SettingOptionToken, reactive({ ...props }))
</script>

<template>
	<div class="setting-option">
		<slot></slot>
	</div>
</template>

<style lang="postcss" scoped></style>
