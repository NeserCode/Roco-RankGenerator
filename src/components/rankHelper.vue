<script lang="ts" setup>
import { CloudArrowDownIcon, ArrowPathIcon } from "@heroicons/vue/20/solid"
import { ref, defineProps, toRefs, watch, computed, onUnmounted } from "vue"
import { useStore } from "vuex"

import { key } from "@/state"
import { $Bus } from "@/utils/Mitt"
import { computedRank, RankAnalyse, compareRank } from "@/utils/rank"
import { RankStack, BattleStack } from "@/utils/rankStack"

import type { Ws_RankPackage } from "@/shared/types"

const $props = defineProps<{
	query: Ws_RankPackage
}>()
const { query } = toRefs($props)
const $store = useStore(key)

watch(query, (player: Ws_RankPackage) => {
	$Bus.emit("query-rank-data", { id: player.id })
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
const selfStack = ref<RankStack>(new RankStack())

const battleInfo = computed(() =>
	rankStack.value.translateToBattle(query.value.id)
)
const selfBattleInfo = () =>
	selfStack.value.translateToBattle($store.state.user.id)

const computedTitle = (info: BattleStack) => {
	return `${info.state ? "战胜" : "输给"} ${info.opponent.nickname}`
}

function getAdvice(data: BattleStack[], self: BattleStack[]): string {
	let winCount = 0
	let loseCount = 0
	let winRate = 0
	let advice = ""
	let power = 0
	let rankAnalyseResult = RankAnalyse(data, query.value)
	let selfAnalyseResult = RankAnalyse(self, $store.state.user)
	let winByRank = compareRank($store.state.user, query.value)

	data.forEach((info) => {
		if (info.state) winCount++
		else loseCount++
	})

	winRate = (winCount / (winCount + loseCount)) * 100

	advice = `对手胜率 ${winRate.toFixed(2)}% `

	if (rankAnalyseResult.isDoubleWin) {
		advice += " Ta正在二连胜"
		power -= 5
	} else if (rankAnalyseResult.isDoubleLose) {
		advice += " Ta正在二连败"
		power += 5
	} else if (rankAnalyseResult.isTripleLose) {
		advice += " Ta正在三连败"
		power -= 2
	} else if (rankAnalyseResult.isTripleWin) {
		advice += " Ta正在三连胜"
		power += 2
	} else if (rankAnalyseResult.isFirstWin) {
		advice += " Ta正在首胜"
		power -= 2
	} else if (rankAnalyseResult.isFirstLose) {
		advice += " Ta正在首败"
		power += 2
	} else if (rankAnalyseResult.isMoreThanThreeWin) {
		advice += " Ta正在疯狂连胜"
		power += 1
	} else if (rankAnalyseResult.isMoreThanThreeLose) {
		advice += " Ta正在疯狂连败"
		power -= 1
	}

	if (selfAnalyseResult.isDoubleWin) {
		advice += " 你正在二连胜"
		power += 5
	} else if (selfAnalyseResult.isDoubleLose) {
		advice += " 你正在二连败"
		power -= 5
	} else if (selfAnalyseResult.isTripleLose) {
		advice += " 你正在三连败"
		power += 2
	} else if (selfAnalyseResult.isTripleWin) {
		advice += " 你正在三连胜"
		power -= 2
	} else if (selfAnalyseResult.isFirstWin) {
		advice += " 你正在首胜"
		power += 2
	} else if (selfAnalyseResult.isFirstLose) {
		advice += " 你正在首败"
		power -= 2
	} else if (selfAnalyseResult.isMoreThanThreeWin) {
		advice += " 你正在疯狂连胜"
		power -= 1
	} else if (selfAnalyseResult.isMoreThanThreeLose) {
		advice += " 你正在疯狂连败"
		power += 1
	}

	if (data.length === 0) advice = `一场战斗都没有怎么分析啊喂，胜者组吃分吧`
	else if (winByRank === 1) {
		advice += ` 段位高于对手`
		power += 1
	} else if (winByRank === -1) {
		advice += ` 段位低于对手`
		power -= 1
	} else if (winByRank === 0) {
		advice += ` 段位与对手相同`
	}

	if (power > 0) advice += " 建议:赢"
	else if (power < 0) advice += " 建议:输"

	return advice
}

$Bus.on("query-rank-data-reply", ({ data, queryId }) => {
	let selfId = localStorage.getItem("roco.user.id") ?? ""

	if (queryId === selfId) selfStack.value.setStack(data)
	else {
		clearTimeout(loadingTimer[0])
		clearTimeout(loadingTimer[1])

		loadingState.value = true
		adviceLoadingState.value = true
		adviceText.value = "正在计算"

		loadingTimer[0] = setTimeout(() => {
			loadingState.value = false
		}, 200)
		loadingTimer[1] = setTimeout(() => {
			adviceLoadingState.value = false
			if (query.value.id === "null")
				adviceText.value = "空排 还想要什么建议....随便选一个"
			else
				adviceText.value = getAdvice(battleInfo.value, selfBattleInfo())
		}, 500)

		rankStack.value.setStack(data)
	}
})

$Bus.on("recieve-battle-self", (data) => {
	console.log(data)
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
					<span class="info-item" v-if="battleInfo.length === 0"
						>暂无</span
					>
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
				<ArrowPathIcon
					class="advice-loading-icon"
					v-if="adviceLoadingState"
				/>
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
