<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Usuários</p>
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
              <div class="columns" v-if="tpUser == 1">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Regional</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-users'"
                        v-model:sel="id_regional"
                        :tipo="2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns" v-if="tpUser < 3">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">GVE</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-users'"
                        v-model:sel="id_gve"
                        :tipo="9"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns" v-if="tpUser < 4">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-users'"
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
                :buttons="['edit', 'delete', 'reset', 'impersonate']"
                :has-exports="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                @impersonate="onImpersonate"
                @reset="onReset"
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
import authService from '@/services/auth.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
//import { useAuthStore } from '@/stores/auth'

const { currentUser } = useCurrentUser()
//const auth = useAuthStore()

const router = useRouter()
const toast = useToast()

const idUser = ref(0)
var tpUser = ref(0)
var confirmDialog = ref(null)
const isLoading = ref(false)
const STORAGE_KEY = 'consulta-usersw'

var id_regional = ref(0)
var id_gve = ref(0)
var id_municipio = ref(0)
var hasRows = ref(false)
var dataTable = ref([])

const filter = reactive({
  id_regional,
  id_gve,
  id_municipio,
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const result = await authService.list(JSON.stringify(filter))
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
  router.push(`/user/${item.row.id}`)
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir esse Censitário?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await authService.delete(item.row.id)
    if (resultado.error) {
      toast.error(resultado.error)
    } else {
      toast.success('Registro excluído com sucesso!')
    }
  }
}

async function onImpersonate(item) {
  const user = { username: item.row.login, password: 'AH@g654321' }
  const resp = await authService.impersonate(user)
  if (resp.error) {
    toast.error(resp.msg)
  } else {
    localStorage.setItem('user', JSON.stringify(resp.data))
    location.href = router.resolve({ name: 'home' }).href
  }
}

async function onReset(item) {
  const ok = await confirmDialog.value.show({
    title: 'Reset',
    message: 'Deseja reiniciar o usuário para o padrão inicial?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resp = authService.restart(item.row)
    if (resp.error) {
      toast.error(resp.error)
    } else {
      toast.success('Usuário reiniciado com sucesso!')
    }
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filter, JSON.parse(saved))
  }
  columns.value = [
    { headerName: 'Nome', field: 'nome' },
    { headerName: 'Login', field: 'login' },
    { headerName: 'Local', field: 'local' },
    { headerName: 'Nivel', field: 'role' },
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
