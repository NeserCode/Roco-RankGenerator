import { WebSocketServer } from 'ws'

const port = 2333
const Socket = new WebSocketServer({ port, clientTracking: true })

Socket.on('close', (e) => {
	console.log(`[WebSocket Closed] ${e}`);
})

Socket.on('error', (e) => {
	console.log(`[WebSocket Error] ${e}`);
})

Socket.on('connection', (socket) => {
	socket.on('message', (message) => {
		console.log(`[WebSocket Reboardcast Start]`);
		let index = 0
		Socket.clients.forEach((c) => {
			c.send(String(message))
			console.log(`[Reboardcast User $${++index}]`);
		});
		console.log(`[WebSocket Reboardcast End] Total Client: ${index}`);
		Socket.clients.forEach((c) => {
			c.send(JSON.stringify({
				client: index
			}))
		});
		console.log(`[WebSocket Sent Clients Number]`);
	})

	setInterval(() => {
		socket.send('Heartbeat')
		// console.log(`[WebSocket Sent] Heartbeat`);
	}, 3000)
})

Socket.on('listening', () => {
	console.log(`[WebSocket Listening]`);
})


console.log(`[WebSocket Mounted] Port ${port}`);