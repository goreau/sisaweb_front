<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Conta Ovos - Painel Administrativo</p>
          </header>
          <div class="card-content">
            <div class="content">
              <fieldset class="fieldset">
                <legend>Opções Gerais:</legend>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-alado'"
                          v-model="selOption"
                          :options="options"
                          name="option"
                          :inline="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset class="fieldset">
                <legend>Ovitrampa:</legend>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-alado'"
                          v-model="selOption"
                          :options="optOvi"
                          name="optionOvi"
                          :inline="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset class="fieldset">
                <legend>Opções EDL:</legend>
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-alado'"
                          v-model="selOption"
                          :options="optEdl"
                          name="option"
                          :inline="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              <section v-if="selOption == 1">
                <fieldset class="fieldset optSection">
                  <div class="columns is-centered">
                    <p class="is-centered">
                      Reiniciar o envio de dados para o app ContaOvos do MS?
                    </p>
                  </div>
                  <div class="columns is-centered dvButton">
                    <button class="button is-success" @click.prevent="testecron">Reiniciar</button>
                  </div>
                </fieldset>
              </section>
              <section v-if="selOption == 4">
                <fieldset class="fieldset optSection">
                  <div class="columns">
                    <div class="column is-10 is-offset-1">
                      <label class="label">Municípios com registro sem chave para envio</label>
                      <MyDataTable
                        :loggedUser="{ id: idUser, tipo: tpUser }"
                        :buttons="['edit']"
                        :data="dataTable"
                        :columns="columns"
                        :pagination="true"
                        @edit="onEditRow"
                      />
                    </div>
                  </div>
                </fieldset>
              </section>
              <section v-if="selOption > 10">
                <fieldset class="fieldset optSection">
                  <div class="columns">
                    <div class="column is-10 is-offset-1">
                      <label class="label">Municípios com registros com erro no envio</label>
                      <MyDataTable
                        :loggedUser="{ id: idUser, tipo: tpUser }"
                        :buttons="[]"
                        :data="dataTable"
                        :columns="columns"
                        :pagination="true"
                        :hasExports="true"
                      />
                    </div>
                  </div>
                </fieldset>
              </section>
              <section v-if="dadoSelecionado">
                <fieldset class="fieldset optSection">
                  <div class="columns">
                    <div class="column is-10 is-offset-1">
                      <div class="field">
                        <label class="label">Dados do log de envio</label>
                        <div class="control">
                          <textarea
                            class="textarea"
                            name="data"
                            id="data"
                            rows="8"
                            v-model="logData"
                            :placeholder="placeholderAtual"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-centered dvButton">
                    <button class="button is-success" @click.prevent="processar">Enviar</button>
                  </div>
                </fieldset>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyDataTable from '@/components/general/MyDataTable.vue'
import Loader from '@/components/general/MyLoader.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import contaOvosService from '@/services/gerenciamento/contaOvos.service'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const options = ref([])
const optOvi = ref([])
const optEdl = ref([])
const dadosComplementares = ref([])

const { currentUser } = useCurrentUser()
var idUser = ref(0)
var tpUser = ref(0)

var isLoading = ref(false)
var id_prop = ref(0)
var selOption = ref(0)
var logData = ref('')

var dataTable = ref([])
const columns = ref([])

const dadoSelecionado = computed(() => {
  return dadosComplementares.value.find((item) => item.id === Number(selOption.value))
})

// Extrai apenas o placeholder (ou string vazia se não encontrado)
const placeholderAtual = computed(() => {
  return dadoSelecionado.value?.placeholder ?? ''
})

async function loadCombos() {
  options.value = [
    { id: 1, nome: 'Reiniciar Processamento' },
    { id: 4, nome: 'Localizar Órfãos' },
  ]
  optOvi.value = [
    { id: 2, nome: 'Envio' },
    { id: 3, nome: 'Excluir Visita Anterior' },
    { id: 11, nome: 'Erro no envio' },
  ]
  optEdl.value = [
    { id: 5, nome: 'Envio Cadastro' },
    { id: 6, nome: 'Excluir Cadastro Anterior' },
    { id: 7, nome: 'Envio Manutenção' },
    { id: 8, nome: 'Excluir Visita Anterior' },
    { id: 12, nome: 'Erro no envio' },
  ]
  dadosComplementares.value = [
    { id: 2, endpoint: 'postManual', placeholder: 'key=...&ovitrap_....' },
    { id: 3, endpoint: 'deleteEnviado', placeholder: 'key=...&ovitrap_....' },
    { id: 5, endpoint: 'postManualCadEdl', placeholder: 'id=...&latitude=....' },
    { id: 6, endpoint: 'deleteCadastroEdl', placeholder: 'id=...&latitude=....' },
    { id: 7, endpoint: 'postManualEdl', placeholder: 'id=...&latitude=....' },
    { id: 8, endpoint: 'deleteEdl', placeholder: 'id=...&latitude=....' },
  ]
}

const testecron = async () => {
  try {
    isLoading.value = true

    const result = await contaOvosService.getTesteCron()
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result)
    }
  } finally {
    isLoading.value = false
  }
}

async function processar() {
  const itemAtual = dadosComplementares.value.find((item) => item.id === Number(selOption.value))

  if (!itemAtual?.endpoint) {
    toast.error('Selecione uma opção válida antes de enviar.')
    return
  }

  try {
    isLoading.value = true

    const result = await contaOvosService.postEndpoint(itemAtual.endpoint, logData.value)

    if (result?.error) {
      toast.error(result.msg)
    } else {
      toast.success(result)
    }
  } finally {
    isLoading.value = false
  }
}

async function onEditRow(item) {
  const data = { id_municipio: item.row.id_municipio, api_key: item.row.api_access_key }

  const resultado = await contaOvosService.create(data)

  const msg = 'Chave inserida com sucesso!'

  if (resultado.error) {
    toast.error(resultado.msg)
  } else {
    toast.success(msg)
    getTable()
  }
}

async function getTable() {
  const result = await contaOvosService.getOrfaos()
  if (result.error) {
    dataTable.value = []
  } else {
    dataTable.value = result.data.rows
    columns.value = result.data.cols
  }
}

async function getErros() {
  const result = await contaOvosService.getErros(selOption.value)
  if (result.error) {
    dataTable.value = []
  } else {
    dataTable.value = result.data.rows
    columns.value = result.data.cols
  }
}

watch(
  () => selOption.value,
  async (val) => {
    if (val == 4) {
      getTable()
    } else if (val > 10) {
      getErros()
    }
  },
)

onMounted(async () => {
  let cUser = currentUser
  if (cUser.value) {
    if (cUser.value.tipo > 1) {
      await router.replace('/acesso-negado') // ou { name: 'Home' } / rota de destino
      return
    }
    id_prop.value = cUser.value.id
    idUser.value = cUser.value.id
    tpUser.value = cUser.value.tipo
  }
  loadCombos()
})
</script>

<style scoped>
.optSection {
  padding: 10rem 0;
}
.dvButton {
  padding-top: 4rem;
}
</style>
