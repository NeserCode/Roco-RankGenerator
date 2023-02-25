<script lang="ts" setup>
import { CloudArrowDownIcon } from "@heroicons/vue/20/solid"

import { ref, defineProps, toRefs, watch, computed } from "vue"

import { $Bus } from "@/utils/Mitt"
import { computedRank } from "@/utils/rank"
import { RankStack } from "@/utils/rankStack"

import type { Ws_RankPackage, Ws_BattleInfoPackage } from "@/shared/types"

const $props = defineProps<{
	query: Ws_RankPackage
}>()
const { query } = toRefs($props)

watch(query, (player: Ws_RankPackage) => {
	$Bus.emit("query-rank-data", { id: player.id })
})

const loadingState = ref(true)
const loadingText = ref("正在等待选定对手")
const computedRankText = computed(() =>
	computedRank(query.value.rank, query.value.level, query.value.star)
)

// const info_test = ref<Ws_BattleInfoPackage[]>([])
const info_test = ref<string[]>(["1W", "2L", "3L", "4L", "5W"])
const rankStack = ref<RankStack>(new RankStack())

$Bus.on("query-rank-data-reply", (data) => {
	loadingState.value = false
	rankStack.value.setStack(data)
})
</script>

<template>
	<div class="rank-helper">
		<span class="loading-text" v-if="loadingState">
			<CloudArrowDownIcon class="loading-icon" />
			<span>{{ loadingText }}</span>
		</span>
		<span class="rank-infomation" v-else>
			<span>
				<span class="prefix">Ta的战绩</span>
				<span class="rank-info-simple">
					<span class="info-item" v-for="info in info_test" :key="info">
						{{ info }}
					</span>
				</span>
			</span>
			<span>
				<span class="prefix">Ta的段位</span>
				<span class="rank-simple">
					<span>{{ computedRankText }}</span>
				</span>
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

/* Info style */
.rank-infomation {
	@apply inline-flex flex-col justify-center pt-3;
}

.prefix,
.rank-info-simple {
	@apply inline-block mx-1 text-sm select-none;
}

.rank-info-simple {
	@apply inline-flex items-center border-2
	border-gray-400 dark:border-gray-600;
}
.rank-simple {
	@apply inline-flex text-sm text-gray-500 dark:text-gray-300;
}

.info-item {
	@apply inline-block px-1 text-sm;
}
.info-item:nth-child(odd) {
	@apply bg-gray-300 dark:bg-gray-500;
}
</style>
