<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Exclusão de Setores Censitários</p>
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
                        v-enter-to-next="'form-cens'"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-cens'"
                        v-model:sel="filter.id_area"
                        :data="areas"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Setor Censitário</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-cens'"
                        class="input"
                        type="text"
                        placeholder="Permite parcial"
                        v-model="filter.censitario"
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
                    <label class="label">Censitário a excluir</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-cens'"
                        v-model:sel="regExclui"
                        :data="dataTable"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-4 is-offset-2">
                  <div class="content">
                    <label class="label">Censitário que receberá</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-cens'"
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
import censitarioService from '@/services/cadastro/censitario.service'
import areaService from '@/services/cadastro/area.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)

var confirmDialog = ref(null)
var isLoading = false

var hasRows = ref(false)
var dataTable = ref([])
var areas = ref([])

const filter = reactive({
  id_municipio: 0,
  id_area: 0,
  censitario: '',
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

    const result = await censitarioService.getDuplica(JSON.stringify(filter))
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
    message: `Os quarteirões e toda referência ao censitário ID ${regExclui.value} será transferida para o censitário ID ${regRecebe.value}! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await censitarioService.troca({ sai: regExclui.value, fica: regRecebe.value })
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(
        `Transferência executada com sucesso! ${resultado.master} quarteirões transferidos.`,
      )
      hasRows.value = false
    }
  }
}

watch(
  () => filter.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  },
)

onMounted(() => {
  columns.value = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Censitário', field: 'censitario' },
    { headerName: 'Área', field: 'area' },
    { headerName: 'Quarteirões', field: 'quarts' },
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
