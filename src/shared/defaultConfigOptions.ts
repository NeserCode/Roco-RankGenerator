import { Config } from "./types"

export const defaultConfigOptions: Config = {
	// The default value for the `config` option
	id: ``,
	server: "127.0.0.1",
	port: "8888",
	nickname: "Roco",
	rank: 0,
	level: 0,
	star: 0,
	roundLimit: 10,
	roundCount: 10,
	beforeStartCount: 10,
	beforeRoundCount: 10,
}
