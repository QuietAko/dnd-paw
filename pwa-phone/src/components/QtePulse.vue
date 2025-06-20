<template>
    <div class="qte-heartbeat" @click="handleClick" v-if="!failed && !completed">
      <div class="indicator-line"></div>
      <div class="baseline"></div>
  
      <div
        v-for="pulse in pulses"
        :key="pulse.id"
        class="pulse"
        :class="{ hit: pulse.hit }"
        :style="{ left: `${pulse.x}px` }"
      >
        <div class="pulse-overlay"></div>
        <img :src="heartbeatImage" alt="heartbeat" class="pulse-image" />
      </div>
    </div>
  
    <div v-else class="result-screen">
      <h1>{{ failed ? 'Провал!' : 'Успешно!' }}</h1>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import heartbeatImage from '@/assets/icons/heartbeat.jpg'
  
  const pulses = ref<{ id: number; x: number; hit: boolean }[]>([])
  const speed = 4.5
  const pulseWidth = 80
  const pulseGap = 160
  const indicatorX = 120
  const emit = defineEmits(['success', 'fail'])
  
  let nextId = 0
  let animationFrame: number
  let spawnInterval: ReturnType<typeof setInterval>
  let totalPulsePairs = 3
  let spawnedPairs = 0
  const missCount = ref(0)
  const failed = ref(false)
  const completed = ref(false)
  
  function spawnPulsePair() {
    const screenWidth = window.innerWidth
  
    if (spawnedPairs >= totalPulsePairs) return
    spawnedPairs++
  
    pulses.value.push(
      { id: nextId++, x: screenWidth, hit: false },
      { id: nextId++, x: screenWidth + pulseGap, hit: false }
    )
  }
  
  function update() {
    for (const pulse of pulses.value) {
      pulse.x -= speed
    }
  
    // Удаляем и считаем промахи
    const remaining = []
    for (const pulse of pulses.value) {
      if (pulse.x + pulseWidth <= indicatorX && !pulse.hit) {
        missCount.value++
      } else if (pulse.x + pulseWidth > 0) {
        remaining.push(pulse)
      }
    }
    pulses.value = remaining
  
    if (missCount.value >= 2) {
      failed.value = true
      stop()
      return
    }
  
    if (spawnedPairs >= totalPulsePairs && pulses.value.length === 0) {
      completed.value = true
      stop()
      return
    }
  
    animationFrame = requestAnimationFrame(update)
  }
  
  function handleClick() {
    const tolerance = 10
    for (const pulse of pulses.value) {
      if (
        !pulse.hit &&
        indicatorX >= pulse.x - tolerance &&
        indicatorX <= pulse.x + pulseWidth + tolerance
      ) {
        pulse.hit = true
        document.body.classList.add('qte-flash-success')
        setTimeout(() => {
          document.body.classList.remove('qte-flash-success')
        }, 200)
        return
      }
    }
  
    document.body.classList.add('qte-flash-fail')
    setTimeout(() => {
      document.body.classList.remove('qte-flash-fail')
    }, 200)
  }
  
  function stop() {
    cancelAnimationFrame(animationFrame)
    clearInterval(spawnInterval)
    setTimeout(() => {
      failed.value == false ? emit('success') : emit('fail') 
    }, 1700)
  }
  
  onMounted(() => {
    spawnPulsePair()
    spawnInterval = setInterval(() => {
      spawnPulsePair()
    }, 1800)
  
    update()
  })
  
  onUnmounted(stop)
  </script>
  
  <style scoped>
  .qte-heartbeat {
    position: fixed;
    inset: 0;
    background: black;
    overflow: hidden;
    cursor: crosshair;
  }
  
  .indicator-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 120px;
    width: 3px;
    background: #1d4a1d;
    z-index: 10;
  }
  
  .baseline {
    position: absolute;
    top: 50.6%;
    left: 0;
    right: 0;
    height: 2px;
    background: red;
    z-index: 1;
  }
  
  .pulse {
    position: absolute;
    top: calc(50% - 40px);
    width: 80px;
    height: 80px;
    z-index: 2;
    border-left: 2px solid rgba(0, 255, 255, 0.3);
    border-right: 2px solid rgba(0, 255, 255, 0.3);
    box-sizing: border-box;
    transition: background-color 0.2s ease;
  }
  
  .pulse.hit {
    border-left: 2px solid rgba(0, 255, 42, 0.67);
    border-right: 2px solid rgba(0, 255, 42, 0.67);
    background-color: rgba(0, 64, 0, 0.15);
  }
  
  .pulse-image {
    width: 100%;
    height: auto;
    display: block;
    pointer-events: none;
    user-select: none;
  }
  
  .pulse-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 255, 255, 0.07);
    z-index: 1;
    pointer-events: none;
  }
  
  :global(body.qte-flash-success) {
    background-color: #001e00;
    transition: background-color 0.2s ease;
  }
  
  :global(body.qte-flash-fail) {
    background-color: #2b0000;
    transition: background-color 0.2s ease;
  }
  
  .result-screen {
  position: fixed;
  inset: 0;
  background: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  opacity: 0;
  transform: scale(0.95);
  animation: fadeInZoom 1.7s ease forwards;
}

.result-screen h1 {
  font-size: clamp(1.5rem, 5vw, 4rem);
  text-align: center;
  padding: 0 1rem;
}

@keyframes fadeInZoom {
  to {
    opacity: 1;
    transform: scale(1);
  }
}


  </style>
  