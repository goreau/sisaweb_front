<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Listagem de Visitas</p>
          </header>
          <div class="card-content">
            <section>
              <div class="coluns">
                <div class="column is-10 is-offset-1">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Atividade</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-quadra'"
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
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-model:sel="filter.id_municipio"
                        :tipo="99"
                        v-enter-to-next="'form-userIm'"
                        :errclass="{ 'is-danger': v$.id_municipio.$error }"
                      />
                      <span class="is-error" v-if="v$.id_municipio.$error">
                        {{ v$.id_municipio.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="coluns">
                <div class="column is-6 is-offset-3">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Execução</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-userIm'"
                          v-model="filter.id_execucao"
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
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Data Inicial</label>
                    <div class="control">
                      <MyDatePicker
                        v-enter-to-next="'form-userIm'"
                        v-model="filter.dt_inicial"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_inicial.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_inicial.$error">
                        {{ v$.dt_inicial.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Data Final</label>
                    <div class="control">
                      <MyDatePicker
                        v-enter-to-next="'form-userIm'"
                        v-model="filter.dt_final"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_final.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_final.$error">
                        {{ v$.dt_final.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Agente</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-quadra'"
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="filter.agente"
                      />
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-6 is-offset-3">
                      <button
                        class="button is-link aux-btn is-outlined is-fullwidth"
                        @click="processa"
                      >
                        Visualizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import avulsosService from '@/services/gerenciamento/avulsos.service.js'
import auxiliarService from '@/services/general/auxiliar.service'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import MyDatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import useValidate from '@vuelidate/core'
import { required$, combo$, diferencaMaximaDias$ } from '@/components/forms/validators'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)

var execucoes = ref([])
var atividades = ref([])

const filter = reactive({
  id_municipio: 0,
  id_execucao: 0,
  id_atividade: 0,
  dt_inicial: '',
  dt_final: '',
  agente: '',
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_inicial: { required$ },
  dt_final: {
    required$,
    maximo31Dias: diferencaMaximaDias$('dt_inicial', 31),
  },
}

const v$ = useValidate(rules, filter)

async function processa() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    const resultado = await avulsosService.getListaVisita(JSON.stringify(filter))
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      gerarCsv(resultado.data.rows, resultado.data.cols, resultado.data.filtros)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

async function gerarCsv(dados, colunas, filtros) {
  const XLSX = await import('xlsx')
  const { saveAs } = await import('file-saver')

  // achata as colunas (com suporte a children)
  const exportCols = flattenColumns(colunas)

  const exportData = dados.map((row) =>
    Object.fromEntries(
      exportCols.map((col) => {
        let value = row[col.field]

        // Se o valor for uma string que contém apenas números (ou decimal), converte
        // Verifica se não é nulo/vazio e se é um número válido
        if (typeof value === 'string' && value.trim() !== '' && !isNaN(value)) {
          value = Number(value)
        }

        return [col.exportHeader, value]
      }),
    ),
  )
  const title = 'Sisaweb 3 - Listagem de Visitas'

  const filtrosAplicados = [
    ['Relatório:', 'Listagem de Imóveis Visitados'], // Título que você já tem
    ['Filtros:', filtros],
    [], // Linha vazia para separar os filtros da tabela
  ]

  // 4. Cria o worksheet começando pelos filtros
  const worksheet = XLSX.utils.aoa_to_sheet(filtrosAplicados)

  // 5. Adiciona os dados logo abaixo (na linha 4, por exemplo)
  // origin: -1 faz o SheetJS adicionar os dados na próxima linha disponível
  XLSX.utils.sheet_add_json(worksheet, exportData, {
    origin: 'A5',
    skipHeader: false,
  })

  // 6. Opcional: Ajustar largura das colunas para não ficar tudo espremido
  const max_width = exportCols.length
  worksheet['!cols'] = Array(max_width).fill({ wch: 20 })

  /*const worksheet = XLSX.utils.json_to_sheet(exportData)*/
  const workbook = XLSX.utils.book_new()

  const formatSheetName = (name) => {
    if (!name) return 'Visitas'

    return name
      .replace(/[:\\/?*[\]]/g, '') // Remove proibidos
      .trim() // Limpa espaços
      .substring(0, 31) // Corta no limite exato
  }

  const sheetName = formatSheetName()

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer]), `${title}.xlsx`)
}

function flattenColumns(columns, parentHeader = '') {
  const result = []
  columns.forEach((col) => {
    if (col.children) {
      // recursivo
      result.push(...flattenColumns(col.children, col.headerName))
    } else {
      // monta o header concatenando pai + filho
      const header = parentHeader ? `${parentHeader} - ${col.headerName}` : col.headerName
      result.push({ ...col, exportHeader: header })
    }
  })
  return result
}

onMounted(async () => {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  const result = await auxiliarService.getAtividadeCombo(2)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }

  let cUser = currentUser
  if (cUser.value) {
    tpUser.value = cUser.value.tipo
  }
})
</script>

<style></style>
