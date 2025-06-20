<template>
  <div class="safari-app">
    <div class="top-bar">
      <div class="address-bar">
        <span class="lock">🔒</span>
        <span class="url">https://dnd.su</span>
      </div>
    </div>

    <div class="no-network">
      <AppIcon title="" icon="Safari.png"></AppIcon>
      <p class="message">Не удается открыть страницу, так как отсутствует подключение к интернету.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppIcon from '../AppIcon.vue';

</script>

<style scoped>
.safari-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  color: #333;
  font-family: sans-serif;
}

.top-bar {
  background-color: #f1f1f1;
  padding: 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.address-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 6px 10px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
}

.lock {
  margin-right: 6px;
}

.url {
  font-size: 14px;
  color: #555;
}

.no-network {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.safari-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
}

.message {
  font-size: 16px;
  color: #666;
}
</style>
