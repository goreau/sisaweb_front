<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div v-show="progressoSync.ativo" class="mb-4">
          <!-- Texto descritivo e porcentagem em cima -->
          <p class="has-text-centered mb-1 is-size-7 has-text-weight-semibold">
            {{ progressoSync.mensagem }}
          </p>

          <!-- Barra de progresso do Bulma -->
          <progress class="progress is-info is-large" :value="progressoSync.porcentagem" max="100">
            {{ progressoSync.porcentagem }}%
          </progress>
        </div>
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Imóveis Cadastrados</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!hasRows">
              <div class="columns" v-if="tpUser < 4">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-mobile'"
                        v-model:sel="filter.id_municipio"
                        :tipo="99"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Atividade</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-mobile'"
                          v-model="filter.id_atividade"
                          :options="atividades"
                          name="id_atividade"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-4 is-offset-4">
                  <div class="field">
                    <label class="label">Agente</label>
                    <input
                      type="text"
                      class="input"
                      name="agente"
                      id="agente"
                      v-model="filter.agente"
                    />
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Data Inicial</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-mobile'"
                        v-model="filter.dt_inicial"
                        :error="false"
                        placeholder="Escolha a data"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Data Final</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-mobile'"
                        v-model="filter.dt_final"
                        :error="false"
                        placeholder="Escolha a data"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="field column is-3 is-offset-4">
                  <label class="label">&nbsp;</label>
                  <div class="control">
                    <button class="button is-link is-fullwidth" @click="loadData">
                      <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                      Carregar
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section v-if="hasRows">
              <MyDataTable
                ref="tabelaRef"
                :data="dataTable"
                :columns="columns"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                @boletim="printSheet"
                :buttons="['edit', 'delete', 'boletim']"
                :has-exports="true"
                :loggedUser="{ id: idUser, tipo: tpUser }"
                :title="'Mobile Imóveis Cadastrados'"
                :filter="filtros"
              />
              <hr />
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button
                    class="button is-success is-outlined aux-btn is-fullwidth"
                    @click="sincroniza"
                  >
                    Sincronizar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import mobVcImovelService from '@/services/mobile/mobVc_imovel.service'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import { useMobileStore } from '@/stores/mobileStore'
import auxiliarService from '@/services/general/auxiliar.service'
import { boletim } from '@/services/general/geraBoletim.service'
import utilitariosService from '@/services/utilitarios.service'

const { currentUser } = useCurrentUser()

const router = useRouter()
const toast = useToast()
const store = useMobileStore()

var tpUser = ref(0)
var idUser = ref(0)

var confirmDialog = ref(null)
var isLoading = ref(false)
const STORAGE_KEY = 'consulta-mobvcimovelsw'

var hasRows = ref(false)
var dataTable = ref([])
var filtros = ref('')
const atividades = ref([])

const tabelaRef = ref(null)

const filter = reactive({
  id_municipio: 0,
  id_atividade: 0,
  agente: 0,
  dt_inicial: '',
  dt_final: '',
})

const progressoSync = ref({
  ativo: false,
  atual: 0,
  total: 0,
  porcentagem: 0,
  mensagem: '',
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const result = await mobVcImovelService.getMobVcImovels(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data.rows
      columns.value = result.data.cols
      filtros.value = result.data.filtros
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

async function onEditRow(item) {
  const ret = await mobVcImovelService.getMobVcImovel(item.row.id)
  if (ret.error) {
    toast.error(ret.msg)
  } else {
    store.setVisita({ ...ret })
    router.push({ name: 'mobVcImovel', query: { from: 'edit' } })
  }
}

async function onDeleteRow(item) {
  try {
    isLoading.value = true
    const ok = await confirmDialog.value.show({
      title: 'Excluir',
      message: 'Deseja mesmo excluir essa Visita?',
      okButton: 'Confirmar',
    })
    if (ok) {
      const resultado = await mobVcImovelService.delete(item.row.id)
      if (resultado.error) {
        toast.error(resultado.msg)
      } else {
        toast.success('Imóvel excluído com sucesso!')
        loadData()
      }
    }
  } finally {
    isLoading.value = false
  }
}

async function printSheet(item) {
  const ret = await utilitariosService.boletimMobImovel(item.row.id)
  if (ret.error) {
    toast.error(ret.msg)
  } else {
    boletim(ret.data)
  }
}

async function sincroniza() {
  try {
    //isLoading.value = true
    if (!tabelaRef.value) return

    const linhas = tabelaRef.value.getFilteredRows()

    const ids = linhas.map((l) => l.id) // Substitua 'l.id' pelo campo correto do ID na sua tabela

    if (!ids || ids.length === 0) {
      toast.warning('Nenhum registro para sincronizar.')
      return
    }

    const tamanhoLote = 1000 // Lotes de 500 IDs por requisição
    let totalSucesso = 0
    let totalErros = 0
    let todosErrosDetalhes = []

    const totalLinhas = ids.length
    const totalLotes = Math.ceil(totalLinhas / tamanhoLote)

    progressoSync.value = {
      ativo: true,
      atual: 0,
      total: totalLotes,
      porcentagem: 0,
      mensagem: `Iniciando sincronização de ${ids.length} registros...`,
    }

    for (let i = 0; i < totalLinhas; i += tamanhoLote) {
      const loteIds = ids.slice(i, i + tamanhoLote)

      const loteAtual = Math.floor(i / tamanhoLote) + 1

      progressoSync.value.atual = loteAtual
      progressoSync.value.porcentagem = Math.round((loteAtual / totalLotes) * 100)
      progressoSync.value.mensagem = `Processando lote ${loteAtual} de ${totalLotes} (${progressoSync.value.porcentagem}%)...`

      // toast.info(`Sincronizando lote ${loteAtual} de ${totalLotes}...`, { id: 'sync-progress' })

      // Envia apenas o array de IDs para o backend

      const ret = await mobVcImovelService.sync({ ids: loteIds })

      if (ret && !ret.error) {
        totalSucesso += ret.master || 0
        totalErros += ret.errosCount || 0
        if (ret.detalhesErros) {
          todosErrosDetalhes.push(...ret.detalhesErros)
        }
      }
    }

    tabelaRef.value.clearFilters()

    if (totalErros > 0) {
      toast.warning(
        `Sincronização concluída com avisos. Sucessos: ${totalSucesso}, Erros: ${totalErros}`,
      )
    } else {
      toast.success(`Sincronização concluída com sucesso! ${totalSucesso} registros processados.`)
    }

    loadData()
  } finally {
    //isLoading.value = false
    setTimeout(() => {
      progressoSync.value.ativo = false
    }, 1500)
  }
}

/*async function sincroniza() {
  try {
    isLoading.value = true
    if (tabelaRef.value) {
      const linhas = tabelaRef.value.getFilteredRows()

      const ret = await mobVcImovelService.sync(linhas)
      if (!ret.status) {
        toast.error(ret.error.msg)
      } else {
        tabelaRef.value.clearFilters()
        toast.success(`${ret.master} ${ret.msg}`)
        loadData()
      }
    }
  } finally {
    isLoading.value = false
  }
}*/

async function loadCombos() {
  const result = await auxiliarService.getAtividadeCombo(1)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filter, JSON.parse(saved))
  }

  loadCombos()

  let cUser = currentUser
  if (cUser.value) {
    tpUser.value = cUser.value.tipo
    idUser.value = 0
    if (tpUser.value == 4) {
      loadData()
    }
  }
})
</script>

<style></style>
