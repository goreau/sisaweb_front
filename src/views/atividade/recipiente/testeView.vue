<template>
  <div>
    <h2>Recipiente</h2>
    <div class="field">
      <label>Grupo</label>
      <input v-model="id_grupo" type="number" />
    </div>
    <div class="field">
      <label>Amostra</label>
      <input v-model="amostra" type="text" />
    </div>

    <button @click="adicionarItem">Adicionar</button>
    <button @click="carregarDadosAnteriores">Carregar da API</button>

    <div ref="table" class="tabulator-table" style="margin-top: 20px"></div>

    <pre>{{ colRecipientes }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator.min.css'

// Campos do formulário
const id_grupo = ref(0)
const amostra = ref('')

// Dados da tabela
const colRecipientes = []

const table = ref(null)
let tabulator = null

// Inserir novo item
function adicionarItem() {
  const novoItem = {
    ordem: colRecipientes.length + 1,
    id_grupo: id_grupo.value,
    amostra: amostra.value,
  }
  colRecipientes.push(novoItem)
  // tabulator?.replaceData([...colRecipientes]) // força atualização
}

// Simula carregamento da API
function carregarDadosAnteriores() {
  const dadosApi = [
    { id_grupo: 11, amostra: 'API A' },
    { id_grupo: 22, amostra: 'API B' },
  ]

  colRecipientes.splice(
    0,
    colRecipientes.length,
    ...dadosApi.map((item, i) => ({
      ...item,
      ordem: i + 1,
    }))
  )

  // tabulator?.replaceData([...colRecipientes])
}

// Inicializa Tabulator
onMounted(() => {
  tabulator = new Tabulator(table.value, {
    data: colRecipientes,
    reactiveData: true,
    layout: 'fitColumns',
    columns: [
      { title: 'Ordem', field: 'ordem' },
      { title: 'Grupo', field: 'id_grupo' },
      { title: 'Amostra', field: 'amostra' },
    ],
    placeholder: 'Nenhum recipiente adicionado',
  })
})
</script>

<style scoped>
.field {
  margin-bottom: 10px;
}
input {
  margin-left: 10px;
  padding: 4px;
}
button {
  margin-right: 10px;
  padding: 6px 12px;
}
</style>
