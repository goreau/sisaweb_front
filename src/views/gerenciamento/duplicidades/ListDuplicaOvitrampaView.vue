<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Exclusão de Pesquisas de Ovitrampas</p>
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
                <div class="column is-5 is-offset-3">
                  <div class="content">
                    <label class="label">Ano</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-user'"
                        class="input"
                        type="text"
                        placeholder="Ano das visitas"
                        v-model="ano"
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
                :logged-user="idUser"
                :data="dataTable"
                :columns="columns"
                :pagination="false"
                @delete="processa"
                :buttons="['delete']"
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
import avulsosService from '@/services/gerenciamento/avulsos.service.js'
import MyDataTable from '@/components/general/MyDataTable.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)
const idUser = ref(0)

var confirmDialog = ref(null)
var isLoading = ref(false)

var hasRows = ref(false)
var dataTable = ref([])
var areas = ref([])

const ano = ref([])

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  try {
    isLoading.value = true

    const result = await avulsosService.getDuplicaOvi(ano.value)
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data.rows
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

async function processa(item) {
  const ok = await confirmDialog.value.show({
    title: 'Transferência',
    message: `Remover automaticamente os registros duplicados desse município! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await avulsosService.trocaOvi({
      id_municipio: item.row.id_municipio,
      ano: ano.value,
    })
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(`Remoção de duplicatas efetivada!!`)
      loadData()
    }
  }
}

onMounted(() => {
  columns.value = [
    { headerName: 'Municipio', field: 'municipio' },
    { headerName: 'Quantidade de Duplicidades', field: 'quantidade' },
    { headerName: 'ID', field: 'id_municipio', hide: true },
    { headerName: 'Proprietário', field: 'owner_id', hide: true },
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
