<template>
    <div class="app-icon" @click="handleClick">
      <img v-if="resolvedIcon" :src="resolvedIcon" :alt="title" />
      <span>{{ title }}</span>
    </div>
  </template>
  
  <script lang="ts" setup>
  const props = defineProps<{
    title: string
    icon: string
  }>()
  
  const emit = defineEmits<{
    (e: 'click'): void
  }>()
  
  const handleClick = () => {
    emit('click')
  }
  
  const icons = import.meta.glob('@/assets/icons/ios/*.png', {
    eager: true,
    import: 'default',
  })
  
  const resolvedIcon = icons[`/src/assets/icons/ios/${props.icon}`] as string | undefined
  </script>

<style>
.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  text-align: center;
  color: white;
  
  margin-top: 15px;
  gap: 5px;
  padding: 0;
  
  /* Чтобы flex-элементы не растягивались */
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  user-select: none;
  transition: transform 0.1s ease-in-out;
}

.app-icon:active {
  filter: brightness(0.6);
}

.app-icon img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  
  /* Убираем возможность растягивания */
  flex-shrink: 0;
  margin: 0;
  padding: 0;
}

.app-icon span {
  font-size: 12px;
  margin: 4px 0 0 0; /* сверху 4px, снизу 0 */
  padding: 0;
  line-height: 1;
  
  /* Убираем растягивание */
  flex-shrink: 0;
  flex-grow: 0;
}
</style>