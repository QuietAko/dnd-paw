<template>
    <transition name="fade">
      <div
        v-if="visible"
        ref="qteContainer"
        class="qte-fullscreen grim"
        @click="shrink"
      >
        <div class="qte-wrapper">
          <div class="circle-wrapper">
            <!-- SVG таймер -->
            <svg class="time-ring" width="240" height="240">
              <circle
                class="ring-bg"
                cx="120"
                cy="120"
                r="110"
                stroke-width="12"
                fill="none"
              />
              <circle
                class="ring-progress"
                cx="120"
                cy="120"
                r="110"
                stroke-width="12"
                fill="none"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference * (1 - timeProgress)"
                :style="{ stroke: ringColor }"
              />
            </svg>
  
            <!-- Target -->
            <div
              class="circle target"
              :style="{ width: `${targetSize}px`, height: `${targetSize}px` }"
            ></div>
  
            <!-- Active shrinking -->
            <div
              class="circle active"
              :style="{ width: `${progressSize}px`, height: `${progressSize}px` }"
            ></div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onUnmounted, watch, nextTick } from 'vue'
  
  interface Props {
    difficult: number
    timeLimit?: number
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['success', 'fail'])
  
  const qteContainer = ref<HTMLElement | null>(null)
  const visible = ref(false)
  const status = ref<'idle' | 'success' | 'fail'>('idle')
  const reachedTarget = ref(false)
  
  const fullSize = 240
  const maxRadius = fullSize / 2
  const progress = ref(maxRadius)
  const target = ref(maxRadius * 0.7)
  
  const shrinkStep = 8
  const relaxRate = ref(0.4)
  const timeProgress = ref(0)
  
  const progressSize = computed(() => progress.value * 2)
  const targetSize = computed(() => target.value * 2)
  const timeLimit = computed(() => props.timeLimit || 5000)
  
  const radius = 110
  const circumference = 2 * Math.PI * radius
  
  function lerpColor(color1: string, color2: string, t: number): string {
    const c1 = parseInt(color1.slice(1), 16)
    const c2 = parseInt(color2.slice(1), 16)
  
    const r1 = (c1 >> 16) & 0xff
    const g1 = (c1 >> 8) & 0xff
    const b1 = c1 & 0xff
  
    const r2 = (c2 >> 16) & 0xff
    const g2 = (c2 >> 8) & 0xff
    const b2 = c2 & 0xff
  
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
  
    return `rgb(${r}, ${g}, ${b})`
  }
  
  const ringColor = computed(() =>
    lerpColor('#ff0000', '#550000', timeProgress.value)
  )
  
  let relaxInterval: ReturnType<typeof setInterval> | null = null
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null
  
function triggerStatusFlash(result: 'success' | 'fail') {
  status.value = result
  const el = qteContainer.value
  if (!el) return

  const flashClass = result === 'success' ? 'flash-success' : 'flash-fail'
  el.classList.add(flashClass)
}

  
  function startQTE() {
    progress.value = maxRadius
    target.value = maxRadius * (1 - props.difficult * 0.25)
    relaxRate.value = 0.2 + props.difficult * 0.3
    reachedTarget.value = false
    status.value = 'idle'
    visible.value = true
    timeProgress.value = 0
  
    const startTime = performance.now()
  
    if (relaxInterval) clearInterval(relaxInterval)
    if (timeoutHandle) clearTimeout(timeoutHandle)
  
    relaxInterval = setInterval(() => {
      if (status.value !== 'idle') return
      const elapsed = performance.now() - startTime
      timeProgress.value = Math.min(elapsed / timeLimit.value, 1)
      progress.value = Math.min(progress.value + relaxRate.value, maxRadius)
    }, 16)
  
    timeoutHandle = setTimeout(() => {
      if (relaxInterval) clearInterval(relaxInterval)
      if (reachedTarget.value) {
        triggerStatusFlash('success')
        emit('success')
      } else {
        triggerStatusFlash('fail')
        emit('fail')
      }
      setTimeout(() => {
        visible.value = false
        status.value = 'idle'
      }, 1000)
    }, timeLimit.value)
  }
  
  function shrink() {
    if (status.value !== 'idle') return
    progress.value = Math.max(progress.value - shrinkStep, 0)
  
    if (!reachedTarget.value && progress.value <= target.value) {
      reachedTarget.value = true
      triggerStatusFlash('success')
      emit('success')
  
      if (relaxInterval) clearInterval(relaxInterval)
      if (timeoutHandle) clearTimeout(timeoutHandle)
  
      setTimeout(() => {
        visible.value = false
        status.value = 'idle'
      }, 1000)
    }
  }
  
  onUnmounted(() => {
    if (relaxInterval) clearInterval(relaxInterval)
    if (timeoutHandle) clearTimeout(timeoutHandle)
  })
  
  watch(() => props.difficult, startQTE, { immediate: true })
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
  
  .qte-fullscreen.grim {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(circle, #111 0%, #000 100%);
    color: #eee;
    font-family: 'Special Elite', monospace;
    user-select: none;
    cursor: crosshair;
  }
  
  .qte-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .circle-wrapper {
    position: relative;
    width: 240px;
    height: 240px;
  }
  
  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: transparent;
  }
  
  .circle.target {
    border: 4px dashed #441111;
    background-color: rgba(100, 0, 0, 0.05);
    z-index: 1;
  }
  
  .circle.active {
    border: 6px solid #771111;
    background-color: rgba(120, 0, 0, 0.08);
    z-index: 2;
  }
  
  .time-ring {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    transform: rotate(-90deg);
  }
  
  .ring-bg {
    stroke: #1a1a1a;
  }
  
  .ring-progress {
    stroke-linecap: butt;
    transition: stroke-dashoffset 0.05s linear;
  }
  
  /* Вспышки */
  @keyframes flashGreen {
  0%, 100% { background-color: rgba(0, 255, 0, 0); }
  50% { background-color: rgba(0, 255, 0, 0.5); }
}

@keyframes flashRed {
  0%, 100% { background-color: rgba(255, 0, 0, 0); }
  50% { background-color: rgba(255, 0, 0, 0.5); }
}

/* Зелёный флеш */
.flash-success {
  background: rgba(0, 128, 0, 0.4) !important;
}

/* Красный флеш */
.flash-fail {
  background: rgba(128, 0, 0, 0.4) !important;
}

  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  