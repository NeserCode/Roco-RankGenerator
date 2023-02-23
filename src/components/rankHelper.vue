<script lang="ts" setup>
import { CloudArrowDownIcon } from "@heroicons/vue/20/solid"

import { ref, computed, defineProps, toRefs, watch } from "vue"

import { $Bus } from "@/utils/Mitt"

import type { Ws_RankPackage } from "@/shared/types"

const $props = defineProps<{
	query: Ws_RankPackage
}>()
const { query } = toRefs($props)

watch(query, (player: Ws_RankPackage) => {
	$Bus.emit("query-rank-data", { id: player.id })
})

const loadingState = ref(0)
const loadingText = ref("正在等待选定对手")

const info_test = ref(["√", "×", "×", "×", "√"])
const computedLoading = computed(() => {
	return loadingState.value !== 0
})

$Bus.on("query-rank-data-reply", (data) => {
	console.log(data)
})
</script>

<template>
	<div class="rank-helper">
		<span class="loading-text" v-if="!computedLoading">
			<CloudArrowDownIcon class="loading-icon" />
			<span>{{ loadingText }}</span>
		</span>
		<span class="rank-infomation" v-else>
			最近胜负情况
			<span class="info-item" v-for="info in info_test" :key="info">
				{{ info }}
			</span>
		</span>
	</div>
</template>

<style lang="postcss" scoped>
.rank-helper {
	@apply z-0;
}
/* Loading style */
.loading-text {
	@apply inline-flex items-center pt-3 animate-pulse select-none;
}

.loading-icon {
	@apply w-5 h-5 mr-2;
}
</style>
