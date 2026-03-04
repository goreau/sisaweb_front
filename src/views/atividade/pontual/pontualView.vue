<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-four-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Atividades Pontuais</p>
          </header>
          <div class="card-content">
            <p class="divisor">Origem da Atividade</p>
            <div class="columns">
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo de Atividade</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-ovi'"
                        v-model="pontual.tipo"
                        :options="tipos"
                        name="tipo"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      v-enter-to-next="'form-ovi'"
                      :tipo="99"
                      v-model:sel="pontual.id_municipio"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <fieldset class="fieldset">
              <legend>Imóvel Referência</legend>
              <div class="columns">
                <div class="column">
                  <div class="content">
                    <label class="label">{{ strTipo }}</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-ovi'"
                        v-model:sel="pontual.id_imovel"
                        :data="imoveis"
                      />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="content">
                    <label class="label">Data Pesquisa</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-ovi'"
                        v-model:sel="pontual.id_visita"
                        :data="visitas"
                        :errclass="{ 'is-danger': v$.id_visita.$error }"
                      />
                      <span class="is-error" v-if="v$.id_visita.$error">
                        {{ v$.id_visita.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <hr />
            <p class="divisor">Atividade Executada</p>
            <section v-show="!navs">
              <div class="columns">
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-vc'"
                        v-model:sel="pontual.id_area"
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
                        v-enter-to-next="'form-vc'"
                        v-model:sel="pontual.id_censitario"
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
                        v-enter-to-next="'form-vc'"
                        v-model:sel="pontual.id_quarteirao"
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
            </section>
            <div class="columns">
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-ovi'"
                        v-model="pontual.id_execucao"
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
                  <div class="field">
                    <label class="label">Data</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-ovi'"
                        v-model="pontual.dt_cadastro"
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
            </div>
            <div class="columns">
              <div class="column">
                <div class="content">
                  <div class="field">
                    <label class="label">Trabalhados</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-ovi'"
                        class="input"
                        type="text"
                        placeholder="Nº Imóveis"
                        v-model="pontual.trabalhado"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <div class="field">
                    <label class="label">Pendentes</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-ovi'"
                        class="input"
                        type="text"
                        placeholder="Nº Imóveis"
                        v-model="pontual.pendente"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="field">
                <label class="label">Agente</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-ovi'"
                    class="input"
                    type="text"
                    placeholder="Executor da visita"
                    v-model="pontual.agente"
                  />
                </div>
              </div>
            </div>

            <footer class="card-footer">
              <footerCard
                v-enter-to-next="'submit-action'"
                @submit="save"
                @cancel="null"
                @aux="null"
                :cFooter="cFooter"
              />
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import ovitrampaService from '@/services/cadastro/ovitrampa.service'
import pontualService from '@/services/atividade/pontual.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import edlCadastroService from '@/services/cadastro/edlCadastro.service'

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

var execucoes = ref([])

var imoveis = ref([])
var visitas = ref([])
var tipos = ref([])
var strTipo = ref('')

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var id_prop = ref(0)

var pontual = reactive({
  id_pontual: 0,
  tipo: 0,
  id_imovel: 0,
  id_visita: 0,
  id_municipio: 0,
  id_area: 0,
  id_censitario: 0,
  id_quarteirao: 0,
  dt_cadastro: '',
  id_execucao: 0,
  trabalhado: 0,
  pendente: 0,
  agente: '',
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_cadastro: { required$ },
  id_execucao: { required$, minValue: combo$(1) },
  id_visita: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  id_area: { required$ },
  id_censitario: { required$ },
  pendente: { required$ },
  trabalhado: { required$ },
  agente: { required$ },
}

const v$ = useValidate(rules, pontual)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await pontualService.update(pontual)
    } else {
      resultado = await pontualService.create(pontual)
    }

    if (resultado.status) {
      pontual.id_pontual = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

async function loadImoveis() {
  if (pontual.tipo == 0 || pontual.id_municipio == 0) return
  const filter = { id_municipio: pontual.id_municipio }
  if (pontual.tipo == 4) {
    strTipo.value = 'Ovitrampas'
    const result = await ovitrampaService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  } else if (pontual.tipo == 16) {
    strTipo.value = 'EDLs'
    const result = await edlCadastroService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  }
}

watch(
  () => pontual.tipo,
  async (val) => {
    loadImoveis()
  },
)

watch(
  () => pontual.id_municipio,
  async (val) => {
    const result2 = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result2.error) {
      console.log(result2.error)
      areas.value = []
    } else {
      areas.value = result2
    }

    loadImoveis()
  },
)

watch(
  () => pontual.id_imovel,
  async (val) => {
    const filter = { id_imovel: val, tipo: pontual.tipo }
    const result = await pontualService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      visitas.value = []
    } else {
      visitas.value = result
    }
  },
)

watch(
  () => pontual.id_area,
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
  () => pontual.id_censitario,
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

const isEditMode = computed(() => Number(pontual.id_vc_ovitrampa) > 0)

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos.value = [
    { id: 4, nome: 'Ovitrampa' },
    { id: 16, nome: 'EDL' },
  ]
}

onMounted(async () => {
  if (route.params.id > 0) {
    const result = await pontualService.getPontual(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(pontual, result)
    }
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
.card-content {
  margin: 0 3rem;
}
</style>
