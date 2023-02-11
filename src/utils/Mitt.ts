import Mitt from "mitt"

import type { Ws_JoinPackage } from "@/shared/types"

export const $Bus = Mitt<{
	// request join room
	"request-join-room": Ws_JoinPackage
}>()
