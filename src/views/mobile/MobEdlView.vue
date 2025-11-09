<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Cadastro de Manutenção: EDL</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      v-enter-to-next="'form-mob-edl'"
                      v-model:sel="edl.id_municipio"
                      :tipo="99"
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
                  <label class="label">Data de Instalação</label>
                  <div class="control">
                    <DatePicker
                      v-enter-to-next="'form-mob-edl'"
                      v-model="edl.dt_cadastro"
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
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-mob-edl'"
                        v-model="edl.id_execucao"
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
              <div class="column is-2">
                <div class="content">
                  <label class="label">Ordem</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="N° de Ordem"
                      v-model="edl.ordem"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <label class="label">Cadastro</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-mob-edl'"
                      v-model:sel="edl.id_cadastro_edl"
                      :data="imoveis"
                      :errclass="{ 'is-danger': v$.id_cadastro_edl.$error }"
                    />
                    <span class="is-error" v-if="v$.id_cadastro_edl.$error">
                      {{ v$.id_cadastro_edl.$errors[0].$message }}
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
                        v-enter-to-next="'form-mob-edl'"
                        v-model="edl.id_situacao"
                        :options="situacoes"
                        name="id_situacao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Nível Água</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-mob-edl'"
                        v-model="edl.id_nivel"
                        :options="niveis"
                        name="id_nivel"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <label class="label">Larvas</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-mob-edl'"
                      class="input"
                      type="text"
                      placeholder="N° de larvasl"
                      v-model="edl.larvas"
                    />
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <label class="label">Pupas</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-mob-edl'"
                      class="input"
                      type="text"
                      placeholder="N° de pupas"
                      v-model="edl.pupas"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Ocorrências</legend>
                    <div class="field">
                      <GenericCheckBox
                        v-enter-to-next="'form-mob-edl'"
                        :checkAll="false"
                        :columnsCount="6"
                        :options="ocorrencias"
                        v-model="chkOcorrencias"
                      />
                      <GenericCheckBox
                        :checkAll="false"
                        :columnsCount="6"
                        :options="ocorrencias"
                        v-model="edl.ocorrencias"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <div class="field">
                  <label class="label">Observação</label>
                  <textarea
                    v-enter-to-next="'form-mob-edl'"
                    class="textarea"
                    rows="2"
                    v-model="edl.observacao"
                    placeholder="Complementação da informação"
                  ></textarea>
                </div>
              </div>
            </div>
            <hr />
            <div class="columns">
              <div class="column is-4 is-offset-4">
                <div class="field">
                  <label class="label">Agente</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-mob-edl'"
                      class="input"
                      type="text"
                      placeholder="Executor da visita"
                      v-model="edl.agente"
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
              @cancel="null"
              @aux="null"
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
import mobEdlService from '@/services/mobile/mobEdl.service'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import GenericCheckBox from '@/components/forms/GenericCheckBox.vue'
import { required$, combo$, maxLength$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import edlCadastroService from '@/services/cadastro/edlCadastro.service'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

var execucoes = ref([])
var situacoes = ref([])
var niveis = ref([])
const ocorrencias = ref([])
var chkOcorrencias = ref([])

var imoveis = ref([])

var id_prop = ref(0)

var edl = reactive({
  id_edl: 0,
  ordem: 1,
  id_municipio: 0,
  dt_cadastro: '',
  id_execucao: 0,
  id_situacao: 0,
  id_cadastro_edl: 0,
  id_nivel: 0,
  larvas: 0,
  pupas: 0,
  observacao: '',
  ocorrencias: [],
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
  dt_cadastro: { required$ },
  id_situacao: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_cadastro_edl: { required$, minValue: combo$(1) },
  id_nivel: { required$, minValue: combo$(1) },
  observacao: { maxLength: maxLength$(200) },
  agente: { required$ },
}

const v$ = useValidate(rules, edl)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    edl.ocorrencias = JSON.stringify(chkOcorrencias.value)

    if (isEditMode.value) {
      resultado = await mobEdlService.update(edl)
    } else {
      resultado = await mobEdlService.create(edl)
    }

    if (resultado.status) {
      edl.id_edl = resultado.master
      toast.success(resultado.msg)
      limpar()
      v$.value.$reset()
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

function limpar() {
  let vazio = {
    id_edl: 0,
    ordem: edl.ordem + 1,
    id_situacao: 0,
    id_cadastro_edl: 0,
    id_nivel: 0,
    larvas: 0,
    pupas: 0,
    observacao: '',
    ocorrencias: [],
  }
  Object.assign(edl, vazio)
}

watch(
  () => edl.id_municipio,
  async (val) => {
    const filter = { id_municipio: val }
    const result = await edlCadastroService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  },
)

const isEditMode = computed(() => Number(route.params.id) > 0)

async function loadCombos() {
  const result = await auxiliarService.getGenericCombo(11)
  if (result.error) {
    console.log(result.error)
    ocorrencias.value = []
  } else {
    ocorrencias.value = result
  }

  niveis.value = [
    { id: 1, nome: 'Seca' },
    { id: 2, nome: '< 50%' },
    { id: 3, nome: '>= 50%' },
  ]

  situacoes.value = [
    { id: 1, nome: 'Trabalhado' },
    { id: 2, nome: 'Fechado' },
    { id: 3, nome: 'Recusa' },
  ]

  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]
}

onMounted(async () => {
  if (isEditMode.value) {
    const ret = await mobEdlService.getMobEdl(route.params.id)
    if (ret.error) {
      toast.error(ret.msg)
    } else {
      ret.id_municipio = Number(ret.id_municipio)
      Object.assign(edl, ret)
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
</style>
