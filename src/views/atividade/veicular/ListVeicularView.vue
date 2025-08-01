<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Nebulizações Veiculares</p>
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
            <section v-show="hasRows">
              <MyDataTable
                :data="dataTable"
                :columns="columns"
                :search="true"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
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
import MyDataTable from '@/components/general/gptTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()

var tpUser = ref(0)

var confirmDialog = ref(null)

var hasRows = ref(false)
var dataTable = ref([])

const filter = reactive({
  id_municipio: 0,
  dt_inicial: '',
  dt_final: '',
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  localStorage.setItem('censSW', JSON.stringify(filter))

  const result = await veicularService.getVeiculars(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataTable.value = result.data
    hasRows.value = true
  }
}

async function onEditRow(item) {
  router.push({ name: 'veicular', params: { id: item.row.id } })
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir essa atividade?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await veicularService.delete(item.row.id)
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success('Imóvel excluído com sucesso!')
      loadData()
    }
  }
}

onMounted(() => {
  columns.value = [
    { label: 'Município', field: 'municipio' },
    { label: 'Área', field: 'area' },
    { label: 'Ciclo', field: 'ciclo' },
    { label: 'Data', field: 'data' },
    { label: 'Responsável', field: 'owner' },
    { label: 'Ações', field: 'acoes' },
  ]

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
