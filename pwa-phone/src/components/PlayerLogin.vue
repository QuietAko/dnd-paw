<template>
    <div class="login-screen">
      <input
        v-model="name"
        @keyup.enter="submit"
        placeholder="Введите имя игрока"
        class="login-input"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const name = ref('')
  const router = useRouter()
  
  function submit() {
    const trimmed = name.value.trim()
    if (trimmed) {
      localStorage.setItem('playerId', trimmed)
      router.push('/')
    }
  }
  </script>
  
  <style scoped>
  .login-screen {
    height: 100vh;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-input {
    font-size: 20px;
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    outline: none;
    background: #222;
    color: white;
    width: 80%;
    max-width: 300px;
    text-align: center;
  }
  </style>
  