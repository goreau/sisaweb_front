<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ptBR } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'
import { computed, ref, watch, getCurrentInstance, onMounted } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: [String, Date, Object, null],
  minDate: Date,
  maxDate: Date,
  placeholder: {
    type: String,
    default: 'dd/mm/aaaa',
  },
  error: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'date',
  },
})

const emit = defineEmits(['update:modelValue'])
const datepickerRef = ref(null)

// Campo de texto interno controlado por nós
const textInputValue = ref('')
const innerValue = ref(null)

const isMonthMode = computed(() => props.mode === 'month')

function focus() {
  const inputEl = datepickerRef.value?.$el?.querySelector('.dp__input')
  if (inputEl) inputEl.focus()
}

defineExpose({ focus })

// Formata a data que vem de fora/datepicker para exibir no input
const formatDateDisplay = (date) => {
  if (!date || !(date instanceof Date) || !isValid(date)) return ''
  return props.mode === 'month'
    ? format(date, 'MM/yyyy', { locale: ptBR })
    : format(date, 'dd/MM/yyyy', { locale: ptBR })
}

// Sincroniza props.modelValue -> innerValue & textInputValue

/*watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      innerValue.value = null
      textInputValue.value = ''
      return
    }

    let parsedDate = null
    if (val instanceof Date && isValid(val)) {
      parsedDate = val
    } else if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [year, month, day] = val.split('-').map(Number)
      parsedDate = new Date(year, month - 1, day)
    }

    if (parsedDate && isValid(parsedDate)) {
      innerValue.value = parsedDate
      textInputValue.value = formatDateDisplay(parsedDate)
    }
  },
  { immediate: true },
)*/

// Manipula a digitação manual do usuário
const handleInput = (event) => {
  let value = event.target.value

  // Aplica máscara visual dd/mm/yyyy enquanto digita
  const clean = value.replace(/\D/g, '')
  if (clean.length <= 2) {
    value = clean
  } else if (clean.length <= 4) {
    value = `${clean.slice(0, 2)}/${clean.slice(2)}`
  } else {
    value = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`
  }

  textInputValue.value = value

  // 🛑 SÓ CONVERTE E EMITE QUANDO TIVER 8 DÍGITOS (DDMMYYYY)
  if (clean.length === 8) {
    const day = parseInt(clean.substring(0, 2), 10)
    const month = parseInt(clean.substring(2, 4), 10) - 1
    const year = parseInt(clean.substring(4, 8), 10)

    const parsedDate = new Date(year, month, day)

    if (
      isValid(parsedDate) &&
      parsedDate.getDate() === day &&
      parsedDate.getMonth() === month &&
      parsedDate.getFullYear() === year
    ) {
      innerValue.value = parsedDate
      emit('update:modelValue', parsedDate)
    }
  } else if (clean.length === 0) {
    innerValue.value = null
    emit('update:modelValue', null)
  }
}

const syncValueFromProp = (val) => {
  if (!val) {
    innerValue.value = null
    textInputValue.value = ''
    return
  }

  let parsedDate = null

  // 1. Se já vier como objeto Date do JavaScript
  if (val instanceof Date && isValid(val)) {
    parsedDate = val
  }
  // 2. Se vier como String do tipo YYYY-MM-DD ou ISO
  else if (typeof val === 'string') {
    // Se for formato AAAA-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
      const [year, month, day] = val.substring(0, 10).split('-').map(Number)
      parsedDate = new Date(year, month - 1, day)
    }
    // Se for formato BR DD/MM/AAAA
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
      const [day, month, year] = val.split('/').map(Number)
      parsedDate = new Date(year, month - 1, day)
    }
    // Fallback generico
    else {
      const d = new Date(val)
      if (isValid(d)) parsedDate = d
    }
  }

  // Atribui o valor se for uma data válida
  if (parsedDate && isValid(parsedDate)) {
    innerValue.value = parsedDate
    textInputValue.value = formatDateDisplay(parsedDate)
  }
}

// Quando o usuário seleciona uma data clicando no calendário
const handleDateSelect = (date) => {
  innerValue.value = date
  textInputValue.value = formatDateDisplay(date)
  emit('update:modelValue', date)
}

watch(
  () => props.modelValue,
  (newVal) => {
    syncValueFromProp(newVal)
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  syncValueFromProp(props.modelValue)
  const instance = getCurrentInstance()
  const rootEl = instance?.vnode?.el
  if (rootEl && rootEl.setAttribute) {
    rootEl.setAttribute('data-focus-type', 'custom-datepicker')
  }
})
</script>

<template>
  <Datepicker
    ref="datepickerRef"
    v-model="innerValue"
    :format-locale="ptBR"
    :min-date="minDate"
    :max-date="maxDate"
    :type="isMonthMode ? 'month' : 'date'"
    :month-picker="isMonthMode"
    :hide-offset-dates="!isMonthMode"
    class="datepicker-wrapper"
    :auto-apply="true"
    :enable-time-picker="false"
    :clearable="true"
    @update:model-value="handleDateSelect"
  >
    <!-- Slot customizado que substitui o input padrão -->
    <template #dp-input="{ onFocus, onBlur }">
      <input
        type="text"
        class="dp__input input"
        :class="{ 'is-danger': error }"
        :placeholder="placeholder"
        :value="textInputValue"
        @input="handleInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </template>
  </Datepicker>
</template>
