<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">
              Nebulizações Veiculares - Estimativa de Consumo
            </p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!hasRows">
              <div class="columns" v-if="tpUser < 4">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">GVE</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-nav'"
                        :tipo="9"
                        v-model:sel="filter.id_gve"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-nav'"
                        v-model:sel="filter.id_municipio"
                        :data="municipios"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Ano</label>
                    <div class="control">
                      <input
                        class="input"
                        type="number"
                        v-model="filter.ano"
                        v-enter-to-next="'form-nav'"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="content">
                    <label class="label">Área de Transmissão</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-nav'"
                        v-model:sel="filter.id_area_nav"
                        :data="areas_nav"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="field column is-3 is-offset-4">
                  <label class="label">&nbsp;</label>
                  <div class="control">
                    <button class="button is-link is-fullwidth" @click="loadData">
                      <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                      Carregar
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section v-if="hasRows">
              <MyDataTable
                :data="dataTable"
                :columns="columns"
                :logged-user="idUser"
                :pagination="false"
                :buttons="[]"
                :has-exports="true"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import veicularService from '@/services/atividade/veicular.service'
//import reportService from '@/services/report.service'
import area_navService from '@/services/cadastro/areaNav.service'
import auxiliarService from '@/services/general/auxiliar.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'

const { currentUser } = useCurrentUser()

const idUser = ref(0)
var tpUser = ref(0)

var confirmDialog = ref(null)
var isLoading = ref(false)
const STORAGE_KEY = 'consulta-veicularsw'

var hasRows = ref(false)
var dataTable = ref([])
const municipios = ref([])
const areas_nav = ref([])

const filter = reactive({
  id_gve: 0,
  id_municipio: 0,
  ano: '',
  id_area_nav: '',
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const result = await veicularService.getPrevisao(JSON.stringify(filter))
    //  const result = await reportService.getData('nav', 'navPrevisao', filter)
    if (result.error) {
      console.log(result.error)
    } else {
      console.log(result)
      dataTable.value = result.data
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => filter.id_municipio,
  async () => {
    if (filter.ano == '') return
    const result = await area_navService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      areas_nav.value = []
    } else {
      areas_nav.value = result
    }
  },
)

watch(
  () => filter.ano,
  async () => {
    if (filter.id_municipio == 0) return
    const result = await area_navService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      areas_nav.value = []
    } else {
      areas_nav.value = result
    }
  },
)

watch(
  () => filter.id_gve,
  async (val) => {
    const result = await auxiliarService.getMunicipiosCombo(JSON.stringify({ id_gve: val }))
    if (result.error) {
      console.log(result.error)
      municipios.value = []
    } else {
      municipios.value = result
    }
  },
)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filter, JSON.parse(saved))
  }

  columns.value = [
    {
      headerName: 'Cadastro',
      children: [
        { headerName: 'Município', field: 'municipio' },
        { headerName: 'Nome Área', field: 'nome' },
        { headerName: 'Censitários', field: 'censitarios' },
        { headerName: 'Quadras', field: 'qt' },
        { headerName: 'Cad. Quadras', field: 'cad_quart' },
      ],
    },
    {
      headerName: 'Mapa',
      children: [
        { headerName: 'Rel. Perc/Área', field: 'relacao' },
        { headerName: 'Área (ha)', field: 'newArea' },
        { headerName: 'Percurso (Km)', field: 'percurso' },
      ],
    },
    {
      headerName: 'Previsto para a atividade',
      children: [
        { headerName: 'Km Aplicação', field: 'km' },
        { headerName: 'Consumo', field: 'consumo' },
      ],
    },
  ]

  let cUser = currentUser
  if (cUser.value) {
    idUser.value = cUser.value
    tpUser.value = cUser.value.tipo
    if (tpUser.value == 4) {
      loadData()
    }
  }
})
</script>

<style></style>
