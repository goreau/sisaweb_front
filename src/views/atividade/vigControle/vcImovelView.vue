<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-8">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Imóveis</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-3 is-offset-2">
                <div class="content">
                  <label class="label">Ordem</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="N° de Ordem"
                      v-model="imovel.ordem"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-3 is-offset-2">
                <div class="content">
                  <label class="label">Casa</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="N° do Imóvel"
                      v-model="imovel.casa"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-8">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Situação</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="imovel.id_situacao"
                        :options="situacoes"
                        name="id_situacao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Controle</legend>
                    <div class="field">
                      <label class="checkbox">
                        <input type="checkbox" value="1" v-model="imovel.mecanico" />
                        Mecânico
                      </label>
                      <label class="checkbox">
                        <input type="checkbox" value="1" v-model="imovel.alternativo" />
                        Alternativo
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <hr />
            <div class="columns">
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>Tratamento Focal</legend>
                  <div class="columns">
                    <div class="column is-5">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="imovel.focal" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-7">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.qt_focal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>Tratamento Perifocal</legend>
                  <div class="columns">
                    <div class="column is-5">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="imovel.perifocal" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-7">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.qt_peri"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>Nebulização</legend>
                  <div class="columns">
                    <div class="column is-5">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="imovel.nebulizacao" />
                          Tratado
                        </label>
                      </div>
                    </div>

                    <div class="column is-7">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.qt_neb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>BR Aedes</legend>
                  <div class="columns">
                    <div class="column is-5">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="imovel.br_aedes" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-7">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.qt_br"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4 is-offset-2">
                <div class="field">
                  <label class="label">Latitude</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Graus decimais"
                      v-model="imovel.latitude"
                      v-decimal
                      :class="{ 'is-danger': v$.latitude.$error }"
                    />
                    <span class="is-error" v-if="v$.latitude.$error">
                      {{ v$.latitude.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Longitude</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Graus decimais"
                      v-model="imovel.longitude"
                      v-decimal
                      :class="{ 'is-danger': v$.longitude.$error }"
                    />
                    <span class="is-error" v-if="v$.longitude.$error">
                      {{ v$.longitude.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <button class="button is-link aux-btn is-fullwidth" @click="insert">Salvar</button>
              </div>
            </div>
            <hr />
            <span v-if="colImoveis.length > 0">
              <p class="divisor">Imóveis</p>
              <MyDataTable
                :data="colImoveis"
                :columns="columns"
                :calcHeight="true"
                :pagination="false"
                :hasExports="false"
                :buttons="['edit', 'delete', 'recipiente']"
                @edit="onEditRow"
                @delete="onDeleteRow"
                @recipiente="onRecipiente"
              />
            </span>
            <hr />
          </div>
          <footer class="card-footer">
            <footerCard
              @submit="save"
              :ready="readyToGo"
              :customBack="true"
              @cancel="voltar"
              @aux="recipientes"
              :cFooter="cFooter"
            />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import MyDataTable from '@/components/general/MyDataTable.vue'
import useValidate from '@vuelidate/core'
import {
  required$,
  combo$,
  coordenada$,
  numeric$,
  maxLength$,
  decimal$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useVcVisitaStore } from '@/stores/vcVisitaStore'
import { useRouter } from 'vue-router'
//import { useToast } from 'vue-toastification'
import { generateId } from '@/utils/myUtils'

//const toast = useToast()
//const route = useRoute()
const router = useRouter()

const { currentUser } = useCurrentUser()
const store = useVcVisitaStore()

var situacoes = ref([])
var controles = ref([])
var prod_focais = ref([])
var prod_peris = ref([])
var prod_nebs = ref([])

var colImoveis = ref([])
const columns = ref([])

var id_prop = ref(0)

var imovel = reactive({
  id: 0,
  id_imovel: 0,
  ordem: 1,
  casa: '',
  latitude: '',
  longitude: '',
  id_situacao: 0,
  fant_sit: '',
  mecanico: 0,
  alternativo: 0,
  focal: 0,
  qt_focal: '',
  perifocal: 0,
  qt_peri: '',
  nebulizacao: 0,
  qt_neb: '',
  br_aedes: 0,
  qt_br: '',
  agente: '',
  recipientes: [],
})

var isLoading = false

var cFooter = ref({
  strSubmit: 'Voltar',
  strCancel: 'Cancelar',
  strAux: 'Recipientes',
  aux: false,
})

const rules = {
  ordem: { required$, numeric$ },
  casa: { maxLength: maxLength$(40) },
  id_situacao: { required$, minValue: combo$(1) },
  qt_focal: { decimal$ },
  qt_peri: { decimal$ },
  qt_neb: { decimal$ },
  qt_br: { decimal$ },
  latitude: { coordenada$ },
  longitude: { coordenada$ },
}

const v$ = useValidate(rules, imovel)

async function recipientes() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setVisita({ ...imovel })
    router.push({ name: 'recipientesVc', query: { from: 'imovel' } })
  }
}

function insert() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    if (imovel.id != 0) {
      const index = colImoveis.value.findIndex((item) => item.id === imovel.id)
      if (index !== -1) {
        colImoveis.value[index] = { ...imovel }
      }
    } else {
      imovel.id = generateId()
      colImoveis.value.push({ ...imovel })
      store.addImovel({ ...imovel })
    }
    limpar()
  }
}

