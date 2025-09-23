<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-8">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Cadastro de Visita: Visita a imóveis</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="vc_linha.id_municipio"
                      @selTerr="vc_linha.id_municipio = $event"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label">Data</label>
                  <div class="control">
                    <DatePicker
                      v-model="vc_linha.dt_cadastro"
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
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Atividade</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_linha.id_atividade"
                        :options="atividades"
                        name="id_atividade"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                  <span class="is-error" v-if="v$.id_atividade.$error">
                    {{ v$.id_atividade.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_linha.id_execucao"
                        :options="execucoes"
                        name="id_execucao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                  <span class="is-error" v-if="v$.id_execucao.$error">
                    {{ v$.id_execucao.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo de Trabalho</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_linha.id_tipo"
                        :options="tipos"
                        name="id_tipo"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                  <span class="is-error" v-if="v$.id_tipo.$error">
                    {{ v$.id_tipo.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
            <section v-show="!navs">
              <div class="columns">
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_area"
                        :data="areas"
                        @selGen="vc_linha.id_area = $event"
                        :errclass="{ 'is-danger': v$.id_area.$error }"
                      />
                      <span class="is-error" v-if="v$.id_area.$error">
                        {{ v$.id_area.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Censitário</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_censitario"
                        :data="censitarios"
                        @selGen="vc_linha.id_censitario = $event"
                        :errclass="{ 'is-danger': v$.id_censitario.$error }"
                      />
                      <span class="is-error" v-if="v$.id_censitario.$error">
                        {{ v$.id_censitario.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Quarteirão</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_quarteirao"
                        :data="quarteiraos"
                        @selGen="vc_linha.id_quarteirao = $event"
                        :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                      />
                      <span class="is-error" v-if="v$.id_quarteirao.$error">
                        {{ v$.id_quarteirao.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section v-show="navs">
              <div class="columns">
                <div class="column is-6">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_area_nav"
                        :data="areas_nav"
                        @selGen="vc_linha.id_area_nav = $event"
                        :errclass="{ 'is-danger': v$.id_area_nav.$error }"
                      />
                      <span class="is-error" v-if="v$.id_area_nav.$error">
                        {{ v$.id_area_nav.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="column is-4">
                  <div class="content">
                    <label class="label">Quarteirão</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_quarteirao"
                        :data="quarteiraos"
                        @selGen="vc_linha.id_quarteirao = $event"
                        :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                      />
                      <span class="is-error" v-if="v$.id_quarteirao.$error">
                        {{ v$.id_quarteirao.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <hr />
            <div class="columns">
              <div class="column">
                <fieldset class="fieldset">
                  <legend>Produtos em Uso</legend>
                  <div class="columns">
                    <div class="column is-3">
                      <div class="content">
                        <label class="label">Focal</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_focal"
                            :data="prod_focais"
                            @selGen="vc_linha.id_prod_focal = $event"
                            :errclass="{ 'is-danger': v$.id_prod_focal.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_focal.$error">
                            {{ v$.id_prod_focal.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-3">
                      <div class="content">
                        <label class="label">Perifocal</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_peri"
                            :data="prod_peris"
                            @selGen="vc_linha.id_prod_peri = $event"
                            :errclass="{ 'is-danger': v$.id_prod_peri.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_peri.$error">
                            {{ v$.id_prod_peri.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-3">
                      <div class="content">
                        <label class="label">Nebulizacao</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_neb"
                            :data="prod_nebs"
                            @selGen="vc_linha.id_prod_neb = $event"
                            :errclass="{ 'is-danger': v$.id_prod_neb.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_neb.$error">
                            {{ v$.id_prod_neb.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-3">
                      <div class="content">
                        <label class="label">BR Aedes</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_br"
                            :data="prod_peris"
                            @selGen="vc_linha.id_prod_br = $event"
                            :errclass="{ 'is-danger': v$.id_prod_br.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_br.$error">
                            {{ v$.id_prod_br.$errors[0].$message }}
                          </span>
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
                      v-model="vc_linha.agente"
                    />
                    <span class="is-error" v-if="v$.agente.$error">
                      {{ v$.agente.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard
              @submit="save"
              :ready="readyToGo"
              @cancel="null"
              @aux="imoveis"
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
import vc_linhaService from '@/services/atividade/vc_linha.service'
import auxiliarService from '@/services/general/auxiliar.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import areaNavService from '@/services/cadastro/areaNav.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$, requiredIf$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useVcVisitaStore } from '@/stores/vcVisitaStore'
import { useDefautValues } from '@/composables/defaultValues'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { generateId } from '@/utils/myUtils'

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
const store = useVcVisitaStore()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])
var prod_focais = ref([])
var prod_peris = ref([])
var prod_nebs = ref([])

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var areas_nav = ref([])
var navs = ref(false)

var id_prop = ref(0)

var vc_linha = reactive({
  id: 0,
  id_vc_linha: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_atividade: 0,
  id_execucao: 0,
  id_tipo: 0,
  id_area: 0,
  id_censitario: 0,
  id_quarteirao: 0,
  id_area_nav: 0,
  id_prod_focal: 0,
  id_prod_peri: 0,
  id_prod_neb: 0,
  id_prod_br: 0,
  agente: '',
  imoveis: [],
})

var isLoading = false

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: 'Imóveis',
  aux: true,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_cadastro: { required$ },
  id_tipo: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_area_nav: { requiredIf: requiredIf$(() => navs.value === true) },
  id_area: { requiredIf: requiredIf$(() => navs.value === false) },
  id_censitario: { requiredIf: requiredIf$(() => navs.value === false) },
  id_quarteirao: { required$, minValue: combo$(1) },
  id_prod_focal: { required$, minValue: combo$(1) },
  id_prod_peri: { required$, minValue: combo$(1) },
  id_prod_neb: { required$, minValue: combo$(1) },
  id_prod_br: { required$, minValue: combo$(1) },
  agente: { required$ },
}

const v$ = useValidate(rules, vc_linha)

const filtro = computed(() => [vc_linha.id_atividade, vc_linha.id_municipio])

watch(filtro, async ([novo1, novo2]) => {
  if (novo1 && novo2) {
    if (novo1 == 6 || novo1 == 7) {
      navs.value = true
      const resultado = await areaNavService.getCombo(JSON.stringify({ id_municipio: novo2 }))
      if (resultado.error) {
        areas_nav.value = []
      } else {
        areas_nav.value = await resultado
      }
    } else {
      navs.value = false
    }
  } else if (novo1) {
    navs.value = novo1 == 6 || novo1 == 7
  } else {
    areas_nav.value = []
  }
})

async function imoveis() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    vc_linha.id = generateId()
    store.setFolha({ ...vc_linha })
    router.push({ name: 'vigImoveis', query: { from: 'vc_linha' } })
  }
}

const readyToGo = computed(() => {
  return Array.isArray(store.objetoFolha?.imoveis) && store.objetoFolha.imoveis.length > 0
})

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await vc_linhaService.update(vc_linha)
    } else {
      resultado = await vc_linhaService.create(vc_linha)
    }

    if (resultado.status) {
      vc_linha.id_vc_linha = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(vc_linha.id_vc_folha) > 0)

watch(
  () => vc_linha.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  }
)

watch(
  () => vc_linha.id_area,
  async (val) => {
    const result = await censitarioService.getCombo(JSON.stringify({ id_area: val }))
    if (result.error) {
      console.log(result.error)
      censitarios.value = []
    } else {
      censitarios.value = result
    }
  }
)

watch(
  () => vc_linha.id_censitario,
  async (val) => {
    const result = await quarteiraoService.getCombo(JSON.stringify({ id_censitario: val }))
    if (result.error) {
      console.log(result.error)
      quarteiraos.value = []
    } else {
      quarteiraos.value = result
    }
  }
)

watch(
  () => vc_linha.id_area_nav,
  async (val) => {
    const result = await areaNavService.getComboQuart(val)
    if (result.error) {
      console.log(result.error)
      quarteiraos.value = []
    } else {
      quarteiraos.value = result
    }
  }
)

async function loadCombos() {
  const result = await auxiliarService.getAtividadeCombo(2)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }

  const result0 = await auxiliarService.getAtividadeCombo(3)
  if (result0.error) {
    console.log(result0.error)
  } else {
    atividades.value = [...atividades.value, ...result0]
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
}

watch(
  () => vc_linha.id_prod_focal,
  (val) => (defValues.prodFocal = val)
)
watch(
  () => vc_linha.id_prod_peri,
  (val) => (defValues.prodPeri = val)
)
watch(
  () => vc_linha.id_prod_neb,
  (val) => (defValues.prodNeb = val)
)
watch(
  () => vc_linha.id_prod_br,
  (val) => (defValues.prodBr = val)
)

onMounted(async () => {
  if (route.query.returnFrom === 'imovel' || route.query.from === 'edit') {
    Object.assign(vc_linha, JSON.parse(JSON.stringify(store.objetoFolha)))
  } else {
    store.setFolha({})
    vc_linha.id_prod_focal = defValues.prodFocal
    vc_linha.id_prod_peri = defValues.prodPeri
    vc_linha.id_prod_neb = defValues.prodNeb
    vc_linha.id_prod_br = defValues.prodBr
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
