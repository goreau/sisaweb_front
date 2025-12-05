<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Usuário</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-user'"
                    class="input"
                    type="text"
                    placeholder="Nome"
                    v-model="user.nome"
                    :class="{ 'is-danger': v$.nome.$error }"
                  />
                  <span class="is-error" v-if="v$.nome.$error">
                    {{ v$.nome.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <fieldset class="fieldset">
                <legend>Nível</legend>
                <div class="field">
                  <div class="columns">
                    <div class="column is-4" v-if="tpUser == 1">
                      <label class="radio">
                        <input
                          type="radio"
                          name="nivel"
                          value="1"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        Administrador
                      </label>
                      <label class="radio">
                        <input
                          type="radio"
                          name="nivel"
                          value="6"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        Visualizador Estado
                      </label>
                    </div>
                    <div class="column is-4" v-if="tpUser < 4">
                      <label class="radio" v-if="tpUser < 3">
                        <input
                          type="radio"
                          name="nivel"
                          value="2"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        Gestor Regional
                      </label>
                      <label class="radio" v-if="tpUser < 3">
                        <input
                          type="radio"
                          name="nivel"
                          value="3"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        User Regional
                      </label>
                      <label class="radio" v-if="tpUser < 3">
                        <input
                          type="radio"
                          name="nivel"
                          value="9"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        Gestor Local
                      </label>
                      <label class="radio">
                        <input
                          type="radio"
                          name="nivel"
                          value="7"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        Visualizador Regional
                      </label>
                    </div>
                    <div class="column is-4">
                      <label class="radio" v-if="nvUser == 4 || tpUser < 4">
                        <input
                          type="radio"
                          name="nivel"
                          value="4"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        Adm Município
                      </label>
                      <label class="radio" v-if="[3, 4].includes(nvUser) || tpUser < 4">
                        <input
                          type="radio"
                          name="nivel"
                          value="5"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
                        User Município
                      </label>
                      <label class="radio">
                        <input
                          type="radio"
                          name="nivel"
                          value="8"
                          v-model="user.nivel"
                          v-enter-to-next="'form-user'"
                        />
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
                  <CmbTerritorio
                    v-enter-to-next="'form-user'"
                    v-model:sel="user.id_municipio"
                    :tipo="user.nivel"
                    :errclass="{ 'is-danger': v$.id_municipio.$error }"
                  />
                  <span class="is-error" v-if="v$.id_municipio.$error">
                    {{ v$.id_municipio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-user'"
                    class="input"
                    type="text"
                    placeholder="E-mail"
                    v-model="user.email"
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
                    v-enter-to-next="'form-user'"
                    class="input"
                    type="text"
                    placeholder="Nome de usuário"
                    v-model="user.login"
                    :class="{ 'is-danger': v$.login.$error }"
                  />
                  <span class="is-error" v-if="v$.login.$error">
                    {{ v$.login.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Senha</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-user'"
                    class="input"
                    type="password"
                    v-model="user.senha"
                    :class="{ 'is-danger': v$.senha.$error }"
                  />
                  <span class="is-error" v-if="v$.senha.$error">
                    {{ v$.senha.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirme a Senha</label>
                <div class="control">
                  <input
                    v-enter-to-next="'form-user'"
                    class="input"
                    type="password"
                    v-model="user.confirm"
                    placeholder="Confirme a senha"
                    :class="{ 'is-danger': v$.confirm.$error }"
                  />
                  <span class="is-error" v-if="v$.confirm.$error">
                    {{ v$.confirm.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard
              v-enter-to-next="'submit-action'"
              @submit="save"
              @cancel="null"
              @aux="null"
              :cFooter="cFooter"
            />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import authService from '@/services/auth.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import {
  required$,
  minLength$,
  minLengthIfFilled$,
  email$,
  combo$,
  sameAs$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

var tpUser = ref(0)
var nvUser = ref(0)

var isLoading = ref(false)

var strLocal = ref('Município')

var user = reactive({
  nome: '',
  login: '',
  confirm: '',
  email: '',
  id_municipio: 0,
  nivel: 0,
  senha: '',
  id_prop: 0,
})

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const senhaReferencia = computed(() => user.senha)

const rules = {
  nome: { minLength: minLength$(10) },
  senha: { minLength: minLengthIfFilled$(4) },
  email: { required$, email$ },
  confirm: { sameAs: sameAs$(senhaReferencia) },
  login: { minLength: minLength$(5) },
  nivel: { required$, minValue: combo$(1) },
  id_municipio: { required$, minValue: combo$(1) },
}

const v$ = useValidate(rules, user)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await authService.update(user)
      msg = 'Usuário alterado com sucesso!'
    } else {
      resultado = await authService.register(user)
      msg = 'Usuário inserido com sucesso!'
    }

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(route.params.id) > 0)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await authService.getUserData(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      result.id_municipio = Number(result.id_municipio)
      Object.assign(user, result)
    }
  } else {
    Object.assign(user, {
      nome: '',
      login: '',
      confirm: '',
      email: '',
      id_municipio: 0,
      nivel: 0,
      senha: '',
      id_prop: 0,
    })
  }
  let cUser = currentUser
  if (cUser.value) {
    user.id_prop = cUser.value.id
    tpUser.value = cUser.value.tipo
    nvUser.value = cUser.value.nivel
    //strLocal.value = val == 1 ? 'Local' : (val == 2 ? 'Regional' : (val == 3 ? 'GVE' : 'Município'));
  }
})

watch(
  () => user.nivel.value,
  (val) => {
    strLocal.value = [1, 6].includes(val)
      ? 'Local'
      : [2, 3, 7].includes(val)
        ? 'Regional'
        : [9].includes(val)
          ? 'GVE'
          : 'Município'
  },
)
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
