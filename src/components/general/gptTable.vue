<!-- src/components/MyDataTable.vue -->
<script setup>
import { ref, watch } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'

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
})

const emit = defineEmits(['edit', 'delete', 'quarteirao', 'reset', 'impersonate', 'recipiente'])

const rows = ref([...props.data]) // cópia reativa

function shouldDisableButton(row) {
  if (props.loggedUser === 0) {
    return false
  } else {
    return row.owner_id != props.loggedUser
  }
}

watch(
  () => props.data,
  (newVal) => {
    rows.value = [...newVal]
  },
  { deep: true }
)
</script>

<template>
  <VueGoodTable
    :columns="columns"
    :rows="rows"
    :pagination-options="{
      enabled: pagination,
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
