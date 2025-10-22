<script setup>
defineOptions({})
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Date, Object, null],
  minDate: Date,
  maxDate: Date,
  placeholder: {
    type: String,
    default: 'Selecione uma data',
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

const isMonthMode = computed(() => props.mode === 'month')

//const dateFormat = computed(() => (isMonthMode.value ? 'MM/yyyy' : 'dd/MM/yyyy'))
const dateFormat = (date) => {
  return props.mode === 'month'
    ? format(date, 'MMM/yyyy', { locale: ptBR }) // abreviado
    : format(date, 'dd/MM/yyyy', { locale: ptBR })
}

const innerValue = ref(null)

function areSameMonthYear(a, b) {
  return a && b && a.month === b.month && a.year === b.year
}

function areSameDate(a, b) {
  return a && b && a.getTime() === b.getTime()
}

function parseLocalDate(input) {
  // Garante que input seja uma string como '2025-03-01'
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [year, month, day] = input.split('-').map(Number)
    return new Date(year, month - 1, day) // JS: mês é 0-based
  }
  return new Date(input) // fallback
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      if (innerValue.value !== null) innerValue.value = null
      return
    }

    if (isMonthMode.value) {
      let newVal
      if (typeof val === 'object' && val.month !== undefined && val.year !== undefined) {
        newVal = val
      } else if (val instanceof Date) {
        newVal = { month: val.getMonth(), year: val.getFullYear() }
      } else if (typeof val === 'string') {
        const [year, month] = val.split('-').map(Number)
        newVal = { month: month - 1, year }
      } else {
        // fallback
        newVal = null
      }

      if (!areSameMonthYear(newVal, innerValue.value)) {
        innerValue.value = newVal
      }
    } else {
      let newDate = val instanceof Date ? val : parseLocalDate(val)
      if (!areSameDate(newDate, innerValue.value)) {
        innerValue.value = newDate
      }
    }
  },
  { immediate: true },
)

watch(innerValue, (val) => {
  if (!val) {
    emit('update:modelValue', null)
    return
  }

  if (isMonthMode.value) {
    // Sempre emite Date com dia 1
    const correctedDate =
      val instanceof Date
        ? new Date(val.getFullYear(), val.getMonth(), 1)
        : new Date(val.year, val.month, 1)

    if (
      !(props.modelValue instanceof Date) ||
      props.modelValue.getTime() !== correctedDate.getTime()
    ) {
      emit('update:modelValue', correctedDate)
    }
  } else {
    if (!(props.modelValue instanceof Date) || props.modelValue.getTime() !== val.getTime()) {
      emit('update:modelValue', val)
    }
  }
})
//:locale="ptBR" :locale="getLocale()"
//:day-names="['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
/**
 * <Datepicker
    v-model="innerValue"
    :locale="ptBR"
    :format-locale="ptBR"
    :format="dateFormat"
    :min-date="minDate"
    :max-date="maxDate"
    :type="isMonthMode ? 'month' : 'date'"
    :month-picker="isMonthMode"
    :auto-apply="true"
    :teleport="false"
    :enable-time-picker="false"
    :show-cancel="true"
    :clearable="true"
    input-class-name="input"
    :class="{ 'is-danger': error }"
    select-text="Confirmar"
    cancel-text="Cancelar"
    clear-text="Limpar"
    :hide-offset-dates="!isMonthMode"
    class="datepicker-wrapper"
    :placeholder="placeholder"
  />
 *
 *
 *
 *
 *
 *
 *
 * * */
</script>

<template>
  <Datepicker
    v-model="innerValue"
    :format-locale="ptBR"
    :format="dateFormat"
    :min-date="minDate"
    :max-date="maxDate"
    :type="isMonthMode ? 'month' : 'date'"
    :month-picker="isMonthMode"
    input-class-name="input"
    :class="{ 'is-danger': error }"
    :hide-offset-dates="!isMonthMode"
    class="datepicker-wrapper"
    :auto-apply="true"
    :enable-time-picker="false"
    :action-row="{ showNow: true }"
    :clearable="true"
  />
</template>
