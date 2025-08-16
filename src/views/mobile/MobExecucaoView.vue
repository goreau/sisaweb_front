<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-6">
        <MyLoader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Alterar execução</p>
          </header>
          <div class="card-content">
            <fieldset class="fieldset">
              <legend>Procurar Atividade</legend>
              <div class="content">
                <label class="label">Município</label>
                <div class="control">
                  <CmbTerritorio
                    :tipo="99"
                    :sel="mobile.id_municipio"
                    @selTerr="mobile.id_municipio = $event"
                    :errclass="{ 'is-danger': vp$.id_municipio.$error }"
                  />
                  <span class="is-error" v-if="vp$.id_municipio.$error">
                    {{ vp$.id_municipio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Data Início</label>
                    <div class="control">
                      <DatePicker
                        v-model="mobile.dt_inicio"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': vp$.dt_inicio.$error }"
                      />
                      <span class="is-error" v-if="vp$.dt_inicio.$error">
                        {{ vp$.dt_inicio.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Data Término</label>
                    <div class="control">
                      <DatePicker
                        v-model="mobile.dt_final"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': vp$.dt_final.$error }"
                      />
                      <span class="is-error" v-if="vp$.dt_final.$error">
                        {{ vp$.dt_final.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="content">
                <fieldset class="fieldset">
                  <legend>Origem dos registros</legend>
                  <div class="field">
                    <RadioGeneric
                      v-model="mobile.origem"
                      :options="origems"
                      name="origem"
                      :inline="true"
                    />
                  </div>
                </fieldset>
                <span class="is-error" v-if="vp$.origem.$error">
                  {{ vp$.origem.$errors[0].$message }}
                </span>
              </div>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button class="button is-link aux-btn is-fullwidth" @click="pesquisar">
                    Procurar
                  </button>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset" v-show="hasTroca">
              <legend>Correção</legend>
              <div class="content">
                <label class="label">Agente</label>
                <div class="control">
                  <CmbGeneric
                    :data="agentes"
                    @selGen="mobile.agente = $event"
                    :errclass="{ 'is-danger': vt$.agente.$error }"
                  />
                  <span class="is-error" v-if="vt$.agente.$error">
                    {{ vt$.agente.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="content">
                <fieldset class="fieldset">
                  <legend>Execução a aplicar</legend>
                  <div class="field">
                    <RadioGeneric
                      v-model="mobile.id_execucao"
                      :options="execucoes"
                      name="execucao"
                      :inline="true"
                    />
                  </div>
                </fieldset>
                <span class="is-error" v-if="vt$.id_execucao.$error">
                  {{ vt$.id_execucao.$errors[0].$message }}
                </span>
              </div>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button class="button is-success aux-btn is-fullwidth" @click="processa">
                    Aplicar Alteração
                  </button>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyLoader from '@/components/general/MyLoader.vue'
import mobileService from '@/services/mobile/mobGeneric.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const toast = useToast()

const { currentUser } = useCurrentUser()

const origems = ref([])
var execucoes = ref([])
var agentes = ref([])

const hasTroca = ref(false)

var mobile = reactive({
  id_municipio: 0,
  dt_inicio: '',
  dt_final: '',
  origem: 0,
  id_execucao: 0,
  agente: 0,
})

var isLoading = false

const rulesPesq = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_inicio: { required$ },
  dt_final: { required$ },
  origem: { required$, minValue: combo$(1) },
}

const rulesTroca = {
  id_execucao: { required$, minValue: combo$(1) },
  agente: { required$ },
}

const vp$ = useValidate(rulesPesq, mobile)
const vt$ = useValidate(rulesTroca, mobile)

async function pesquisar() {
  try {
    vp$.value.$touch()
    if (!vp$.value.$invalid) {
      isLoading = true
      const resultado = await mobileService.getAgentes(JSON.stringify(mobile))
      if (resultado.status) {
        agentes.value = resultado.data
        hasTroca.value = true
      } else {
        toast.error(resultado.error.msg)
      }
    } else {
      toast.warning('Corrija os erros para enviar as informações')
    }
  } finally {
    isLoading = false
  }
}

async function processa() {
  try {
    vt$.value.$touch()
    if (!vt$.value.$invalid) {
      isLoading = true
      const resultado = await mobileService.trocaExecucao(mobile)
      if (resultado.status) {
        toast.success(resultado.msg)
      } else {
        toast.error(resultado.error.msg)
      }
    } else {
      toast.warning('Corrija os erros para enviar as informações')
    }
  } finally {
    isLoading = false
  }
}

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  origems.value = [
    { id: 1, nome: 'Imóveis Cadastrados' },
    { id: 2, nome: 'Visita a Imóveis' },
  ]
}

onMounted(async () => {
  let cUser = currentUser
  console.log(cUser)
  loadCombos()
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
