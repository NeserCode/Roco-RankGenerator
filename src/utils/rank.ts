// import type { Config } from "@/shared/types"
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
