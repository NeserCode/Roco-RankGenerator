<script lang="ts" setup>
import { CloudArrowDownIcon } from "@heroicons/vue/20/solid"

import { ref, computed } from "vue"

const loadingState = ref(0)
const loadingText = ref("正在加载排名数据")

const info_test = ref(["√", "×", "×", "×", "√"])
const computedLoading = computed(() => {
	return loadingState.value !== 0
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
