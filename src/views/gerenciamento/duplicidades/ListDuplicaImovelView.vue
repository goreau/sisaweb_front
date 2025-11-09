<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Exclusão de Imóveis Cadastrados</p>
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
                        v-model:sel="filter.id_municipio"
                        :tipo="99"
                        v-enter-to-next="'form-imovel'"
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
                          v-enter-to-next="'form-imovel'"
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
                <div class="column is-5 is-offset-3">
                  <div class="content">
                    <label class="label">Cadastro/Endereço</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-imovel'"
                        class="input"
                        type="text"
                        placeholder="Permite parcial"
                        v-model="filter.cadastro"
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
              <MyDataTable :data="dataTable" :columns="columns" :pagination="false" />
              <hr />
              <div class="columns">
                <div class="column is-4 is-offset-1">
                  <div class="content">
                    <label class="label">Imóvel a excluir</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-imovel'"
                        v-model:sel="regExclui"
                        :data="dataTable"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-4 is-offset-2">
                  <div class="content">
                    <label class="label">Imóvel que receberá</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-imovel'"
                        v-model:sel="regRecebe"
                        :data="dataTable"
                      />
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
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import imovelService from '@/services/cadastro/imovel.service'
import auxiliarService from '@/services/general/auxiliar.service'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)

var confirmDialog = ref(null)
var isLoading = false

var hasRows = ref(false)
var dataTable = ref([])
var imoveis = ref([])
var atividades = ref([])

const filter = reactive({
  id_municipio: 0,
  id_atividade: 0,
  cadastro: '',
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

    const result = await imovelService.getDuplica(JSON.stringify(filter))
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
  const ok = await confirmDialog.value.show({
    title: 'Transferência',
    message: `Toda referência ao imóvel ID ${regExclui.value} será transferida para o imóvel ID ${regRecebe.value}! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await imovelService.troca({ sai: regExclui.value, fica: regRecebe.value })
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(
        `Transferência executada com sucesso! ${resultado.master} registros transferidos.`,
      )
      hasRows.value = false
    }
  }
}

watch(
  () => filter.id_atividade,
  async (val) => {
    if (filter.id_municipio == 0) return
    const filter = { id_municipio: filter.id_municipio, id_atividade: val }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  },
)

watch(
  () => filter.id_municipio,
  async (val) => {
    if (filter.id_atividade == 0) return
    const filter = { id_municipio: filter.id_municipio, id_atividade: val }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  },
)

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
    { headerName: 'ID', field: 'id' },
    { headerName: 'Atividade', field: 'atividade' },
    { headerName: 'Cadastro', field: 'cadastro' },
    { headerName: 'Endereço', field: 'endereco' },
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
