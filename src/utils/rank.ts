// import type { Config } from "@/shared/types"
import type { RankAnalyseResult, Ws_RankPackage } from "@/shared/types"
import type { BattleStack } from "./rankStack"
// import type { Ref } from "vue"

export const computedRank = (rank: number, level: number, star: number) => {
	const rankText =
		Number(rank) == 0
			? "学徒魔法师"
			: rank == 1
			? "初级魔法师"
			: rank == 2
			? "中级魔法师"
			: rank == 3
			? "高级魔法师"
			: rank == 4
			? "魔导士"
			: "圣魔导师"
	let levelText = "I"

	switch (Number(level)) {
		case 0:
			levelText = "I"
			break
		case 1:
			levelText = "II"
			break
		case 2:
			levelText = "III"
			break
		case 3:
			levelText = "IV"
			break
		case 4:
			levelText = "V"
			break
		default:
			levelText = "I"
			break
	}
	return `${rankText}·${levelText}·${star}星`
}

export const RankAnalyse: (
	data: BattleStack[],
	player: Ws_RankPackage
) => RankAnalyseResult = (data, player) => {
	const lastBattle = data[data.length - 1]
	const result: RankAnalyseResult = {
		isDoubleLose: false,
		isDoubleWin: false,
		isFirstLose: false,
		isFirstWin: false,
		isMoreThanThreeLose: false,
		isMoreThanThreeWin: false,
		isTripleLose: false,
		isTripleWin: false,
		rank: lastBattle
			? lastBattle.state
				? lastBattle.winer
				: lastBattle.loser
			: player,
	}

	if (data.length === 0) return result

	if (data.length >= 2) {
		const last2Battle = data[data.length - 2]
		if (last2Battle.state === lastBattle.state) {
			result.isDoubleWin = lastBattle.state
			result.isDoubleLose = !lastBattle.state
		}
		if (data.length >= 3) {
			const last3Battle = data[data.length - 3]
			if (
				last3Battle.state === last2Battle.state &&
				last3Battle.state === lastBattle.state
			) {
				result.isTripleWin = lastBattle.state
				result.isTripleLose = !lastBattle.state
			}
			if (data.length > 4) {
				const last4Battle = data[data.length - 4]
				if (
					last4Battle.state === last3Battle.state &&
					last4Battle.state === last2Battle.state &&
					last4Battle.state === lastBattle.state
				) {
					result.isMoreThanThreeWin = lastBattle.state
					result.isMoreThanThreeLose = !lastBattle.state
				}
			}
		}
	}

	result.isFirstWin = lastBattle.state
	result.isFirstLose = !lastBattle.state

	return result
}

export const compareRank: <T extends Ws_RankPackage>(
	a: T,
	b: T
) => -1 | 0 | 1 = (a, b) => {
	console.log(a, b)

	if (a.rank === b.rank) {
		if (a.level === b.level) {
			if (a.star === b.star) return 0
			return a.star > b.star ? -1 : 1
		}
		return a.level > b.level ? -1 : 1
	}
	return a.rank > b.rank ? -1 : 1
}
