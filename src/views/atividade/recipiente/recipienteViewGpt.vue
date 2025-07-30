<script setup>
import { ref } from 'vue'
import MyTable from '@/components/general/gptTable.vue'

const colRecipientes = ref([])
const columns = [
  { title: 'Ordem', field: 'ordem' },
  { title: 'Grupo', field: 'id_grupo' },
]

function adicionar() {
  colRecipientes.value.push({
    ordem: colRecipientes.value.length + 1,
    id_grupo: Math.floor(Math.random() * 100),
  })
}
</script>

<template>
  <button @click="adicionar">Adicionar</button>
  <MyTable :tableData="colRecipientes" :columns="columns" />
  <pre>{{ colRecipientes }}</pre>
</template>
