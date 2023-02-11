import { createStore } from "vuex"
/**
 * 创建仓库和导出
 */

export default createStore({
	state: {
		isJoinedRoom: false,
		isHost: false,
		user: {
			id: "",
			nickname: "",
			rank: 0,
			level: 0,
			star: 0,
		},
	},
	mutations: {
		ensureJoinedRoom(state) {
			state.isJoinedRoom = true
		},
		ensureHost(state) {
			state.isHost = true
		},
		ensureQuitRoom(state) {
			state.isJoinedRoom = false
			state.isHost = false
		},
		ensureUnhost(state) {
			state.isHost = false
		},
	},
})
