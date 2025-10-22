<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />

        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Relatório</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!hasRows">
              <FiltroWrapper
                :ativos="options.ativos"
                :endpoint="options.endpoint"
                @submit="buscar"
              />
            </section>
            <section v-if="hasRows" class="result">
              <!-- Resultado do filtro -->
              <div class="box mt-5">
                <h2 class="title is-6">{{ fantTitle }}</h2>
                <h4><b>Filtros:</b> {{ fantFiltro }}</h4>
                <MyDataTable
                  :data="dataTable"
                  :columns="options.colunas"
                  :pagination="true"
                  :has-exports="true"
                  :buttons="[]"
                />
              </div>
              <hr />
              <div v-html="options.extra" class="content mt-3 extra"></div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FiltroWrapper from '@/components/report/filtroWrapper.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import reportService from '@/services/report.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const route = useRoute()
const toast = useToast()
const fantTitle = ref('')

const dataTable = ref([])
const fantFiltro = ref([])

var hasRows = ref(false)
var isLoading = ref(false)
const relat = ref('')
const tipo = ref('')
const options = ref([])

function newFilter() {
  hasRows.value = false
}

async function buscar(filtros) {
  try {
    if (filtros.fantVar) {
      fantTitle.value = options.value.titulo + ' - ' + filtros.fantVar
      delete filtros.fantVar
    } else {
      fantTitle.value = options.value.titulo
    }
    // Aqui você pode chamar a API com os filtros
    isLoading.value = true

    const result = await reportService.getData(tipo.value, relat.value, filtros)
    if (result.error) {
      toast.error(result.msg)
    } else {
      var res = result.data
      if ('filtros' in res) {
        fantFiltro.value = res.filtros
      }
      if ('colunas' in res) {
        options.value.colunas = res.colunas
      }
      if ('dados' in res) {
        dataTable.value = res.dados
      } else {
        // comportamento padrão, caso venha direto como linhas
        dataTable.value = res
      }

      // dataTable.value = result.data
      hasRows.value = true
    }
  } catch (err) {
    toast.error(err)
  } finally {
    isLoading.value = false
  }
}

async function carregarRelatorio(tipoParam, nomeParam) {
  try {
    isLoading.value = true
    tipo.value = tipoParam
    relat.value = nomeParam
    const result = await reportService.getConfig(tipo.value, relat.value)
    if (result.error) {
      toast.error(result.msg)
    } else {
      options.value = result.data
      hasRows.value = false
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params,
  (params) => {
    carregarRelatorio(params.tipo, params.nome)
  },
)

onMounted(async () => {
  carregarRelatorio(route.params.tipo, route.params.nome)
})
</script>

<style scoped>
.result * {
  font-size: medium;
}

.extra * {
  font-size: small;
}
</style>
