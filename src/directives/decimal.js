export default {
  beforeMount(el) {
    el.addEventListener('input', () => {
      el.value = el.value.replace(',', '.');
      el.dispatchEvent(new Event('input')); // atualiza o v-model
    });
  }
}
