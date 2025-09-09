<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Construir Relatório</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="pivotData.length">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!pivotData.length">
              <crossTab :data="campos" @options="gerarRelatorio" />
            </section>
            <section v-if="pivotData.length">
              <div class="box mt-5">
                <h4 class="rel_title">{{ pivotFantasia }}</h4>
                <MyDataTable
                  :data="pivotData"
                  :columns="pivotColumns"
                  :pagination="true"
                  :has-exports="true"
                  :buttons="[]"
                  :has-graf="true"
                  @chart="toGrafico"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import crossTab from '@/components/report/crossTab.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import reportService from '@/services/report.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import { useReportStore } from '@/stores/reportStore'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useReportStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const campos = ref([])
const pivotData = ref([])
const pivotColumns = ref([])
const pivotFantasia = ref('')

var isLoading = ref(false)

function toGrafico() {
  store.setTable(pivotData, pivotColumns, campos, pivotFantasia)
  router.push('/testeChart')
}

onMounted(async () => {
  try {
    isLoading.value = true
    if (route.query.returnFrom === 'grafico') {
      pivotData.value = store.tableData
      pivotColumns.value = store.tableColumns
      campos.value = store.tableOptions
      pivotFantasia.value = store.tableTitle
    } else {
      const result = await reportService.getCrossVars()
      if (result.error) {
        console.log(result.error)
        campos.value = []
      } else {
        campos.value = result.data
      }
    }
  } finally {
    isLoading.value = false
  }
})

function newFilter() {
  pivotData.value = []
  pivotColumns.value = []
}

async function gerarRelatorio(options) {
  try {
    isLoading.value = true
    const result = await reportService.getCrossTab(options)
    if (result.error) {
      toast.error(result.message)
      campos.value = []
    } else {
      pivotData.value = result.data.rows
      pivotColumns.value = result.data.colunas
      pivotFantasia.value = result.data.fantasia
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: auto;
}
.rel_title {
  font-size: larger;
  font-weight: bold;
  color: rgb(2, 2, 92);
}
</style>
