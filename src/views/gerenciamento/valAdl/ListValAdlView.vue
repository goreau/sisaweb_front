<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Validação de Adl</p>
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
                        :sel="id_municipio"
                        @selTerr="id_municipio = $event"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Ano</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Ano dos ValAdls"
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
            <section v-show="hasRows">
              <MyDataTable
                :loggedUser="idUser"
                :data="dataTable"
                :columns="columns"
                :search="true"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
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
import MyDataTable from '@/components/general/gptTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import valAdlService from '@/services/gerenciamento/valAdl.service'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()

var tpUser = ref(0)

var confirmDialog = ref(null)

var id_municipio = ref(0)
var ano = ref('')

var hasRows = ref(false)
var dataTable = ref([])
const idUser = ref(0)

const filter = reactive({
  id_municipio,
  ano,
})

var myspan = ref(null)
var myspan2 = ref(null)

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  localStorage.setItem('areaSW', JSON.stringify(filter))

  const result = await valAdlService.getValAdls(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataTable.value = result
    hasRows.value = true
  }
}

async function onEditRow(item) {
  router.push(`/valAdl/${item.row.id}`)
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir esse ValAdl?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await valAdlService.delete(item.row.id)
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success('ValAdl excluído com sucesso!')
      loadData()
    }
  }
}

onMounted(() => {
  columns.value = [
    { label: 'Município', field: 'municipio' },
    { label: 'Execução', field: 'execucao' },
    { label: 'Referência', field: 'data' },
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
