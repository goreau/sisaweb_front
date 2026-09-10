<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Inconsistências em Coordenadas Geográficas</p>
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
                    <fieldset class="fieldset">
                      <legend>Tipo</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-vc'"
                          v-model="filter.tipo"
                          :options="tipos"
                          name="tipo"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns" v-if="tpUser < 4">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-vc'"
                        :tipo="99"
                        v-model:sel="filter.id_municipio"
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
              <div class="columns">
                <p class="title">{{ title }}</p>
              </div>
              <MyDataTable
                ref="dataTableRef"
                :logged-user="idUser"
                :data="dataTable"
                :columns="columns"
                :pagination="true"
                @edit="onEditRow"
                :buttons="['edit']"
                :has-exports="true"
                :title="title"
              />
            </section>
          </div>
        </div>
        <Modal v-if="showModal" @confirm="handleConfirm" @cancel="handleCancel">
          <!-- Conteúdo específico do modal -->
          <p class="divisor">Coordenadas</p>
          <hr />
          <div class="columns">
            <div class="column is-3 is-offset-2">
              <div class="field">
                <label class="label">Latitude</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-ovi'"
                    class="input"
                    type="text"
                    placeholder="Opcional"
                    v-model="ovitrampa.latitude"
                    v-decimal
                    :class="{ 'is-danger': v$.latitude.$error }"
                  />
                  <span class="is-error" v-if="v$.latitude.$error">
                    {{ v$.latitude.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
            <div class="column is-2">
              <label class="label">&nbsp;</label>
              <button
                class="button is-info is-small is-outlined"
                @click="trocar"
                title="Inverter valores"
              >
                <font-awesome-icon icon="fa-solid fa-exchange" />
              </button>
            </div>
            <div class="column is-3">
              <div class="field">
                <label class="label">Longitude</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-ovi'"
                    class="input"
                    type="text"
                    placeholder="Opcional"
                    v-model="ovitrampa.longitude"
                    v-decimal
                    :class="{ 'is-danger': v$.latitude.$error }"
                  />
                  <span class="is-error" v-if="v$.longitude.$error">
                    {{ v$.longitude.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import coordenadasService from '@/services/gerenciamento/coordenadas.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import useValidate from '@vuelidate/core'
import { latitudeSP$, longitudeSP$ } from '@/components/forms/validators'
import Modal from '@/components/forms/GenericModal.vue'

const { currentUser } = useCurrentUser()

const toast = useToast()

const idUser = ref(0)
var tpUser = ref(0)
const dataTableRef = ref(null)

var isLoading = ref(false)
const STORAGE_KEY = 'consulta-coordenadassw'

var hasRows = ref(false)
var dataTable = ref([])

var showModal = ref(false)

const filter = reactive({
  tipo: 0,
  id_municipio: 0,
})

var ovitrampa = reactive({
  id: 0,
  latitude: 0.0,
  longitude: 0.0,
  tipo: 0,
})

const rules = {
  latitude: { latitudeSP$ },
  longitude: { longitudeSP$ },
}

const v$ = useValidate(rules, ovitrampa)

const title = ref('')

const tipos = ref([])

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

function trocar() {
  const lat = ovitrampa.latitude
  ovitrampa.latitude = ovitrampa.longitude
  ovitrampa.longitude = lat
}

function formatarCoordenada(campo) {
  const valorOriginal = ovitrampa[campo]
  if (valorOriginal === null || valorOriginal === '' || valorOriginal === undefined) return

  // 1. Substitui vírgula por ponto decimal
  let str = String(valorOriginal).trim().replace(',', '.')
  let num = parseFloat(str)

  if (isNaN(num)) return

  // 2. Garante o sinal negativo (hemisférios Sul e Oeste)
  if (num > 0) {
    num = -num
  }

  // 3. Corrige a falta de ponto decimal se o valor for muito alto
  // Exemplo: -2355054 vira -23.55054
  if (campo === 'latitude') {
    while (Math.abs(num) > 90) {
      num = num / 10
    }
  } else if (campo === 'longitude') {
    while (Math.abs(num) > 180) {
      num = num / 10
    }
  }

  // 4. Atualiza a propriedade reativa com a precisão ajustada
  ovitrampa[campo] = Number(num.toFixed(6))
}

function onEditRow(item) {
  ovitrampa.id = item.row.id
  ovitrampa.latitude = item.row.latitude
  ovitrampa.longitude = item.row.longitude
  ovitrampa.tipo = filter.tipo

  formatarCoordenada('latitude')
  formatarCoordenada('longitude')

  showModal.value = true
}

async function handleConfirm() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    const resultado = await coordenadasService.update(ovitrampa)
    const msg = 'Cadastro alterado com sucesso!'

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(msg)
      dataTable.value = dataTable.value.filter((item) => item.id !== ovitrampa.id)
    }

    showModal.value = false
  } else {
    toast.warning('Coordenadas precisam ser ajustadas')
  }
}

function handleCancel() {
  showModal.value = false
}

async function loadData() {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const item = tipos.value.find((o) => o.id === filter.tipo)
    title.value = item.nome

    const result = await coordenadasService.get(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data.rows
      columns.value = result.data.columns
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => filter.tipo,
  (value) => {
    const item = tipos.value.find((o) => o.id === value)
    if (item) {
      // É sempre bom garantir que o item foi encontrado
      title.value = item.nome
    }
  },
)

onMounted(async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filter, JSON.parse(saved))
  }

  tipos.value = [
    { id: 1, nome: 'Imóveis Cadastrados' },
    { id: 2, nome: 'Ovitrampas' },
  ]

  let cUser = currentUser
  if (cUser.value) {
    idUser.value = cUser.value
    tpUser.value = cUser.value.tipo
  }
})
</script>

<style scoped>
.title {
  font-size: large;
  padding-left: 2rem;
  color: rgb(23, 24, 102);
}
.subtitle {
  font-size: small;
  padding-top: 1rem;
  padding-left: 2rem;
  color: rgb(23, 24, 102);
}
</style>
