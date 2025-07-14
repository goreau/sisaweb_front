<template>
  <popup-modal ref="popup">
    <div class="columns titule">
      <p>{{ title }}</p>
    </div>
    <div class="corpo">
      <p>{{ message }}</p>
    </div>
    <div class="btns">
      <button class="button conf-btn" @click="confirm">{{ okButton }}</button>
      <button class="button cancel-btn" @click="cancel">{{ cancelButton }}</button>
    </div>
  </popup-modal>
</template>

<script setup>
import { ref } from 'vue';
import PopupModal from './PopupModal.vue'

const popup = ref(null);
// Parameters that change depending on the type of dialogue
var title = ref(undefined);
var message = ref(undefined); // Main text content
var okButton = ref(undefined); // Text for confirm button; leave it empty because we don't know what we're using it for
var cancelButton = ref('Cancelar'); // text for cancel button

// Private variables
//var resolvePromise = ref(undefined);
//var rejectPromise = ref(undefined);
let resolvePromise;

function show(opts = {}) {
  title.value = opts.title
  message.value = opts.message
  okButton.value = opts.okButton
  if (opts.cancelButton) {
    cancelButton.value = opts.cancelButton
  }

  // Once we set our config, we tell the popup modal to open
  popup.value.open()
  // Return promise so the caller can get results
  return new Promise((resolve) => {
    resolvePromise = resolve;
  })
}

defineExpose({
  show,
  confirm,
  cancel
})

function confirm() {
  popup.value.close()
  if (resolvePromise) resolvePromise(true)
}

function cancel() {
  popup.value.close()
  if (resolvePromise) resolvePromise(false)
}
</script>

<style scoped>
.titule {
  margin-top: 0;
  padding: .5rem .3rem;
  border-bottom: 1px solid rgb(50, 50, 104);
}

.titule p {
  font-size: large;
  font-weight: bold;
  padding: .5rem;
}

.btns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem 15% .2rem 15%;
}

.corpo {
  padding: 1rem 0;
}

.conf-btn {
  background-color: #4f52a3;
  color: #e6e2db;
  font-weight: bold;
  border: 2px solid #13156e;
  padding: 1rem;
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.conf-btn:hover {
  background-color: transparent;
  color: #13156e;
  border: 2px solid #4f52a3;
}

.cancel-btn {
  background-color: #509966;
  color: #e6e4df;
  font-weight: bold;
  border: 2px solid #1a8339;
  padding: 1rem;
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.cancel-btn:hover {
  background-color: transparent;
  color: #1a8339;
  border: 2px solid #509966;
}
</style>
