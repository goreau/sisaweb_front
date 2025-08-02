<template>
  <div class="control">
    <div class="select">
      <select @change="onChange($event)" class="input" :class="errclass">
        <option value="0">-- Selecione --</option>
        <option v-for="loc in territorios" :key="loc.id" :value="loc.id" :selected="loc.id == sel">
          {{ loc.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import TerritorioService from '@/services/general/territorio.service.js'
import { onMounted, ref, watch } from 'vue'

const territorios = ref([])

const props = defineProps(['sel', 'errclass', 'tipo'])

const emit = defineEmits(['selTerr'])

function onChange(event) {
  emit('selTerr', event.target.value)
}

async function loadData() {
  const result = await TerritorioService.getCombo(props.tipo)
  if (result.error) {
    console.log(result.error)
    territorios.value = []
  } else {
    territorios.value = result
  }
}

watch(
  () => props.tipo,
  (newVal) => {
    loadData(newVal)
  }
)

onMounted(() => {
  loadData(props.tipo)
})
</script>

<style scoped></style>
