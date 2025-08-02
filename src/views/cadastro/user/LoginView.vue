<template>
  <div class="main-container pt-6">
    <div class="columns is-centered">
      <div class="column is-two-fifths mt-1">
        <Message
          v-if="showMessage"
          @do-close="closeMessage"
          :msg="message"
          :type="type"
          :caption="caption"
        />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Acesso</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Login</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    class="input is-danger"
                    type="text"
                    placeholder="Nome de usuário"
                    v-model="user.login"
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="fa-solid fa-user" />
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Senha</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    type="password"
                    v-model="user.password"
                    placeholder="Sua senha"
                  />
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
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import NewSenhaDialog from '@/components/general/NewSenhaDialog.vue'
import authService from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const auth = useAuthStore()

var user = ref({
  login: '',
  password: '',
})

var cFooter = ref({
  strSubmit: 'Entrar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const newSenhaDialog = ref(null)

onMounted(() => {
  //this.$store.dispatch("auth/logout").then(() => { });
})

async function login() {
  try {
    const log = await auth.login(user.value)

    if (log.status === false && log.msg) {
      if (log.msg == 'Alterar senha') {
        const password = await newSenhaDialog.value.show({
          okButton: 'Confirmar',
        })
        if (password != '') {
          user.value.password = password
          const resultado = authService.firstAccess(user.value)
          if (resultado.error) {
            toast.error(resultado.error)
          } else {
            toast.success('Dados do usuário alterados com sucesso.')
          }
        }
      } else {
        toast.error('erro')
      }
    } else {
      router.push({ name: 'home' })
    }
  } catch (err) {
    toast.error('Erro ao logar:', err)
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
