<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['download'])

const isOpen = ref(false)

const handleClick = () => {
  if (props.item.type === 'directory') {
    isOpen.value = !isOpen.value
  } else {
    // Se for arquivo, "avisamos" o pai enviando o item completo (ou só o path)
    emit('download', props.item)
  }
}
</script>

<template>
  <div class="file-item">
    <div @click="handleClick" :class="['label', item.type]">
      <span class="icon">
        {{ item.type === 'directory' ? (isOpen ? '📂' : '📁') : '📄' }}
      </span>

      <span>{{ item.name }}</span>
    </div>

    <ul v-if="isOpen && item.children" class="children-list">
      <li v-for="child in item.children" :key="child.path">
        <FileTree :item="child" @download="(f) => emit('download', f)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.file-item {
  margin-left: 15px;
  font-family: sans-serif;
}
.label {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.label:hover {
  background-color: #f0f0f0;
}
.directory {
  font-weight: bold;
  color: #2c3e50;
}
.file a {
  text-decoration: none;
  color: #3498db;
}
.children-list {
  list-style: none;
  border-left: 1px solid #ddd;
  padding-left: 10px;
}
.icon {
  margin-right: 8px;
}
</style>
