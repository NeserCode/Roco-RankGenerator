<script setup lang="ts">
import { initialDarkMode, toggleDarkMode } from "@/utils/DarkMode"
import { ipcRenderer } from "electron"

import { onMounted } from "vue"

// listen to the dark mode change event
ipcRenderer.on("dark-mode", () => {
	toggleDarkMode()
})

onMounted(() => {
	initialDarkMode()
	document.title = "Roco Rank - 洛克王国系别车队专用排位系统"
})
</script>

<template>
	<div class="app-container">
		<nav class="link-container">
			<button class="view-btn">
				<router-link to="/">首页</router-link>
			</button>
			<button class="view-btn">
				<router-link to="/setting">设置</router-link>
			</button>
		</nav>

		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
</template>

<style lang="postcss" scoped>
.app-container {
	@apply flex flex-col justify-center items-center w-full h-[551px];
}
nav.link-container {
	@apply fixed top-0 inline-flex justify-center items-center w-full py-4
	bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-slate-800
	shadow-md;
}

button.view-btn {
	@apply inline-flex justify-center items-center py-0 px-3 mx-2
  border-2 border-gray-300 bg-gray-200 hover:bg-gray-300
	dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200
  rounded text-gray-700 font-medium
  transition-all duration-300 ease-in-out select-none;
}

button.view-btn:active {
	@apply bg-gray-400;
}

button.view-btn:focus {
	@apply outline-none;
}

.view-btn a {
	@apply border-b-2 border-transparent;
	-webkit-user-drag: none;
}

.view-btn a.router-link-exact-active {
	@apply border-gray-700 dark:border-gray-300;
}
</style>

<style lang="postcss">
@font-face {
	font-family: "HYWH";
	src: url("./assets/HYWenHei-75W.ttf");
}

html,
body {
	@apply max-h-full m-0 p-0 overflow-x-hidden;
	font-family: "HYWH";
}

.home,
.setting {
	@apply overflow-y-auto overflow-x-hidden mt-[63px];
}

html.dark {
	color-scheme: dark;
}
</style>
