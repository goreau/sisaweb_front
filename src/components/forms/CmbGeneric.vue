<template>
  <div class="control" data-focus-type="custom-select">
    <VSelect
      ref="vSelectRef"
      :options="combinedOptions"
      :reduce="(gen) => gen.id"
      label="nome"
      :filter-by="customFilterBy"
      :modelValue="modelValueProxy"
      @update:modelValue="modelValueProxy = $event"
      :class="props.errclass"
      placeholder="-- Selecione --"
    >
      <template #no-options="{}"> Nenhuma opção encontrada para a sua pesquisa. 😔 </template>
    </VSelect>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
import { computed, ref } from 'vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps({
  data: { type: Array, required: true },
  sel: [String, Number],
  errclass: Object,
  // 1. Nova prop opcional para receber a regra de filtro externa
  filterBy: { type: Function, default: null },
})

const emit = defineEmits(['update:sel', 'change'])
const vSelectRef = ref(null)

// 2. Filtro padrão do vue-select
const defaultFilter = (option, label, search) => {
  return (label || '').toLowerCase().indexOf((search || '').toLowerCase()) > -1
}

// 3. Usa o filtro recebido por prop ou recorre ao padrão
const customFilterBy = (option, label, search) => {
  if (typeof props.filterBy === 'function') {
    return props.filterBy(option, label, search)
  }
  return defaultFilter(option, label, search)
}

const modelValueProxy = computed({
  get: () => props.sel ?? null,
  set: (newValue) => {
    emit('update:sel', newValue)
    emit('change', newValue)
  },
})

const focusAndOpen = () => {
  if (vSelectRef.value) {
    vSelectRef.value.focus()
    vSelectRef.value.toggleDropdown(true)
  }
}

const placeholderOption = { id: 0, nome: '-- Selecione --' }

const combinedOptions = computed(() => {
  const isPlaceholderPresent = props.data?.some((item) => item.id === 0 || item.id === '0')

  if (!isPlaceholderPresent) {
    return [placeholderOption, ...(props.data || [])]
  }

  return props.data || []
})

defineExpose({
  focus: focusAndOpen,
})
</script>

<style scoped>
::v-deep(.v-select .vs__search) {
  line-height: 1.7 !important;
}

::v-deep(.v-select .vs__dropdown-menu) {
  margin-left: 0 !important;
  margin-top: 0 !important;
  border-top: 1px solid #b5b5b5;
}
</style>
