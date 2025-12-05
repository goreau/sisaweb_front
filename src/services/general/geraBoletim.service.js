import { jsPDF } from 'jspdf'

/**
 * Exporta um array de objetos JSON para um arquivo CSV.
 * @param {Array<Object>} data - O array de objetos a ser exportado.
 * @param {string} fileName - O nome do arquivo (sem extensão).
 */

export function boletim(data) {
  var doc = header(data)
  doc = cabecalho(doc)

  const colWidths = [
    10, 53, 10, 10, 7, 7, 7, 7, 7, 7, 11, 11, 11, 11, 11, 12, 10, 10, 10, 10, 15, 10, 10, 10,
  ]

  const MARGIN_X = 10 // Margem inicial X
  let currentX = MARGIN_X
  let currentY = 62 // Margem inicial Y
  const LINE_HEIGHT = 6

  const imoveis = data.imoveis
  const CHAR_TRACO = '-'

  var qtLinha = 0
  imoveis.forEach((row) => {
    const lineData = [
      // Adapte para o nome do campo correto
      { value: row.ordem, align: 'C' },
      {
        value: row.longitude == '' ? row.latitude : '(' + row.latitude + ', ' + row.longitude + ')',
        align: 'C',
      },
      { value: row.tempo ? row.tempo : '-', align: 'C' },
      { value: row.casa ? row.casa : 'N/I', align: 'C' },
      { value: row.id_situacao == 1 ? 'X' : '', align: 'C' },
      { value: row.id_situacao == 2 ? 'X' : '', align: 'C' },
      { value: row.id_situacao == 3 ? 'X' : '', align: 'C' },
      { value: row.id_situacao == 4 ? 'X' : '', align: 'C' },
      { value: row.id_situacao == 5 ? 'X' : '', align: 'C' },
      { value: row.id_situacao == 6 ? 'X' : '', align: 'C' },
      { value: row.mecanico ? 'X' : '-', align: 'C' },
      { value: row.alternativo ? 'X' : '-', align: 'C' },
      { value: row.focal ? 'X' : '-', align: 'C' },
      { value: row.perifocal ? 'X' : '-', align: 'C' },
      { value: row.nebul ? 'X' : '-', align: 'C' },
      { value: row.br_aedes ? 'X' : '-', align: 'C' },
    ]

    const recipientesData = row.recipientes || [] // Garante que é um array, mesmo que seja null/undefined

    // 3. Define a Linha Base para os dados fixos (para usar nos loops)
    let baseLineData = lineData

    // A. Caso não haja recipientes, ou haja, mas queremos tratar a primeira linha de forma especial
    // O número de linhas a imprimir é no mínimo 1 (sem recipiente) ou N (N recipientes)
    const numLinhas = Math.max(1, recipientesData.length)
    qtLinha += numLinhas

    for (let i = 0; i < numLinhas; i++) {
      const isPrimeiraLinha = i === 0

      // 4. Monta a seção de Recipientes para a linha atual
      let recipienteSection = []

      if (isPrimeiraLinha && recipientesData.length > 0) {
        // Primeira linha: usa os dados do primeiro recipiente, se existir
        const rec = recipientesData[0]
        recipienteSection = [
          { value: rec.cod_tipo ? rec.cod_tipo : '', align: 'C' },
          { value: rec.existente ? rec.existente : '', align: 'C' },
          { value: rec.agua ? rec.agua : '', align: 'C' },
          { value: rec.larva ? rec.larva : '', align: 'C' },
          { value: rec.amostra ? rec.amostra : '', align: 'C' },
          { value: rec.examinadas ? rec.examinadas : '', align: 'C' },
          { value: rec.aegypti ? rec.aegypti : '', align: 'C' },
          { value: rec.albopictus ? rec.albopictus : '', align: 'C' },
        ]
      } else if (!isPrimeiraLinha) {
        // Linhas secundárias (2ª em diante): usa os dados do recipiente seguinte
        const rec = recipientesData[i]
        recipienteSection = [
          { value: rec.cod_tipo ? rec.cod_tipo : '', align: 'C' },
          { value: rec.existente ? rec.existente : '', align: 'C' },
          { value: rec.agua ? rec.agua : '', align: 'C' },
          { value: rec.larva ? rec.larva : '', align: 'C' },
          { value: rec.amostra ? rec.amostra : '', align: 'C' },
          { value: rec.examinadas ? rec.examinadas : '', align: 'C' },
          { value: rec.aegypti ? rec.aegypti : '', align: 'C' },
          { value: rec.albopictus ? rec.albopictus : '', align: 'C' },
        ]
      } else {
        // Primeira linha SEM recipientes: preenche a seção de recipiente com traços
        // Ou, linhas secundárias, mas com array vazio (nunca deve ocorrer se numLinhas for 1)
        // Assumindo que a seção de recipiente tem 9 colunas.
        recipienteSection = Array(8).fill({ value: CHAR_TRACO, align: 'C' })
      }

      // 5. Monta o array final da linha
      const finalLine = [
        ...baseLineData, // Dados fixos ou traços
        ...recipienteSection, // Dados do recipiente atual ou traços
      ]

      // 6. Bloco de Impressão
      let currentX = MARGIN_X

      finalLine.forEach((cell, index) => {
        const width = colWidths[index]

        // Define o valor do texto:
        // Na primeira linha, usa o valor original. Nas demais, usa '-' para as colunas fixas.
        const textValue = String(cell.value).trim()

        // --- SEU CÓDIGO DE IMPRESSÃO ---
        doc.rect(currentX, currentY, width, LINE_HEIGHT, 'S')

        let xPos = currentX
        if (cell.align === 'C') xPos += width / 2
        else if (cell.align === 'R') xPos += width - 1
        else xPos += 1

        doc.text(textValue, xPos, currentY + LINE_HEIGHT / 2, {
          align: cell.align === 'L' ? 'left' : cell.align === 'R' ? 'right' : 'center',
          baseline: 'middle',
        })

        currentX += width
      })
      // --- FIM DO CÓDIGO DE IMPRESSÃO ---

      currentY += LINE_HEIGHT // Avança para a próxima linha

      // 7. Atualiza o BaseLineData para as próximas iterações (Linhas Secundárias)
      if (isPrimeiraLinha && numLinhas > 1) {
        // Prepara baseLineData para as linhas 2, 3, ... N (preenche com traços)
        baseLineData = baseLineData.map((cell) => ({
          value: CHAR_TRACO,
          align: cell.align,
        }))
      }

      // 8. Verifica se precisa de quebra de página
      if (currentY > 200) {
        doc.addPage()
        currentY = 10
        qtLinha = 0
        // Opcionalmente, redesenha o cabeçalho aqui
      }
    }
  })

  while (qtLinha < 20) {
    currentX = MARGIN_X

    colWidths.forEach((col) => {
      let xPos = currentX + col / 2
      doc.rect(currentX, currentY, col, LINE_HEIGHT, 'S')
      doc.text('', xPos, currentY + LINE_HEIGHT / 2, {
        align: 'center',
        baseline: 'middle',
      })
      currentX += col
    })
    currentY += LINE_HEIGHT
    qtLinha++
  }

  doc.output('dataurlnewwindow')
  //geraFile(doc) //gera apenas para download, não abre nnova guia
}

