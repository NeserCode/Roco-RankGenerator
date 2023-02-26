<script lang="ts" setup>
import { CloudArrowDownIcon, ArrowPathIcon } from "@heroicons/vue/20/solid"

import { ref, defineProps, toRefs, watch, computed, onUnmounted } from "vue"

import { $Bus } from "@/utils/Mitt"
import { computedRank, RankAnalyse } from "@/utils/rank"
import { RankStack, BattleStack } from "@/utils/rankStack"

import type { Ws_RankPackage } from "@/shared/types"

const $props = defineProps<{
	query: Ws_RankPackage
}>()
const { query } = toRefs($props)

watch(query, (player: Ws_RankPackage) => {
	$Bus.emit("query-rank-data", { id: player.id })
	console.log(1)
})

const loadingState = ref(true)
const loadingText = ref("正在等待选定对手")
const adviceText = ref("正在计算")
const adviceLoadingState = ref(true)
let loadingTimer: NodeJS.Timeout[] = []
const computedRankText = computed(() =>
	computedRank(query.value.rank, query.value.level, query.value.star)
)

const rankStack = ref<RankStack>(new RankStack())
const battleInfo = computed(() =>
	rankStack.value.translateToBattle(query.value.id)
)

const computedTitle = (info: BattleStack) => {
	return `${info.state ? "战胜" : "输给"} ${info.opponent.nickname}`
}

function getAdvice(data: BattleStack[]): string {
	let winCount = 0
	let loseCount = 0
	let winRate = 0
	let advice = ""
	let rankAnalyseResult = RankAnalyse(data, query.value)

	data.forEach((info) => {
		if (info.state) {
			winCount++
		} else {
			loseCount++
		}
	})

	winRate = winCount / (winCount + loseCount)

	advice = `对手胜率：${(winRate * 100).toFixed(2)}%`
	console.log(rankAnalyseResult)

	if (data.length === 0) advice = `一场战斗都没有`
	if (rankAnalyseResult.isDoubleWin) {
		advice += `正处于连胜两场状态`
	}

	return advice
}

$Bus.on("query-rank-data-reply", (data) => {
	clearTimeout(loadingTimer[0])
	clearTimeout(loadingTimer[1])

	loadingState.value = true
	adviceLoadingState.value = true
	adviceText.value = "正在计算"

	loadingTimer[0] = setTimeout(() => {
		loadingState.value = false
	}, 800)
	loadingTimer[1] = setTimeout(() => {
		adviceLoadingState.value = false
		if (query.value.id === "null")
			adviceText.value = "空排 你还想要什么建议....随便选一个"
		else adviceText.value = getAdvice(battleInfo.value)
	}, 1800)

	rankStack.value.setStack(data)
})

onUnmounted(() => {
	// Fix bug: when the component is unmounted, the event will still be triggered
	$Bus.off("query-rank-data-reply")
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
					<span
						class="info-item"
						v-for="info in battleInfo"
						:key="info.id"
						:title="computedTitle(info)"
					>
						{{ info.state ? "胜" : "负" }}
					</span>
					<span class="info-item" v-if="battleInfo.length === 0">暂无</span>
				</span>
			</span>
			<span>
				<span class="prefix">Ta的段位</span>
				<span class="rank-simple">
					<span>{{ computedRankText }}</span>
				</span>
			</span>
			<span class="advice">
				<span class="prefix">建议</span>
				<ArrowPathIcon class="advice-loading-icon" v-if="adviceLoadingState" />
				<span class="rank-simple">
					<span>{{ adviceText }}</span>
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

/* Advice style */
.advice {
	@apply inline-flex items-center pt-2;
}

.advice-loading-icon {
	@apply w-3 h-3 animate-spin mx-1;
}
</style>
