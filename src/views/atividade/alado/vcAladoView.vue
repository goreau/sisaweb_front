<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Captura de Alados</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="vc_alado.id_municipio"
                      @selTerr="vc_alado.id_municipio = $event"
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
                      v-model="vc_alado.dt_cadastro"
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
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_alado.ref_ativ"
                        :options="tipos"
                        name="ref_ativ"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
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
                        v-model="vc_alado.id_atividade"
                        :options="atividades"
                        name="id_atividade"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_alado.id_execucao"
                        :options="execucoes"
                        name="id_execucao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <section v-if="vc_alado.ref_ativ == 4">
              <div class="columns">
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_alado.id_area"
                        :data="areas"
                        @selGen="vc_alado.id_area = $event"
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
                        :sel="vc_alado.id_censitario"
                        :data="censitarios"
                        @selGen="vc_alado.id_censitario = $event"
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
                        :sel="vc_alado.id_quarteirao"
                        :data="quarteiraos"
                        @selGen="vc_alado.id_quarteirao = $event"
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
            <div class="columns">
              <div class="column is-4 is-offset-4">
                <div class="field">
                  <label class="label">Agente</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Executor da visita"
                      v-model="vc_alado.agente"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {{ isEditMode }}
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
import vc_aladoService from '@/services/atividade/vc_alado.service'
import auxiliarService from '@/services/general/auxiliar.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$, requiredIf$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useVcAladoStore } from '@/stores/vcAladoStore'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const { currentUser } = useCurrentUser()
const store = useVcAladoStore()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var id_prop = ref(0)

var vc_alado = reactive({
  id_vc_alado: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_atividade: 0,
  id_execucao: 0,
  ref_ativ: 0,
  id_quarteirao: 0,
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
  id_area: { requiredIf: requiredIf$(vc_alado.ref_ativ == 4) },
  id_censitario: { requiredIf: requiredIf$(vc_alado.ref_ativ == 4) },
  id_quarteirao: { requiredIf: requiredIf$(vc_alado.ref_ativ == 4) },
  ref_ativ: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  agente: { required$ },
}

const v$ = useValidate(rules, vc_alado)

async function imoveis() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setFolha({ ...vc_alado })
    router.push({ name: 'imAlado', query: { from: 'vc_alado' } })
  }
}

const readyToGo = computed(() => {
  return Array.isArray(store.objetoAlado?.imoveis) && store.objetoAlado.imoveis.length > 0
})

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await vc_aladoService.update(vc_alado)
    } else {
      resultado = await vc_aladoService.create(vc_alado)
    }

    if (resultado.status) {
      vc_alado.id_vc_alado = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

watch(
  () => vc_alado.ref_ativ,
  async (val) => {
    let at = val == 10 ? 1 : 4
    const result = await auxiliarService.getAtividadeCombo(at)
    if (result.error) {
      atividades.value = []
    } else {
      atividades.value = result
    }
  }
)

const isEditMode = computed(() => Number(vc_alado.id_alado) > 0)

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos.value = [
    { id: 10, nome: 'Imóveis Cadastrados' },
    { id: 9, nome: 'Outras Atividades' },
  ]
}

watch(
  () => vc_alado.id_municipio,
  async (val) => {
    if (vc_alado.ref_ativ == 1) return
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
  () => vc_alado.id_area,
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
  () => vc_alado.id_censitario,
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

onMounted(async () => {
  if (route.query.returnFrom === 'imoveis' || route.query.from === 'edit') {
    //console.log(store.objetoAlado)
    //readyToGo.value = true
    Object.assign(vc_alado, JSON.parse(JSON.stringify(store.objetoAlado)))
  } else {
    vc_alado.ref_ativ = 1
    store.setFolha({})
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
