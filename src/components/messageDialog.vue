<script setup lang="ts">
import { ref, toRefs, defineEmits, defineProps, watch } from "vue"
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/vue"

import type { Notification } from "@/shared/types"

const $emit = defineEmits(["open", "close"])

const $props = defineProps<{
	textNotifaication?: Notification
}>()
const { textNotifaication } = toRefs($props)

const isOpen = ref(true)

watch(isOpen, (value) => {
	if (value) $emit("open")
	else $emit("close")
})

function optionAction(callback?: () => void, withClose?: boolean) {
	if (callback) callback()

	if (textNotifaication?.value?.options?.length === 1) closeModalWindow()
	else if (withClose) closeModalWindow()
}

function closeModalWindow() {
	isOpen.value = false
}
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" class="dialog">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="dialog-backdrop" />
			</TransitionChild>

			<div class="dialog-warpper-main">
				<div class="dialog-warpper">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel class="dialog-panel">
							<DialogTitle as="h3" class="dialog-title">
								{{ textNotifaication?.title }}
							</DialogTitle>
							<div class="dialog-details">
								<p v-for="item in textNotifaication?.message" :key="item">
									{{ item }}
								</p>
							</div>

							<div class="options-container">
								<button
									v-for="option in textNotifaication?.options"
									:key="option?.text"
									type="button"
									class="btn"
									:class="option?.type"
									@click="optionAction(option?.callback, option?.withClose)"
								>
									{{ option?.text }}
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<style lang="postcss" scoped>
.dialog {
	@apply relative z-10;
}
.dialog-backdrop {
	@apply fixed inset-0 bg-black dark:bg-white
	bg-opacity-50 dark:bg-opacity-20;
}
.dialog-panel {
	@apply w-full max-w-md p-6 overflow-hidden text-left
	align-middle transition-all transform
	bg-gray-50 dark:bg-gray-800 shadow-xl rounded-2xl;
}
.dialog-warpper-main {
	@apply fixed inset-0 overflow-hidden;
}
.dialog-warpper {
	@apply flex items-center justify-center min-h-full p-4 text-center;
}

.dialog-details {
	@apply flex flex-col max-h-64 overflow-y-auto
	text-sm text-gray-400;
}
.dialog-title {
	@apply flex items-center py-2 text-lg font-medium leading-6;
}

.btn {
	@apply inline-flex justify-center px-4 py-2 text-sm font-medium 
	text-blue-900 bg-blue-100 border border-transparent
	rounded-md hover:bg-blue-200 focus:outline-none select-none
	focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2;
}
.btn.NOTIFY_OPTIONS_PRIMARY {
	@apply bg-blue-500 text-white;
}
.btn.NOTIFY_OPTIONS_DANGER {
	@apply bg-red-500 text-white;
}

.options-container {
	@apply flex flex-wrap justify-between items-center mt-4;
}
</style>
