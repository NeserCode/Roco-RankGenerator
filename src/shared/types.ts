export interface ServerInfo {
	server: string
	port: string
}

export type Nickname = {
	nickname: string
}

export type RankLevel = {
	rank: number
	level: number
	star: number
}

export type RankLimit = {
	Rank: number
	Level: number
	Star: number
}

export type Config = ServerInfo & Nickname & RankLevel

export type BoundType = ServerInfo | Nickname
