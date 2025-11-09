<template>
  <div class="control" data-focus-type="custom-select">
    <div class="select">
      <select ref="selectElement" @change="onChange($event)" class="input" :class="props.errclass">
        <option value="0">-- Selecione --</option>
        <option
          v-for="gen in props.data"
          :key="gen.id"
          :value="gen.id"
          :selected="gen.id == props.sel"
        >
          {{ gen.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
// 1. Desativa a herança de atributos na raiz
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { ref } from 'vue'

const props = defineProps(['sel', 'errclass', 'data'])
const emit = defineEmits(['selGen'])

const selectElement = ref(null)

function onChange(event) {
  emit('selGen', event.target.value)
}

function focus() {
  if (selectElement.value) {
    selectElement.value.focus()
  }
}

// 2. Exponha a função de foco
defineExpose({
  focus, // Torna a função 'focus' acessível de fora
})
</script>

<style scoped></style>
