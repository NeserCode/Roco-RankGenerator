import { createStore } from "vuex"

import type { RankLevel } from "@/shared/types"
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
		room: {
			id: "",
			players: [],
			ownerId: "",
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
		updateUserRank(state, rank: RankLevel) {
			state.user.rank = rank.rank
			state.user.level = rank.level
			state.user.star = rank.star
		},
	},
})
