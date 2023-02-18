export class WebSocketProxy {
	state
	url
	Socket: WebSocket | undefined

	constructor(url: URL, onMessage: (e: MessageEvent) => void) {
		this.url = url
		this.state = 0
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
		this.state = 1
	}

	private handleClose(e: Event) {
		console.log("WebSocket disconnected", e)
		this.state = 0
	}

	private handleError(e: Event) {
		console.log("WebSocket error", e)
		this.state = -1
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
