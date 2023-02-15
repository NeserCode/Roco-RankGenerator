<script lang="ts" setup>
import { useStore } from "vuex"
import { computed, toRefs, defineProps } from "vue"

// import { $Bus } from '@/utils/Mitt'

import { Ws_RankPackage } from "@/shared/types"

const $props = defineProps<{
	player: Ws_RankPackage
}>()
const $store = useStore()

const { player } = toRefs($props)

const computedRank = computed(() => {
	let rankText =
		Number(player.value.rank) == 0
			? "学徒魔法师"
			: player.value.rank == 1
			? "初级魔法师"
			: player.value.rank == 2
			? "中级魔法师"
			: player.value.rank == 3
			? "高级魔法师"
			: player.value.rank == 4
			? "魔导士"
			: "圣魔导师"
	let levelText = "I"
	switch (Number(player.value.level)) {
		case 0:
			levelText = "I"
			break
		case 1:
			levelText = "II"
			break
		case 2:
			levelText = "III"
			break
		case 3:
			levelText = "IV"
			break
		case 4:
			levelText = "V"
			break
		default:
			levelText = "I"
			break
	}
	return `${rankText}·${levelText}·${player.value.star}星`
})

const wheatherHost = computed(() => {
	return $store.state.room.id === player.value.id
})
</script>

<template>
	<div class="player-item">
		<div class="player-item-container">
			<div class="player-item-nickname">
				<span v-if="wheatherHost" class="host">房主</span>
				{{ player.nickname }}
			</div>
			<div class="player-item-rank">{{ computedRank }}</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.player-item {
	@apply inline-block flex-row justify-center w-full py-1 px-2
  border-slate-300 dark:border-slate-500 select-none;
}

.item:nth-child(odd) .player-item {
	@apply bg-slate-100 dark:bg-slate-600;
}

.item:nth-child(even) .player-item {
	@apply bg-slate-200 dark:bg-slate-700;
}

.player-item-nickname .host {
	@apply inline-block justify-center items-center text-sm px-1 rounded-full
  bg-slate-600 text-slate-100 dark:bg-slate-200 dark:text-slate-700 select-none;
}

.player-item-nickname {
	@apply w-full truncate
  text-slate-700 dark:text-slate-100;
}

.player-item-rank {
	@apply text-slate-500 text-sm;
}
</style>
