<template>
  <div class="notes-wrapper">
    <div class="notes-header">
      <select v-model="selectedNoteId" class="notes-select" aria-label="Выбор заметки">
        <option v-for="note in notes" :key="note.id" :value="note.id">
          {{ shortenTitle(note.title) }}
        </option>
      </select>
      <button class="create-btn" @click="createNote" aria-label="Создать заметку">+</button>
      <button
        class="delete-btn"
        @click="deleteNote"
        aria-label="Удалить заметку"
        :disabled="!selectedNote"
        title="Удалить заметку"
      >
        −
      </button>
    </div>

    <div class="note-editor" v-if="selectedNote">
      <textarea
        v-model="selectedNote.content"
        placeholder="Введите текст заметки..."
        class="note-content"
        @input="updateTitle"
    ></textarea>>
    </div>
    <div v-else class="note-placeholder">
      <p>Заметок нет. Создайте новую.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue'
import { Players, type PlayerId } from '@/constans/players'

interface Note {
  id: number
  title: string
  content: string
}

// Пример заметок для игроков
const NOTES_DB: Record<PlayerId, Note[]> = {
  [Players.JASON]: [
    {
      id: 1,
      title: 'Список страхов',
      content: `1. Темнота\n2. Одиночество\n3. Лес\n4. Глубокая вода\n5. Дом, в котором "никто не жил 20 лет"\n Но остаться дома было бы хуже.`,
    },
    {
      id: 2,
      title: 'Сборы',
      content: `✓ УФ-фонарик\n✓ Ингалятор\n✓ Кулон от духов\n✓ Колода Таро\n✓ Плед с совами\n✗ Уверенность — не помещается в рюкзак`,
    },
    {
      id: 3,
      title: 'История Red Lake',
      content: `В 1973 поменялся владелец? А почему ? Кто такое хорошее место продаст ? УЖЕ БОЮСЬ!!! АААААА`,
    },
    {
      id: 4,
      title: 'Что сказать, если станет жутко',
      content: `— "Наверное, это просто ветер."\n— "Дом старый — скрипит."\n— "Не факт, что оно за нами…"\n Главное — не смотреть в зеркало ночью.`,
    },
    {
      id: 5,
      title: 'Зачем я еду',
      content: `Ричии сказал: "Будет весело." Лоуренс: "Ты нужен в группе, чувак." А я… просто устал быть в стороне. Может, это шанс.`,
    },
    {
      id: 6,
      title: 'Приметы перед отъездом',
      content: `✓ Мигала лампа, когда собирал вещи\n✓ Птица ударилась в окно\n✓ Сон: я сижу в лодке, но вода чёрная\n Просто совпадения. Наверное.`,
    },
  ],

  [Players.LAWRENECE]: [
    {
      id: 1,
      title: 'Музыкальный набор на выезд',
      content: `✓ Колонка\n✓ Пауэрбанк x2\n✓ Плейлист “Campfire Funk Vol.1”\n✓ Кассета с моим треком\n✓ Танцевальные кроссы`,
    },
    {
      id: 2,
      title: 'Речь на крыльце (черновик)',
      content: `“Некоторые слышат скрип половиц. Я слышу бит. Некоторые бегут от леса. Я — туда, где звук отражается от сосен. Добро пожаловать в Baxter Beats Camp.”`,
    },
    {
      id: 3,
      title: 'Список для вечеринки',
      content: `✓ Плед\n✓ Полароид\n✓ Свечи (для атмосферы)\n✓ Закуски\n✓ Лазерная указка (на случай скуки)`,
    },
    {
      id: 4,
      title: 'Кто как едет',
      content: `Ричии — как трактор\nДжейсон — как будто едет в ад\nКлэй — как будто проводит эксперимент\nЯ — как будто организатор тура\n Команда мечты!`,
    },
    {
      id: 5,
      title: 'Если что пойдёт не так',
      content: `✓ Включить музыку\n✓ Рассмешить Джейсона\n✓ Увести тему в танцы\n✓ НЕ паниковать первым\n Надо держать вайб, даже если все испугаются.`,
    },
    {
      id: 6,
      title: 'Ожидания от Red Lake',
      content: `— Один фристайл у костра\n— Две бессонные ночи\n— Танцы до рассвета\n— Фото с дымом и луной\n Главное — сохранить магию`,
    },
  ],

  [Players.CLAY]: [
    {
      id: 1,
      title: 'Наблюдение №1',
      content: `Интересное поведение группы: высокая мотивация уехать от города, несмотря на заведомо плохие условия. Подходит под феномен “синтетической сплочённости”.`,
    },
    {
      id: 2,
      title: 'Список снаряжения',
      content: `✓ Заметки по поведенческой психологии\n✓ Фонарик (обычный, не УФ)\n✓ Швейцарский нож\n✓ Мини-микрофон (если понадобятся записи)\n✓ Журнал для записей`,
    },
    {
      id: 3,
      title: 'Цели поездки',
      content: `1. Изучить поведение группы в условиях изоляции\n2. Посмотреть, как страх влияет на решения\n3. Собрать материал для блога (“Человеческий фактор в дикой среде”)`,
    },
    {
      id: 4,
      title: 'Физика дома (по фото)',
      content: `— Деревянная конструкция без термоизоляции\n— Окна — скорее всего, с перекосом\n— Влажность внутри выше нормы\n Возможны иллюзии звука и эха`,
    },
    {
      id: 5,
      title: 'Фраза на случай паники в группе',
      content: `“Никаких доказательств угрозы нет. Всё, что ты чувствуешь — работа амигдалы.”`,
    },
    {
      id: 6,
      title: 'Маленький страх',
      content: `Я не боюсь умереть. Я боюсь быть не в состоянии объяснить, почему это случилось. Нелогичное — пугает сильнее всего.`,
    },
  ],

  [Players.RICHIE]: [
    {
      id: 1,
      title: 'Чеклист от мамы',
      content: `✓ Тёплые носки\n✓ Шампунь\n✓ Тапки\n✓ Сигнальный свисток (серьёзно, мам?)\n✓ Футболка “BBQ KING”`,
    },
    {
      id: 2,
      title: 'Планы у костра',
      content: `— Мясо. Много.\n— Слушать музон Лоуренса\n— Может, сыграть в “правду или действие”?\n— Не уснуть первым!`,
    },
    {
      id: 3,
      title: 'Про дом',
      content: `На фотках — так себе. Но крыша есть, и это главное. Лестница немного кривая, пол вроде бы живой. Главное — если не пахнет, значит норм.`,
    },
    {
      id: 4,
      title: 'Про пацанов',
      content: `Джейсон — смешной, хоть и всё время боится\nКлэй — умный, но будто из другого мира\nЛоуренс — главный по звуку и настроению\n Хорошая команда. Надеюсь, ничего не сломаю.`,
    },
    {
      id: 5,
      title: 'Запомнить',
      content: `— Если кто-то теряется — кричать три раза и ждать\n— Не пить воду из озера\n— Не пугать Джейсона специально — он правда пугается\n И не ломать дверь. Даже если она хлипкая.`,
    },
    {
      id: 6,
      title: 'Чего я хочу',
      content: `Просто… чтобы всё прошло хорошо. Без драк. Без бед. Хочу шашлык, музыку, и чтоб никто не ныл. Всё же взрослые уже. И кому нибудь натянуть трусишки 😂😂😂`,
    },
  ],
}



