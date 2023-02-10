export interface ServerInfo {
	server: string
	port: string
}

export type Nickname = {
	nickname: string
}

export type Config = ServerInfo & Nickname

export type BoundType = ServerInfo | Nickname
