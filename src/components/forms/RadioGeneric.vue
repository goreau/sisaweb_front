<template>
  <div class="radio-group" :class="{ inline }">
    <label v-for="(option, index) in options" :key="index" class="radio">
      <input type="radio" :name="name" :value="option[valueKey]" v-model="modelValueProxy" />
      {{ option[labelKey] }}
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  modelValue: [String, Number],
  valueKey: {
    type: String,
    default: 'id'
  },
  labelKey: {
    type: String,
    default: 'nome'
  },
  inline: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
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