function limpar() {
  let vazio = {
    id: 0,
    id_imovel: 0,
    ordem: imovel.ordem + 1,
    casa: '',
    latitude: '',
    longitude: '',
    id_situacao: 0,
    mecanico: 0,
    alternativo: 0,
    focal: 0,
    qt_focal: '',
    perifocal: 0,
    qt_peri: '',
    nebulizacao: 0,
    qt_neb: '',
    br_aedes: 0,
    qt_br: '',
    agente: '',
    recipientes: [],
  }
  Object.assign(imovel, vazio)
}

const readyToGo = computed(() => {
  return Array.isArray(store.objetoFolha?.imoveis) && store.objetoFolha.imoveis.length > 0
})

function onEditRow(item) {
  const row = colImoveis.value.find((a) => a.id === Number(item.row.id))

  //let row = colImoveis.value.splice(item.index, 1)
  Object.assign(imovel, row)
}

function onDeleteRow(item) {
  colImoveis.value.splice(item.index, 1)
}

function onRecipiente(item) {
  router.push({ name: 'recipientesVc', params: { idImovel: item.row.id } })
}

async function save() {
  store.updateImoveis(colImoveis.value)
  router.push({ name: 'vigLinha', query: { returnFrom: 'imovel' } })
}

function voltar() {
  router.push({ name: 'vigLinha', query: { returnFrom: 'imovel' } }) // params: { id: 0 }
}

async function loadCombos() {
  const result1 = await auxiliarService.getProdutoCombo(1)
  if (result1.error) {
    console.log(result1.error)
    prod_focais.value = []
  } else {
    prod_focais.value = result1
  }

  const result2 = await auxiliarService.getProdutoCombo(2)
  if (result2.error) {
    console.log(result2.error)
    prod_peris.value = []
  } else {
    prod_peris.value = result2
  }

  const result3 = await auxiliarService.getProdutoCombo(3)
  if (result3.error) {
    console.log(result3.error)
    prod_nebs.value = []
  } else {
    prod_nebs.value = result3
  }

  situacoes.value = [
    { id: 1, nome: 'Trabalhado' },
    { id: 2, nome: 'Fechado' },
    { id: 3, nome: 'Desocupado' },
    { id: 4, nome: 'Temporada' },
    { id: 5, nome: 'Parcial' },
    { id: 6, nome: 'Recusa' },
  ]

  controles.value = [
    { id: 1, nome: 'Mecânico' },
    { id: 2, nome: 'Alternativo' },
  ]
}

watch(
  () => imovel.id_situacao,
  (id) => {
    const item = situacoes.value.find((a) => a.id === Number(id))
    imovel.fant_sit = item?.nome || ''
  }
)

onMounted(async () => {
  Object.assign(colImoveis.value, JSON.parse(JSON.stringify(store.objetoFolha.imoveis)))

  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  columns.value = [
    { headerName: 'Ordem', field: 'ordem' },
    { headerName: 'Situação', field: 'fant_sit' },
  ]

  loadCombos()
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
