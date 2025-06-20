<template>
    <transition name="fade">
      <div v-if="visible" class="incoming-call-fullscreen">
        <div class="background-overlay"></div>
        <div class="call-content">
          <img class="avatar" :src="avatar" alt="Caller Avatar" />
          <h1 class="caller-name">{{ callerName }}</h1>
          <p class="call-text">Входящий звонок</p>
  
          <div class="actions">
            <button class="decline" @click="declineCall">Отклонить</button>
            <button class="accept" @click="acceptCall">Принять</button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  interface Props {
    callerName: string
    avatar?: string
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['accept', 'decline'])
  
  const visible = ref(false)
  
  watch(
    () => props.callerName,
    (newVal) => {
      visible.value = !!newVal
    },
    { immediate: true }
  )
  
  const avatar = props.avatar || 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'
  
  function acceptCall() {
    emit('accept')
    visible.value = false
  }
  
  function declineCall() {
    emit('decline')
    visible.value = false
  }
  </script>
  
  <style scoped>
  .incoming-call-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    user-select: none;
  }
  
  .background-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.75), #000);
    backdrop-filter: blur(15px);
    z-index: 1;
  }
  
  .call-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    padding: 40px 20px;
    max-width: 360px;
    width: 100%;
    border-radius: 24px;
  }
  
  .avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 4px solid white;
    margin: 0 auto 24px auto;
    display: block;
  }
  
  .caller-name {
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    line-height: 1.1;
  }
  
  .call-text {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 8px 0 40px 0;
    opacity: 0.85;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  
  button {
    flex: 1;
    padding: 18px 0;
    font-size: 1.25rem;
    border-radius: 50px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    user-select: none;
    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
    transition: background-color 0.25s ease;
  }
  
  button.accept {
    background-color: #34c759;
    color: white;
    box-shadow: 0 8px 20px rgba(52, 199, 89, 0.6);
  }
  
  button.accept:hover {
    background-color: #28a745;
  }
  
  button.decline {
    background-color: #ff3b30;
    color: white;
    box-shadow: 0 8px 20px rgba(255, 59, 48, 0.6);
  }
  
  button.decline:hover {
    background-color: #e02b20;
  }
  
  /* Анимация появления/скрытия */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.35s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  