<!-- TickCrossRenderer.vue -->
<template>
  <span :class="['tick-cell', params.value ? 'tick-yes' : 'tick-no']">
    {{ params.value ? '✔' : '✖' }}
  </span>
</template>

<script>
export default {
  props: ['params'],
}
</script>

<style scoped>
.tick-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1.3em;
}
.tick-yes {
  color: green;
}
.tick-no {
  color: red;
}
</style>
