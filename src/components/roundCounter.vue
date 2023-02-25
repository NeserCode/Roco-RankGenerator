<script lang="ts" setup>
import ContainerDialog from "./containerDialog.vue"
import RankHelper from "./rankHelper.vue"
// import { debounce } from "ts-debounce"
import { ref, computed } from "vue"
import { useStore } from "vuex"
import { key } from "@/state"

import { $Bus } from "@/utils/Mitt"

import {
	Combobox,
	ComboboxInput,
	ComboboxButton,
	ComboboxOptions,
	ComboboxOption,
	TransitionRoot,
} from "@headlessui/vue"

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid"
import { Ws_RankPackage } from "@/shared/types"

import { specialOption } from "@/shared/specialRankOptions"

const $store = useStore(key)
const query = ref("")

const selectedPlayer = ref<Ws_RankPackage>(specialOption.value[0])
const filteredPlayers = computed(() =>
	query.value === ""
		? $store.state.room.players
		: $store.state.room.players.filter((player) => {
				return player.nickname.toLowerCase().includes(query.value.toLowerCase())
		  })
)

function closeDialog() {
	$Bus.emit("dialog-container-close")
}

function battleStateHanlder(state: boolean) {
	let data = {
		id: $store.state.user.id,
		winerId: state ? $store.state.user.id : selectedPlayer.value.id,
		loserId: state ? selectedPlayer.value.id : $store.state.user.id,
		timestamp: Date.now(),
	}
	let isEnsured = $store.state.isEnsuredBattle === true

	$Bus.emit("update-battle", {
		...data,
		type: isEnsured ? "BATTLE_INFO_ENSURE" : "BATTLE_INFO",
	})

	// closeDialog()
}

const isActivedItem = computed(() => (active: boolean) => {
	return active ? "actived" : null
})
const isNotFound = computed(() => {
	return filteredPlayers.value.length === 0 && query.value !== ""
})
const displayFn = (player: Ws_RankPackage) => player.nickname

const exceptFn = (player: Ws_RankPackage) => {
	return player.id === $store.state.user.id
}
const exceptClass = (player: Ws_RankPackage) => {
	return player.id === $store.state.user.id ? "except" : null
}
</script>

<template>
	<div class="host-operations">
		<container-dialog>
			<template #title>
				<span>⌛ 正在进行第 {{ $store.state.room.round }} 回合</span>
			</template>
			<template #details>
				<Combobox v-model="selectedPlayer" by="id" as="div" class="combox-main">
					<div class="combox-input-container">
						<ComboboxInput
							class="combox-input"
							@change="query = $event.target.value"
							:displayValue="displayFn"
						/>
						<ComboboxButton class="combox-button">
							<ChevronUpDownIcon class="combox-input-icon" aria-hidden="true" />
						</ComboboxButton>
					</div>
					<TransitionRoot
						leave="transition ease-in-out duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<ComboboxOptions class="combox-options">
							<div
								v-if="isNotFound"
								class="relative px-4 py-2 text-gray-700 cursor-default select-none"
							>
								未找到相关玩家
							</div>
							<ComboboxOption
								v-for="player in filteredPlayers"
								:key="player.id"
								:value="player"
								v-slot="{ selected, active }"
								:disabled="exceptFn(player)"
							>
								<li
									:class="[
										'combox-option-item',
										isActivedItem(active),
										exceptClass(player),
									]"
								>
									<CheckIcon
										v-if="selected"
										class="check-icon"
										aria-hidden="true"
									/>
									<span class="player-name">{{ player.nickname }}</span>
								</li>
							</ComboboxOption>
							<ComboboxOption
								v-for="player in specialOption"
								:key="player.id"
								:value="player"
								v-slot="{ selected, active }"
							>
								<li :class="['combox-option-item', isActivedItem(active)]">
									<CheckIcon
										v-if="selected"
										class="check-icon"
										aria-hidden="true"
									/>
									<span class="player-name">{{ player.nickname }}</span>
								</li>
							</ComboboxOption>
						</ComboboxOptions>
					</TransitionRoot>
				</Combobox>
				<p>选择你的对手，并根据双方的最近胜负决定本回合自己的胜负</p>
				<p>
					若双方在下一个回合开始前<b>没有选择</b>或者双方对于胜负有<b>分歧</b>，该次比赛将由
					<span class="u" title="别对内鬼客气哦">对手的决定</span>
					记录比分。
				</p>
				<p>
					自己的选择只会影响到对手的最近胜负。
					<span class="u" title="有内鬼，停止交易！">你的对手也是如此</span>。
				</p>
				<p>
					若双方没有配对成功，即选择了错误的对手，本场比赛将不会有记录（显示为未定胜负）
				</p>
			</template>
			<template #options>
				<rank-helper :query="selectedPlayer" />
				<div class="options">
					<button class="btn primary" @click="battleStateHanlder(true)">
						选择胜利
					</button>
					<button class="btn primary" @click="battleStateHanlder(false)">
						选择认输
					</button>
				</div>
			</template>
		</container-dialog>
	</div>
</template>

<style lang="postcss" scoped>
/* button style */
button:disabled {
	@apply bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-500
	cursor-not-allowed;
}

/* inner dialog */
.options {
	@apply flex items-center w-full pt-2;
}
.options .btn {
	@apply mr-2;
}

p {
	@apply pt-2;
}

p .u {
	@apply underline underline-offset-4;
}

p b {
	@apply inline-block mx-0.5;
}

.btn {
	@apply inline-flex justify-center px-4 py-2 text-sm font-medium 
	text-blue-900 bg-blue-100 border border-transparent
	rounded-md hover:bg-blue-200 focus:outline-none select-none
	focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2;
}
.btn.primary {
	@apply bg-blue-500 text-white;
}
.btn.danger {
	@apply bg-red-500 text-white;
}

/* Combox style */
.combox-main {
	@apply relative w-full flex justify-center items-center;
}

.combox-input-container {
	@apply relative w-64 overflow-hidden border-2
	border-gray-300 dark:border-gray-600 text-left;
}

.combox-input {
	@apply w-full border-none py-2 pl-3 pr-10 text-sm bg-transparent
	text-gray-800 dark:text-gray-200 outline-none;
}

.combox-button {
	@apply absolute inset-y-0 right-0 flex items-center pr-2;
}

.combox-input-icon {
	@apply w-5 h-5 text-gray-500 dark:text-gray-400;
}

.combox-options {
	@apply absolute w-64 mt-1 max-h-48 py-1 overflow-auto border-2
	border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900;
}

.combox-option-item {
	@apply relative cursor-pointer select-none flex items-center justify-start
	py-1.5 px-9;
}
.combox-option-item.except {
	@apply bg-red-400 cursor-not-allowed;
}

.check-icon {
	@apply absolute top-2 left-2.5 w-4 h-4;
}

.player-name {
	@apply block truncate text-gray-700 dark:text-gray-200;
}
.actived .player-name {
	@apply text-gray-700;
}

.actived {
	@apply bg-gray-200 text-gray-700;
}
</style>
