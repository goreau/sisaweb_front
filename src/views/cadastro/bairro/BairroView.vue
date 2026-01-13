<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Bairro</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio
                  v-enter-to-next="'form-nav'"
                  v-model:sel="bairro.id_municipio"
                  :tipo="99"
                  :errclass="{ 'is-danger': v$.id_municipio.$error }"
                />
                <span class="is-error" v-if="v$.id_municipio.$error">
                  {{ v$.id_municipio.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Nome</label>
              <div class="control">
                <input
                  v-enter-to-next="'form-nav'"
                  class="input"
                  type="text"
                  placeholder="Nome do Bairro"
                  v-model="bairro.nome"
                  :class="{ 'is-danger': v$.nome.$error }"
                />
                <span class="is-error" v-if="v$.nome.$error">
                  {{ v$.nome.$errors[0].$message }}
                </span>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard
              v-enter-to-next="'submit-action'"
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
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import bairroService from '@/services/cadastro/bairro.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import { useBairroStore } from '@/stores/bairroStore'
import { useRouter, useRoute } from 'vue-router'
import { minLengthIfFilled$, required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const toast = useToast()

const { currentUser } = useCurrentUser()
const store = useBairroStore()
const router = useRouter()
const route = useRoute()

var id_prop = ref(0)

const bairro = reactive({
  id_bairro: 0,
  id_municipio: 0,
  nome: '',
  filhos: [],
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: 'Censitários',
  aux: true,
})

const rules = {
  nome: { required$ },
  id_municipio: { required$, minValue: combo$(1) },
}

const v$ = useValidate(rules, bairro)

function details() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    store.setObjeto({ ...bairro })
    router.push({ name: 'bairroChild', query: { from: 'pai' } })
  }
}

const isEditMode = computed(() => Number(bairro.id_bairro) > 0)

async function create() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await bairroService.update(bairro)
      msg = 'Bairro alterado com sucesso!'
    } else {
      resultado = await bairroService.create(bairro)
      msg = 'Bairro inserido com sucesso!'
    }
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      bairro.id_bairro = resultado.master
      toast.success(msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const readyToGo = computed(() => {
  return Array.isArray(store.objetoPrincipal?.filhos) && store.objetoPrincipal.filhos.length > 0
})

onMounted(() => {
  if (route.query.returnFrom === 'filho' || route.query.from === 'edit') {
    console.log(store.objetoPrincipal)
    Object.assign(bairro, JSON.parse(JSON.stringify(store.objetoPrincipal)))
  } else {
    Object.assign(bairro, {
      id_municipio: 0,
      nome: '',
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
