import { WebSocketServer } from "ws"
import { createHmac } from "crypto"

import { RankStack } from "./utils/RankStack.js"

const port = 2333
const Socket = new WebSocketServer({ port, clientTracking: true })
const HOST_KEY = createHmac("sha256", "NeserCode.Roco").digest("hex")

let PlayerIdList = new Set([])
let PlayerList = []
let HOST_ID = null
let ROUND_SUM = 0
let ROUND = 0
let RANK_STACK = new RankStack(5)

Socket.on("close", (e) => {
	console.log(`[WebSocket Closed] ${e}`)
})

Socket.on("error", (e) => {
	console.log(`[WebSocket Error] ${e}`)
})

Socket.on("connection", (socket) => {
	socket.on("message", (message) => {
		console.log(`[WebSocket Reboardcast Start]`)

		let JsonMessage = JSON.parse(message)
		if (JsonMessage.hostKey === HOST_KEY && HOST_ID === null) {
			HOST_ID = JsonMessage.id
			console.log(`[WebSocket Host] ${HOST_ID}`)
		} else if (JsonMessage.type === "BEFORE_START") {

			ROUND_SUM = JsonMessage.roundLimit ?? 10
			ROUND = 0
			RANK_STACK.clear()

			setTimeout(() => {
				socket.send(
					JSON.stringify({
						type: "START_ROUND",
						timestamp: Date.now(),
					})
				)
			}, JsonMessage.timeCount * 1000)

		} else if (JsonMessage.type === "BEFORE_ROUND" && ROUND_SUM >= 0) {
			console.log(`[WebSocket Round Start]`)

			setTimeout(() => {
				ROUND++
				socket.send(
					JSON.stringify({
						type: "START_ROUND",
						round: JsonMessage.round,
						timestamp: Date.now(),
						isAddon: ROUND_SUM === 0,
					})
				)
			}, JsonMessage.timeCount * 1000)

			if (ROUND_SUM - 1 >= 0) ROUND_SUM--
			console.log(`[WebSocket Round End] Leave ${ROUND_SUM} Round ${ROUND}`)
		}

		if (JsonMessage.type === "JOIN" || JsonMessage.type === "HOST") {
			if (JsonMessage.id) PlayerIdList.add(JsonMessage.id)
			console.log(`[WebSocket Player] ${JsonMessage.id}`)
		} else if (JsonMessage.type === "RANK") {
			// not repeat player which identified by id who in PlayerIdList
			if (
				PlayerIdList.has(JsonMessage.id) &&
				!PlayerList.find((p) => p.id === JsonMessage.id)
			) {
				PlayerList.push(JsonMessage)
			}

			socket.send(
				JSON.stringify({
					type: "PLAYERS_INFO",
					timestamp: Date.now(),
					playerIdList: [...PlayerIdList],
					playerList: PlayerList,
				})
			)
		} else if (JsonMessage.type === "BATTLE_INFO_QUERY") {
			socket.send(
				JSON.stringify({
					type: "BATTLE_INFO_REPLY",
					timestamp: Date.now(),
					data: RANK_STACK.value,
				})
			)
		} else if (JsonMessage.type === "BATTLE_INFO") {
			let specialOtherId = "other"
			let specialNullId = "null"

			if (
				(PlayerIdList.has(JsonMessage.winerId) &&
					PlayerIdList.has(JsonMessage.loserId)) ||
				(JsonMessage.winerId === specialOtherId ||
					JsonMessage.loserId === specialOtherId) ||
				(JsonMessage.winerId === specialNullId ||
					JsonMessage.loserId === specialNullId)
			) {
				let winer = PlayerList.find((p) => p.id === JsonMessage.winerId)
				let loser = PlayerList.find((p) => p.id === JsonMessage.loserId)

				RANK_STACK.pushRank({
					type: "BATTLE_INFO",
					id: JsonMessage.id,
					winerId: JsonMessage.winerId,
					loserId: JsonMessage.loserId,
					winer,
					loser: loser ?? {
						id: JsonMessage.loserId,
						nickname: "-",
						rank: 0,
						level: 0,
						star: 0,
						type: "SPECIAL_RANK",
						timestamp: -1,
					},
					timestamp: Date.now(),
				})
			}
		}

		let index = 0
		Socket.clients.forEach((c) => {
			if (JsonMessage.type !== "BEFORE_ROUND") c.send(String(message))
			else {
				c.send(
					JSON.stringify({
						...JsonMessage,
						round: ROUND,
						isAddon: ROUND_SUM === 0,
					})
				)
				console.log(`[Round $${ROUND}]`)
			}
			console.log(`[Reboardcast User $${++index}]`)
		})

		console.log(`[WebSocket Reboardcast End]`)

		Socket.clients.forEach((c) => {
			c.send(
				JSON.stringify({
					timestamp: Date.now(),
					client: index,
				})
			)
		})

		console.log(`[WebSocket Sent Clients Number]`)
	})

	setInterval(() => {
		socket.send("Heartbeat")
		if (HOST_ID)
			socket.send(
				JSON.stringify({
					type: "HOST_ID",
					timestamp: Date.now(),
					hostId: HOST_ID,
				})
			)
		// console.log(`[WebSocket Sent] Heartbeat`);
	}, 3000)
})

Socket.on("listening", () => {
	console.log(`[WebSocket Listening]`)
})

console.log(
	`[WebSocket Mounted] Port ${port}\n[WebSocket Host Key] ${HOST_KEY}`
)
// 484ee001def98e1fb6ef8062e4d32bfc33084242392769b9c46b011439534598
