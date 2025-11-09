<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Ovitrampa</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      v-enter-to-next="'form-ovi'"
                      :tipo="99"
                      v-model:sel="ot_ovitrampa.id_municipio"
                      @selTerr="ot_ovitrampa.id_municipio = $event"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-ovi'"
                        v-model="ot_ovitrampa.id_execucao"
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
                      v-enter-to-next="'form-ovi'"
                      v-model:sel="ot_ovitrampa.id_area"
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
                      v-enter-to-next="'form-ovi'"
                      v-model:sel="ot_ovitrampa.id_censitario"
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
                      v-enter-to-next="'form-ovi'"
                      v-model:sel="ot_ovitrampa.id_quarteirao"
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
            <div class="columns">
              <div class="column">
                <div class="content">
                  <div class="field">
                    <label class="label">Data Instalação</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-ovi'"
                        v-model="ot_ovitrampa.dt_instala"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_instala.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_instala.$error">
                        {{ v$.dt_instala.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <div class="field">
                    <label class="label">Data Retirada</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-ovi'"
                        v-model="ot_ovitrampa.dt_retira"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_retira.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_retira.$error">
                        {{ v$.dt_retira.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Local</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-ovi'"
                        v-model="ot_ovitrampa.peri_intra"
                        :options="locais"
                        name="peri_intra"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Local</legend>
                    <div class="field">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          value="1"
                          v-model="ot_ovitrampa.positiva"
                          v-enter-to-next="'form-ovi'"
                        />
                        Positiva
                      </label>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-8">
                <div class="content">
                  <label class="label">Observação</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-ovi'"
                      v-model:sel="ot_ovitrampa.obs"
                      :data="obss"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <div class="field">
                    <label class="label">Ovos</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-ovi'"
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="ot_ovitrampa.ovos"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <div class="content">
                  <div class="field">
                    <label class="label">Agente</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-ovi'"
                        class="input"
                        type="text"
                        placeholder="Executor da visita"
                        v-model="ot_ovitrampa.agente"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <footerCard
                v-enter-to-next="'submit-action'"
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
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import ot_ovitrampaService from '@/services/atividade/ot_ovitrampa.service'
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
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

var execucoes = ref([])
var locais = ref([])
var obss = ref([])

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var id_prop = ref(0)

var ot_ovitrampa = reactive({
  id_ot_ovitrampa: 0,
  id_municipio: 0,
  dt_instala: '',
  dt_retira: '',
  id_execucao: 0,
  obs: 0,
  id_area: 0,
  id_censitario: 0,
  id_quarteirao: 0,
  positiva: false,
  ovos: 0,
  peri_intra: 0,
  agente: '',
})

var isLoading = false

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_instala: { required$ },
  dt_retira: { required$ },
  id_execucao: { required$, minValue: combo$(1) },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  peri_intra: { required$ },
  ovos: { required$ },
  agente: { required$ },
}

const v$ = useValidate(rules, ot_ovitrampa)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await ot_ovitrampaService.update(ot_ovitrampa)
    } else {
      resultado = await ot_ovitrampaService.create(ot_ovitrampa)
    }

    if (resultado.status) {
      ot_ovitrampa.id_ot_ovitrampa = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

watch(
  () => ot_ovitrampa.id_municipio,
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
  () => ot_ovitrampa.id_area,
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
  () => ot_ovitrampa.id_censitario,
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

const isEditMode = computed(() => Number(ot_ovitrampa.id_ot_ovitrampa) > 0)

async function loadCombos() {
  obss.value = [
    { id: 0, nome: '--Selecione--' },
    { id: 1, nome: 'Intervalo acima 7 dias' },
    { id: 2, nome: 'Ovitrampa ou palheta desaparecidas' },
    { id: 3, nome: 'Ovitrampa ou palheta danificadas' },
    { id: 4, nome: 'Ovitrampa seca' },
    { id: 5, nome: 'Casa fechada' },
    { id: 6, nome: 'Ovitrampa cheia d`água' },
    { id: 7, nome: 'Ovitrampa pouca água' },
  ]

  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  locais.value = [
    { id: 1, nome: 'Peri' },
    { id: 2, nome: 'Intra' },
  ]
}

onMounted(async () => {
  if (route.params.id > 0) {
    const result = await ot_ovitrampaService.getOtOvitrampa(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(ot_ovitrampa, result)
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
