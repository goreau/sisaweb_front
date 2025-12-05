<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">EDLs Cadastradas</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
            <button class="button is-primary is-outlined" @click="newReg">
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
                        v-enter-to-next="'form-edl'"
                        v-model:sel="id_municipio"
                        :tipo="99"
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
                :loggedUser="{ id: idUser, tipo: tpUser }"
                :data="dataTable"
                :columns="columns"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                :buttons="['edit', 'delete']"
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
import edlCadastroService from '@/services/cadastro/edlCadastro.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()

var tpUser = ref(0)

var isLoading = ref(false)
const STORAGE_KEY = 'consulta-edlCadsw'

var confirmDialog = ref(null)

var id_municipio = ref(0)
var hasRows = ref(false)
var dataTable = ref([])
const idUser = ref(0)

const filter = reactive({
  id_municipio,
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

function newReg() {
  router.push('edlCadastro/0')
}

async function loadData() {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const result = await edlCadastroService.getEdlCadastros(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

async function onEditRow(item) {
  router.push(`/edlCadastro/${item.row.id}`)
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir essa EDL?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await edlCadastroService.delete(item.row.id)
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success('Registro excluído com sucesso!')
      loadData()
    }
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filter, JSON.parse(saved))
  }

  columns.value = [
    { headerName: 'Município', field: 'municipio' },
    { headerName: 'Cadastro', field: 'cadastro' },
    { headerName: 'Tipo', field: 'tipo' },
    { headerName: 'Área', field: 'area', hide: true },
    { headerName: 'Censitário', field: 'censitario', hide: true },
    { headerName: 'Quarteirão', field: 'numero_quarteirao' },
    { headerName: 'Bairro', field: 'bairro' },
    { headerName: 'Endereço', field: 'endereco' },
    { headerName: 'Resp. Imóvel', field: 'responsavel', hide: true },
    { headerName: 'Telefone', field: 'telefone', hide: true },
    { headerName: 'Data Cadastro', field: 'data', hide: true },
    { headerName: 'Local', field: 'local', hide: true },
    { headerName: 'Latitude', field: 'latitude', hide: true },
    { headerName: 'Longitude', field: 'longitude', hide: true },
    {
      headerName: 'Ativa',
      field: 'ativa',
      cellRenderer: 'tickCrossRenderer',
    },
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
