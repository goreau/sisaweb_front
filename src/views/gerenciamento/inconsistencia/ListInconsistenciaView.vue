<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Inconsistências</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!hasRows">
              <div class="columns">
                <div class="column">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Tipo</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-vc'"
                          v-model="filter.tipo"
                          :options="tipos"
                          name="tipo"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns" v-if="tpUser < 4">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-vc'"
                        :tipo="99"
                        v-model:sel="filter.id_municipio"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Data Inicial</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-vc'"
                        v-model="filter.dt_inicial"
                        :error="false"
                        placeholder="Escolha a data"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Data Final</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-vc'"
                        v-model="filter.dt_final"
                        :error="false"
                        placeholder="Escolha a data"
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
              <div class="columns">
                <p class="title">{{ title }}</p>
              </div>
              <div class="columns">
                <p class="subtitle">{{ subtitle }}</p>
              </div>
              <MyDataTable
                ref="dataTableRef"
                :logged-user="idUser"
                :data="dataTable"
                :columns="columns"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                @boletim="printSheet"
                :buttons="['edit', 'boletim']"
                :has-exports="true"
                :title="title"
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
import inconsistenciaService from '@/services/gerenciamento/inconsistencia.service'
import vc_linhaService from '@/services/atividade/vc_linha.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import { useVcVisitaStore } from '@/stores/vcVisitaStore'
import { boletim } from '@/services/general/geraBoletim.service'
import utilitariosService from '@/services/utilitarios.service'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()
const store = useVcVisitaStore()

const idUser = ref(0)
var tpUser = ref(0)
const dataTableRef = ref(null)

var confirmDialog = ref(null)
var isLoading = ref(false)
const STORAGE_KEY = 'consulta-vcvisitasw'

var hasRows = ref(false)
var dataTable = ref([])

const filter = reactive({
  tipo: 0,
  id_municipio: 0,
  dt_inicial: '',
  dt_final: '',
})

const title = ref('')
const subtitle = ref('')

const tipos = ref([])

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

function newReg() {
  router.push(`/vigLinha`)
}

async function loadData() {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const item = tipos.value.find((o) => o.id === filter.tipo)
    title.value = item.title
    subtitle.value = item.subtitle

    const result = await inconsistenciaService.get(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data.rows
      columns.value = result.data.columns
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

async function onEditRow(item) {
  const ret = await vc_linhaService.getVcLinha(item.row.id)
  if (ret.error) {
    toast.error(ret.msg)
  } else {
    store.setFolha({ ...ret })
    router.push({ name: 'vigLinha', query: { from: 'edit' } })
  }
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir essa Visita?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await vc_linhaService.delete(item.row.id)
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success('Imóvel excluído com sucesso!')
      loadData()
    }
  }
}

async function printSheet(item) {
  const ret = await utilitariosService.boletimFolha(item.row.id)
  if (ret.error) {
    toast.error(ret.msg)
  } else {
    boletim(ret.data)
  }
}

watch('filter.tipo', (value) => {
  const item = tipos.value.find((o) => o.id === value)
  title.value = item.title
  subtitle.value = item.subtitle
})

onMounted(async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filter, JSON.parse(saved))
  }

  const result = await inconsistenciaService.getOptions()
  if (result.error) {
    console.log(result.error)
  } else {
    tipos.value = result.data
  }

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

<style scoped>
.title {
  font-size: large;
  padding-left: 2rem;
  color: rgb(23, 24, 102);
}
.subtitle {
  font-size: small;
  padding-top: 1rem;
  padding-left: 2rem;
  color: rgb(23, 24, 102);
}
</style>
