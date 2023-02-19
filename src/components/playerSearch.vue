<template>
	<div class="player-search">
		<Combobox v-model="selected">
			<div class="relative">
				<div class="input-wapper">
					<ComboboxInput
						class="box-input"
						:displayValue="(person) => person.name"
						@change="query = $event.target.value"
					/>
					<ComboboxButton class="box-btn">
						<ChevronUpDownIcon class="box-btn-icon" aria-hidden="true" />
					</ComboboxButton>
				</div>
				<TransitionRoot
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					@after-leave="query = ''"
				>
					<ComboboxOptions class="box-options">
						<div
							v-if="filteredPeople.length === 0 && query !== ''"
							class="relative px-4 py-2 text-gray-700 cursor-default select-none"
						>
							Nothing found.
						</div>

						<ComboboxOption
							v-for="person in filteredPeople"
							as="template"
							:key="person.id"
							:value="person"
							v-slot="{ selected, active }"
						>
							<li
								class="relative py-2 pl-10 pr-4 cursor-default select-none"
								:class="{
									'bg-teal-600 text-white': active,
									'text-gray-900': !active,
								}"
							>
								<span
									class="block truncate"
									:class="{ 'font-medium': selected, 'font-normal': !selected }"
								>
									{{ person.name }}
								</span>
								<span
									v-if="selected"
									class="absolute inset-y-0 left-0 flex items-center pl-3"
									:class="{ 'text-white': active, 'text-teal-600': !active }"
								>
									<CheckIcon class="w-5 h-5" aria-hidden="true" />
								</span>
							</li>
						</ComboboxOption>
					</ComboboxOptions>
				</TransitionRoot>
			</div>
		</Combobox>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import {
	Combobox,
	ComboboxInput,
	ComboboxButton,
	ComboboxOptions,
	ComboboxOption,
	TransitionRoot,
} from "@headlessui/vue"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid"

const people = [
	{ id: 1, name: "Wade Cooper" },
	{ id: 2, name: "Arlene Mccoy" },
	{ id: 3, name: "Devon Webb" },
	{ id: 4, name: "Tom Cook" },
	{ id: 5, name: "Tanya Fox" },
	{ id: 6, name: "Hellen Schmidt" },
]

let selected = ref(people[0])
let query = ref("")

let filteredPeople = computed(() =>
	query.value === ""
		? people
		: people.filter((person) =>
				person.name
					.toLowerCase()
					.replace(/\s+/g, "")
					.includes(query.value.toLowerCase().replace(/\s+/g, ""))
		  )
)
</script>

<style lang="postcss" scoped>
.player-search {
	@apply relative;
}

.input-wapper {
	@apply relative w-full overflow-hidden text-left 
  bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 
  focus-visible:ring-white focus-visible:ring-opacity-75 
  focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300;
}

.box-input {
	@apply w-full py-2 pl-3 pr-10 text-sm leading-5
  text-gray-900 border-none focus:ring-0;
}

.box-btn {
	@apply absolute inset-y-0 right-0 flex items-center pr-2;
}

.box-btn-icon {
	@apply w-5 h-5 text-gray-400;
}

.box-options {
	@apply absolute w-full py-1 mt-1 overflow-auto text-base 
  bg-white rounded-md shadow-lg max-h-60 ring-1 
  ring-black ring-opacity-5 focus:outline-none sm:text-sm;
}
</style>
