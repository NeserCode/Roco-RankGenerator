import Mitt from "mitt"

import type {
	Ws_JoinPackage,
	Ws_ClientSumPackage,
	Ws_RankPackage,
	Ws_HostPackage,
	Ws_TimePackage,
} from "@/shared/types"

export const $Bus = Mitt<{
	// request join room
	"request-join-room": Ws_JoinPackage
	"update-client-number": Ws_ClientSumPackage
	"update-join-player": Ws_RankPackage
	"ensure-host-room": Ws_HostPackage
	"update-own-rank": void
	"update-rank": Ws_RankPackage
	"start-round": void
	"start-round-count": Ws_TimePackage
	"next-round": { round: number }
	"next-round-count": Ws_TimePackage & { round: number }
}>()
