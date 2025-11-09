<template>
  <div
    class="radio-group"
    :class="{ inline }"
    ref="radioGroupRef"
    @keydown="handleKeydown"
    data-focus-type="custom-radio-group"
  >
    <label v-for="(option, index) in options" :key="index" class="radio">
      <input type="radio" :name="name" :value="option[valueKey]" v-model="modelValueProxy" />
      {{ option[labelKey] }}
    </label>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const radioGroupRef = ref(null)

function focus() {
  if (radioGroupRef.value) {
    // Foca no primeiro ou no rádio selecionado para iniciar a navegação
    const selectedRadio = radioGroupRef.value.querySelector('input[type="radio"]:checked')
    const target = selectedRadio || radioGroupRef.value.querySelector('input[type="radio"]')

    if (target) {
      target.focus()
    }
  }
}

function handleKeydown(event) {
  const radios = Array.from(radioGroupRef.value.querySelectorAll('input[type="radio"]'))
  const currentIndex = radios.findIndex((r) => r === document.activeElement)

  if (
    ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key) &&
    currentIndex !== -1
  ) {
    event.preventDefault() // Evita que a seta role a página
    let nextIndex = currentIndex

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % radios.length // Cicla para baixo
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + radios.length) % radios.length // Cicla para cima
    }

    // Move o foco para o próximo rádio e automaticamente o marca
    radios[nextIndex].focus()
    radios[nextIndex].checked = true // Marca a opção (se o v-model não fizer isso no focus)

    // Atualiza o v-model do componente para garantir que o Vue registre a seleção
    // Dispara manualmente o evento 'change' ou 'input' no rádio para que o v-model reaja
    const changeEvent = new Event('change')
    radios[nextIndex].dispatchEvent(changeEvent)
  }
}

defineExpose({
  focus, // Torna a função 'focus' acessível de fora
})

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  modelValue: [String, Number],
  valueKey: {
    type: String,
    default: 'id',
  },
  labelKey: {
    type: String,
    default: 'nome',
  },
  inline: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-group.inline {
  flex-direction: row;
  flex-wrap: wrap;
}

.radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
