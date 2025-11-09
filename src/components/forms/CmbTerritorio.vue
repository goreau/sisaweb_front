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
import TerritorioService from '@/services/general/territorio.service.js'
import { computed, onMounted, ref, watch } from 'vue'
import VSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const territorios = ref([])
const selectElement = ref(null)

const props = defineProps({
  tipo: { type: Number, required: true },
  sel: [String, Number], // Corresponde ao modelValue
  errclass: Object,
  // Assumindo que você tem as chaves 'id' e 'nome' no seu objeto 'gen'
})

const emit = defineEmits(['update:sel', 'change'])

const modelValueProxy = computed({
  get: () => {
    // Ao ler, retorna o valor atual da prop 'sel'
    return props.sel
  },
  set: (newValue) => {
    // Ao receber um novo valor (do vue-select), emite para o componente pai
    emit('update:sel', newValue)
    // Mantenha o evento 'change' se ele for usado no seu sistema legado
    emit('change', newValue)
  },
})

function focus() {
  if (selectElement.value) {
    selectElement.value.focus()
  }
}

// 2. Exponha a função de foco
defineExpose({
  focus, // Torna a função 'focus' acessível de fora
})

async function loadData() {
  const result = await TerritorioService.getCombo(props.tipo)
  if (result.error) {
    console.log(result.error)
    territorios.value = []
  } else {
    territorios.value = result
  }
}

const placeholderOption = { id: 0, nome: '-- Selecione --' }

const combinedOptions = computed(() => {
  const isPlaceholderPresent = territorios.value.some((item) => item.id === 0)

  if (!isPlaceholderPresent) {
    // 3. Retorna um novo array combinando o placeholder e os dados reais
    return [placeholderOption, ...territorios.value]
  }

  return territorios.value || [] // Retorna os dados originais se vazios ou se o placeholder já estiver lá
})

watch(
  () => props.tipo,
  (newVal) => {
    loadData(newVal)
  },
)

onMounted(() => {
  loadData(props.tipo)
})
</script>

<style scoped>
::v-deep(.v-select .vs__search) {
  line-height: 1.7 !important;
}

/* 2. Correção da margem da lista (se .content ul for o seletor correto) */
/* Nota: Você precisa ter certeza que o elemento com a classe 'content'
   está dentro do DOM do seu CmbGeneric, ou que 'content ul' é o seletor exato do dropdown. */
::v-deep(.v-select .vs__dropdown-menu) {
  margin-left: 0 !important;
  margin-top: 0 !important;
  border-top: 1px solid #b5b5b5;
}
</style>
