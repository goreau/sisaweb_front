<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Usuário</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Nome" v-model="nome"
                    :class="{ 'is-danger': v$.nome.$error }" />
                  <span class="is-error" v-if="v$.nome.$error">
                    {{ v$.nome.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <fieldset class="fieldset">
                <legend>Nível</legend>
                <div class="field">
                  <div class="columns">
                    <div class="column is-4">
                      <label class="radio">
                        <input type="radio" name="nivel" value="1" v-model="nivel" />
                        Administrador
                      </label>
                      <label class="radio">
                        <input type="radio" name="nivel" value="6" v-model="nivel" />
                        Visualizador Estado
                      </label>
                    </div>
                    <div class="column is-4">
                      <label class="radio">
                        <input type="radio" name="nivel" value="2" v-model="nivel" />
                        Gestor Regional
                      </label>
                      <label class="radio">
                        <input type="radio" name="nivel" value="3" v-model="nivel" />
                        User Regional
                      </label>
                      <label class="radio">
                        <input type="radio" name="nivel" value="9" v-model="nivel" />
                        Gestor Local
                      </label>
                      <label class="radio">
                        <input type="radio" name="nivel" value="7" v-model="nivel" />
                        Visualizador Regional
                      </label>
                    </div>
                    <div class="column is-4">
                      <label class="radio">
                        <input type="radio" name="nivel" value="4" v-model="nivel" />
                        Adm Município
                      </label>
                      <label class="radio">
                        <input type="radio" name="nivel" value="5" v-model="nivel" />
                        User Município
                      </label>
                      <label class="radio">
                        <input type="radio" name="nivel" value="8" v-model="nivel" />
                        Visualizador Município
                      </label>
                    </div>
                  </div>
                  <span class="is-error" v-if="v$.nivel.$error">
                    {{ v$.nivel.$errors[0].$message }}
                  </span>
                </div>
              </fieldset>
              <div class="field">
                <label class="label">{{ strLocal }}</label>
                <div class="control">
                  <CmbTerritorio :id_prop="id_prop" :tipo="nivel" :sel="id_municipio" @selTerr="id_municipio = $event"
                    :errclass="{ 'is-danger': v$.id_municipio.$error }" />
                  <span class="is-error" v-if="v$.id_municipio.$error">
                    {{ v$.id_municipio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="E-mail" v-model="email"
                    :class="{ 'is-danger': v$.email.$error }" />
                  <span class="is-error" v-if="v$.email.$error">
                    {{ v$.email.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Login</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Nome de usuário" v-model="login" />
                </div>
              </div>
              <div class="field">
                <label class="label">Senha</label>
                <div class="control">
                  <input class="input" type="password" v-model="senha" :class="{ 'is-danger': v$.senha.$error }" />
                  <span class="is-error" v-if="v$.senha.$error">
                    {{ v$.senha.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirme a Senha</label>
                <div class="control">
                  <input class="input" type="password" v-model="confirm" placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.confirm.$error }" />
                  <span class="is-error" v-if="v$.confirm.$error">
                    {{ v$.confirm.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="update" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Message from "@/components/general/CustomMessage.vue";
import Loader from "@/components/general/MyLoader.vue";
import footerCard from '@/components/general/FooterCard.vue'
import authService from "@/services/auth.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import {
  required$,
  minLength$,
  minLengthIfFilled$,
  email$,
  combo$,
  sameAs$
} from "@/components/forms/validators";
import { ref, onMounted, reactive, watch } from "vue";
import { useRoute } from 'vue-router';
import { useCurrentUser } from '@/composables/currentUser';

const { currentUser } = useCurrentUser();

const route = useRoute()


var id_usuario = ref(0);
var nome = ref("");
var login = ref("");
var confirm = ref('');
var email = ref("");
var id_municipio = ref(0);
var nivel = ref(0);
var senha = ref('');
var id_prop = ref(0);
var strLocal = ref('Município');

var user = reactive({
  id_usuario,
  nome,
  email,
  login,
  senha,
  confirm,
  id_municipio,
  nivel,
  id_prop
});

var isLoading = ref(false);
var message = ref('');
var caption = ref('');
var type = ref('');
var showMessage = ref(false);
var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false
});

const rules = {
  id_usuario: { required$ },
  nome: { minLength: minLength$(10) },
  senha: { minLength: minLengthIfFilled$(4) },
  email: { required$, email$ },
  confirm: { sameAs: sameAs$(senha) },
  login: { minLength: minLength$(5) },
  nivel: { required$, minValue: combo$(1) },
  id_municipio: { required$, minValue: combo$(1) },
  id_prop: { required$ }
}

const v$ = useValidate(rules, user);


function loadData() {
  isLoading.value = true;

  authService.getUserData(id_usuario.value).then(
    (response) => {
      let data = response.data;
      nome.value = data.nome.trim();
      email.value = data.email.trim();
      id_municipio.value = data.id_municipio;
      nivel.value = data.nivel;
      login.value = data.login.trim();
      strLocal.value = ([4, 5, 8].includes(data.nivel) ? 'Município' : ([2, 3, 7].includes(data.nivel) ? 'Regional' : 'Local'));
    },
    (error) => {
      message.value = error.data;
      showMessage.value = true;
      type.value = "alert";
      caption.value = "Usuário";
      setTimeout(() => (showMessage.value = false), 3000);
    }
  );

  isLoading.value = false;
}


function update() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    authService.update(user).then(
      (response) => {
        showMessage.value = true;
        message.value = "Usuário cadastrado com sucesso.";
        type.value = "success";
        caption.value = "Usuário";
        setTimeout(() => (showMessage.value = false), 3000);
      },
      (error) => {
        message.value = error;
        showMessage.value = true;
        type.value = "alert";
        caption.value = "Usuário";
        setTimeout(() => (showMessage.value = false), 3000);
      }
    )
      .finally(() => {
        document.getElementById("login").classList.remove("is-loading");
      });
  } else {
    message.value = "Corrija os erros para enviar as informações";
    showMessage.value = true;
    type.value = "alert";
    caption.value = "Usuário";
    setTimeout(() => (showMessage.value = false), 3000);
  }
}

onMounted(() => {
  let cUser = currentUser;
  if (cUser.value) {
    id_prop.value = cUser.value.id;
  }

  id_usuario.value = route.params.id;
  loadData();
});

watch(
  () => nivel.value,
  (val) => {
    strLocal.value = [1, 6].includes(val) ? 'Local' : ([2, 3, 7].includes(val) ? 'Regional' : ([9].includes(val) ? 'GVE' : 'Município'));
  });
</script>

<!--/**
 * 1) Administrador
 * 2) Gestor Regional
 * 3) User Regional
 * 4) Adm Municipio
 * 5) User Municipio
 * 6) Visualizador DCV
 * 7) Visualizador Regional
 * 8) Visualizador Municipio
 * 9) Gestor Local
 */-->

<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
