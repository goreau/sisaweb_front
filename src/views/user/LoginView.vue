<template>
  <div class="main-container pt-6">
    <div class="columns is-centered">
      <div class="column is-two-fifths mt-1">
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">
              Acesso
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Login</label>
                <div class="control has-icons-left has-icons-right">
                  <input class="input is-danger" type="text" placeholder="Nome de usuário" v-model="user.login">
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="fa-solid fa-user" />
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Senha</label>
                <div class="control has-icons-left">
                  <input class="input" type="password" v-model="user.password" placeholder="Sua senha">
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="fa-solid fa-lock" />
                  </span>
                </div>
              </div>
              <a href="#/forgot">Esqueci minha senha</a>
              <!--  <br><p><b>Atenção: Para acessar a versão antiga do sistema (dados até 10/2024), acesse esse link <a href="https://vigent.saude.sp.gov.br/capop_old">Capop</a></b></p>-->
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="login" @cancel="null" @aux="null" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <NewSenhaDialog ref="newSenhaDialog"></NewSenhaDialog>
  </div>
</template>

<script setup>
import Message from '@/components/general/CustomMessage.vue'
import footerCard from '@/components/general/FooterCard.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue';
import NewSenhaDialog from '@/components/general/NewSenhaDialog.vue';
import authService from "@/services/auth.service";
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const auth = useAuthStore();
var user = ref({
  login: '',
  password: '',
});
//var isNewUser = ref(false);
var isLoading = ref(false);
//var isRegistering = ref(false);
var message = ref('');
var caption = ref('');
var type = ref('');
var showMessage = ref(false);
var cFooter = ref({
  strSubmit: 'Entrar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false
});

const newSenhaDialog = ref(null);

onMounted(() => {
  //this.$store.dispatch("auth/logout").then(() => { });
});

/*function closeModal() {
  isNewUser.value = false;
}*/

async function login() {

  try {
    await auth.login(user.value)
      .then(
        () => {
          //document.getElementById('main').className = "main";
          router.push({ name: 'home' });
        },
        async (error) => {
          message.value = error.message;

          if (message.value == 'Alterar senha') {
            const password = await newSenhaDialog.value.show({
              okButton: 'Confirmar',
            });
            if (password != '') {
              user.value.password = password;
              authService.firstAccess(user.value).then(
                (response) => {
                  showMessage.value = true;
                  message.value = "Dados do usuário alterados com sucesso.";
                  type.value = "success";
                  caption.value = "Usuário";
                  setTimeout(() => (showMessage.value = false), 3000);
                },
                (error) => {
                  message.value =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.response.data ||
                    error.message ||
                    error.toString();
                  showMessage.value = true;
                  type.value = "alert";
                  caption.value = "Usuário";
                  setTimeout(() => (showMessage.value = false), 3000);
                }
              );
            } else {

              isLoading.value = false;
              showMessage.value = true;
              type.value = 'alert';
              caption.value = 'Erro';

              setTimeout(() => showMessage.value = false, 3000);
            }
          } else {
            isLoading.value = false;
            showMessage.value = true;
            type.value = 'alert';
            caption.value = 'Erro';

            setTimeout(() => showMessage.value = false, 3000);
          }
        }
      )
      .finally(() => {
        document.getElementById('login').classList.remove('is-loading');
      });
  } catch (err) {
    console.error('Erro ao logar:', err)
  }

}

/*function cancelRegister() {
  isRegistering.value = false;
}

function registerOk() {
  isRegistering.value = false;
}*/

</script>

<style scoped>
.card-footer {
  padding: 1rem;
}

.card-footer .button {
  width: 100%;
}
</style>
