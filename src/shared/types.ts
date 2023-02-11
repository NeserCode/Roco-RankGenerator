export interface ServerInfo {
	server: string
	port: string
}

export type Id = {
	id: string
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

export interface Ws_BasicInfoPackage {
	id: string
	timestamp: number
}

export interface Ws_JoinPackage extends Ws_BasicInfoPackage {
	type: "JOIN" | "HOST"
	hostKey?: string
}

export interface Ws_NormalPackage extends Ws_BasicInfoPackage {
	type: ""
}

export interface Ws_TimePackage extends Ws_BasicInfoPackage {
	type: "BEFORE_START" | "BEFORE_ROUND" | "ROUNDDOWN"
	timeCount: number
	canPause?: boolean
}

export interface Ws_RankPackage extends Ws_BasicInfoPackage {
	nickname: string
	rank: 0 | 1 | 2 | 3 | 4 | 5
	level: 0 | 1 | 2 | 3 | 4
	star: 0 | 1 | 2 | 3 | 4
}

export type Config = ServerInfo & Nickname & RankLevel & Id

export type BoundType = ServerInfo | Nickname | RankLevel
