import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Хранилища подключений
const admins = new Set()
const players = new Map() // playerId => ws

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)

      if (data.type === 'register') {
        if (data.role === 'admin') {
          admins.add(ws)
          console.log('Admin connected')
        } else if (data.role === 'player' && data.playerId) {
          players.set(data.playerId, ws)
          console.log(`Player ${data.playerId} connected`)
        }
      }

      if (data.type === 'incoming-call' && data.playerId && data.callerName) {
        const playerWs = players.get(data.playerId)
        if (playerWs && playerWs.readyState === playerWs.OPEN) {
          playerWs.send(JSON.stringify({
            type: 'incomingCall',
            callerName: data.callerName
          }))
          console.log(`Call sent to player ${data.playerId} from ${data.callerName}`)
        }
      }

      if (data.type === 'qteRelax' || data.type === 'qtePulse' && data.playerId && data.difficult) {
        const playerWs = players.get(data.playerId)
        if (playerWs && playerWs.readyState === playerWs.OPEN) {
          playerWs.send(JSON.stringify({
            type: data.type,
            difficult: data.difficult
          }))
          console.log(`Qte sent to player ${data.playerId} from admin`)
        }
      }


    } catch (e) {
      console.error('Invalid message', e)
    }
  })

  ws.on('close', () => {
    admins.delete(ws)
    for (const [playerId, socket] of players) {
      if (socket === ws) {
        players.delete(playerId)
        console.log(`Player ${playerId} disconnected`)
        break
      }
    }
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
