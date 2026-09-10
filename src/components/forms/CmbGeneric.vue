<template>
  <div class="control" data-focus-type="custom-select">
    <VSelect
      ref="vSelectRef"
      :options="combinedOptions"
      :reduce="(gen) => gen.id"
      label="nome"
      :modelValue="modelValueProxy"
      @update:modelValue="modelValueProxy = $event"
      :class="props.errclass"
      placeholder="-- Selecione --"
    >
      <template #no-options="{ loading, searching, options }">
        Nenhuma opção encontrada para a sua pesquisa. 😔
      </template>
    </VSelect>
  </div>
</template>

<script>
// 1. Desativa a herança de atributos na raiz
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
  sel: [String, Number], // Já aceita texto ou número
  errclass: Object,
})
const emit = defineEmits(['update:sel', 'change'])

const vSelectRef = ref(null)

const modelValueProxy = computed({
  get: () => {
    // Retorna o valor original sem forçar Number().
    // Se for undefined ou null, retorna null para o VSelect.
    return props.sel ?? null
  },
  set: (newValue) => {
    console.log('Mudou o valor do controle')
    // Ao receber um novo valor (string ou number), emite diretamente
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

// Aceita ID numérico ou string para não conflitar com opções baseadas em texto
const placeholderOption = { id: 0, nome: '-- Selecione --' }

const combinedOptions = computed(() => {
  const isPlaceholderPresent = props.data.some((item) => item.id === 0 || item.id === '0')

  if (!isPlaceholderPresent) {
    return [placeholderOption, ...props.data]
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
