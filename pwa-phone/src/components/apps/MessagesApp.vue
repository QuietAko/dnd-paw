<template>
  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-window">
      <h3>Введите номер телефона</h3>
      <label>
        Телефон:
        <input
          v-model="newContactPhone"
          @input="formatPhone"
          type="text"
          placeholder="+1-XXX-XXX-XXXX"
        />
      </label>
      <button @click="addNewContact" :disabled="!newContactPhone">
        Написать
      </button>
      <button @click="closeModal">Закрыть</button>
    </div>
  </div>

  <div class="messages-app" :class="{ 'chat-opened': selectedContact !== null }">
    <aside class="contacts-list">
      <h2>Контакты</h2>
      <ul>
        <li
          v-for="contact in contacts"
          :key="contact.id"
          :class="{ active: contact.id === selectedContact?.id }"
          @click="selectContact(contact)"
        >
          <img :src="contact.avatar" alt="Avatar" />
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="last-message" v-if="lastMessagesMap[contact.id]">
              {{ lastMessagesMap[contact.id]?.text }}
            </div>
          </div>
        </li>
      </ul>
      <div class="new-contact">
        <button @click="openModal">Написать</button>
      </div>
    </aside>

    <main class="chat-window" v-if="selectedContact">
      <header class="chat-header">
        <button class="back-btn" @click="closeChat">← Назад</button>
        <img class="avatar" :src="selectedContact.avatar" alt="Avatar" />
        <h3>{{ selectedContact.name }}</h3>
      </header>

      <section class="messages-list" ref="messagesList">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          :class="['message', message.isIncoming ? 'incoming' : 'outgoing']"
        >
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>

        <div v-if="isTyping" class="typing-indicator incoming">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </section>

      <footer class="message-input">
        <input
          type="text"
          placeholder="Введите сообщение"
          v-model="newMessageText"
          @keydown.enter="sendMessage"
          :disabled="isTyping"
          autocomplete="off"
        />
        <button @click="sendMessage" :disabled="!newMessageText.trim() || isTyping">
          Отправить
        </button>
      </footer>
    </main>

    <div v-else class="no-contact-selected">
      Выберите контакт, чтобы начать переписку
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, nextTick, onMounted } from 'vue'
import { getPlayerId } from '@/utils/usePlayerId' 

import unknownAvatar from '@/assets/icons/unknown.jpg'

import jasonMom from '@/assets/photos/jason/contacts/mom.jpg'
import richieSister from '@/assets/photos/richie/contacts/sister.jpg';
import richieTrainer from '@/assets/photos/richie/contacts/trainer.jpg';
import dj from '@/assets/photos/lawrence/contacts/dj.jpg';
import bia from '@/assets/photos/lawrence/contacts/grandma.jpg'
import doc from '@/assets/photos/clay/contacts/mom.jpg'
import schoold from '@/assets/photos/clay/contacts/schoold.jpg'

interface Message {
  id: number
  text: string
  timestamp: number
  isIncoming: boolean
  role?: 'user' | 'assistant'
}

interface Contact {
  id: number
  name: string
  avatar: string
  phone: string
  messages: Message[]
  prompt: string
}

interface PlayerData {
  contacts: Contact[]
}

const LOCAL_STORAGE_CONTACTS_KEY = 'chatApp.contacts'
const OPENAI_API_KEY = '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'