function geraFile(doc) {
  const nomeDesejado = 'Boletim.pdf'

  // 1. Gera a URL de dados limpa (sem o parâmetro filename no meio)
  const dataUrlLimpa = doc.output('datauristring')

  // 2. Cria um elemento <a> temporário
  const link = document.createElement('a')

  // 3. Define a URL de dados limpa como o href
  link.href = dataUrlLimpa

  // 4. Define o atributo 'download' com o nome desejado
  // Esta linha fará o download, não apenas abrir na aba.
  link.download = nomeDesejado

  // 5. Adiciona o link ao corpo (necessário para o .click() funcionar no Firefox)
  document.body.appendChild(link)

  // 6. Simula o clique
  link.click()

  // 7. Remove o link temporário
  document.body.removeChild(link)
}

function header(data) {
  const doc = new jsPDF('l', 'mm', 'a4')

  const MARGIN_X = 10 // Margem inicial X
  let currentX = MARGIN_X
  let currentY = 10 // Margem inicial Y
  const LINE_HEIGHT = 6

  doc.setFont('arial', 'bold')
  doc.setFontSize(14)

  doc.text('BOLETIM DE ATIVIDADES DE VIGILÂNCIA E CONTROLE', currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  doc.setLineWidth(0.2)
  doc.line(10, 14, 287, 14)
  doc.line(10, 15, 287, 15)
  doc.line(10, 16, 287, 16)
  doc.line(10, 17, 287, 17)

  doc.setFont('arial', '')
  doc.setFontSize(10)

  currentY = 25
  currentX = 130

  doc.text('Data: ' + data.data, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 210

  doc.text('Município: ' + data.municipio, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentY = 35
  currentX = 10

  doc.text('Atividade: ' + data.atividade, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 90

  doc.text('Área: ' + data.fant_area, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 130

  doc.text('Setor Censitário: ' + data.fant_cens, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 210

  doc.text('Quarteirão: ' + data.quadra, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentY = 45
  currentX = 10

  doc.text('Agente: ' + data.agente, currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 90

  doc.text('Execução: ', currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentY = currentY - 3
  currentX = 110
  doc.rect(currentX, currentY, 6, LINE_HEIGHT, 'S')

  currentX = 140
  doc.rect(currentX, currentY, 6, LINE_HEIGHT, 'S')

  currentX = 170
  doc.rect(currentX, currentY, 6, LINE_HEIGHT, 'S')

  currentY = currentY + 3

  switch (data.id_execucao) {
    case 1:
      currentX = 112
      break
    case 2:
      currentX = 142
      break
    default:
      currentX = 172
      break
  }

  doc.text('X', currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 118
  doc.text('Estado', currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 148
  doc.text('Município', currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  currentX = 178
  doc.text('ACS', currentX, currentY, {
    align: 'left',
    baseline: 'middle',
  })

  return doc
}

function cabecalho(doc) {
  const MARGIN_X = 10 // Margem inicial X
  let currentX = MARGIN_X
  let currentY = 50 // Margem inicial Y
  const LINE_HEIGHT = 6 // Altura da linha (como seu 'Ln(6)' e altura '6')

  doc.setFont('arial', '')
  doc.setFontSize(7)

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.1)
  const BORDER_COLOR = [0, 0, 0] // Cor preta para a borda
  const TEXT_COLOR = [0, 0, 0]

  currentX = MARGIN_X
  doc.rect(currentX, currentY, 10, LINE_HEIGHT * 2, 'S')

  currentX += 10
  doc.rect(currentX, currentY, 53, LINE_HEIGHT * 2, 'S')

  currentX += 53
  doc.rect(currentX, currentY, 10, LINE_HEIGHT * 2, 'S')

  currentX += 10
  doc.rect(currentX, currentY, 10, LINE_HEIGHT * 2, 'S')

  currentX += 10
  doc.rect(currentX, currentY, 42, LINE_HEIGHT, 'S')

  doc.rect(currentX, currentY + 6, 7, LINE_HEIGHT, 'S')

  currentX += 7
  doc.rect(currentX, currentY + 6, 7, LINE_HEIGHT, 'S')

  currentX += 7
  doc.rect(currentX, currentY + 6, 7, LINE_HEIGHT, 'S')

  currentX += 7
  doc.rect(currentX, currentY + 6, 7, LINE_HEIGHT, 'S')

  currentX += 7
  doc.rect(currentX, currentY + 6, 7, LINE_HEIGHT, 'S')

  currentX += 7
  doc.rect(currentX, currentY + 6, 7, LINE_HEIGHT, 'S')

  currentX += 7
  doc.rect(currentX, currentY, 67, LINE_HEIGHT, 'S')

  doc.rect(currentX, currentY + 6, 11, LINE_HEIGHT, 'S')

  currentX += 11
  doc.rect(currentX, currentY + 6, 11, LINE_HEIGHT, 'S')

  currentX += 11
  doc.rect(currentX, currentY + 6, 11, LINE_HEIGHT, 'S')

  currentX += 11
  doc.rect(currentX, currentY + 6, 11, LINE_HEIGHT, 'S')

  currentX += 11
  doc.rect(currentX, currentY + 6, 11, LINE_HEIGHT, 'S')

  currentX += 11
  doc.rect(currentX, currentY + 6, 12, LINE_HEIGHT, 'S')

  currentX += 12
  doc.rect(currentX, currentY, 40, LINE_HEIGHT, 'S')

  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  currentX += 10
  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  currentX += 10
  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  currentX += 10
  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  currentX += 10
  doc.rect(currentX, currentY, 15, LINE_HEIGHT * 2, 'S')

  currentX += 15
  doc.rect(currentX, currentY, 30, LINE_HEIGHT, 'S')

  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  currentX += 10
  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  currentX += 10
  doc.rect(currentX, currentY + 6, 10, LINE_HEIGHT, 'S')

  doc.text('CAD', 15, currentY + LINE_HEIGHT / 2, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('NÚM/', 88, currentY + LINE_HEIGHT / 2, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('SITUAÇÃO', 114, currentY + LINE_HEIGHT / 2, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('MEDIDAS DE CONTROLE', 168, currentY + LINE_HEIGHT / 2, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('RECIPIENTES', 221, currentY + LINE_HEIGHT / 2, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('RESULTADO', 271, currentY + LINE_HEIGHT / 2, {
    align: 'center',
    baseline: 'middle',
  })

  /***** */
  doc.text('LOCAL', 46, currentY + LINE_HEIGHT, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('TEMPO', 78, currentY + LINE_HEIGHT, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('AMOSTRA', 249, currentY + LINE_HEIGHT, {
    align: 'center',
    baseline: 'middle',
  })

  /***** */
  doc.text('ORDEM', 15, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('COMPL', 88, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('T', 97, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('F', 104, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('D', 111, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('T', 118, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('P', 125, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('R', 132, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('MEC', 141, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('ALT', 152, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('FOCAL', 163, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('PERI', 174, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('NEB', 185, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('BRAedes', 196, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('TIPO', 207, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('EXIST', 217, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('ÁGUA', 227, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('LARVA', 237, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('EXAM', 262, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('Ae aeg', 272, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  doc.text('Ae alb', 282, currentY + 9, {
    align: 'center',
    baseline: 'middle',
  })

  return doc
}
