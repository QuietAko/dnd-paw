<template>
  <div class="home">
    <StatusBar />
    
    <div v-if="!activeComponent" class="app-grid">
      <AppIcon title="Карта" icon="Maps.png" @click="openApp(MapApp)" />
      <AppIcon title="Фото" icon="Photos.png"  @click="openApp(PhotosApp)" />
      <AppIcon title="Заметки" icon="Notes.png" @click="openApp(NotesApp)" />
      <AppIcon title="Контакты" icon="Contacts.png" @click="openApp(ContactsApp)"/>
      <AppIcon title="Часы" icon="Clock.png" @click="openApp(ClockApp)"/>
    </div>

    <div v-else class="app-container">
      <component
        :is="activeComponent"
        v-if="activeComponent"
        class="app-container"
      />

      <button class="close-btn" v-if="activeComponent" @click="closeApp">Х</button>
    </div>

    <Dock v-if="!activeComponent" :openApp="openApp" />

    <IncomingCall
      v-if="incomingCall"
      :callerName="incomingCall.callerName"
      @accept="acceptCall"
      @decline="declineCall"
    />

    <QteRelax
      v-if="qteRelax"
      :difficult="2"
      @success="onSuccessQte" 
      @fail="onFailQte"
    />

    <QtePulse 
      v-if="qtePulse"
      :targets="[0.8, 2.5, 4.0]" 
      :duration="3000"
      :tolerance="6"             
      :blockSpeed="30"
      @success="onSuccessQte" 
      @fail="onFailQte"
      />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, type Component } from 'vue'
import { getPlayerId } from '@/utils/usePlayerId'

import StatusBar from '@/components/StatusBar.vue'
import AppIcon from '@/components/AppIcon.vue'
import Dock from '@/components/Dock.vue'

import MapApp from '@/components/apps/MapApp.vue'
import PhotosApp from '@/components/apps/PhotosApp.vue'
import NotesApp from '@/components/apps/NotesApp.vue'
import ContactsApp from '@/components/apps/ContactsApp.vue'
import ClockApp from '@/components/apps/ClockApp.vue'

import IncomingCall from '@/components/IncomingCall.vue'
import QtePulse from '@/components/QtePulse.vue'
import QteRelax from '@/components/QteRelax.vue'

const activeComponent = ref<Component | null>(null)

function openApp(component: Component) {
  activeComponent.value = component
}

function closeApp() {
  activeComponent.value = null
}

function setVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

onMounted(() => {
  setVh()
  window.addEventListener('resize', setVh)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVh)
})

const playerId = getPlayerId()
const ws = new WebSocket('ws://wss.wazowskii.ru')

const incomingCall = ref<{ callerName: string } | null>(null)
const qteRelax = ref<{ difficult: number } | null>(null)
const qtePulse = ref<{ difficult: number } | null>(null)        

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'register', role: 'player', playerId }))
}

ws.onmessage = (event) => {
  console.log(event.data)
  const data = JSON.parse(event.data)
  if (data.type === 'incomingCall') {
    incomingCall.value = { callerName: data.callerName }
  }

  if(data.type === 'qtePulse') {
    qtePulse.value = { difficult: data.difficult }
  }

  if(data.type === 'qteRelax') {
    qteRelax.value = { difficult: data.difficult }
  }

}

// Логика принятия звонка
function acceptCall() {
  // Можно отправить серверу сигнал, что звонок принят
  ws.send(JSON.stringify({ type: 'call-accepted', playerId }))
  incomingCall.value = null
  // Здесь можно открыть нужный компонент или выполнить другое действие
}

// Логика отклонения звонка
function declineCall() {
  // Можно отправить серверу сигнал, что звонок отклонен
  ws.send(JSON.stringify({ type: 'call-declined', playerId }))
  incomingCall.value = null
}

function onSuccessQte() {
  console.log('Прошел QTE')
  resetQte()
}

function onFailQte() {
  resetQte()
}

function resetQte() {
  qteRelax.value = null
  qtePulse.value = null
}

</script>

<style>
.home {
  height: 100%;
}

.app-container {
  flex-grow: 1;
  position: relative;
  overflow-x: none;
  overflow-y: auto;
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 70px;
  right: 20px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  padding: 8px 16px;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  backdrop-filter: blur(2px);
  z-index: 999;
}
</style>
