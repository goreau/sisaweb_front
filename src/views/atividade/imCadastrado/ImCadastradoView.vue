<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Cadastro de Visita: Imóvel Cadastrado</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="vc_imovel.id_municipio"
                      @selTerr="vc_imovel.id_municipio = $event"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Data</label>
                  <div class="control">
                    <DatePicker
                      v-model="vc_imovel.dt_cadastro"
                      :error="false"
                      placeholder="Escolha a data"
                      :class="{ 'is-danger': v$.dt_cadastro.$error }"
                    />
                    <span class="is-error" v-if="v$.dt_cadastro.$error">
                      {{ v$.dt_cadastro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Atividade</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_imovel.id_atividade"
                        :options="atividades"
                        name="id_atividade"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column is-3">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_imovel.id_execucao"
                        :options="execucoes"
                        name="id_execucao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo de Trabalho</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_imovel.id_tipo"
                        :options="tipos"
                        name="id_tipo"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Imóvel</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="vc_imovel.id_imovel"
                      :data="imoveis"
                      @selGen="vc_imovel.id_imovel = $event"
                      :errclass="{ 'is-danger': v$.id_imovel.$error }"
                    />
                    <span class="is-error" v-if="v$.id_imovel.$error">
                      {{ v$.id_imovel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Situação</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_imovel.id_situacao"
                        :options="situacoes"
                        name="id_situacao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column is-2">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Controle</legend>
                    <div class="field">
                      <label class="checkbox">
                        <input type="checkbox" value="1" v-model="vc_imovel.mecanico" />
                        Mecânico
                      </label>
                      <label class="checkbox">
                        <input type="checkbox" value="1" v-model="vc_imovel.alternativo" />
                        Alternativo
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <hr />
            <div class="columns">
              <div class="column is-6">
                <fieldset class="fieldset">
                  <legend>Tratamento Focal</legend>
                  <div class="columns">
                    <div class="column is-4">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="vc_imovel.focal" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_imovel.id_prod_focal"
                            :data="prod_focais"
                            @selGen="vc_imovel.id_prod_focal = $event"
                            :errclass="{ 'is-danger': v$.id_prod_focal.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_focal.$error">
                            {{ v$.id_prod_focal.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_imovel.qt_focal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-6">
                <fieldset class="fieldset">
                  <legend>Tratamento Perifocal</legend>
                  <div class="columns">
                    <div class="column is-4">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="vc_imovel.perifocal" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_imovel.id_prod_peri"
                            :data="prod_peris"
                            @selGen="vc_imovel.id_prod_peri = $event"
                            :errclass="{ 'is-danger': v$.id_prod_peri.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_peri.$error">
                            {{ v$.id_prod_peri.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_imovel.qt_peri"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <fieldset class="fieldset">
                  <legend>Nebulização</legend>
                  <div class="columns">
                    <div class="column is-4">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="vc_imovel.nebulizacao" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_imovel.id_prod_neb"
                            :data="prod_nebs"
                            @selGen="vc_imovel.id_prod_neb = $event"
                            :errclass="{ 'is-danger': v$.id_prod_neb.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_neb.$error">
                            {{ v$.id_prod_neb.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_imovel.qt_neb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-6">
                <fieldset class="fieldset">
                  <legend>BR Aedes</legend>
                  <div class="columns">
                    <div class="column is-4">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input type="checkbox" value="1" v-model="vc_imovel.br_aedes" />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_imovel.id_prod_br"
                            :data="prod_peris"
                            @selGen="vc_imovel.id_prod_br = $event"
                            :errclass="{ 'is-danger': v$.id_prod_br.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_br.$error">
                            {{ v$.id_prod_br.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_imovel.qt_br"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4 is-offset-4">
                <div class="field">
                  <label class="label">Agente</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Executor da visita"
                      v-model="vc_imovel.agente"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns is-centered">
              <div class="column is-narrow">
                <button class="button is-warning" @click="canSend">Sem Recipientes</button>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard
              @submit="save"
              :ready="readyToGo"
              @cancel="null"
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
import vc_imovelService from '@/services/atividade/vc_imovel.service'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import imovelService from '@/services/cadastro/imovel.service'
import { useVcImovelStore } from '@/stores/vcImovelStore'
import { useDefautValues } from '@/composables/defaultValues'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const { defValues } = useDefautValues('defaultValues', {
  prodFocal: 0,
  prodPeri: 0,
  prodNeb: 0,
  prodBr: 0,
})

const { currentUser } = useCurrentUser()
const store = useVcImovelStore()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])
var situacoes = ref([])
var controles = ref([])
var prod_focais = ref([])
var prod_peris = ref([])
var prod_nebs = ref([])

var imoveis = ref([])

var id_prop = ref(0)

var readyToGo = ref(false)

var vc_imovel = reactive({
  id_vc_imovel: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_atividade: 0,
  id_execucao: 0,
  id_tipo: 0,
  id_situacao: 0,
  id_imovel: 0,
  mecanico: 0,
  alternativo: 0,
  focal: 0,
  id_prod_focal: 0,
  qt_focal: '',
  perifocal: 0,
  id_prod_peri: 0,
  qt_peri: '',
  nebulizacao: 0,
  id_prod_neb: 0,
  qt_neb: '',
  br_aedes: 0,
  id_prod_br: 0,
  qt_br: '',
  agente: '',
  recipientes: [],
})

var isLoading = false

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: 'Recipientes',
  aux: true,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_cadastro: { required$ },
  id_situacao: { required$, minValue: combo$(1) },
  id_tipo: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_imovel: { required$, minValue: combo$(1) },
  id_prod_focal: { required$, minValue: combo$(1) },
  id_prod_peri: { required$, minValue: combo$(1) },
  id_prod_neb: { required$, minValue: combo$(1) },
  id_prod_br: { required$, minValue: combo$(1) },
  agente: { required$ },
}

const v$ = useValidate(rules, vc_imovel)

async function recipientes() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setVisita({ ...vc_imovel })
    router.push({ name: 'recipientes', query: { from: 'vc_imovel' } })
  }
}

function canSend() {
  readyToGo.value = true
}

/*const readyToGo = true  computed(() => {
  return Array.isArray(store.objetoPrincipal?.filhos) && store.objetoPrincipal.filhos.length > 0
})*/

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await vc_imovelService.update(vc_imovel)
    } else {
      resultado = await vc_imovelService.create(vc_imovel)
    }

    if (resultado.status) {
      vc_imovel.id_vc_imovel = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

watch(
  () => vc_imovel.id_atividade,
  async (val) => {
    if (vc_imovel.id_municipio == 0) return
    const filter = { id_municipio: vc_imovel.id_municipio, id_atividade: val }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  }
)

watch(
  () => vc_imovel.id_municipio,
  async (val) => {
    if (vc_imovel.id_atividade == 0) return
    const filter = { id_municipio: vc_imovel.id_municipio, id_atividade: val }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  }
)

const isEditMode = computed(() => Number(vc_imovel.id_vc_imovel) > 0)

async function loadCombos() {
  const result = await auxiliarService.getAtividadeCombo(1)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }

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

  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos.value = [
    { id: 1, nome: 'Rotina' },
    { id: 2, nome: 'Pendência' },
    { id: 3, nome: 'Demanda' },
  ]

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
  () => vc_imovel.id_prod_focal,
  (val) => (defValues.prodFocal = val)
)
watch(
  () => vc_imovel.id_prod_peri,
  (val) => (defValues.prodPeri = val)
)
watch(
  () => vc_imovel.id_prod_neb,
  (val) => (defValues.prodNeb = val)
)
watch(
  () => vc_imovel.id_prod_br,
  (val) => (defValues.prodBr = val)
)

onMounted(async () => {
  if (route.query.returnFrom === 'recipiente' || route.query.from === 'edit') {
    readyToGo.value = true
    Object.assign(vc_imovel, JSON.parse(JSON.stringify(store.visita)))
  } else {
    store.setVisita({})
    vc_imovel.id_prod_focal = defValues.prodFocal
    vc_imovel.id_prod_peri = defValues.prodPeri
    vc_imovel.id_prod_neb = defValues.prodNeb
    vc_imovel.id_prod_br = defValues.prodBr
  }

  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  loadCombos()
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
