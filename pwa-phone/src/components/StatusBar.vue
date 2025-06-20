<template>
  <div class="status-bar">
    <span>{{ time }} | {{ playerId.toUpperCase() }}</span>
    <div>
      <span class="status-bar-item"><img class="network" src="../assets/icons/3g.png" /></span>
      <span class="status-bar-item">{{ batteryLevel }}%</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getPlayerId } from '@/utils/usePlayerId'

const time = ref('')
onMounted(() => {
  const update = () => {
    const now = new Date()
    time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  update()
  setInterval(update, 60000)
})

const batteryLevel = ref<number>(0)

const batteryByPlayer: Record<string, number> = {
  jason: 87,
  clay: 64,
  lawrence: 42,
  richie: 19,
}

const playerId = getPlayerId()
batteryLevel.value = batteryByPlayer[playerId] ?? 50

</script>


<style>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  color: white;
  padding: 6px 16px;
  font-size: 14px;
}

.status-bar-item {
    margin-left: 10px;
}

.network {
  width: 16px;
  height: 16px;
}
</style>
  