<template>
  <fieldset class="fieldset">
    <legend>Fonte de Dados</legend>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label v-for="item in schema" :key="item.id" class="radio">
            <input type="radio" name="tabela" :value="item.id" v-model="tabela" />
            {{ item.name }}
          </label>
        </div>
      </div>
    </div>
  </fieldset>
  <fieldset class="fieldset" v-show="tabela.length > 0">
    <legend>Conteúdo</legend>
    <div class="columns">
      <div class="column is-8">
        <div class="columns">
          <div class="column is-3 is-offset-3 divide head">&nbsp;</div>
          <div class="column is-3 head">
            <label class="label">Colunas:</label>
            <draggable
              v-model="coluna"
              group="campos"
              item-key="id"
              class="isSlot"
              data-tipo="dimensao"
            >
              <template #item="{ element }">
                <div>{{ element.name }}</div>
              </template>
            </draggable>
          </div>
        </div>
        <div class="columns">
          <div class="column is-3 is-offset-3 divide head">
            <label class="label">Linhas:</label>
            <draggable
              v-model="linha"
              group="campos"
              item-key="id"
              data-tipo="dimensao"
              class="isSlot"
            >
              <template #item="{ element }">
                <div>{{ element.name }}</div>
              </template>
            </draggable>
          </div>
          <div class="column is-3 head">
            <label class="label">Incremento:</label>
            <draggable
              class="isSlot"
              v-model="incremento"
              group="campos"
              item-key="id"
              data-tipo="incremento"
            >
              <template #item="{ element }">
                <div>{{ element.name }}</div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      <div class="column is-3 is-offset-1">
        <label class="label">Campos disponíveis</label>
        <draggable v-model="campos" group="campos" item-key="id" class="isMother" :move="checkMove">
          <template #item="{ element }">
            <div>{{ element.name }}</div>
          </template>
        </draggable>
      </div>
    </div>
    <hr />
    <div class="columns is-centered">
      <h2 class="is-centered"><b>Filtros</b></h2>
    </div>
    <FiltroWrapper :ativos="ativos" :endpoint="'cross'" @submit="processar" />
  </fieldset>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import FiltroWrapper from '@/components/report/filtroWrapper.vue'

const schema = ref({})
const ativos = ref({})

const tabela = ref('')
const campos = ref([])
const linha = ref([])
const coluna = ref([])
const incremento = ref([])

const props = defineProps(['data'])
const emit = defineEmits(['options'])

async function processar(filtros) {
  const opt = {
    tabela: tabela.value,
    linha: linha.value[0],
    coluna: coluna.value[0],
    incremento: incremento.value[0],
    filtros: filtros,
  }
  emit('options', opt)
}

const checkMove = (evt) => {
  if (evt.to == evt.from) {
    return
  }
  var teste = evt.to.dataset.tipo
  if (teste != evt.draggedContext.element.tipo) {
    return false
  }
  return true
}

watch(
  () => props.data,
  () => {
    schema.value = props.data
  }
)

watch(tabela, (val) => {
  const filtered = schema.value.filter((item) => item.id === val)
  ativos.value = filtered.length > 0 ? filtered[0].ativos : {}
  campos.value = filtered.length > 0 ? [...filtered[0].campos] : []
  // opcional: limpar linhas/colunas/incrementos quando muda a tabela
  linha.value = []
  coluna.value = []
  incremento.value = []
})

onMounted(async () => {
  schema.value = props.data
})
</script>

<style>
.container {
  max-width: 800px;
  margin: auto;
}
.head {
  border-bottom: 1px solid #000;
}
.divide {
  border-right: 1px solid #000;
}
.isSlot {
  border: 1px solid #000;
  padding: 2rem;
  background-color: #ccc;
}
.isMother {
  border: 1px solid #000;
  padding: 2rem;
  background-color: #9ca2ff;
}
</style>