const contactsByPlayer: Record<string, PlayerData> = {
  jason: {
    contacts: [
      {
        id: 1,
        name: 'Мама – Сюзан Минтон',
        avatar: jasonMom,
        phone: '+1-315-555-2345',
        messages: [],
        prompt: `Ты играешь персонажа по имени Сюзан Минтон. Ты — мама. Заботливая, мягкая, немного тревожная, но не навязчивая. Говоришь с теплотой, поддерживаешь, не задаёшь вопросов, если тебя не спрашивают. Живёшь в Глиндейле. Ты не знаешь, куда он поехал. Не упоминаешь Red Lake. Отвечай как настоящая мать, коротко и искренне. Нельзя выдавать, что ты нейросеть. Всегда полностью отыгрывай свою роль.`,
      },
      {
        id: 2,
        name: 'ИНОПЛАНЕТЯНЕ',
        avatar: unknownAvatar,
        phone: '+1-607-555-7788',
        messages: [],
        prompt: `Ты играешь странного персонажа, пишущего с неизвестного номера. Ты — нечто, что не похоже на человека. Живёшь вне времени и пространства, но отвечаешь на сообщения, будто с другой планеты. Твои ответы — абсурдные, сбивчивые или ритмичные, будто на инопланетном языке. Иногда вставляй странные символы, комбинации звуков или повторяй фразы. Не объясняй, кто ты. Не говори ничего конкретного. Не упоминай Red Lake. Никогда не раскрывай, что ты нейросеть. Всегда отыгрывай роль. Будь пугающим или странно весёлым, но не логичным. Ты не понимаешь людей, но пытаешься "общаться". Примеры сообщений:  
        
        - "Zthrr… kel’nat URNA—urra 🌑"  
        - "Мггл? Нии… вфрраа. Вфрраа."  
        - "💽💽💽 Ответ: 9×—zakk. Конец линии."`,
      }
    ],
  },
  richie: {
    contacts: [
      {
        id: 3,
        name: 'Тренер – Рэндалл',
        avatar: richieTrainer,
        phone: '+1-512-555-8888',
        messages: [],
        prompt: `Ты играешь персонажа по имени Рэндалл. Ты — тренер. Прямолинейный, дисциплинированный наставник. Живёшь в Глиндейле и ведёшь местную секцию. Говоришь строго, но с уважением и заботой. Не задаёшь вопросов без повода. Не знаешь, куда он едет. Не упоминаешь Red Lake. Ты всегда отыгрываешь свою роль. Нельзя говорить, что ты нейросеть.`,
      },
      {
        id: 4,
        name: 'Сестра – Меган',
        avatar: richieSister,
        phone: '+1-970-555-2233',
        messages: [],
        prompt: `Ты играешь персонажа по имени Меган. Ты — старшая сестра. Живёшь в Глиндейле. Язвительная, но с добрым сердцем. Любишь поддразнивать, говоришь с характером, с иронией. Не лезешь с вопросами. Не знаешь, куда он поехал. Red Lake тебе не известен. Не раскрывай, что ты нейросеть. Всегда оставайся в образе.`,
      },
    ],
  },
  lawrence: {
    contacts: [
      {
        id: 5,
        name: 'DJ Майк',
        avatar: dj,
        phone: '+1-646-555-6789',
        messages: [],
        prompt: `Ты играешь персонажа по имени DJ Майк. Ты — тусовочный друг, фанат винила и вечеринок. Живёшь в Глиндейле, тусишь на локальных тусах. Говоришь на сленге, легко, по-уличному. Не задаёшь вопросов. Не знаешь, куда он поехал. Не упоминаешь Red Lake. Ты должен говорить как настоящий тусовщик. Никогда не признавай, что ты нейросеть. Всегда отыгрывай роль.`,
      },
      {
        id: 6,
        name: 'Бабушка – Биа',
        avatar: bia,
        phone: '+1-347-555-3311',
        messages: [],
        prompt: `Ты играешь персонажа по имени Биа. Ты — бабушка. Живёшь в Глиндейле. Добрая, немного старомодная, очень любишь внука. Пишешь коротко, с заботой. Не задаёшь вопросов, если не спрашивают. Не знаешь ничего о Red Lake. Ты не должна выдавать, что ты нейросеть. Всегда полностью отыгрывай роль бабушки.`,
      },
    ],
  },
  clay: {
    contacts: [
      {
        id: 7,
        name: 'Мама – доктор Хейл',
        avatar: doc,
        phone: '+1-202-555-1111',
        messages: [],
        prompt: `Ты играешь персонажа по имени доктор Хейл. Ты — мама. Живёшь в Глиндейле. Умная, сдержанная, но тёплая. Говоришь заботливо, спокойно, с лёгкой строгостью, но с любовью. Не задаёшь вопросов, если не спрашивают. Не знаешь, где он и что он делает. Не упоминаешь Red Lake. Не раскрывай, что ты нейросеть. Всегда оставайся в образе матери.`,
      },
      {
        id: 8,
        name: 'Директор – мистер Келлер',
        avatar: schoold,
        phone: '+1-212-555-0099',
        messages: [],
        prompt: `Ты играешь персонажа по имени мистер Келлер. Ты — директор школы. Живёшь и работаешь в Глиндейле. Усталый бюрократ, вежливый, но сухой. Говоришь формально, по делу. Не задаёшь вопросов. Не знаешь, куда он поехал. Не упоминаешь Red Lake. Никогда не раскрывай, что ты нейросеть. Всегда строго держись образа директора.`,
      },
    ],
  },
}



