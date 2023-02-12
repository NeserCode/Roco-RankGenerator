import Mitt from "mitt"

import type {
	Ws_JoinPackage,
	Ws_ClientSumPackage,
	Ws_RankPackage,
} from "@/shared/types"

export const $Bus = Mitt<{
	// request join room
	"request-join-room": Ws_JoinPackage
	"update-client-number": Ws_ClientSumPackage
	"update-join-player": Ws_RankPackage
}>()
