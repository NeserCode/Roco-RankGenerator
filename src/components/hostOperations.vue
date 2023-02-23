<script lang="ts" setup>
import ContainerDialog from "./containerDialog.vue"
import RankHelper from "./rankHelper.vue"
import { debounce } from "ts-debounce"
import { ref, computed, watch } from "vue"
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

const selectedPlayer = ref({})
const filteredPlayers = computed(() =>
	query.value === ""
		? $store.state.room.players
		: $store.state.room.players.filter((player) => {
				return player.nickname.toLowerCase().includes(query.value.toLowerCase())
		  })
)

const readyText = ref("等待连接服务器")

const updateOwnRank = debounce(() => {
	$Bus.emit("update-own-rank")
}, 2000)

const startRound = debounce(() => {
	$Bus.emit("start-round")
}, 2000)

const nextRoundStart = debounce(() => {
	$Bus.emit("next-round", {
		round: $store.state.room.round,
	})
}, 3000)

// ws state
$Bus.on("update-ws-state", (data) => {
	if (data.state === 1) readyText.value = "已连接服务器"
	else if (data.state === -1) readyText.value = "连接服务器时出错"
	else if (data.state === 0) readyText.value = "与服务器断开连接"
})

function closeDialog() {
	$Bus.emit("dialog-container-close")
}

const isActivedItem = computed(() => (active: boolean) => {
	return active ? "actived" : null
})
const isNotFound = computed(() => {
	return filteredPlayers.value.length === 0 && query.value !== ""
})
const displayFn = (player: Ws_RankPackage) => player.nickname

const loger = () => {
	console.log(selectedPlayer.value)
}

watch(selectedPlayer, loger)
</script>

<template>
	<div class="host-operations">
		<div class="main">
			<span class="state">
				{{ readyText }}
			</span>
			<button class="operation" v-if="$store.state.isHost" @click="startRound">
				开始发车
			</button>
			<button
				class="operation"
				v-if="$store.state.isHost"
				@click="nextRoundStart"
			>
				下一轮开始
			</button>
			<button
				class="operation"
				@click="updateOwnRank"
				:disabled="!$store.state.isJoinedRoom"
			>
				更新段位
			</button>
		</div>
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
								Nothing found.
							</div>
							<ComboboxOption
								v-for="player in filteredPlayers"
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
					若双方在下一个回合开始前没有选择或者双方对于胜负有分歧，该次比赛将由对手的决定记录比分。
				</p>
				<p>自己的选择只会影响到对手的最近胜负。同样，你的对手也是如此。</p>
				<p>
					若双方没有配对成功，即选择了错误的对手，本场比赛将不会有记录（显示为未定胜负）
				</p>
			</template>
			<template #options>
				<rank-helper :query="selectedPlayer" />
				<div class="options">
					<button class="btn primary" @click="closeDialog">选择胜利</button>
					<button class="btn primary" @click="closeDialog">选择认输</button>
				</div>
			</template>
		</container-dialog>
	</div>
</template>

<style lang="postcss" scoped>
.main {
	@apply inline-flex items-center justify-evenly w-full flex-wrap;
}

/* button style */
button.operation {
	@apply relative w-24 py-0.5 px-1 mx-0.5 my-2 text-center border-2 border-gray-300 bg-gray-200
  dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200
  rounded text-gray-700
  transition-all duration-300 ease-in-out select-none;
}

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

.state {
	@apply flex items-center justify-center px-2
	text-gray-500 dark:text-gray-500 text-sm
	select-none;
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
	@apply relative cursor-default select-none flex items-center justify-start
	py-1.5 px-9;
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
