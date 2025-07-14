<template>
  <div class="control">
    <div class="select">
      <select @change="onChange($event)" class="input" :class="props.errclass">
        <option value="0">-- Selecione --</option>
        <option v-for="gen in props.data" :key="gen.id" :value="gen.id" :selected="gen.id == props.sel">
          {{ gen.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>

const props = defineProps(['sel', 'errclass', 'data']);
const emit = defineEmits(['selGen']);

function onChange(event) {
  emit('selGen', event.target.value);
}
</script>

<style scoped></style>
