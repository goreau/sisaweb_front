<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-four-fifths">
        <MyLoader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Logs de Envio de Dados</p>
          </header>
          <div class="card-content">
            <div class="content">
              <section v-show="!hasRows">
                <div class="columns">
                  <div class="column is-3 is-offset-3">
                    <div class="field">
                      <label class="label">Data Inicial</label>
                      <div class="control">
                        <DatePicker
                          v-enter-to-next="'form-alado'"
                          v-model="filter.inicio"
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
                          v-enter-to-next="'form-alado'"
                          v-model="filter.final"
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
                <table class="log-table">
                  <thead>
                    <tr>
                      <th>Data do Log</th>
                      <th>Tamanho</th>
                      <th>Criado em</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="arquivo in dataTable" :key="arquivo.nome">
                      <td>{{ formatarNome(arquivo.nome) }}</td>
                      <td>{{ arquivo.tamanho }}</td>
                      <td>{{ new Date(arquivo.criadoEm).toLocaleString('pt-BR') }}</td>
                      <td>
                        <button
                          class="button is-small is-outlined is-info"
                          @click="visualizarLog(arquivo.nome)"
                          title="Visualizar"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button
                          class="button is-small is-outlined is-success"
                          @click="baixarLog(arquivo.nome)"
                        >
                          <i class="fas fa-download"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Modal v-if="modalAberto" :hasAction="false">
                  <div class="columns">
                    <div class="column is-11 divisor">Conteúdo: {{ arquivoNomeAtivo }}</div>
                    <div class="column is-1">
                      <button
                        class="button is-small is-outlined"
                        @click="fecharModal"
                        title="Fechar"
                      >
                        <i class="fas fa-x"></i>
                      </button>
                    </div>
                  </div>
                  <!-- <p class="divisor">Conteúdo: {{ arquivoNomeAtivo }}</p>-->

                  <pre><code>{{ conteudoFormatado }}</code></pre>
                </Modal>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import contaOvosService from '@/services/gerenciamento/contaOvos.service'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import Modal from '@/components/forms/GenericModal.vue'
import { ref, computed, reactive } from 'vue'

var isLoading = ref(false)
const STORAGE_KEY = 'consulta-contaovoslogs'

var dataTable = ref([])
var hasRows = ref(false)

const modalAberto = ref(false)
const arquivoNomeAtivo = ref('')
const conteudoRaw = ref('')

const filter = reactive({
  inicio: '',
  final: '',
})

const loadData = async () => {
  try {
    isLoading.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter))

    const result = await contaOvosService.getListaLog(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result
      //columns.value = result.data.cols
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

const baixarLog = async (nomeArquivo) => {
  try {
    const response = await contaOvosService.getLogFile(nomeArquivo)

    // Cria a URL para o navegador baixar o arquivo
    const blob = new Blob([response], { type: 'application/jsonl' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nomeArquivo) // Nome que aparecerá no PC do usuário

    document.body.appendChild(link)
    link.click()

    // Limpeza
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao baixar arquivo:', error)
    alert('Erro ao tentar baixar o arquivo de log.')
  }
}

const formatarNome = (nome) => nome.replace('.jsonl', '')

const conteudoFormatado = computed(() => {
  try {
    // Como é JSONL, quebramos as linhas, parseamos e juntamos com espaços
    return conteudoRaw.value
      .trim()
      .split('\n')
      .map((linha) => JSON.stringify(JSON.parse(linha), null, 2))
      .join('\n') //('\n---\n')
  } catch (e) {
    return conteudoRaw.value // Se falhar, mostra o texto bruto
  }
})

const visualizarLog = async (nome) => {
  arquivoNomeAtivo.value = nome
  try {
    const response = await contaOvosService.getLogFile(nome)

    // Transforma o Blob em String
    conteudoRaw.value = response
    modalAberto.value = true
  } catch (error) {
    alert('Erro ao ler conteúdo')
  }
}

const fecharModal = () => {
  modalAberto.value = false
  conteudoRaw.value = ''
}
</script>

<style lang="scss" scoped></style>
