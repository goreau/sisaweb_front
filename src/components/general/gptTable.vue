<!-- src/components/MyDataTable.vue -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  search: {
    type: Boolean,
    default: true,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  buttons: {
    type: Array,
    default: () => ['e', 'd'],
  },
  loggedUser: {
    type: Number,
    default: 0,
  },
  hasExports: {
    type: Boolean,
    default: true,
  },
})

const filtro = ref('')
const paginationEnabled = ref(true)

const emit = defineEmits([
  'edit',
  'delete',
  'quarteirao',
  'reset',
  'impersonate',
  'recipiente',
  'search',
])

const rows = ref([...props.data]) // cópia reativa

function onSearch(params) {
  filtro.value = params.searchTerm
  filtrados()
}

function onPageChange(params) {
  // params.currentPage - current page that pagination is at
  if (props.pagination) {
    paginationEnabled.value = params.total > params.currentPerPage
  }
  //- number of items per page
  //- total number of items in the table
}

function filtrados() {
  if (!filtro.value) return rows.value
  const rowsFiltered = rows.value.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(filtro.value.toLowerCase()))
  )
  emit('search', rowsFiltered)
  return rowsFiltered
}

function shouldDisableButton(row) {
  if (props.loggedUser === 0) {
    return false
  } else {
    return row.owner_id != props.loggedUser
  }
}

function download_xlsx() {
  const filename = 'Sisaweb3.xlsx'
  const exportCols = props.columns.filter((col) => col.field !== 'acoes')

  const myRows = filtrados()

  // Monta nova estrutura de dados
  const exportData = myRows.map((row) =>
    Object.fromEntries(exportCols.map((col) => [col.label, row[col.field]]))
  )

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, filename)
}

function download_pdf() {
  const filename = 'Sisaweb3.pdf'

  const doc = new jsPDF()

  const myRows = filtrados()

  const exportCols = props.columns.filter((col) => col.field !== 'acoes')
  const headers = exportCols.map((col) => col.label)
  const linhas = myRows.map((row) => exportCols.map((col) => row[col.field]))

  autoTable(doc, {
    head: [headers],
    body: linhas,
  })

  doc.save(filename)
}

watch(
  () => props.data,
  (newVal) => {
    rows.value = [...newVal]
  },
  { deep: true }
)
onMounted(async () => {
  paginationEnabled.value = props.pagination && rows.value.length > 10
})
</script>

<template>
  <div class="has-text-right export" v-if="hasExports">
    <button
      id="download-xlsx"
      class="button is-success is-outlined is-small"
      @click="download_xlsx"
    >
      <font-awesome-icon icon="fa-solid fa-file-excel" />
    </button>
    <button id="download-pdf" class="button is-danger is-outlined is-small" @click="download_pdf">
      <font-awesome-icon icon="fa-solid fa-file-pdf" />
    </button>
  </div>
  <VueGoodTable
    :columns="columns"
    :rows="rows"
    :pagination-options="{
      enabled: paginationEnabled,
      perPage: 10,
      dropdownAllowAll: true,
      nextLabel: 'próximo',
      prevLabel: 'anterior',
      rowsPerPageLabel: 'Linhas por página',
      ofLabel: 'de',
      pageLabel: 'página',
      allLabel: 'Todos',
    }"
    :search-options="{ enabled: search, placeholder: 'Procurar nessa tabela' }"
    v-on:search="onSearch"
    v-on:per-page-change="onPageChange"
    class="table is-bordered is-hoverable is-fullwidth"
  >
    <!-- slot para ações -->
    <template #table-row="props">
      <span v-if="props.column.field !== 'acoes'">
        {{ props.formattedRow[props.column.field] }}
      </span>
      <span v-if="props.column.field === 'acoes'">
        <button
          :disabled="shouldDisableButton(props.row)"
          class="btn-delete button is-small is-success is-outlined"
          title="Editar"
          v-if="buttons.includes('e')"
          @click="$emit('edit', { row: props.row, index: props.index })"
        >
          <span class="icon is-small is-left">
            <font-awesome-icon icon="fa-solid fa-edit" />
          </span>
        </button>
        <button
          :disabled="shouldDisableButton(props.row)"
          class="btn-delete button is-small is-danger is-outlined"
          title="Excluir"
          v-if="buttons.includes('d')"
          @click="$emit('delete', { row: props.row, index: props.index })"
        >
          <span class="icon is-small is-left">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </span>
        </button>
        <button
          class="btn-view button is-small is-info is-outlined"
          title="Quarteirões"
          v-if="buttons.includes('q')"
          @click="$emit('quarteirao', { row: props.row, index: props.index })"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="fa-solid fa-trash" />
          </span>
        </button>
        <button
          class="btn-view button is-small is-warning is-outlined"
          title="Reset"
          v-if="buttons.includes('r')"
          @click="$emit('reset', { row: props.row, index: props.index })"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="fa-solid fa-power-off" />
          </span>
        </button>
        <button
          class="btn-view button is-small is-info is-outlined"
          title="Logar como"
          v-if="buttons.includes('p')"
          @click="$emit('impersonate', { row: props.row, index: props.index })"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="fa-solid fa-user-secret" />
          </span>
        </button>
        <button
          class="btn-view button is-small is-info is-outlined"
          title="Recipientes"
          v-if="buttons.includes('v')"
          @click="$emit('recipiente', { row: props.row, index: props.index })"
        >
          <span class="icon is-small">
            <font-awesome-icon icon="fa-solid fa-glass-water-droplet" />
          </span>
        </button>
      </span>
    </template>
  </VueGoodTable>
</template>

<style scoped>
.button {
  margin-left: 1rem;
  padding: 1rem;
  border-radius: 0.4rem !important;
}
.export {
  padding: 1rem;
}
/* Aplicar estilos com profundidade */
/*::v-deep .vgt-table {
  background-color: white;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
}

::v-deep .vgt-table .vgt-wrap {
  border: solid 2px #000 !important;
}

::v-deep .vgt-table table {
  width: 100%;
  border-collapse: collapse;
}

::v-deep .vgt-table thead th {
  color: #000;
  font-weight: bold;
  text-align: left;
  background: #cabb9c;
  padding: 0.75rem;
}

::v-deep .vgt-table tbody td {
  padding: 0.5rem;
}*/
</style>
