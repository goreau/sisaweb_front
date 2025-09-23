<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">BRI</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="vc_bri.id_municipio"
                      @selTerr="vc_bri.id_municipio = $event"
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
                      v-model="vc_bri.dt_cadastro"
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
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_bri.id_execucao"
                        :options="execucoes"
                        name="id_execucao"
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
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="vc_bri.id_area"
                      :data="areas"
                      @selGen="vc_bri.id_area = $event"
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
                      :sel="vc_bri.id_censitario"
                      :data="censitarios"
                      @selGen="vc_bri.id_censitario = $event"
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
                      :sel="vc_bri.id_quarteirao"
                      :data="quarteiraos"
                      @selGen="vc_bri.id_quarteirao = $event"
                      :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                    />
                    <span class="is-error" v-if="v$.id_quarteirao.$error">
                      {{ v$.id_quarteirao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_bri.situacao"
                        :options="tipos"
                        name="situacao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4">
                <div class="field">
                  <label class="label">Dupla</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Executores da atividade"
                      v-model="vc_bri.agente"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Equipamento</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Nº do patrimônio"
                      v-model="vc_bri.patrimonio"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Vazão média</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Vazão do equipamento"
                      v-model="vc_bri.vazao"
                    />
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
import vc_briService from '@/services/atividade/vc_bri.service'
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
import { useVcBriStore } from '@/stores/vcBriStore'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const { currentUser } = useCurrentUser()
const store = useVcBriStore()

var execucoes = ref([])
var tipos = ref([])

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var id_prop = ref(0)

var vc_bri = reactive({
  id_bri: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_area: 0,
  id_censitario: 0,
  id_execucao: 0,
  situacao: 0,
  id_quarteirao: 0,
  agente: '',
  patrimonio: '',
  vazao: 0,
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
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  situacao: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  agente: { required$ },
  patrimonio: { required$ },
  vazao: { required$ },
}

const v$ = useValidate(rules, vc_bri)

async function imoveis() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setFolha({ ...vc_bri })
    router.push({ name: 'imBri', query: { from: 'vc_bri' } })
  }
}

const readyToGo = computed(() => {
  return Array.isArray(store.objetoBri?.imoveis) && store.objetoBri.imoveis.length > 0
})

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await vc_briService.update(vc_bri)
    } else {
      resultado = await vc_briService.create(vc_bri)
    }

    if (resultado.status) {
      vc_bri.id_bri = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(vc_bri.id_bri) > 0)

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos.value = [
    { id: 1, nome: 'Rotina' },
    { id: 2, nome: 'Pendência' },
  ]
}

watch(
  () => vc_bri.id_municipio,
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
  () => vc_bri.id_area,
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
  () => vc_bri.id_censitario,
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
    console.log(store.objetoBri)
    readyToGo.value = true
    Object.assign(vc_bri, JSON.parse(JSON.stringify(store.objetoBri)))
  } else {
    vc_bri.ref_ativ = 1
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
