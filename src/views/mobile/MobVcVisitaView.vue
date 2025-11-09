<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-8">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Visita a imóveis</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      v-enter-to-next="'form-mob-vc'"
                      v-model:sel="vc_linha.id_municipio"
                      :tipo="99"
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
                      v-enter-to-next="'form-mob-vc'"
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
              <div class="column">
                <div class="field">
                  <label class="label">Imóvel</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Ordem"
                      v-model="vc_linha.imovel"
                    />
                    <span class="is-error" v-if="v$.imovel.$error">
                      {{ v$.imovel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label class="label">Casa</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Número da Casa"
                      v-model="vc_linha.casa"
                    />
                    <span class="is-error" v-if="v$.casa.$error">
                      {{ v$.casa.$errors[0].$message }}
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
                        v-enter-to-next="'form-mob-vc'"
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
                        v-enter-to-next="'form-mob-vc'"
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
                        v-enter-to-next="'form-mob-vc'"
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
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-mob-vc'"
                      v-model:sel="vc_linha.id_area"
                      :data="areas"
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
                      v-enter-to-next="'form-mob-vc'"
                      v-model:sel="vc_linha.id_censitario"
                      :data="censitarios"
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
                      v-enter-to-next="'form-mob-vc'"
                      v-model:sel="vc_linha.id_quarteirao"
                      :data="quarteiraos"
                      :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                    />
                    <span class="is-error" v-if="v$.id_quarteirao.$error">
                      {{ v$.id_quarteirao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="columns">
              <div class="column is-8">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Situação</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-mob-vc'"
                        v-model="vc_linha.id_situacao"
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
                        <input
                          type="checkbox"
                          value="1"
                          v-model="vc_linha.mecanico"
                          v-enter-to-next="'form-mob-vc'"
                        />
                        Mecânico
                      </label>
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          value="1"
                          v-model="vc_linha.alternativo"
                          v-enter-to-next="'form-mob-vc'"
                        />
                        Alternativo
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column is-6">
                <fieldset class="fieldset">
                  <legend>Tratamento Focal</legend>
                  <div class="columns">
                    <div class="column is-4">
                      <label>&nbsp;</label>
                      <div class="field">
                        <label class="checkbox">
                          <input
                            type="checkbox"
                            value="1"
                            v-model="vc_linha.focal"
                            v-enter-to-next="'form-mob-vc'"
                          />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            v-enter-to-next="'form-mob-vc'"
                            v-model:sel="vc_linha.id_prod_focal"
                            :data="prod_focais"
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
                            v-enter-to-next="'form-mob-vc'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_focal"
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
                          <input
                            type="checkbox"
                            value="1"
                            v-model="vc_linha.perifocal"
                            v-enter-to-next="'form-mob-vc'"
                          />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            v-enter-to-next="'form-mob-vc'"
                            v-model:sel="vc_linha.id_prod_peri"
                            :data="prod_peris"
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
                            v-enter-to-next="'form-mob-vc'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_peri"
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
                          <input
                            type="checkbox"
                            value="1"
                            v-model="vc_linha.nebulizacao"
                            v-enter-to-next="'form-mob-vc'"
                          />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            v-enter-to-next="'form-mob-vc'"
                            v-model:sel="vc_linha.id_prod_neb"
                            :data="prod_nebs"
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
                            v-enter-to-next="'form-mob-vc'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_neb"
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
                          <input
                            type="checkbox"
                            value="1"
                            v-model="vc_linha.br_aedes"
                            v-enter-to-next="'form-mob-vc'"
                          />
                          Tratado
                        </label>
                      </div>
                    </div>
                    <div class="column is-4">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            v-enter-to-next="'form-mob-vc'"
                            v-model:sel="vc_linha.id_prod_br"
                            :data="prod_peris"
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
                            v-enter-to-next="'form-mob-vc'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_br"
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
                      v-enter-to-next="'form-mob-vc'"
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
              v-enter-to-next="'submit-action'"
              @submit="save"
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
import mobFolhaService from '@/services/mobile/mobVc_folha.service'
import auxiliarService from '@/services/general/auxiliar.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useMobileStore } from '@/stores/mobileStore'
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
const store = useMobileStore()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])
var situacoes = ref([])
var controles = ref([])
var prod_focais = ref([])
var prod_peris = ref([])
var prod_nebs = ref([])

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var id_prop = ref(0)

var vc_linha = reactive({
  id: 0,
  id_mob_vc_folha: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_atividade: 0,
  id_execucao: 0,
  id_situacao: 0,
  mecanico: 0,
  alternativo: 0,
  id_tipo: 0,
  id_area: 0,
  id_censitario: 0,
  id_quarteirao: 0,
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
  imovel: '',
  casa: '',
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
  id_tipo: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_situacao: { required$, minValue: combo$(1) },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  id_prod_focal: { required$, minValue: combo$(1) },
  id_prod_peri: { required$, minValue: combo$(1) },
  id_prod_neb: { required$, minValue: combo$(1) },
  id_prod_br: { required$, minValue: combo$(1) },
  agente: { required$ },
  imovel: { required$ },
  casa: { required$ },
}

const v$ = useValidate(rules, vc_linha)

async function recipientes() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setVisita({ ...vc_linha })
    router.push({ name: 'mobRecipiente', query: { from: 'mob_vc_folha' } })
  }
}

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await mobFolhaService.update(vc_linha)
    } else {
      resultado = await mobFolhaService.create(vc_linha)
    }

    if (resultado.status) {
      vc_linha.id_mob_vc_folha = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(vc_linha.id_mob_vc_folha) > 0)

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
  },
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
  },
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
  },
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
  () => vc_linha.id_prod_focal,
  (val) => (defValues.prodFocal = val),
)
watch(
  () => vc_linha.id_prod_peri,
  (val) => (defValues.prodPeri = val),
)
watch(
  () => vc_linha.id_prod_neb,
  (val) => (defValues.prodNeb = val),
)
watch(
  () => vc_linha.id_prod_br,
  (val) => (defValues.prodBr = val),
)

onMounted(async () => {
  if (route.query.returnFrom === 'recipiente' || route.query.from === 'edit') {
    console.log(store.visita)
    store.visita.id_municipio = Number(store.visita.id_municipio)
    Object.assign(vc_linha, JSON.parse(JSON.stringify(store.visita)))
  } else {
    store.setVisita({})
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
