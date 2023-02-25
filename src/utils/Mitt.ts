import Mitt from "mitt"

import type {
	Ws_JoinPackage,
	Ws_ClientSumPackage,
	Ws_RankPackage,
	Ws_HostPackage,
	Ws_TimePackage,
	Ws_BattlePackage,
	Ws_BattleInfoPackage,
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
	"update-ws-state": { state: number }
	"dialog-container-open": void
	"dialog-container-close": void
	"update-battle": Ws_BattlePackage
	"ensure-battle": Ws_BattleInfoPackage
	"query-rank-data": { id: string }
	"query-rank-data-reply": Ws_BattleInfoPackage[]
}>()
