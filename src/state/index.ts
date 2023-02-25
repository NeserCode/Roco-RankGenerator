import { createStore } from "vuex"
import { $Bus } from "@/utils/Mitt"

import { InjectionKey } from "vue"
import type { Store } from "vuex"

import type {
	RankLevel,
	Ws_ClientSumPackage,
	Ws_RankPackage,
} from "@/shared/types"

export interface State {
	isJoinedRoom: boolean
	isHost: boolean
	isReady: boolean
	isAddon: boolean
	user: Ws_RankPackage
	room: {
		id: string
		round: number
		players: Ws_RankPackage[]
		clientSum: number
	}
	isEnsuredBattle: boolean
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol()

export default createStore<State>({
	state: {
		isJoinedRoom: false,
		isHost: false,
		isReady: false,
		isAddon: false,
		user: {
			id: "",
			nickname: "",
			rank: 0,
			level: 0,
			star: 0,
			timestamp: -1,
			type: "RANK",
		},
		room: {
			id: "",
			round: 0,
			players: [],
			clientSum: 0,
		},
		isEnsuredBattle: false,
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
			state.room.players.push(player)
		},
		updateClientSum(state, data: Ws_ClientSumPackage) {
			state.room.clientSum = data.client
		},
		updateRoomPlayersFromWs(
			state,
			data: {
				playerIdList: string[]
				playerList: Ws_RankPackage[]
			}
		) {
			state.room.players = []
			data.playerIdList.forEach((id) => {
				const player = data.playerList.find((player) => player.id === id)
				if (player) state.room.players.push(player)
			})
		},
		getReady(state) {
			state.isReady = true
		},
		cancelReady(state) {
			state.isReady = false
		},
		nextRound(state) {
			state.room.round++
			// Auto run
			// $Bus.emit("next-round", { round: state.room.round })
		},
		updateRound(state, round: number) {
			state.room.round = round
		},
		ensureAddon(state) {
			state.isAddon = true
		},
		ensureBattle(state) {
			state.isEnsuredBattle = true
		},
		initBattle(state) {
			state.isEnsuredBattle = false
		},
	},
})
