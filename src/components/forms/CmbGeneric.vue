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
  sel: [String, Number], // Corresponde ao modelValue
  errclass: Object,
})
const emit = defineEmits(['update:sel', 'change'])

const vSelectRef = ref(null)

const modelValueProxy = computed({
  get: () => {
    // Ao ler, retorna o valor atual da prop 'sel'
    return props.sel
  },
  set: (newValue) => {
    console.log('Mudou o valor do controle')
    // Ao receber um novo valor (do vue-select), emite para o componente pai
    emit('update:sel', newValue)
  },
})

const focusAndOpen = () => {
  if (vSelectRef.value) {
    // 1. Foca o elemento de input interno
    vSelectRef.value.focus()

    // 2. Abre o dropdown
    vSelectRef.value.toggleDropdown(true)
  }
}

const placeholderOption = { id: 0, nome: '-- Selecione --' }

// 🌟 Propriedade Computada para Gerar a Lista
const combinedOptions = computed(() => {
  const isPlaceholderPresent = props.data.some((item) => item.id === 0)

  if (!isPlaceholderPresent) {
    // 3. Retorna um novo array combinando o placeholder e os dados reais
    return [placeholderOption, ...props.data]
  }

  return props.data || [] // Retorna os dados originais se vazios ou se o placeholder já estiver lá
})

defineExpose({
  // Expor apenas 'focus' que o FocusManager chamará
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
