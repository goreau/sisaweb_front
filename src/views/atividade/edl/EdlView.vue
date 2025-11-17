<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Cadastro de Manutenção: EDL</p>
          </header>
          <div class="card-content" data-form-container>
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      v-enter-to-next="'form-edl-id-1'"
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
                  <label class="label">Data da Visita</label>
                  <div class="control">
                    <DatePicker
                      v-enter-to-next="'form-edl-id-1'"
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
                        v-enter-to-next="'form-edl-id-1'"
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
                      v-enter-to-next="'form-edl-id-1'"
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
                  <CmbGeneric
                    v-enter-to-next="'form-edl-id-1'"
                    v-model:sel="edl.id_cadastro_edl"
                    :data="imoveis"
                    :errclass="{ 'is-danger': v$.id_cadastro_edl.$error }"
                  />
                  <span class="is-error" v-if="v$.id_cadastro_edl.$error">
                    {{ v$.id_cadastro_edl.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Situação</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-edl-id-1'"
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
                        v-enter-to-next="'form-edl-id-1'"
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
                      v-enter-to-next="'form-edl-id-1'"
                      class="input"
                      type="text"
                      placeholder="N° de larvas"
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
                      v-enter-to-next="'form-edl-id-1'"
                      class="input"
                      type="text"
                      placeholder="N° de pupas"
                      v-model="edl.pupas"
                    />
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <label class="label">Ae. aegypti</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-edl-id-1'"
                      class="input"
                      type="text"
                      placeholder="N° de larvas Ae aegypti"
                      v-model="edl.aegypti"
                    />
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <label class="label">Ae albopictus</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-edl-id-1'"
                      class="input"
                      type="text"
                      placeholder="N° de larvas Ae albopiictus"
                      v-model="edl.albopictus"
                    />
                  </div>
                </div>
              </div>
            </div>
            <fieldset class="fieldset">
              <legend>Outras Espécies</legend>
              <div class="columns">
                <div class="column is-3 is-offset-1">
                  <div class="content">
                    <label class="label">Espécie</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-edl-id-1'"
                        class="input"
                        type="text"
                        placeholder="Espécie"
                        v-model="outro.especie"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2 is-offset-1">
                  <div class="content">
                    <label class="label">Quantidade</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-edl-id-1'"
                        class="input"
                        type="text"
                        placeholder="N° de larvas"
                        v-model="outro.quant"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="column is-2 is-offset-1"
                  data-focus-type="custom-submit-group"
                  v-enter-to-next="'submit-action'"
                >
                  <label class="label">&nbsp;</label>
                  <button class="button is-link aux-btn is-fullwidth" @click="insert">
                    Inserir
                  </button>
                </div>
              </div>
              <div class="columns">
                <div class="column is-10 is-offset-1">
                  <section v-if="outras.length > 0">
                    <MyDataTable
                      :loggedUser="{ id: 0, tipo: 0 }"
                      :data="outras"
                      :columns="columns"
                      calc-height="true"
                      :pagination="false"
                      @delete="handleDelete"
                      :buttons="['delete']"
                    />
                  </section>
                </div>
              </div>
            </fieldset>
            <div class="columns">
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Ocorrências</legend>
                    <div class="field">
                      <GenericCheckBox
                        v-enter-to-next="'form-edl-id-1'"
                        :checkAll="false"
                        :columnsCount="6"
                        :options="ocorrencias"
                        v-model="chkOcorrencias"
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
                    v-enter-to-next="'form-edl-id-1'"
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
                      v-enter-to-next="'form-edl-id-1'"
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
import edlService from '@/services/atividade/edl.service'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import GenericCheckBox from '@/components/forms/GenericCheckBox.vue'
import MyDataTable from '@/components/general/MyDataTable.vue'
import { required$, combo$, maxLength$, requiredIf$ } from '@/components/forms/validators'
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

var imoveis = ref([])

var id_prop = ref(0)

var outras = ref([])
var chkOcorrencias = ref([])
const columns = ref([])

const outro = reactive({
  especie: '',
  quant: 0,
})

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
  aegypti: 0,
  albopictus: 0,
  outras: {},
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
  id_nivel: { requiredIf: requiredIf$(edl.id_situacao == 1) },
  observacao: { maxLength: maxLength$(200) },
  agente: { required$ },
}

const v$ = useValidate(rules, edl)

function insert() {
  if (outro.especie && parseInt(outro.quant) > 0) {
    const novoItem = {
      id: Date.now(),
      especie: outro.especie,
      quant: parseInt(outro.quant),
    }

    outras.value.push(novoItem)

    // Limpa o formulário
    outro.especie = ''
    outro.quant = 0
  }
}

function handleDelete(dados) {
  const row = dados.row
  // O filtro
  outras.value = outras.value.filter((f) => f.id !== row.id)
}

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    const contagensObjeto = outras.value.reduce((acc, item) => {
      // O Knex/PostgreSQL espera { "chave": valor }
      acc[item.especie] = item.quant
      return acc
    }, {})

    edl.ocorrencias = JSON.stringify(chkOcorrencias.value)

    edl.outras = contagensObjeto // O objeto JSON que será inserido no JSONB

    if (isEditMode.value) {
      resultado = await edlService.update(edl)
    } else {
      resultado = await edlService.create(edl)
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
    aegypti: 0,
    albopictus: 0,
    outras: {},
    observacao: '',
    ocorrencias: [],
  }
  chkOcorrencias.value = []
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
  columns.value = [
    { headerName: 'Espécie', field: 'especie' },
    { headerName: 'Quantidade', field: 'quant' },
  ]

  if (isEditMode.value) {
    const ret = await edlService.getEdl(route.params.id)
    if (ret.error) {
      toast.error(ret.msg)
    } else {
      const objetoJson = ret.outras
      outras.value = Object.entries(objetoJson).map(([especie, quant]) => {
        // 2. O .map() itera sobre cada array e os desestrutura em [especie, quant]
        // 3. E os mapeia de volta para o formato de objeto desejado
        return {
          especie: especie,
          // Converte o valor 'quant' para número, se necessário (boa prática)
          quant: Number(quant),
        }
      })
      chkOcorrencias.value = ret.ocorrencias
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
