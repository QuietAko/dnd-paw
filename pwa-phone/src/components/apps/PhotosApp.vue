<template>
  <div class="gallery-container">
    <transition name="fade" mode="out-in">
      <div v-if="selectedImage === null" key="grid" class="grid">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="thumb"
          @click="openPhoto(index)"
        >
          <img :src="photo" alt="Фото" loading="lazy" />
        </div>
      </div>

      <div v-else key="fullscreen" class="fullscreen">
        <button class="back-btn" @click="closePhoto">← Назад</button>
        <img
          :src="photos[selectedImage]"
          alt="Просмотр фото"
          class="full-image"
          loading="eager"
          @error="onImageError"
        />
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Players, type PlayerId } from '@/constans/players'
import { getPlayerId } from '@/utils/usePlayerId'

const photoModules = import.meta.glob('@/assets/photos/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  as: 'url',
})

function getPhoto(path: string): string {
  return photoModules[`/src/assets/photos/${path}`] || ''
}

const PHOTOS_DB: Record<PlayerId, string[]> = {
  [Players.JASON]: [
    getPhoto('jason/museum.jpg'),
    getPhoto('jason/school.jpg'),
    getPhoto('jason/games.jpg'),
    getPhoto('jason/new_york.jpg'),
    getPhoto('jason/ufo.jpg'),
    getPhoto('jason/led_zeppelin.jpg'),
    getPhoto('jason/breakfast.jpg'),
    getPhoto('jason/book.jpg'),
    getPhoto('jason/dog.jpg'),
    getPhoto('jason/best_friends.jpg')
  ],
  [Players.CLAY]: [
    getPhoto('clay/osci.jpg'),
    getPhoto('clay/lab.jpg'),
    getPhoto('clay/haha.jpg'),
    getPhoto('clay/book.jpg'),
    getPhoto('clay/math.jpg'),
    getPhoto('clay/clay.jpg'),
    getPhoto('clay/school2.jpg'),
    getPhoto('clay/clay_and_richie.jpg'),
    getPhoto('clay/lake.jpg')
  ],
  [Players.LAWRENECE]: [
    getPhoto('lawrence/disco.jpg'),
    getPhoto('lawrence/lawrence.jpg'),
    getPhoto('lawrence/kfc.jpg'),
    getPhoto('lawrence/basket.jpg'),
    getPhoto('lawrence/disneyland.jpg'),
    getPhoto('lawrence/clay_kissing.jpg'),
    getPhoto('lawrence/lawrence2.jpg'),
    getPhoto('lawrence/male.jpg'),
    getPhoto('lawrence/girl.jpg')
  ],
  [Players.RICHIE]: [
    getPhoto('richie/burgers.jpg'),
    getPhoto('richie/farm.jpg'),
    getPhoto('richie/food.jpg'),
    getPhoto('richie/aesthetic.jpg'),
    getPhoto('richie/richie.jpg'),
    getPhoto('richie/girls.jpg'),
    getPhoto('richie/cow.jpg'),
    getPhoto('richie/new_york.jpg'),
    getPhoto('richie/clay_and_farm.jpg')
  ],
}

const playerId = getPlayerId()
const photos = PHOTOS_DB[playerId as PlayerId] || []

const selectedImage = ref<number | null>(null)

function openPhoto(index: number) {
  selectedImage.value = index
}

function closePhoto() {
  selectedImage.value = null
}

function onImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = ''
}
</script>


<style scoped>
.gallery-container {
  height: 100vh;
  background: #000;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0px;
  width: 100%;
  max-width: 480px;
}

.thumb {
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: #111;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.thumb:hover {
  transform: scale(1.05);
}

.thumb:hover img {
  transform: scale(1.1);
}

.fullscreen {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(8px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
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
