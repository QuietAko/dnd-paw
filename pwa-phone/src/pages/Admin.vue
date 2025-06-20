<template>
  <div class="admin">
    <h1>Админка управления звонками и сообщениями</h1>
    <div class="grid">

      <!-- Звонок -->
      <div class="card">
        <h2>Звонок</h2>
        <label>
          Игрок:
          <select v-model="callPlayer">
            <option disabled value="">Выберите игрока</option>
            <option value="jason">Джейсон</option>
            <option value="clay">Клей</option>
            <option value="richie">Риччи</option>
            <option value="lawrence">Лоуренс</option>
          </select>
        </label>
        <label>
          Номер звонящего:
          <input v-model="callerNumber" placeholder="Например, +7 900 123-45-67" />
        </label>
        <button @click="sendCall">Позвонить</button>
      </div>

      <!-- QTE RELAX -->
      <div class="card">
        <h2>QTE RELAX</h2>
        <label>
          Игрок:
          <select v-model="qteRelaxPlayer">
            <option disabled value="">Выберите игрока</option>
            <option value="jason">Джейсон</option>
            <option value="clay">Клей</option>
            <option value="richie">Риччи</option>
            <option value="lawrence">Лоуренс</option>
          </select>
        </label>
        <label>
          Сложность QTE:
          <input v-model="qteDifficultRelax" placeholder="Сложность" />
        </label>
        <button @click="sendQte('qteRelax')">Отправить QTE</button>
      </div>

      <!-- QTE ПУЛЬС -->
      <div class="card">
        <h2>QTE ПУЛЬС</h2>
        <label>
          Игрок:
          <select v-model="qtePulsePlayer">
            <option disabled value="">Выберите игрока</option>
            <option value="jason">Джейсон</option>
            <option value="clay">Клей</option>
            <option value="richie">Риччи</option>
            <option value="lawrence">Лоуренс</option>
          </select>
        </label>
        <label>
          Сложность QTE:
          <input v-model="qteDifficultPulse" placeholder="Сложность" />
        </label>
        <button @click="sendQte('qtePulse')">Отправить QTE</button>
      </div>
    </div>

    <!-- Лог -->
    <div v-if="log.length" class="log">
      <h2>Лог событий</h2>
      <ul>
        <li v-for="(item, i) in log" :key="i">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])
const ws = new WebSocket('ws://localhost:3000')

ws.onopen = () => {
  log.value.push('Подключено к серверу')
  ws.send(JSON.stringify({ type: 'register', role: 'admin' }))
}

ws.onmessage = (event) => {
  log.value.push(`Получено сообщение от сервера: ${event.data}`)
}

ws.onclose = () => {
  log.value.push('Соединение закрыто')
}

// Звонок
const callPlayer = ref('')
const callerNumber = ref('')

function sendCall() {
  if (!callPlayer.value || !callerNumber.value) {
    alert('Пожалуйста, выберите игрока и укажите номер звонящего')
    return
  }
  const msg = {
    type: 'incoming-call',
    playerId: callPlayer.value,
    callerName: callerNumber.value,
  }
  ws.send(JSON.stringify(msg))
  log.value.push(`Отправлен звонок игроку ${callPlayer.value} с номера ${callerNumber.value}`)
}

// QTE RELAX и QTE PULSE
const qteRelaxPlayer = ref('')
const qtePulsePlayer = ref('')
const qteDifficultRelax = ref('')
const qteDifficultPulse = ref('')

function sendQte(type: 'qteRelax' | 'qtePulse') {
  const playerId = type === 'qteRelax' ? qteRelaxPlayer.value : qtePulsePlayer.value
  const difficult = type === 'qteRelax' ? qteDifficultRelax.value : qteDifficultPulse.value

  if (!playerId || !difficult) {
    alert('Пожалуйста, заполните все поля для QTE')
    return
  }

  const msg = {
    type,
    playerId,
    difficult,
  }

  ws.send(JSON.stringify(msg))
  log.value.push(`Отправлено ${type} игроку ${playerId}, сложность: ${difficult}`)
}

// Воспроизведение звука
const soundPlayer = ref('')
const soundUrl = ref('')

function sendPlaySound() {
  if (!soundPlayer.value || !soundUrl.value) {
    alert('Пожалуйста, выберите игрока и укажите URL звука')
    return
  }

  const msg = {
    type: 'play-sound',
    playerId: soundPlayer.value,
    url: soundUrl.value,
  }

  ws.send(JSON.stringify(msg))
  log.value.push(`Отправлен запрос воспроизвести звук игроку ${soundPlayer.value}`)
}
</script>

<style scoped>
.admin {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: #f5f5f7;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #333;
}

label {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #555;
}

input, select {
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

button {
  margin-top: auto;
  padding: 10px;
  background-color: #007aff;
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #005bb5;
}

.log {
  max-height: 200px;
  overflow-y: auto;
  background: #eaeaea;
  padding: 15px;
  border-radius: 10px;
  font-size: 0.9rem;
}

.log h2 {
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 600;
}

.log ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.log li {
  margin-bottom: 5px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 3px;
  color: #333;
}
</style>
