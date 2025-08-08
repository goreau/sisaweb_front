<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Imóveis Cadastrados</p>
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
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        :tipo="99"
                        :sel="filter.id_municipio"
                        @selTerr="filter.id_municipio = $event"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Atividade</legend>
                      <div class="field">
                        <RadioGeneric
                          v-model="filter.id_atividade"
                          :options="atividades"
                          name="id_atividade"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Data Inicial</label>
                    <div class="control">
                      <DatePicker
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
              <MyDataTable
                ref="tabelaRef"
                :data="dataTable"
                :columns="columns"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                :buttons="['edit', 'delete']"
                :has-exports="true"
              />
              <hr />
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button
                    class="button is-success is-outlined aux-btn is-fullwidth"
                    @click="sincroniza"
                  >
                    Sincronizar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import mobVcImovelService from '@/services/mobile/mobVc_imovel.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import { useVcImovelStore } from '@/stores/vcImovelStore'
import auxiliarService from '@/services/general/auxiliar.service'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()
const store = useVcImovelStore()

var tpUser = ref(0)

var confirmDialog = ref(null)

var hasRows = ref(false)
var dataTable = ref([])
const atividades = ref([])

const tabelaRef = ref(null)

const filter = reactive({
  id_municipio: 0,
  id_atividade: 0,
  dt_inicial: '',
  dt_final: '',
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  localStorage.setItem('censSW', JSON.stringify(filter))

  const result = await mobVcImovelService.getMobVcImovels(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataTable.value = result.data
    let teste = result.data[0]
    console.log(teste.amostras)
    hasRows.value = true
  }
}

async function onEditRow(item) {
  const ret = await mobVcImovelService.getMobVcImovel(item.row.id)
  if (ret.error) {
    toast.error(ret.msg)
  } else {
    store.setVisita({ ...ret })
    router.push({ name: 'mobVcImovel', query: { from: 'edit' } })
  }
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir essa Visita?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await mobVcImovelService.delete(item.row.id)
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success('Imóvel excluído com sucesso!')
      loadData()
    }
  }
}

async function sincroniza() {
  if (tabelaRef.value) {
    const linhas = tabelaRef.value.getFilteredRows()

    const ret = await mobVcImovelService.sync(linhas)
    if (ret.error) {
      toast.error(ret.msg)
    } else {
      tabelaRef.value.clearFilters()
      toast.success(`${ret.master} ${ret.msg}`)
      loadData()
    }
  }
}

async function loadCombos() {
  const result = await auxiliarService.getAtividadeCombo(1)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }
}

onMounted(() => {
  columns.value = [
    { headerName: 'Município', field: 'municipio' },
    { headerName: 'Atividade', field: 'atividade' },
    { headerName: 'Imóvel', field: 'imovel' },
    { headerName: 'Data', field: 'data' },
    { headerName: 'Agente', field: 'agente' },
    {
      headerName: 'Amostras',
      field: 'amostras',
      valueFormatter: (params) => {
        const value = params.value
        if (!value || value.length === 0 || (value.length === 1 && value[0] === '-')) {
          return '-'
        }
        if (Array.isArray(value)) {
          return value.join(', ')
        } else {
          return value
        }
      },
    },
  ]

  loadCombos()

  let cUser = currentUser
  if (cUser.value) {
    tpUser.value = cUser.value.tipo
    if (tpUser.value == 4) {
      loadData()
    }
  }
})
</script>

<style></style>
