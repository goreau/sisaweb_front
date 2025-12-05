<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-6">
        <MyLoader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Consultar logs de envio</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasLog">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
          </header>
          <div class="card-content">
            <fieldset class="fieldset" v-show="!hasLog">
              <legend>Opções de filtro</legend>
              <div class="content">
                <fieldset class="fieldset">
                  <legend>Origem dos registros</legend>
                  <div class="field">
                    <RadioGeneric
                      v-enter-to-next="'form-mob-log'"
                      v-model="mobile.tipo"
                      :options="origems"
                      name="origem"
                      :inline="true"
                    />
                  </div>
                </fieldset>
                <span class="is-error" v-if="vp$.tipo.$error">
                  {{ vp$.tipo.$errors[0].$message }}
                </span>
              </div>
              <div class="content">
                <label class="label">Município</label>
                <div class="control">
                  <CmbTerritorio
                    v-enter-to-next="'form-mob-log'"
                    v-model:sel="mobile.id_municipio"
                    :tipo="99"
                    :errclass="{ 'is-danger': vp$.id_municipio.$error }"
                  />
                  <span class="is-error" v-if="vp$.id_municipio.$error">
                    {{ vp$.id_municipio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="content">
                <div class="field">
                  <label class="label">Data</label>
                  <div class="control">
                    <DatePicker
                      v-enter-to-next="'form-mob-log'"
                      v-model="mobile.dt_cadastro"
                      :error="false"
                      placeholder="Escolha a data"
                      :class="{ 'is-danger': vp$.dt_cadastro.$error }"
                    />
                    <span class="is-error" v-if="vp$.dt_cadastro.$error">
                      {{ vp$.dt_cadastro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="field">
                  <label class="label">Agente</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-mob-log'"
                      class="input"
                      type="text"
                      placeholder="Nome do agente"
                      v-model="mobile.agente"
                    />
                    <span class="is-error" v-if="vp$.agente.$error">
                      {{ vp$.agente.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button class="button is-link aux-btn is-fullwidth" @click="pesquisar">
                    Procurar
                  </button>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset" v-show="hasLog">
              <legend>Resultado</legend>
              <div v-for="(item, i) in logs" :key="i" class="log-card">
                <p><b>Timestamp:</b> {{ item.timestamp }}</p>
                <p><b>Tipo:</b> {{ item.tipo }}</p>

                <details>
                  <summary>Dados</summary>
                  <pre>{{ item.dados }}</pre>
                </details>

                <details>
                  <summary>Retorno</summary>
                  <pre>{{ item.retorno }}</pre>
                </details>
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
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import axios from 'axios'

const toast = useToast()

const { currentUser } = useCurrentUser()

const origems = ref([])

const logs = ref([])
const hasLog = ref(false)

var mobile = reactive({
  id_municipio: 0,
  dt_cadastro: '',
  tipo: '',
  agente: '',
})

var isLoading = ref(false)

const rulesPesq = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_cadastro: { required$ },
  tipo: { required$ },
  agente: { required$ },
}

const vp$ = useValidate(rulesPesq, mobile)

function newFilter() {
  hasLog.value = false
}

async function pesquisar() {
  try {
    vp$.value.$touch()
    if (!vp$.value.$invalid) {
      isLoading.value = true

      mobile.data = format(mobile.dt_cadastro, 'yyyy-MM-dd')

      // const chave = import.meta.env.VITE_SISAPI_KEY

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://sisapi.saude.sp.gov.br/api/recebe/logs', //'http://10.8.150.23:4033/api/recebe/logs', //
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer "${import.meta.env.VITE_SISAPI_KEY}"`,
        },
        data: JSON.stringify(mobile),
      }

      axios
        .request(config)
        .then((response) => {
          //logs.value(JSON.stringify(response.data))
          logs.value = response.data
          hasLog.value = logs.value.length > 0
          if (!hasLog.value) {
            toast.warning('Nenhum envio encontrado com essas informações!')
          }
        })
        .catch((error) => {
          toast.error('Erro na requisição')
          console.log(error)
        })

      /*const response = await fetch('http://200.144.1.23/sisapi/api/recebe/logs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mobile),
      })

      if (!response.ok) toast.error('Erro na requisição')
      const registros = await response.json()
      console.log(registros)*/
    } else {
      toast.warning('Corrija os erros para enviar as informações')
    }
  } finally {
    isLoading.value = false
  }
}

async function loadCombos() {
  origems.value = [
    { id: 'vc_imovel', nome: 'Imóveis Cadastrados' },
    { id: 'vc_folha', nome: 'Visita a Imóveis' },
    { id: 'alado', nome: 'Captura de Alados' },
    { id: 'edl', nome: 'Manutenção de EDL' },
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
