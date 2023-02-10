import { remote } from "electron"
import fs from "fs"

import type { Config } from "@/shared/types"

class configStorage {
	private Config: Config = this.getConfig()
	private ConfigPath: string = remote.app.getPath("userData") + "/config.json"

	/**
	 * getConfig
	 */
	public getConfig(): Config {
		fs.readFile(this.ConfigPath, (err, data: { toString: () => string }) => {
			if (err) throw err
			this.Config = JSON.parse(data.toString())
		})

		return this.Config
	}
}

export const configStorager = new configStorage()
