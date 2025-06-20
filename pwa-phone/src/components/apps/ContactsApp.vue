<template>
  <div class="contacts-app">
    <div class="contacts-list">
      <h2>Контакты</h2>
      <ul>
        <li
          v-for="contact in contacts"
          :key="contact.id"
          :class="{ active: selectedContact?.id === contact.id }"
          @click="selectContact(contact)"
        >
          <div class="contact-name">{{ contact.name }}</div>
          <div class="contact-phone">{{ contact.phone }}</div>
        </li>
      </ul>
    </div>

    <div class="contact-card" v-if="selectedContact">
      <img
        :src="selectedContact.photo"
        alt="Фото контакта"
        class="contact-photo"
      />
      <h3 class="contact-name">{{ selectedContact.name }}</h3>
      <p class="contact-phone">{{ selectedContact.phone }}</p>
    </div>

    <div class="contact-placeholder" v-else>
      <p>Выберите контакт из списка</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Players, type PlayerId } from '@/constans/players'
import unknownAvatar from '@/assets/icons/unknown.jpg'

interface Contact {
  id: number
  name: string
  phone: string
  photo: string
}

const CONTACTS_DB: Record<PlayerId, Contact[]> = {
  [Players.JASON]: [
    {
      id: 1,
      name: 'Мама – Сюзан Минтон',
      phone: '+1-315-555-2345',
      photo: unknownAvatar,
    },
    {
      id: 2,
      name: 'Боб',
      phone: '+1-607-555-7788',
      photo: unknownAvatar,
    },
  ],

  [Players.LAWRENECE]: [
    {
      id: 1,
      name: 'Лучший друг – Майк "DJ Mike"',
      phone: '+1-646-555-6789',
      photo: unknownAvatar,
    },
    {
      id: 2,
      name: 'Бабушка – Биа Бакстер',
      phone: '+1-347-555-3311',
      photo: unknownAvatar,
    },
  ],

  [Players.CLAY]: [
    {
      id: 1,
      name: 'Мама – доктор Хейл',
      phone: '+1-202-555-1111',
      photo: unknownAvatar,
    },
    {
      id: 2,
      name: 'Директор – мистер Келлер',
      phone: '+1-212-555-0099',
      photo: unknownAvatar,
    },
  ],

  [Players.RICHIE]: [
    {
      id: 1,
      name: 'Тренер по бейсболу – Рэндалл',
      phone: '+1-512-555-8888',
      photo: unknownAvatar,
    },
    {
      id: 2,
      name: 'Сестра – Меган',
      phone: '+1-970-555-2233',
      photo: unknownAvatar,
    },
  ],
};



const storedPlayer = localStorage.getItem('playerId')
const playerId: PlayerId = storedPlayer && Object.values(Players).includes(storedPlayer as PlayerId)
  ? (storedPlayer as PlayerId)
  : Players.RICHIE

const contacts = ref<Contact[]>(CONTACTS_DB[playerId])
const selectedContact = ref<Contact | null>(null)

watch(contacts, () => {
  selectedContact.value = null
})

function selectContact(contact: Contact) {
  selectedContact.value = contact
}
</script>

<style scoped>
/* Твой CSS */
.contacts-app {
  display: flex;
  height: 100vh;
  background: #121212;
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Список контактов слева */
.contacts-list {
  width: 240px;
  border-right: 1px solid #333;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  background: #1e1e1e;
}

.contacts-list h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
}

.contacts-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contacts-list li {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.25s ease;
  background: #222;
}

.contacts-list li:hover {
  background-color: #333;
}

.contacts-list li.active {
  background-color: #444;
}

.contact-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
}

.contact-phone {
  font-size: 0.9rem;
  color: #bbb;
  margin-top: 4px;
}

/* Карточка контакта справа */
.contact-card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
  background: #181818;
  text-align: center;
}

.contact-photo {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
  border: 3px solid #555;
  box-shadow: 0 0 12px rgba(255 255 255 / 0.15);
}

.contact-card .contact-name {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: #fff;
}

.contact-card .contact-phone {
  font-size: 1.2rem;
  color: #aaa;
}

/* Заглушка если контакт не выбран */
.contact-placeholder {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 1.2rem;
  font-style: italic;
}
</style>
