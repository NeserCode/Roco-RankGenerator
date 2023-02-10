import { remote } from "electron"
import fs from "fs"

import { defaultConfigOptions } from "@/shared/defaultConfigOptions"

import type { Config } from "@/shared/types"

const { app } = remote

class configStorage {
	private Config: Config = this.getConfig()
	private ConfigPath: string = this.initialPath()

	public getConfig(): Config {
		this.initialPath()

		fs.readFile(this.ConfigPath, (err, data: { toString: () => string }) => {
			if (err) {
				this.initialConfig()
				throw err
			}
			this.Config = JSON.parse(data.toString())
		})

		return this.Config
	}

	private initialConfig(): void {
		fs.writeFile(
			this.ConfigPath,
			JSON.stringify(defaultConfigOptions),
			(err) => {
				if (err) throw err
			}
		)
	}

	public setConfig(config: Config): void {
		this.Config = config
		fs.writeFile(this.ConfigPath, JSON.stringify(config), (err) => {
			if (err) throw err
		})
	}

	private initialPath(): string {
		this.ConfigPath = app.getPath("userData") + "/config.json"
		return this.ConfigPath
	}
}

export const configStorager = new configStorage()