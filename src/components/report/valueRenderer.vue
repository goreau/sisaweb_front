<template>
  <span :class="['value-cell', isHigh ? 'text-red' : 'text-normal']">
    {{ params.value }}
  </span>
</template>

<script>
export default {
  name: 'ColorValueRenderer',
  computed: {
    isHigh() {
      // Converte para número e valida se é maior que 50
      const val = parseFloat(this.params.value)
      return !isNaN(val) && val > 50
    },
  },
}
</script>

<style scoped>
.value-cell {
  font-weight: bold;
}
.text-red {
  color: red;
}
.text-normal {
  color: inherit; /* Ou a cor padrão do seu tema */
}
</style>
