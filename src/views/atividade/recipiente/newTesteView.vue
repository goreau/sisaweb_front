<script setup>
import { onMounted, reactive, ref } from 'vue'
import MyDataTable from '@/components/general/gptTable.vue'

const dados = ref([])

const item = reactive({
  id: 0,
  nome: '',
  idade: 0,
})

const colunas = [
  { label: 'Nome', field: 'nome' },
  { label: 'Idade', field: 'idade' },
  { label: 'Ações', field: 'acoes' },
]

function adicionar() {
  item.id = dados.value.length + 1

  dados.value.push({ ...item })

  /* dados.value.push({
    id: Date.now(),
    nome: 'Novo',
    idade: Math.floor(Math.random() * 50 + 18),
  })*/
}

function editarRegistro(registro) {
  alert(`Editar registro: ${registro.nome}`)
}

onMounted(async () => {
  dados.value = [
    { id: 1, nome: 'Maria', idade: 28 },
    { id: 2, nome: 'Carlos', idade: 34 },
  ]
})
</script>

<template>
  <label>Nome</label>
  <input type="text" v-model="item.nome" />

  <label>Idade</label>
  <input type="text" v-model="item.idade" />

  <button @click="adicionar">Adicionar</button>

  <MyDataTable :data="dados" :columns="colunas" @edit="editarRegistro" />
</template>

<style scoped>
</style>
