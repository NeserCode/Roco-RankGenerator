<script lang="ts" setup>
import { SettingOptionToken } from "@/tokens/settingOption"
import { RankLimit } from "@/shared/rankLimit"
import { inject } from "vue"

const { boundValue } = inject(SettingOptionToken, {})

function resetLevel() {
	if (boundValue.rank < 4) {
		boundValue.level = 0
		boundValue.star = 0
	}
}

const computedMax = () => {
	return RankLimit.Star - (boundValue.rank < 3 ? 1 : 0)
}
</script>

<template>
	<div class="setting-roco-rank-level">
		<div class="roco-rank-level">
			<div class="roco-rank-level-label">等级</div>
			<div class="roco-rank-level-selection">
				<span class="line">
					<select v-model="boundValue.rank" @change="resetLevel">
						<option :value="0">学徒魔法师</option>
						<option :value="1">初级魔法师</option>
						<option :value="2">中级魔法师</option>
						<option :value="3">高级魔法师</option>
						<option :value="4">魔导士</option>
						<option :value="5">圣魔导师</option>
					</select>
				</span>
				<span class="line">
					<select v-model="boundValue.level">
						<option :value="0" selected>一段</option>
						<option :value="1">二段</option>
						<option :value="2">三段</option>
						<option :value="3" :disabled="boundValue.rank < 2">四段</option>
						<option :value="4" :disabled="boundValue.rank < 4">五段</option>
					</select>
					<input
						type="number"
						:max="computedMax()"
						min="0"
						v-model="boundValue.star"
					/>星
				</span>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.roco-rank-level-selection {
	@apply flex flex-col justify-center;
}

.setting-roco-rank-level input {
	@apply w-12 py-px px-1 text-center border-2 mx-1
  border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700 font-medium
  transition-all duration-300 ease-in-out select-none;
}

.line {
	@apply py-0.5;
}

/* select style */
.setting-roco-rank-level select {
	@apply w-32 py-0.5 px-1 text-center border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700 font-medium
  transition-all duration-300 ease-in-out select-none;
}

/* label style */
.setting-roco-rank-level .roco-rank-level-label {
	@apply w-full py-0.5 select-none;
}
</style>
