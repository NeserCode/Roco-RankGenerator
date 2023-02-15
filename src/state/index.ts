import { createStore } from "vuex"
import { $Bus } from "@/utils/Mitt"

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
		isReady: false,
		user: {
			id: "",
			nickname: "",
			rank: 0,
			level: 0,
			star: 0,
		},
		room: {
			id: "",
			round: 0,
			players: [
				{
					id: "",
					nickname: "",
					rank: 0,
					level: 0,
					star: 0,
				},
			],
			clientSum: 0,
		},
	},
	mutations: {
		ensureJoinedRoom(state) {
			state.isJoinedRoom = true
		},
		ensureQuitRoom(state) {
			state.isJoinedRoom = false
			state.isHost = false
		},
		updateRoomId(state, id: string) {
			state.room.id = id
			if (
				!state.isHost &&
				state.isJoinedRoom &&
				state.room.id === state.user.id
			) {
				state.isHost = true
				$Bus.emit("ensure-host-room", {
					id: state.room.id,
					timestamp: Date.now(),
					type: "HOST_ENSURE",
					nickname: state.user.nickname,
				})
			} else if (state.isHost && state.room.id !== state.user.id)
				state.isHost = false
		},
		updateUserNickname(state, { id, nickname }) {
			state.user.id = id
			state.user.nickname = nickname
		},
		updateRank(state, data: Ws_RankPackage) {
			const player = state.room.players.findIndex(
				(player) => player.id === data.id
			)
			if (player !== -1) {
				state.room.players[player].rank = data.rank
				state.room.players[player].level = data.level
				state.room.players[player].star = data.star
			}
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
		getReady(state) {
			state.isReady = true
		},
		cancelReady(state) {
			state.isReady = false
		},
		nextRound(state) {
			state.room.round++
		},
	},
})
