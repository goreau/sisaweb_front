<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Relatório</p>
          </header>
          <div class="card-content">
            <section v-if="!hasRows">
              <FiltroWrapper :ativos="options.ativos" @submit="buscar" />
            </section>
            <section v-if="hasRows" class="result">
              <!-- Resultado do filtro -->
              <div class="box mt-5">
                <h2 class="title is-6">{{ options.titulo }}</h2>
                <MyDataTable :data="dataTable" :columns="options.colunas" :pagination="true" />
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
import Loader from '@/components/general/MyLoader.vue'
import reportService from '@/services/report.service'
import MyDataTable from '@/components/general/gptTable.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

const route = useRoute()
const toast = useToast()

const dataTable = ref([])

var hasRows = ref(false)
var isLoading = ref(false)
const relat = ref('')
const tipo = ref('')
const options = ref([])

const msg = ref('')

async function buscar(filtros) {
  // Aqui você pode chamar a API com os filtros
  msg.value = `Filtros usados: ${JSON.stringify(filtros)}`

  const result = await reportService.getData(tipo.value, relat.value, filtros)
  if (result.error) {
    toast.error(result.msg)
  } else {
    var res = result.data
    if ('dados' in res && 'colunas' in res) {
      dataTable.value = res.dados
      options.value.colunas = res.colunas
    } else {
      // comportamento padrão, caso venha direto como linhas
      dataTable.value = res
    }

    // dataTable.value = result.data
    hasRows.value = true
  }
  // resultado.value = await api.getUsuarios(filtros)
}

onMounted(async () => {
  relat.value = route.params.nome
  tipo.value = route.params.tipo
  const result = await reportService.getConfig(tipo.value, relat.value)
  if (result.error) {
    toast.error(result.msg)
  } else {
    options.value = result.data
  }
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
