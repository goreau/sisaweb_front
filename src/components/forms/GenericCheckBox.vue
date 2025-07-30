<template>
  <div class="field mb-3" v-if="checkAll">
    <label class="checkbox">
      <input type="checkbox" :checked="allSelected" @change="toggleAll" />
      Selecionar todos
    </label>
  </div>
  <div class="columns is-multiline">
    <div v-for="(col, colIndex) in columns" :key="colIndex" class="column" :class="columnClass">
      <div v-for="(item, i) in col" :key="i" class="field">
        <label class="checkbox">
          <input type="checkbox" :value="item[valueKey]" v-model="modelValueLocal" />
          {{ item[labelKey] }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

var allSelected = false

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  checkedIds: {
    type: Array,
    default: () => [],
  },
  valueKey: {
    type: String,
    default: 'id',
  },
  labelKey: {
    type: String,
    default: 'nome',
  },
  columnsCount: {
    type: Number,
    default: 3,
  },
  checkAll: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Ao montar, inicializa com checkedIds se modelValue vier vazio
onMounted(() => {
  if (props.checkedIds.length > 0) {
    //props.modelValue.length === 0 &&
    emit('update:modelValue', [...props.checkedIds])
  }
})

const columns = computed(() => {
  const result = []
  const perCol = Math.ceil(props.options.length / props.columnsCount)

  for (let i = 0; i < props.columnsCount; i++) {
    result.push(props.options.slice(i * perCol, (i + 1) * perCol))
  }

  return result
})

const columnClass = computed(() => {
  const cols = props.columnsCount
  if (cols === 1) return 'is-full'
  if (cols === 2) return 'is-half'
  if (cols === 3) return 'is-one-third'
  if (cols === 4) return 'is-one-quarter'
  return ''
})

/************ */

const toggleAll = () => {
  if (allSelected) {
    // Deseleciona tudo
    modelValueLocal.value = []
  } else {
    // Seleciona todos os IDs disponíveis
    modelValueLocal.value = props.options.map((opt) => opt[props.valueKey])
  }
  allSelected = !allSelected
}
</script>
