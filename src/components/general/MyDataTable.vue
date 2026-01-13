<!-- src/components/MyDataTable.vue -->
<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import {
  ColumnAutoSizeModule,
  CustomFilterModule,
  DateFilterModule,
  LocaleModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  themeAlpine,
  ValidationModule,
} from 'ag-grid-community'
import localeText from '@/utils/agGridLocale'
import { ClientSideRowModelModule } from 'ag-grid-community'
import { CsvExportModule } from 'ag-grid-community'
import tickCrossRenderer from '@/components/report/tickCrossRenderer.vue'

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ValidationModule,
  ColumnAutoSizeModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  PaginationModule,
  LocaleModule,
])

const paginationPageSizeSelector = [10, 20, 50, 100]

const props = defineProps({
  data: Array,
  columns: {
    type: Array,
    default: () => [],
  },
  pagination: Boolean,
  buttons: {
    type: Array,
    default: () => [],
  },
  loggedUser: {
    type: Object,
    default: () => {},
  },
  hasExports: Boolean,
  hasGraf: {
    type: Boolean,
    default: false,
  },
  calcHeight: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits([
  'edit',
  'delete',
  'quarteirao',
  'reset',
  'impersonate',
  'recipiente',
  'chart',
  'boletim',
])

const gridApi = ref(null)
const columnApi = ref(null)

const alturasFixas = ref(0)
const rowHeight = 50 // altura média de cada linha, ajuste conforme seu grid
const baseHeight = 60 // altura base (header + margens), ajuste se necessário

const rows = ref([...props.data])

function onGridReady(params) {
  gridApi.value = params.api
  // gridApi.value.sizeColumnsToFit()
  // Aguarda o grid estar visível (largura > 0) para ajustar colunas
  nextTick(() => {
    const gridContainer = document.querySelector('.ag-root') // Ou use um ref direto se tiver

    if (gridContainer && gridContainer.offsetWidth > 0) {
      gridApi.value.sizeColumnsToFit()
    } else {
      // Tenta novamente após um pequeno atraso
      setTimeout(() => {
        if (gridContainer && gridContainer.offsetWidth > 0) {
          gridApi.value.sizeColumnsToFit()
        }
      }, 100)
    }
  })
}

function autoSizeAll() {
  if (!columnApi.value) return

  const allColumnIds = columnApi.value.getAllColumns().map((col) => col.getColId())
  columnApi.value.autoSizeColumns(allColumnIds, false)
}

function shouldDisableButton(row, name) {
  if (!props.loggedUser) return
  if (name == 'reset' || name == 'impersonate') {
    return props.loggedUser.tipo > 1
  } else if (name == 'boletim') {
    return false
  } else {
    return props.loggedUser.id !== 0 && row.owner_id != props.loggedUser.id
  }
}

const getFilteredRows = () => {
  const rows = []
  const count = gridApi.value.getDisplayedRowCount()

  for (let i = 0; i < count; i++) {
    const rowNode = gridApi.value.getDisplayedRowAtIndex(i)
    rows.push(rowNode.data)
  }

  return rows
}

async function download_xlsx() {
  const XLSX = await import('xlsx')
  const { saveAs } = await import('file-saver')

  const data = getFilteredRows()

  // achata as colunas (com suporte a children)
  const exportCols = flattenColumns(props.columns).filter(
    (col) => col.field && col.field !== 'acoes',
  )

  const exportData = data.map((row) =>
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

  // monta os dados já com headers "pai - filho"
  /* const exportData = data.map((row) =>
    Object.fromEntries(exportCols.map((col) => [col.exportHeader, row[col.field]])),
  )*/

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer]), 'Sisaweb3.xlsx')
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

async function download_pdf() {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF({ orientation: 'landscape' })

  // achata colunas igual ao Excel
  const exportCols = flattenColumns(props.columns).filter(
    (col) => col.field && col.field !== 'acoes',
  )

  const headers = exportCols.map((col) => col.exportHeader)

  const rows = getFilteredRows().map((row) => exportCols.map((col) => row[col.field]))

  autoTable(doc, {
    head: [headers],
    body: rows,
  })

  doc.save('Sisaweb3.pdf')
}

function toGrafico() {
  emit('chart')
}

watch(
  () => props.data,
  (val) => {
    rows.value = [...val]
    if (columnApi.value) {
      nextTick(() => autoSizeAll())
    }
  },
  { deep: true },
)

onMounted(() => {
  let footer = document.querySelector('#footer')?.offsetHeight || 0
  let header = document.querySelector('.header')?.offsetHeight || 0
  alturasFixas.value = footer + header * 4
  nextTick(() => {
    if (gridApi.value && props.pagination) {
      //gridApi.value.setPaginationSetPageSize(20)
    }
  })
})

// Coluna de ações customizada
function createActionsColumn() {
  var definedWidth = 0
  if (props.buttons.length == 0) {
    return {}
  } else {
    definedWidth = props.buttons.length * 80
  }
  return {
    headerName: 'Ações',
    field: 'acoes',
    cellRenderer: ({ data }) => {
      const container = document.createElement('div')
      const addButton = (icon, title, emitName, className = 'is-success') => {
        if (!props.buttons.includes(emitName)) return
        const btn = document.createElement('button')
        btn.innerHTML = `<i class="${icon}"></i>`
        btn.title = title
        btn.className = `button is-small is-outlined ${className}`
        btn.disabled = shouldDisableButton(data, emitName)
        btn.onclick = () => emit(emitName, { row: data })
        container.appendChild(btn)
      }

      addButton('fas fa-edit', 'Editar', 'edit')
      addButton('fas fa-trash', 'Excluir', 'delete', 'is-danger')
      addButton('fas fa-file-pdf', 'Boletim', 'boletim', 'is-primary')
      addButton('fas fa-location-dot', 'Quarteirão', 'quarteirao', 'is-info')
      if (props.loggedUser.tipo == 1) {
        addButton('fas fa-power-off', 'Reset', 'reset', 'is-warning')
        addButton('fas fa-user-secret', 'Logar como', 'impersonate', 'is-info')
      }
      addButton('fas fa-glass-water-droplet', 'Recipientes', 'recipiente', 'is-info')

      return container
    },
    minWidth: definedWidth,
    suppressSizeToFit: true,
    pinned: 'right',
  }
}

// Configuração final das colunas
const agGridColumns = ref([])

const gridHeight = computed(() => {
  if (!props.calcHeight) return `calc(100vh - ${alturasFixas.value}px)`
  let alt = Math.min(rows.value.length * rowHeight + baseHeight, 500)
  return alt + 'px'
})

defineExpose({
  getFilteredRows,
  tickCrossRenderer,
  clearFilters() {
    gridApi.value?.setFilterModel(null)
  },
})

watch(
  () => props.columns,
  () => {
    agGridColumns.value = [
      ...props.columns.map((col) => ({
        ...col,
        sortable: true,
        filter: true,
        resizable: true,
      })),
      props.buttons?.length ? createActionsColumn() : null,
    ].filter(Boolean)
  },
  { immediate: true },
)

/**
 *  //height: 40rem"
    :style="{ height: gridHeight + 'px' }"
 */
</script>

<template>
  <div class="columns">
    <div class="column has-text-right">
      <span class="has-text-right export" v-if="hasGraf">
        <button class="button is-info is-outlined is-small" title="Gráfico" @click="toGrafico">
          <font-awesome-icon icon="fa-solid fa-chart-column" />
        </button>
      </span>
      <span class="has-text-right export" v-if="hasExports">
        <button class="button is-success is-outlined is-small" title="Excel" @click="download_xlsx">
          <font-awesome-icon icon="fa-solid fa-file-excel" />
        </button>
        <button class="button is-danger is-outlined is-small" title="Pdf" @click="download_pdf">
          <font-awesome-icon icon="fa-solid fa-file-pdf" />
        </button>
      </span>
    </div>
  </div>

  <AgGridVue
    :theme="themeAlpine"
    :style="{ width: '100%', height: gridHeight }"
    :rowData="rows"
    :columnDefs="agGridColumns"
    :pagination="pagination"
    :paginationPageSize="10"
    :pagination-auto-page-size="true"
    :localeText="localeText"
    :paginationPageSizeSelector="paginationPageSizeSelector"
    @grid-ready="onGridReady"
  />
</template>

<style>
.button {
  margin-left: 1rem;
  padding: 1rem;
  border-radius: 0.4rem !important;
}
.export {
  padding: 1rem;
}
</style>
