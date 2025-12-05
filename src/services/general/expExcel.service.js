import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * Exporta um array de objetos JSON para um arquivo CSV.
 * @param {Array<Object>} data - O array de objetos a ser exportado.
 * @param {string} fileName - O nome do arquivo (sem extensão).
 */
export function exportToCSV(data, fileName = 'exportacao_dados') {
  if (!data || data.length === 0) {
    console.warn('Nenhum dado fornecido para exportação.')
    return
  }

  // 1. Cria a planilha (WorkSheet) a partir dos dados JSON
  const ws = XLSX.utils.json_to_sheet(data)

  // 2. Cria o arquivo de trabalho (WorkBook)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Dados')

  // 3. Gera o arquivo no formato CSV com o separador ';' (ponto e vírgula)
  const csvData = XLSX.write(wb, {
    bookType: 'csv',
    type: 'array',
    FS: ';', // Field Separator: Ponto e vírgula (ideal para Excel brasileiro)
  })

  // 4. Força o download usando file-saver
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `${fileName}.csv`)
}

// Opcional: Função para exportar para o formato nativo XLSX
export function exportToExcel(data, fileName = 'exportacao_dados') {
  // ... lógica semelhante, mas usando bookType: 'xlsx' ...
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Dados')

  // Gera o arquivo no formato nativo XLSX
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  saveAs(blob, `${fileName}.xlsx`)
}
