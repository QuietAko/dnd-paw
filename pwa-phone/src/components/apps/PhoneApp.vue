<template>
    <div class="phone-app">
      <div class="display">
        <input type="text" v-model="phoneNumber" readonly />
      </div>
  
      <div class="keypad">
        <button
          v-for="key in keys"
          :key="key"
          @click="appendDigit(key)"
          class="key"
        >
          {{ key }}
        </button>
        <button class="key del" @click="deleteDigit">⌫</button>
      </div>
  
      <div class="footer">
        <button class="call-button" @click="makeCall">Позвонить</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const phoneNumber = ref('')
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']
  
  function appendDigit(digit: string) {
    phoneNumber.value += digit
  }
  
  function deleteDigit() {
    phoneNumber.value = phoneNumber.value.slice(0, -1)
  }
  
  function makeCall() {
    if (phoneNumber.value) {
      alert(`Звонок на ${phoneNumber.value}…`)
    } else {
      alert('Введите номер телефона')
    }
  }
  </script>
  
  <style scoped>
.phone-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 16px;
  background: black;
  color: white;
  font-family: 'Helvetica Neue', sans-serif;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  overflow: hidden;
}

.display {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.display input {
  width: 100%;
  font-size: 36px;
  background: transparent;
  border: none;
  color: white;
  text-align: center;
  font-weight: bold;
  letter-spacing: 3px;
  outline: none;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex-grow: 1;
  margin-bottom: 20px;
}

.key {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 28px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.1s ease, background 0.3s ease;
  backdrop-filter: blur(4px);
}

.key:hover {
  background: rgba(255, 255, 255, 0.2);
}

.key:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.3);
}

.key.del {
  font-size: 22px;
  color: #ff6666;
}

.footer {
  padding-bottom: 30px;
}

.call-button {
  width: 100%;
  background: linear-gradient(135deg, #00c853, #00e676);
  color: white;
  font-size: 22px;
  font-weight: bold;
  padding: 18px;
  border: none;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
}

.call-button:hover {
  background: linear-gradient(135deg, #00b248, #00d75a);
}

.call-button:active {
  transform: scale(0.97);
}

@media (max-width: 600px) {
  .display input {
    font-size: 26px;
  }

  .key {
    font-size: 22px;
    height: 60px;
  }

  .call-button {
    font-size: 18px;
    padding: 14px;
  }
}

  </style>
  