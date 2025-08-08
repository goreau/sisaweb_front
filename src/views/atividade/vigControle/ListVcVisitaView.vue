<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Visitas a Imóveis</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
            <button class="button is-primary is-outlined" @click="newUser">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
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
                ref="dataTableRef"
                :logged-user="idUser"
                :data="dataTable"
                :columns="columns"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                :buttons="['edit', 'delete']"
                :has-exports="true"
              />
            </section>
            <div style="display: none">
              <span class="icon is-small is-left" ref="myspan">
                <font-awesome-icon icon="fa-solid fa-edit" />
              </span>
              <span class="icon is-small is-left" ref="myspan2">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import vc_linhaService from '@/services/atividade/vc_linha.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { ref, onMounted, reactive, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import { useVcVisitaStore } from '@/stores/vcVisitaStore'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()
const store = useVcVisitaStore()

const idUser = ref(0)
var tpUser = ref(0)
const dataTableRef = ref(null)

var confirmDialog = ref(null)

var hasRows = ref(false)
var dataTable = ref([])

const filter = reactive({
  id_municipio: 0,
  dt_inicial: '',
  dt_final: '',
})

var myspan = ref(null)
var myspan2 = ref(null)

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  localStorage.setItem('censSW', JSON.stringify(filter))

  const result = await vc_linhaService.getVcLinhas(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataTable.value = result.data
    hasRows.value = true
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

/*watch(hasRows, (visivel) => {
  if (visivel) {
    nextTick(() => {
      dataTableRef.value?.sizeColumnsToFit()
    })
  }
})*/

onMounted(() => {
  columns.value = [
    { headerName: 'Município', field: 'municipio' },
    { headerName: 'Tipo', field: 'atividade' },
    { headerName: 'Data', field: 'data' },
    { headerName: 'Responsável', field: 'owner' },
    { headerName: 'OwnerId', field: 'owner_id', hide: true },
  ]

  let cUser = currentUser
  if (cUser.value) {
    idUser.value = cUser.value.id
    tpUser.value = cUser.value.tipo
    if (tpUser.value == 4) {
      loadData()
    }
  }
})
</script>

<style></style>
