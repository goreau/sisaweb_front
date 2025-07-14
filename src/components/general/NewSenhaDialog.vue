<template>
  <popup-modal ref="popup">
    <div class="columns titule">
      <p>Você está acessando pela primeira vez essa nova versão do sistema. Por isso, é necessário alterar ou confirmar
        sua senha!</p>
    </div>
    <div class="corpo">
      <div class="field">
        <label class="label">Senha</label>
        <div class="control">
          <input class="input" type="password" v-model="senha" placeholder="Informe a senha a ser utilizada"
            :class="{ 'is-danger': v$.senha.$error }" />
          <span class="is-error" v-if="v$.senha.$error">
            {{ v$.senha.$errors[0].$message }}
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Confirme a Senha</label>
        <div class="control">
          <input class="input" type="password" v-model="confirma" placeholder="Confirme a senha"
            :class="{ 'is-danger': v$.confirma.$error }" />
          <span class="is-error" v-if="v$.confirma.$error">
            {{ v$.confirma.$errors[0].$message }}
          </span>
        </div>
      </div>
    </div>
    <div class="btns">
      <button class="button conf-btn" @click="_confirm">{{ okButton }}</button>
      <button class="button cancel-btn" @click="_cancel">{{ cancelButton }}</button>
    </div>
  </popup-modal>
</template>

<script setup>
import PopupModal from './PopupModal.vue';
import useVuelidate from '@vuelidate/core';
import {
  required$,
  minLength$,
  sameAs$
} from "../forms/validators";
import { ref } from 'vue';

// Parameters that change depending on the type of dialogue
var okButton = ref(undefined); // Text for confirm button; leave it empty because we don't know what we're using it for
var cancelButton = ref('Cancelar'); // text for cancel button

// Private variables
var resolvePromise = ref(undefined);
var rejectPromise = ref(undefined);
const senha = ref('')
const confirma = ref('')

const popup = ref(null);

const form = {
  senha,
  confirma,
}

const rules = {
  senha: { required$, minLength: minLength$(4) },
  confirma: { required$, sameAs$: sameAs$(senha) }
}

const v$ = useVuelidate(rules, form);

function show(opts = {}) {
  form.value = { senha: '', confirma: '' }; // ← limpa o form
  v$.value.$reset();

  okButton.value = opts.okButton
  if (opts.cancelButton) {
    cancelButton.value = opts.cancelButton
  }
  // Once we set our config, we tell the popup modal to open
  popup.value.open()
  // Return promise so the caller can get results
  return new Promise((resolve, reject) => {
    resolvePromise.value = resolve
    rejectPromise.value = reject
  })
}

function _confirm() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    resolvePromise.value(form.senha);
    popup.value.close();
  }
}

function _cancel() {
  popup.value.close();
  resolvePromise('');
}

defineExpose({
  show
})

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
