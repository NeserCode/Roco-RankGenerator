import { createStore } from "vuex"

import type {
	RankLevel,
	Ws_ClientSumPackage,
	Ws_RankPackage,
} from "@/shared/types"
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
			players: [{}],
			ownerId: "",
			clientSum: 0,
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
		updateUserNickname(state, { id, nickname }) {
			state.user.id = id
			state.user.nickname = nickname
		},
		updateUserRank(state, rank: RankLevel) {
			state.user.rank = rank.rank
			state.user.level = rank.level
			state.user.star = rank.star
		},
		updateRoomPlayers(state, player: Ws_RankPackage) {
			state.room.players.push({
				id: player.id,
				nickname: player.nickname,
				rank: player.rank,
				level: player.level,
				star: player.star,
			})
		},
		updateClientSum(state, data: Ws_ClientSumPackage) {
			state.room.clientSum = data.client
		},
	},
})
