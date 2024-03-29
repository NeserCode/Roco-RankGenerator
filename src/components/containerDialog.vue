<script setup lang="ts">
import { ref } from "vue"
import { useStore } from "vuex"
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
	DialogDescription,
} from "@headlessui/vue"

import { $Bus } from "@/utils/Mitt"
import { key } from "@/state"

const $store = useStore(key)
const isOpen = ref(false)

$Bus.on("dialog-container-open", () => {
	isOpen.value = true
	$Bus.emit("query-rank-data", { id: $store.state.user.id })
})
$Bus.on("dialog-container-close", () => {
	isOpen.value = false
})
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
								<slot name="title"></slot>
							</DialogTitle>
							<DialogDescription as="div" class="dialog-details">
								<slot name="details"></slot>
								<div class="scrollable">
									<slot name="info"></slot>
								</div>
							</DialogDescription>
							<slot name="options"></slot>
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
	bg-opacity-50 dark:bg-opacity-20 cursor-not-allowed;
}
.dialog-panel {
	@apply w-full max-w-md p-6 overflow-hidden text-left
	align-middle transition-all transform
	bg-gray-50 dark:bg-gray-800 shadow-xl rounded-2xl cursor-auto;
}
.dialog-warpper-main {
	@apply fixed inset-0 overflow-hidden cursor-not-allowed;
}
.dialog-warpper {
	@apply flex items-center justify-center min-h-full p-4 text-center;
}

.dialog-details {
	@apply flex flex-col
	text-sm text-gray-400 select-none;
}
.dialog-details .scrollable {
	@apply mt-1 px-1.5 max-h-40
	border-gray-200 dark:border-gray-700 overflow-y-auto;
}
.dialog-title {
	@apply flex items-center py-2 text-lg font-medium leading-6 select-none;
}
</style>
