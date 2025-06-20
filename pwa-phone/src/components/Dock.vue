<template>
    <div class="dock">
      <AppIcon title="Телефон" icon="Phone.png" @click="props.openApp(PhoneApp)" />
      <AppIcon title="Сообщения" icon="Messages.png" @click="props.openApp(MessagesApp)"/>
      <AppIcon title="Safari" icon="Safari.png" @click="props.openApp(SafariApp)"/>
    </div>
  </template>
  
  <script lang="ts" setup>
    import type { Component } from 'vue'
    const props = defineProps<{
        openApp: (component: Component) => void
    }>()
  
    import AppIcon from './AppIcon.vue';
    import PhoneApp from './apps/PhoneApp.vue';
    import MessagesApp from './apps/MessagesApp.vue';
    import SafariApp from './apps/SafariApp.vue';
  </script>
  
  <style scoped>
  .dock {
    position: absolute;
    left: 20px;
    right: 20px;
    top: calc(100vh - 90px - 30px); /* высота окна - высота дока - нижний отступ */
    height: 90px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    top: calc(--vh);
  }
  </style>
  