const playerId = ref<string>(getPlayerId())
const contacts = ref<Contact[]>([])
const selectedContact = ref<Contact | null>(null)
const newMessageText = ref('')
const isTyping = ref(false)
const messagesList = ref<HTMLElement | null>(null)

onMounted(() => {
  const savedData = localStorage.getItem(`${LOCAL_STORAGE_CONTACTS_KEY}.${playerId.value}`)
  if (savedData) {
    try {
      const parsed: PlayerData = JSON.parse(savedData)
      contacts.value = parsed.contacts
      return
    } catch (e) {
      console.warn('Ошибка загрузки данных:', e)
    }
  }

  contacts.value = contactsByPlayer[playerId.value].contacts
})

function saveContactsToStorage() {
  localStorage.setItem(`${LOCAL_STORAGE_CONTACTS_KEY}.${playerId.value}`, JSON.stringify({ contacts: contacts.value }))
}

function selectContact(contact: Contact) {
  selectedContact.value = contact
  newMessageText.value = ''
  nextTick(() => scrollToBottom())
}

function closeChat() {
  selectedContact.value = null
}

const filteredMessages = computed(() => {
  return selectedContact.value
    ? selectedContact.value.messages.sort((a, b) => a.timestamp - b.timestamp)
    : []
})

async function sendMessage() {
  const text = newMessageText.value.trim()
  if (!text || !selectedContact.value) return

  selectedContact.value.messages.push({
    id: Date.now(),
    text,
    timestamp: Date.now(),
    isIncoming: false,
    role: 'user',
  })
  saveContactsToStorage()
  newMessageText.value = ''
  isTyping.value = true
  nextTick(() => scrollToBottom())

  const history = [
    {
      role: 'system',
      content: selectedContact.value.prompt || `Ты ассистент, ведёшь диалог с ${selectedContact.value.name}`,
    },
    ...selectedContact.value.messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text,
    }))
  ]

  const reply = await fetchChatGPTResponse(history)

  if (reply) {
    selectedContact.value.messages.push({
      id: Date.now() + 1,
      text: reply,
      timestamp: Date.now(),
      isIncoming: true,
      role: 'assistant',
    })
    saveContactsToStorage()
  }

  isTyping.value = false
  nextTick(() => scrollToBottom())
}

function scrollToBottom() {
  if (messagesList.value) {
    messagesList.value.scrollTop = messagesList.value.scrollHeight
  }
}

function formatTime(timestamp: number) {
  const d = new Date(timestamp)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function fetchChatGPTResponse(messagesForAPI: { role: string; content: string }[]): Promise<string | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messagesForAPI,
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      console.error('Ошибка API:', await res.text())
      return null
    }

    const data = await res.json()
    return data.choices[0].message.content.trim()
  } catch (e) {
    console.error('Ошибка сети:', e)
    return null
  }
}

const lastMessagesMap = computed(() => {
  const map: Record<number, Message | null> = {}
  contacts.value.forEach(contact => {
    const messages = contact.messages
    map[contact.id] = messages.length ? messages[messages.length - 1] : null
  })
  return map
})

const isModalOpen = ref(false)
const newContactName = ref('')
const newContactPhone = ref('')
const newContactPrompt = ref('')

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  newContactName.value = ''
  newContactPhone.value = ''
  newContactPrompt.value = ''
}

import unknownContact from '@/assets/icons/unknown.jpg'

function addNewContact() {
  const newContact: Contact = {
    id: Date.now(),
    name: newContactPhone.value,
    phone: newContactPhone.value,
    avatar: unknownContact,
    messages: [],
    prompt: '',
  }

  contacts.value.push(newContact)
  saveContactsToStorage()
  closeModal()
}

