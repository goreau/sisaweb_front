<template>
  <article class="message" :class="style">
    <div class="message-header">
      <p>{{ caption }}</p>
      <button class="delete" @click="fechar" aria-label="delete"></button>
    </div>
    <div class="message-body">
      <p v-html="formattedMessage"></p>
    </div>
  </article>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';

const style = ref('');
const props = defineProps({
  msg: String,
  caption: String,
  type: String
});
const emit = defineEmits(['doClose']);

function fechar() {
  emit('doClose');
}

onMounted(() => {
  style.value = props.type == 'alert' ? 'is-danger' : (props.type == 'success' ? 'is-success' : (props.type == 'warning' ? 'is-warning' : 'is-info'));
});

const formattedMessage = computed(() => {
  return props.msg;
});
</script>

<style></style>
