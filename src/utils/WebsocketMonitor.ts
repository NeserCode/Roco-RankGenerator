export class WebSocketProxy {
	url
	Socket: WebSocket | undefined

	constructor(url: URL, onMessage: (e: MessageEvent) => void) {
		this.url = url
		this.CreateSocket(onMessage)
	}

	private CreateSocket(onMessage: (e: MessageEvent) => void) {
		if (!this.url) return
		this.Socket = new WebSocket(this.url.toString())
		this.Socket.addEventListener("open", this.handleOpen)
		this.Socket.addEventListener("close", this.handleClose)
		this.Socket.addEventListener("error", this.handleError)
		this.Socket.addEventListener("message", onMessage)
	}

	private handleOpen(e: Event) {
		console.log("WebSocket connected", e)
	}

	private handleClose(e: Event) {
		console.log("WebSocket disconnected", e)
	}

	private handleError(e: Event) {
		console.log("WebSocket error", e)
	}

	public send(data: string) {
		if (this.Socket) {
			this.Socket.send(data)
		}
	}

	public close() {
		if (this.Socket) {
			this.Socket.close()
		}
	}

	public get readyState() {
		return this.Socket?.readyState
	}
}
