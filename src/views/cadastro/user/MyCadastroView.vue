<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message
          v-if="showMessage"
          @do-close="closeMessage"
          :msg="message"
          :type="type"
          :caption="caption"
        />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Meu Cadastro</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Nome"
                    v-model="nome"
                    :class="{ 'is-danger': v$.nome.$error }"
                  />
                  <span class="is-error" v-if="v$.nome.$error">
                    {{ v$.nome.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">{{ strLocal }}</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Local do usuário"
                    v-model="local"
                    readonly
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Nível</label>
                <div class="control has-icons-left has-icons-right">
                  <label class="radio" v-if="role == 1">
                    <input type="radio" nome="role" value="1" checked="checked" />
                    Administrador
                  </label>
                  <label class="radio" v-if="role == 2">
                    <input type="radio" nome="role" value="2" checked="checked" />
                    Gestor Regional
                  </label>
                  <label class="radio" v-if="role == 3">
                    <input type="radio" nome="role" value="3" checked="checked" />
                    Gestor Local
                  </label>
                  <label class="radio" v-if="role == 3">
                    <input type="radio" nome="role" value="9" checked="checked" />
                    Convidado
                  </label>
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="E-mail"
                    v-model="email"
                    :class="{ 'is-danger': v$.email.$error }"
                  />
                  <span class="is-error" v-if="v$.email.$error">
                    {{ v$.email.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Login</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Nome de usuário"
                    v-model="login"
                    readonly
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Senha Atual</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="old_password"
                    placeholder="Informe a senha"
                    :class="{ 'is-danger': v$.old_password.$error }"
                  />
                  <span class="is-error" v-if="v$.old_password.$error">
                    {{ v$.old_password.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Nova Senha</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="new_password"
                    placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.new_password.$error }"
                  />
                  <span class="is-error" v-if="v$.new_password.$error">
                    {{ v$.new_password.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirme a Senha</label>
                <div class="control">
                  <input
                    class="input"
                    type="password"
                    v-model="senha"
                    placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.senha.$error }"
                  />
                  <span class="is-error" v-if="v$.senha.$error">
                    {{ v$.senha.$errors[0].$message }}
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
import Message from '@/components/general/CustomMessage.vue'
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import authService from '@/services/auth.service'
import useValidate from '@vuelidate/core'
import {
  required$,
  requiredIf$,
  minLength$,
  minLengthIfFilled$,
  email$,
  sameAs$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'

const { currentUser } = useCurrentUser()

var nome = ref('')
var login = ref('')
var old_password = ref('')
var new_password = ref('')
var email = ref('')
var local = ref('')
//var id_municipio = ref(0);
var role = ref(0)
var senha = ref('')
var id_usuario = ref(0)

var user = reactive({
  nome,
  old_password,
  new_password,
  email,
  senha,
  //local,
  //id_municipio,
  //role,
  id_usuario,
})
//var id_municipio = ref('');
var isLoading = ref(false)
var message = ref('')
var caption = ref('')
var type = ref('')
var showMessage = ref(false)
var strLocal = ref('Município')
var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  nome: { minLength: minLength$(10) },
  new_password: { minLength: minLengthIfFilled$(4) },
  old_password: { requiredIf: requiredIf$(new_password.value.length > 0) },
  email: { required$, email$ },
  senha: { sameAs: sameAs$(new_password) || !new_password.value },
}

const v$ = useValidate(rules, user)

function update() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    authService
      .update(user)
      .then(
        () => {
          showMessage.value = true
          message.value = 'Seu cadastro foi alterado com sucesso.'
          type.value = 'success'
          caption.value = 'Meu Cadastro'
          setTimeout(() => (showMessage.value = false), 3000)
        },
        (error) => {
          message.value = error
          showMessage.value = true
          type.value = 'alert'
          caption.value = 'Usuário'
          setTimeout(() => (showMessage.value = false), 3000)
        }
      )
      .finally(() => {
        document.getElementById('login').classList.remove('is-loading')
      })
  } else {
    message.value = 'Corrija os erros para enviar as informações'
    showMessage.value = true
    type.value = 'alert'
    caption.value = 'Meu Cadastro'
    setTimeout(() => (showMessage.value = false), 3000)
  }
}

function loadData() {
  isLoading.value = true

  authService.getUserData(id_usuario.value).then(
    (response) => {
      let data = response
      nome.value = data.nome.trim()
      email.value = data.email.trim()
      local.value = data.local
      role.value = data.nivel
      //id_municipio = data.id_municipio;
      //this.user.old_password = data.password;
      login.value = data.login.trim()
      strLocal.value = [4, 5, 8].includes(data.nivel)
        ? 'Município'
        : [2, 3, 7].includes(data.nivel)
        ? 'Regional'
        : 'Local'
    },
    (error) => {
      message.value = error.data
      showMessage.value = true
      type.value = 'alert'
      caption.value = 'Usuário'
      setTimeout(() => (showMessage.value = false), 3000)
    }
  )

  isLoading.value = false
}

onMounted(() => {
  let cUser = currentUser
  if (cUser.value) {
    id_usuario.value = cUser.value.id
  }

  loadData()
})
</script>

<style scoped>
.vs {
  font-size: x-small;
}
</style>
