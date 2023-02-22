import { ref } from "vue"
import { Ws_RankPackage } from "./types"

export const specialOption = ref<Ws_RankPackage[]>([
	{
		id: "null",
		nickname: "空排",
		rank: 0,
		level: 0,
		star: 0,
		type: "SPECIAL_RANK",
		timestamp: -1,
	},
	{
		id: "other",
		nickname: "路人",
		rank: 0,
		level: 0,
		star: 0,
		type: "SPECIAL_RANK",
		timestamp: -1,
	},
])
