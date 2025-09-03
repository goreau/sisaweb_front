<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Gráficos</p>
            <button class="button is-info is-outlined" @click="goBack">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-rotate-back" />
              </span>
              <span>Voltar</span>
            </button>
          </header>
          <div class="card-content">
            <fieldset class="fieldset">
              <legend>Tipo de Gráfico</legend>
              <div class="field">
                <RadioGeneric v-model="type" :options="tipos" name="tipo" :inline="true" />
              </div>
            </fieldset>
            <div class="graficoContent" v-if="data.length > 0">
              <ChartWrapper
                class="chart-container"
                :type="type"
                :title="title"
                :columns="columns"
                :data="data"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import ChartWrapper from '@/components/report/chartWrapper.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { onMounted, ref } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import { useRouter } from 'vue-router'

const store = useReportStore()
const router = useRouter()

const columns = ref([])
const data = ref([])
const title = ref('')
const type = ref('bar')

const tipos = ref([])

var isLoading = ref(false)

function goBack() {
  router.push({ name: 'tabelaCruzada', query: { returnFrom: 'grafico' } })
}

onMounted(() => {
  data.value = store.tableData
  columns.value = store.tableColumns
  title.value = store.tableTitle

  tipos.value = [
    { id: 'bar', nome: 'Coluna' },
    { id: 'line', nome: 'Linha' },
    { id: 'pie', nome: 'Pizza' },
  ]
})
</script>

<style scoped>
.graficoContent {
  height: 800px;
}
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px; /* pelo menos isso */
}
</style>
