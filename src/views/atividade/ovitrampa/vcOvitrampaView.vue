<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Ovitrampa</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio
                  :tipo="99"
                  :sel="vc_ovitrampa.id_municipio"
                  @selTerr="vc_ovitrampa.id_municipio = $event"
                  :errclass="{ 'is-danger': v$.id_municipio.$error }"
                />
                <span class="is-error" v-if="v$.id_municipio.$error">
                  {{ v$.id_municipio.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="content">
              <label class="label">Ovitrampa</label>
              <div class="control">
                <CmbGeneric
                  :sel="vc_ovitrampa.id_ovitrampa"
                  :data="imoveis"
                  @selGen="vc_ovitrampa.id_ovitrampa = $event"
                  :errclass="{ 'is-danger': v$.id_ovitrampa.$error }"
                />
                <span class="is-error" v-if="v$.id_ovitrampa.$error">
                  {{ v$.id_ovitrampa.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="content">
              <fieldset class="fieldset">
                <legend>Execução</legend>
                <div class="field">
                  <RadioGeneric
                    v-model="vc_ovitrampa.id_execucao"
                    :options="execucoes"
                    name="id_execucao"
                    :inline="true"
                  />
                </div>
              </fieldset>
            </div>
            <div class="content">
              <div class="field">
                <label class="label">Data Instalação</label>
                <div class="control">
                  <DatePicker
                    v-model="vc_ovitrampa.dt_instala"
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
            <div class="content">
              <div class="field">
                <label class="label">Data Retirada</label>
                <div class="control">
                  <DatePicker
                    v-model="vc_ovitrampa.dt_retira"
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
            <div class="content">
              <fieldset class="fieldset">
                <legend>Local</legend>
                <div class="field">
                  <RadioGeneric
                    v-model="vc_ovitrampa.peri_intra"
                    :options="locais"
                    name="peri_intra"
                    :inline="true"
                  />
                </div>
              </fieldset>
            </div>
            <div class="content">
              <label class="label">Observação</label>
              <div class="control">
                <CmbGeneric
                  :sel="vc_ovitrampa.obs"
                  :data="obss"
                  @selGen="vc_ovitrampa.obs = $event"
                />
              </div>
            </div>
            <div class="content">
              <div class="field">
                <label class="label">Ovos</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Opcional"
                    v-model="vc_ovitrampa.ovos"
                  />
                </div>
              </div>
            </div>
            <div class="content">
              <div class="field">
                <label class="label">Agente</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Executor da visita"
                    v-model="vc_ovitrampa.agente"
                  />
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
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import vc_ovitrampaService from '@/services/atividade/vc_ovitrampa.service'
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

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

var execucoes = ref([])
var locais = ref([])
var obss = ref([])

var imoveis = ref([])

var id_prop = ref(0)

var vc_ovitrampa = reactive({
  id_vc_ovitrampa: 0,
  id_municipio: 0,
  dt_instala: '',
  dt_retira: '',
  id_execucao: 0,
  obs: 0,
  id_ovitrampa: 0,
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
  id_ovitrampa: { required$, minValue: combo$(1) },
  peri_intra: { required$ },
  ovos: { required$ },
  agente: { required$ },
}

const v$ = useValidate(rules, vc_ovitrampa)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await vc_ovitrampaService.update(vc_ovitrampa)
    } else {
      resultado = await vc_ovitrampaService.create(vc_ovitrampa)
    }

    if (resultado.status) {
      vc_ovitrampa.id_vc_ovitrampa = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

watch(
  () => vc_ovitrampa.id_municipio,
  async (val) => {
    const filter = { id_municipio: val }
    const result = await ovitrampaService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  }
)

const isEditMode = computed(() => Number(vc_ovitrampa.id_vc_ovitrampa) > 0)

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
    const result = await vc_ovitrampaService.getVcOvitrampa(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(vc_ovitrampa, result)
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
