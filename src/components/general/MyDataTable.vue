<!-- src/components/MyDataTable.vue -->
<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community'
import localeText from '@/utils/agGridLocale'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

ModuleRegistry.registerModules([AllCommunityModule])

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
  calcHeight: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['edit', 'delete', 'quarteirao', 'reset', 'impersonate', 'recipiente'])

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

function download_xlsx() {
  const data = getFilteredRows()

  const exportCols = props.columns.filter((col) => col.field !== 'acoes')
  const exportData = data.map((row) =>
    Object.fromEntries(exportCols.map((col) => [col.headerName, row[col.field]]))
  )

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer]), 'Sisaweb3.xlsx')
}

function download_pdf() {
  const data = getFilteredRows()

  const doc = new jsPDF()
  const exportCols = props.columns.filter((col) => col.field !== 'acoes')
  const headers = exportCols.map((col) => col.headerName)
  const linhas = data.map((row) => exportCols.map((col) => row[col.field]))
  autoTable(doc, { head: [headers], body: linhas })
  doc.save('Sisaweb3.pdf')
}

watch(
  () => props.data,
  (val) => {
    rows.value = [...val]
    if (columnApi.value) {
      nextTick(() => autoSizeAll())
    }
  },
  { deep: true }
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
  if (props.buttons.length == 0) {
    return {}
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
      addButton('fas fa-location-dot', 'Quarteirão', 'quarteirao', 'is-info')
      if (props.loggedUser.tipo == 1) {
        addButton('fas fa-power-off', 'Reset', 'reset', 'is-warning')
        addButton('fas fa-user-secret', 'Logar como', 'impersonate', 'is-info')
      }
      addButton('fas fa-glass-water-droplet', 'Recipientes', 'recipiente', 'is-info')

      return container
    },
    width: 200,
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
  { immediate: true }
)

/**
 *  //height: 40rem"
    :style="{ height: gridHeight + 'px' }"
 */
</script>

<template>
  <div class="has-text-right export" v-if="hasExports">
    <button class="button is-success is-outlined is-small" @click="download_xlsx">
      <font-awesome-icon icon="fa-solid fa-file-excel" />
    </button>
    <button class="button is-danger is-outlined is-small" @click="download_pdf">
      <font-awesome-icon icon="fa-solid fa-file-pdf" />
    </button>
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