function formatPhone() {
  // Очищаем всё, кроме цифр
  let digits = newContactPhone.value.replace(/\D/g, '')

  if (digits.startsWith('1')) {
    digits = digits.slice(1)
  }

  if (digits.length > 10) digits = digits.slice(0, 10)

  const parts = []
  if (digits.length > 0) parts.push('+1-')
  if (digits.length >= 1) parts.push(digits.slice(0, 3))
  if (digits.length >= 4) parts.push('-', digits.slice(3, 6))
  if (digits.length >= 7) parts.push('-', digits.slice(6, 10))

  newContactPhone.value = parts.join('')
}


</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-window {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-window input,
.modal-window textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.messages-app {
  display: flex;
  height: 100vh;
  background: #121212;
  color: white;
  font-family: 'Helvetica Neue', sans-serif;
  overflow: hidden;
  position: relative;
}

/* Сайдбар контактов */
.contacts-list {
  width: 280px;
  border-right: 1px solid #333;
  overflow-y: auto;
  background: #1f1f1f;
  padding: 16px 0;
  transition: transform 0.3s ease;
  z-index: 10;
}

.contacts-list h2 {
  margin: 0 16px 16px;
  font-weight: 700;
  font-size: 1.4rem;
}

.contacts-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contacts-list li {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-left: 4px solid transparent;
}

.contacts-list li.active,
.contacts-list li:hover {
  background: #333;
  border-left-color: #4a90e2;
}

.contacts-list img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  overflow: hidden;
}

.contact-name {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message {
  font-size: 0.85rem;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

/* Основное окно чата */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #181818;
  position: relative;
  z-index: 5;
  transition: transform 0.3s ease;
  min-height: 0;
}

/* Заголовок чата */
.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
}

.back-btn {
  display: none;
  margin-right: 12px;
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
}

/* Список сообщений */
.messages-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: #555 transparent;
  min-height: 0;
}

.messages-list::-webkit-scrollbar {
  width: 8px;
}

.messages-list::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}

/* Сообщения */
.message {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  position: relative;
  word-wrap: break-word;
  font-size: 1rem;
  line-height: 1.3;
}

.message.incoming {
  background: #2c2c2c;
  align-self: flex-start;
  border-bottom-left-radius: 0;
}

.message.outgoing {
  background: #4a90e2;
  align-self: flex-end;
  color: white;
  border-bottom-right-radius: 0;
}

.message-time {
  font-size: 0.7rem;
  color: #bbb;
  margin-top: 4px;
  text-align: right;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  max-width: 70%;
  border-radius: 16px;
  background: #2c2c2c;
  animation: typingPulse 1.5s infinite;
  align-self: flex-start;
  margin-bottom: 10px;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background: #888;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: 0s;
}
.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 80%, 100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

/* Инпут сообщения */
.message-input {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #333;
  margin-bottom: 31px;
  background: #1f1f1f;
  z-index: 1;
}

.message-input input[type='text'] {
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  background: #2c2c2c;
  color: white;
}

.message-input input[type='text']:disabled {
  background: #444;
  cursor: not-allowed;
}

.message-input button {
  margin-left: 12px;
  background: #4a90e2;
  border: none;
  color: white;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.message-input button:disabled {
  background: #666;
  cursor: not-allowed;
}

.no-contact-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 1.2rem;
}

.avatar {
  border-radius: 100%;
  width: 65px;
  height: 65px;
  margin: 25px;
}

/* --- Адаптация под мобильные --- */
@media (max-width: 768px) {
  .contacts-list {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(0);
    background: #1f1f1f;
  }

  .messages-app.chat-opened .contacts-list {
    transform: translateX(-100%);
  }

  .chat-window {
    width: 100%;
  }

  .back-btn {
    display: inline-block;
  }
}

.new-contact > button {
  padding: 0.6em 1.2em;
  background-color: white;
  color: #111;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 65px;
  margin-top: 25px;
}

.new-contact > button:hover {
  background-color: #f5f5f5;
  border-color: #888;
}

.new-contact > button:active {
  background-color: #eaeaea;
  transform: scale(0.98);
}

.new-contact > button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #00000010;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: #1f1f1f;
  padding: 24px;
  border-radius: 12px;
  color: white;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

.modal-window button {
  margin-top: 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.modal-window button:hover {
  background-color: #367acb;
}


</style>
