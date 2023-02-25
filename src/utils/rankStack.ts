import { Ws_BattleInfoPackage } from "@/shared/types"

export interface BattleStack extends Ws_BattleInfoPackage {
	state: boolean
	opponent: Ws_BattleInfoPackage["winer"] | Ws_BattleInfoPackage["loser"]
}

export class RankStack {
	sValue: Ws_BattleInfoPackage[] = []
	sLimit = 10

	constructor(lengthLimit?: number) {
		this.sLimit = lengthLimit ?? 10
	}

	public pushRank(rank: Ws_BattleInfoPackage) {
		if (rank === undefined || rank === null) return
		if (this.sValue.length === this.sLimit) {
			this.sValue.shift()
		}
		this.sValue.push(rank)
	}

	public getRank() {
		return this.sValue
	}

	public getRankByIndex(index: number) {
		return this.sValue[index]
	}

	public setStack(data: Ws_BattleInfoPackage[]) {
		this.sValue = data
	}

	public translateToBattle(id: string): BattleStack[] {
		const result: BattleStack[] = []
		if (this.sValue.length !== 0) {
			this.sValue.forEach((item) => {
				if (item.winer.id !== "null" && item.loser.id !== "null") {
					if (item.winerId === id) {
						result.push({ ...item, state: true, opponent: item.loser })
					} else if (item.loserId === id) {
						result.push({ ...item, state: false, opponent: item.winer })
					}
				}
			})
		}
		return result
	}
}
