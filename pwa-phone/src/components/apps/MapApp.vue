<template>
  <div class="map-wrapper">
    <img :src="mapSrc" alt="Карта местности" class="map-image" />
  </div>
</template>

<script setup lang="ts">

import mapImage from '@/assets/maps/red_lake.png'

const mapSrc = mapImage
</script>

<style scoped>
.map-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.map-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  box-shadow: 0 0 20px rgba(255 255 255 / 0.1);
}
</style>
