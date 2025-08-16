<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Exclusão de Usuários Cadastrados</p>
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
                    <label class="label">Login/Nome</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Permite parcial"
                        v-model="filter.login"
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
                :search="true"
                :pagination="false"
              />
              <hr />
              <div class="columns">
                <div class="column is-4 is-offset-1">
                  <div class="content">
                    <label class="label">Usuário a excluir</label>
                    <div class="control">
                      <CmbGeneric :data="dataTable" @selGen="regExclui = $event" />
                    </div>
                  </div>
                </div>
                <div class="column is-4 is-offset-2">
                  <div class="content">
                    <label class="label">Usuário que receberá</label>
                    <div class="control">
                      <CmbGeneric :data="dataTable" @selGen="regRecebe = $event" />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button class="button is-link aux-btn is-fullwidth" @click="processa">
                    Processar a troca
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
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import authService from '@/services/auth.service'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)

var confirmDialog = ref(null)
var isLoading = false

var hasRows = ref(false)
var dataTable = ref([])

const filter = reactive({
  id_municipio: 0,
  login: '',
})

const regExclui = ref([])
const regRecebe = ref([])

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  try {
    isLoading = true
    localStorage.setItem('censSW', JSON.stringify(filter))

    const result = await authService.getDuplica(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data
      hasRows.value = true
    }
  } finally {
    isLoading = false
  }
}

async function processa() {
  const sai = dataTable.value.find((a) => a.id === Number(regExclui.value))
  const fica = dataTable.value.find((a) => a.id === Number(regRecebe.value))

  if (fica.nivel > sai.nivel) {
    toast.error(`Um usuário não pode ser atribuido a outro de nivel inferior!`)
    return false
  }

  const ok = await confirmDialog.value.show({
    title: 'Transferência',
    message: `Toda referência ao imóvel ID ${regExclui.value} será transferida para o imóvel ID ${regRecebe.value}! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await authService.troca({ sai: regExclui.value, fica: regRecebe.value })
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(
        `Transferência executada com sucesso! ${resultado.master} registros transferidos.`
      )
      hasRows.value = false
    }
  }
}

onMounted(() => {
  columns.value = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Login', field: 'login' },
    { headerName: 'Nome', field: 'name' },
    { headerName: 'Nível', field: 'role' },
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
