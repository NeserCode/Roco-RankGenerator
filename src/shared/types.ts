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

export type RoundInfo = {
	roundLimit: number
	roundCount: number
	beforeStartCount: number
	beforeRoundCount: number
}

export interface Ws_BasicInfoPackage {
	id: string
	timestamp: number
}

export interface Ws_ClientSumPackage {
	timestamp: number
	client: number
}

export interface Ws_HostPackage extends Ws_BasicInfoPackage {
	type: "HOST_ENSURE"
	nickname: string
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
	type: "RANK" | "RANK_UPDATE" | "SPECIAL_RANK"
	nickname: string
	rank: number
	level: number
	star: number
}

export interface Ws_BattlePackage extends Ws_BasicInfoPackage {
	type: "BATTLE" | "BATTLE_INFO"
	winerId: string
	loserId: string
}

export interface Ws_BattleInfoPackage extends Ws_BattlePackage {
	type: "BATTLE_INFO"
	winer: Ws_RankPackage
	loser: Ws_RankPackage
}

export type Config = ServerInfo & Nickname & RankLevel & Id & RoundInfo

export type BoundType = ServerInfo | Nickname | RankLevel | RoundInfo

export interface BasicMessage {
	type:
		| "MESSAGE"
		| "ERROR"
		| "WARN"
		| "HOST"
		| "JOIN"
		| "RANK"
		| "BEFORE_START"
		| "BEFORE_ROUND"
		| "ROUNDDOWN"
	timestamp: number
	message: string
}

export interface BasicNotification {
	type: "NOTIFY"
	timestamp: number
	message: string[]
	title: string
}

export interface NotificationOption {
	type:
		| "NOTIFY_OPTIONS_PRIMARY"
		| "NOTIFY_OPTIONS_DANGER"
		| "NOTIFY_OPTIONS_OTHER"
	callback?: () => void
	text: string
	withClose?: boolean
}

export interface Notification extends BasicNotification {
	options: NotificationOption[]
}