// Выбираем игрока (можно заменить на передачу из пропсов/роутера)
const storedPlayer = localStorage.getItem('playerId')
const playerId: PlayerId = storedPlayer && Object.values(Players).includes(storedPlayer as PlayerId)
  ? (storedPlayer as PlayerId)
  : Players.RICHIE

const notes = reactive<Note[]>(NOTES_DB[playerId] ? [...NOTES_DB[playerId]] : [])

const selectedNoteId = ref(notes[0]?.id || null)

const selectedNote = computed(() =>
  notes.find(n => n.id === selectedNoteId.value) ?? null
)

function createNote() {
  const newId = notes.length ? Math.max(...notes.map(n => n.id)) + 1 : 1
  notes.push({ id: newId, title: '', content: '' })
  selectedNoteId.value = newId
}

function deleteNote() {
  if (!selectedNote.value) return
  const index = notes.findIndex(n => n.id === selectedNoteId.value)
  if (index === -1) return

  notes.splice(index, 1)

  if (notes.length > 0) {
    if (index >= notes.length) {
      selectedNoteId.value = notes[notes.length - 1].id
    } else {
      selectedNoteId.value = notes[index].id
    }
  } else {
    selectedNoteId.value = null
  }
}

function updateTitle() {
  if (!selectedNote.value) return
  const lines = selectedNote.value.content.split('\n')
  selectedNote.value.title = lines[0].slice(0, 30) || 'Без названия'
}

function shortenTitle(title: string) {
  if (!title) return 'Без названия'
  return title.length > 30 ? title.slice(0, 30) + '…' : title
}

// Сохранять в localStorage не будем, по твоему желанию

</script>

<style scoped>
.notes-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #3a2f00;
  border-radius: 12px;
  overflow: hidden;
}

.notes-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
  background: #f0e6b5;
  border-bottom: 2px solid #d4c378;
}

.notes-select {
  flex-grow: 1;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #c1b46a;
  background: #fff8dc;
  color: #3a2f00;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.create-btn {
  background-color: #a0522d;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.create-btn:hover {
  background-color: #7b3f1a;
}

.delete-btn {
  background-color: #7b3f1a;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.delete-btn:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
}

.delete-btn:hover:not(:disabled) {
  background-color: #5a3410;
}

.note-editor {
  flex-grow: 1;
  background: #fff8dc;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 22px,
      #d4c378 23px,
      #d4c378 24px
    );
  overflow-y: auto;
  border-radius: 0 0 12px 12px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
}

.note-content {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  background: transparent;
  font-size: 16px;
  font-family: "Courier New", Courier, monospace;
  color: #3a2f00;
  line-height: 24px;
  padding-left: 8px;
  outline: none;
  box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Адаптив для телефонов */
@media (max-width: 600px) {
  .notes-wrapper {
    border-radius: 0;
  }

  .notes-header {
    padding: 8px 12px;
  }

  .notes-select {
    font-size: 14px;
    padding: 6px 8px;
  }

  .create-btn,
  .delete-btn {
    width: 36px;
    height: 36px;
    font-size: 24px;
  }

  .note-content {
    font-size: 14px;
    line-height: 24px;
    padding-left: 6px;
  }
}
</style>
