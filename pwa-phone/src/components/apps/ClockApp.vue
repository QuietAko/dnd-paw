<template>
  <div class="clock-container">
    <div class="time">
      {{ time }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const time = ref('')

function updateTime() {
  const now = new Date()
  const hh = now.getHours().toString().padStart(2, '0')
  const mm = now.getMinutes().toString().padStart(2, '0')
  const ss = now.getSeconds().toString().padStart(2, '0')
  time.value = `${hh}:${mm}:${ss}`
}

let interval: number

onMounted(() => {
  updateTime()
  interval = setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.clock-container {
  background-color: #000;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}

.time {
  color: #00ff99;
  font-family: 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700;
  font-size: 8rem;
  letter-spacing: 0.15em;
  user-select: none;
  text-shadow:
    0 0 10px #00ff99aa,
    0 0 20px #00ff9988,
    0 0 30px #00ff9955;
  white-space: nowrap;
  text-align: center;
}

/* Адаптив под телефоны */
@media (max-width: 600px) {
  .time {
    font-size: 4.5rem;
    letter-spacing: 0.1em;
  }
}

@media (max-width: 360px) {
  .time {
    font-size: 3.5rem;
    letter-spacing: 0.08em;
  }
}
</style>
