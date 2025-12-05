<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Sorteio de ADL</p>
          </header>
          <div class="card-content">
            <section>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-sort'"
                        :tipo="99"
                        v-model:sel="filter.id_municipio"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-sort'"
                        v-model:sel="filter.id_area"
                        :data="areas"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="field column is-2 is-offset-3">
                  <label class="label">&nbsp;</label>
                  <div class="control">
                    <button class="button is-danger is-fullwidth" @click="loadPdf">
                      <span class="btico"><font-awesome-icon icon="fa-solid fa-file-pdf" /></span>
                      Gerar PDF
                    </button>
                  </div>
                </div>
                <div class="field column is-2 is-offset-1">
                  <label class="label">&nbsp;</label>
                  <div class="control">
                    <button class="button is-success is-fullwidth" @click="loadExcel">
                      <span class="btico"><font-awesome-icon icon="fa-solid fa-file-excel" /></span>
                      Gerar Excel
                    </button>
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
import areaService from '@/services/cadastro/area.service'
import utilitariosService from '@/services/utilitarios.service'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { exportToCSV } from '@/services/general/expExcel.service'
import { jsPDF } from 'jspdf'
import { reactive, watch, ref } from 'vue'

const filter = reactive({
  id_municipio: 0,
  id_area: 0,
})
var municipio = ref('')
var areas = ref([])
var isLoading = ref(false)
const hasRows = ref(false)
const dataTable = ref([])
const columns = ref([])

