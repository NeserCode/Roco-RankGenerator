import { Ws_BattleInfoPackage } from "@/shared/types"

export class RankStack {
	value: Ws_BattleInfoPackage[] = []
	limit = 10

	constructor(lengthLimit?: number) {
		this.limit = lengthLimit ?? 10
	}

	public pushRank(rank: Ws_BattleInfoPackage) {
		if (rank === undefined || rank === null) return
		if (this.value.length === this.limit) {
			this.value.shift()
		}
		this.value.push(rank)
	}

	public getRank() {
		return this.value
	}

	public getRankByIndex(index: number) {
		return this.value[index]
	}

	public setStack(data: Ws_BattleInfoPackage[]) {
		this.value = data
	}
}
