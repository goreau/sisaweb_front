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
            <p class="card-header-title is-centered">Área de Transmissão</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio
                  :id_prop="id_prop"
                  :tipo="99"
                  :sel="areaNav.id_municipio"
                  @selTerr="areaNav.id_municipio = $event"
                  :errclass="{ 'is-danger': v$.id_municipio.$error }"
                />
                <span class="is-error" v-if="v$.id_municipio.$error">
                  {{ v$.id_municipio.$errors[0].$message }}
                </span>
              </div>
            </div>
            <fieldset class="fieldset">
              <legend>Tipo</legend>
              <div class="field">
                <RadioGeneric
                  v-model="areaNav.tipo_area"
                  :options="tipos"
                  name="tipo_area"
                  :modelValue="2"
                  :inline="true"
                />
              </div>
            </fieldset>
            <div class="field">
              <label class="label">Nome</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Nome da Área"
                  v-model="areaNav.descricao"
                  :class="{ 'is-danger': v$.descricao.$error }"
                />
                <span class="is-error" v-if="v$.descricao.$error">
                  {{ v$.descricao.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Área (ha)</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Apenas para NAV"
                  v-model="areaNav.area"
                  v-decimal
                  :class="{ 'is-danger': v$.area.$error }"
                />
                <span class="is-error" v-if="v$.area.$error">
                  {{ v$.area.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Rel. Percurso/área</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Apenas para NAV"
                  v-model="areaNav.percurso"
                  v-decimal
                  :class="{ 'is-danger': v$.percurso.$error }"
                />
                <span class="is-error" v-if="v$.percurso.$error">
                  {{ v$.percurso.$errors[0].$message }}
                </span>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard
              @submit="create"
              :ready="readyToGo"
              @cancel="null"
              @aux="details"
              :cFooter="cFooter"
            />
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
import areaNavService from '@/services/cadastro/areaNav.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { useAreaNavStore } from '@/stores/areaNavStore'
import { useRouter, useRoute } from 'vue-router'
import { minLengthIfFilled$, required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'

const { currentUser } = useCurrentUser()
const store = useAreaNavStore()
const router = useRouter()
const route = useRoute()

const tipos = [
  { id: 1, nome: 'NAV' },
  { id: 2, nome: 'CC-NP' },
]

var id_prop = ref(0)

const areaNav = reactive({
  id_municipio: 0,
  area: '',
  descricao: '',
  percurso: '',
  tipo_area: 2,
  filhos: [],
})

var isLoading = ref(false)
var message = ref('')
var caption = ref('')
var type = ref('')
var showMessage = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: 'Censitários',
  aux: true,
})

const rules = {
  descricao: { required$ },
  id_municipio: { required$, minValue: combo$(1) },
  area: { minLengthIfFilled: minLengthIfFilled$(2) },
  percurso: { minLengthIfFilled: minLengthIfFilled$(2) },
  tipo_area: { required$, minValue: combo$(1) },
}

const v$ = useValidate(rules, areaNav)

function details() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setObjeto({ ...areaNav })
    router.push({ name: 'areaNavChild', query: { from: 'pai' } })
  }
}

function create() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    areaNavService
      .create(areaNav)
      .then(
        () => {
          showMessage.value = true
          message.value = 'Área cadastrada com sucesso.'
          type.value = 'success'
          caption.value = 'Área'
          setTimeout(() => (showMessage.value = false), 3000)
        },
        (error) => {
          message.value = error
          showMessage.value = true
          type.value = 'alert'
          caption.value = 'Área'
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
    caption.value = 'Área'
    setTimeout(() => (showMessage.value = false), 3000)
  }
}

const readyToGo = computed(() => {
  return Array.isArray(store.objetoPrincipal?.filhos) && store.objetoPrincipal.filhos.length > 0
})

onMounted(() => {
  if (route.query.returnFrom === 'filho' || route.query.from === 'edit') {
    console.log(store.objetoPrincipal)
    Object.assign(areaNav, JSON.parse(JSON.stringify(store.objetoPrincipal)))
  } else {
    Object.assign(areaNav, {
      id_municipio: 0,
      area: '',
      descricao: '',
      percurso: '',
      tipo_area: 2,
      filhos: [],
    })
    store.setObjeto({}) // limpa o store
  }
  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
