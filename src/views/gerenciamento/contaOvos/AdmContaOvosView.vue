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
                <legend>Opção:</legend>
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
              <section v-if="selOption == 2">
                <fieldset class="fieldset optSection">
                  <div class="columns">
                    <div class="column is-10 is-offset-1">
                      <div class="field">
                        <label class="label">Dados do log de envio com erro</label>
                        <div class="control">
                          <textarea
                            class="textarea"
                            name="data"
                            id="data"
                            rows="8"
                            v-model="logData"
                            placeholder="key=...&ovitrap_...."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-centered dvButton">
                    <button class="button is-success" @click.prevent="enviar">Enviar</button>
                  </div>
                </fieldset>
              </section>
              <section v-if="selOption == 3">
                <fieldset class="fieldset optSection">
                  <div class="columns">
                    <div class="column is-10 is-offset-1">
                      <div class="field">
                        <label class="label">Dados do log de envio com erro</label>
                        <div class="control">
                          <textarea
                            class="textarea"
                            name="data"
                            id="data"
                            rows="8"
                            v-model="logData"
                            placeholder="key=...&ovitrap_...."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-centered dvButton">
                    <button class="button is-success" @click.prevent="excluir">Excluir</button>
                  </div>
                </fieldset>
              </section>
              <section v-if="selOption == 4">
                <fieldset class="fieldset optSection">
                  <div class="columns">
                    <div class="column is-10 is-offset-1">
                      <label class="label"
                        >Municípios com registro de ovitrampa sem chave para envio</label
                      >
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
import { onMounted, ref, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import contaOvosService from '@/services/gerenciamento/contaOvos.service'
import { useToast } from 'vue-toastification'

const toast = useToast()

const options = ref([])
const { currentUser } = useCurrentUser()
var idUser = ref(0)
var tpUser = ref(0)

var isLoading = ref(false)
var id_prop = ref(0)
var selOption = ref(0)
var logData = ref('')

var dataTable = ref([])
const columns = ref([])

async function loadCombos() {
  options.value = [
    { id: 1, nome: 'Reiniciar Processamento' },
    { id: 2, nome: 'Envio Manual' },
    { id: 3, nome: 'Excluir Visita Anterior' },
    { id: 4, nome: 'Localizar Órfãos' },
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

async function enviar() {
  try {
    isLoading.value = true

    const dados = logData.value

    const result = await contaOvosService.postManual(dados)
    if (result.error) {
      toast.error(result.msg)
    } else {
      toast.success(result)
    }
  } finally {
    isLoading.value = false
  }
}

async function excluir() {
  try {
    isLoading.value = true

    const dados = logData.value

    const result = await contaOvosService.delete(dados)
    if (result.error) {
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

watch(
  () => selOption.value,
  async (val) => {
    if (val != 4) return

    getTable()
  },
)

onMounted(async () => {
  let cUser = currentUser
  if (cUser.value) {
    if (cUser.value.tipo > 1) {
      alert('some daqui')
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