async function loadData() {
  try {
    isLoading.value = true

    const result = await utilitariosService.sorteio(filter)
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data
      municipio.value = result.municipio
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

async function loadPdf() {
  if (!hasRows.value) {
    await loadData()
  }
  gerarRelatorio()
}

async function loadExcel() {
  if (!hasRows.value) {
    await loadData()
  }
  exportToCSV(dataTable.value, 'Sorteio ADL')
}

async function gerarRelatorio() {
  const doc = new jsPDF('p', 'mm', 'a4') // 'l' para layout paisagem (landscape) para caber mais colunas

  doc.roundedRect(10, 10, 190, 30, 3, 3)
  doc.text('SORTEIO DE ADL - ÁREA', 110, 15, {
    align: 'center',
    baseline: 'middle',
  })

  doc.setFontSize(9)

  doc.text('Município: ' + municipio.value, 20, 35)

  doc.text('Área: ' + dataTable.value[0].area_codigo, 170, 35)

  // Dimensões do documento A4 (em mm): 297 x 210
  const MARGIN_X = 20 // Margem inicial X
  let currentX = MARGIN_X
  let currentY = 50 // Margem inicial Y
  const LINE_HEIGHT = 6 // Altura da linha (como seu 'Ln(6)' e altura '6')

  // Larguras das colunas em milímetros (adaptadas do seu código: 40, 20, 30, 20, 20, 20, 20, 20)
  const colWidths = [30, 30, 25, 25, 20, 20, 20]

  // Títulos das colunas
  const headers = ['Área', 'Censitário', 'Quarteirão', 'Sub-Número', 'Imóveis', 'Início', 'Amostra']

  // Cores e Fonte
  const FILL_COLOR = [211, 211, 211]
  const BORDER_COLOR = [0, 0, 0] // Cor preta para a borda
  const TEXT_COLOR = [0, 0, 0]

  doc.setFont('arial', '')
  doc.setFontSize(6)

  // --- 2. Criação do Cabeçalho ---
  // (Equivalente aos seus $this->Cell(...) com 'true' no final)

  // Percorre e desenha o cabeçalho
  currentX = MARGIN_X
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.1)
  //doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2])
  //doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]) // <-- Cor da borda (preto)
  //doc.setFillColor(FILL_COLOR[0], FILL_COLOR[1], FILL_COLOR[2])
  doc.setFillColor(211, 211, 211)

  headers.forEach((header, index) => {
    const width = colWidths[index]

    // *** REDEFINIÇÃO DE CORES EM CADA CÉLULA ***

    // 1. Configurar o preenchimento (Fundo Cinza)
    doc.setFillColor(FILL_COLOR[0], FILL_COLOR[1], FILL_COLOR[2])

    // 2. Desenha o fundo e a borda (Preenchimento Cinza e Traço Preto)
    // Usa 'F' para preencher com o FillColor (Cinza)
    doc.rect(currentX, currentY, width, LINE_HEIGHT, 'F')

    // 3. Desenha APENAS a borda (Traço Preto)
    // Redefine a cor do traço para preto (se for a cor da borda desejada)
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2])
    doc.rect(currentX, currentY, width, LINE_HEIGHT, 'S')

    // 4. Configura a cor do texto (Preto)
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2])

    // 5. Desenha o texto
    doc.text(header, currentX + width / 2, currentY + LINE_HEIGHT / 2, {
      align: 'center',
      baseline: 'middle',
    })

    currentX += width
  })

  currentY += LINE_HEIGHT // Move para a próxima linha (equivalente a $this->Ln(6))

  // --- 3. Desenho das Linhas de Dados ---
  // (Equivalente aos seus foreach ($this->linhas as $row) e o loop interno)

  doc.setFontSize(6) // Volta para a fonte normal
  doc.setFillColor(255, 255, 255) // Fundo branco

  var qtCens = 0
  var oldCens = ''
  var qtImoveis = 0
  var isFirst = true

  // Seu objeto 'dadosDoBackend' já deve conter os dados processados (amostras, início, etc.)
  // Vamos iterar sobre o array final que você gerou no Node.js
  dataTable.value.forEach((row) => {
    let isFirstQuarteirao = true

    const principalData = [
      row.area_codigo,
      row.cens_codigo,
      row.quarteirao,
      row.sub_numero,
      row.total_imoveis,
      row.inicio_amostragem,
      row.amostra_necessaria,
    ]

    // Se for o primeiro quarteirão, a linha principal terá dados completos
    const lineData = [
      // Adapte para o nome do campo correto
      { value: row.area_codigo, align: 'C' },
      { value: row.cens_codigo, align: 'C' },
      { value: row.quarteirao, align: 'C' },
      { value: row.sub_numero, align: 'C' },
      { value: row.total_imoveis, align: 'C' },
      { value: row.inicio_amostragem, align: 'C' },
      { value: row.amostra_necessaria, align: 'C' },
    ]

    currentX = MARGIN_X

    if (row.cens_codigo !== oldCens) {
      qtCens++
      oldCens = row.cens_codigo
      if (!isFirst) {
        lineData[0].value = '-'
      }
    } else {
      lineData[0].value = '-'
      lineData[1].value = '-'
    }
    qtImoveis += parseInt(row.amostra_necessaria)

    // Itera sobre as colunas para desenhar a linha
    lineData.forEach((cell, index) => {
      const width = colWidths[index]

      const textValue = index < 2 && !isFirstQuarteirao ? '-' : String(cell.value).trim() // Usa '-' para linhas secundárias

      // Desenha a borda da Cell
      doc.rect(currentX, currentY, width, LINE_HEIGHT, 'S')

      // Desenha o texto
      let xPos = currentX
      if (cell.align === 'C') xPos += width / 2
      else if (cell.align === 'R')
        xPos += width - 1 // 1mm de margem interna
      else xPos += 1 // 1mm de margem interna para 'L'

      doc.text(textValue, xPos, currentY + LINE_HEIGHT / 2, {
        align: cell.align === 'L' ? 'left' : cell.align === 'R' ? 'right' : 'center',
        baseline: 'middle',
      })

      currentX += width
    })

    currentY += LINE_HEIGHT // $this->Ln(5)

    // Verifica se precisa de quebra de página
    if (currentY > 280) {
      // Próximo ao fim da página A4
      doc.addPage()
      currentY = 10
      // Opcionalmente, redesenha o cabeçalho aqui
    }

    // Se o seu array de backend tiver mais dados (como os detalhes de quarteirão)
    // você precisaria de um loop interno aqui, mas como seu Node.js já mesclou tudo,
    // o loop principal já deve tratar cada quarteirão como uma linha.
    isFirst = false
    isFirstQuarteirao = false // Próximo item do censitário será uma linha secundária
  })

  //Totalização
  const footers = ['Total', String(qtCens), String(dataTable.value.length), String(qtImoveis)]

  const footerWidths = [30, 30, 50, 60]
  currentX = MARGIN_X

  footers.forEach((footer, index) => {
    const width = footerWidths[index]

    // *** REDEFINIÇÃO DE CORES EM CADA CÉLULA ***

    // 1. Configurar o preenchimento (Fundo Cinza)
    doc.setFillColor(FILL_COLOR[0], FILL_COLOR[1], FILL_COLOR[2])

    // 2. Desenha o fundo e a borda (Preenchimento Cinza e Traço Preto)
    // Usa 'F' para preencher com o FillColor (Cinza)
    doc.rect(currentX, currentY, width, LINE_HEIGHT, 'F')

    // 3. Desenha APENAS a borda (Traço Preto)
    // Redefine a cor do traço para preto (se for a cor da borda desejada)
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2])
    doc.rect(currentX, currentY, width, LINE_HEIGHT, 'S')

    // 4. Configura a cor do texto (Preto)
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2])

    // 5. Desenha o texto
    doc.text(footer, currentX + width / 2, currentY + LINE_HEIGHT / 2, {
      align: 'center',
      baseline: 'middle',
    })

    currentX += width
  })

  var urlExportacao =
    'https://' +
    window.location.hostname +
    '/sisaweb/fichaSorteio.php?dest=2&local=' +
    encodeURIComponent('valorLocal')

  // Se você quiser customizar a cor e sublinhado como no PHP:
  doc.setTextColor(0, 0, 255) // Cor Azul
  doc.textWithLink('Exportar para .csv', 20, currentY + 10, { url: urlExportacao })
  doc.setTextColor(0, 0, 0) // Volta para a cor padrão (preto)

  // Salva o PDF
  // doc.save('relatorio_sorteio_manual.pdf')
  doc.output('dataurlnewwindow')
}

watch(
  () => filter.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  },
)
</script>

<style lang="scss" scoped></style>
