<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
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
                        :id_prop="id_prop"
                        :tipo="2"
                        :sel="id_regional"
                        @selTerr="id_regional = $event"
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
                        :id_prop="id_prop"
                        :tipo="9"
                        :sel="id_gve"
                        @selTerr="id_gve = $event"
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
                        :id_prop="id_prop"
                        :tipo="99"
                        :sel="id_municipio"
                        @selTerr="id_municipio = $event"
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
                :loggedUser="idUser"
                :data="dataTable"
                :columns="columns"
                :search="true"
                :pagination="true"
                :buttons="['e', 'd', 'r', 'p']"
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
import MyDataTable from '@/components/general/gptTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import { useAuthStore } from '@/stores/auth'
import { c } from 'vite/dist/node/types.d-aGj9QkWt'

const { currentUser } = useCurrentUser()
const auth = useAuthStore()

const router = useRouter()
const toast = useToast()

var tpUser = ref(0)
var confirmDialog = ref(null)

var id_regional = ref(0)
var id_gve = ref(0)
var id_municipio = ref(0)
var hasRows = ref(false)
var dataTable = ref([])
const idUser = ref(0)

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
  localStorage.setItem('userSW', JSON.stringify(filter))

  const result = await authService.list(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataTable.value = result
    hasRows.value = true
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
    auth.login(resp)
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
  columns.value = [
    { label: 'Nome', field: 'nome' },
    { label: 'Login', field: 'login' },
    { label: 'Local', field: 'local' },
    { label: 'Nivel', field: 'role' },
    { label: 'Responsável', field: 'owner' },
    { label: 'OwnerId', field: 'owner_id', hidden: true },
    { label: 'Ações', field: 'acoes' },
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
