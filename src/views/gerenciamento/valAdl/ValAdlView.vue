<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Validação de ADL</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio
                  :tipo="99"
                  :sel="valAdl.id_municipio"
                  @selTerr="valAdl.id_municipio = $event"
                  :errclass="{ 'is-danger': v$.id_municipio.$error }"
                />
                <span class="is-error" v-if="v$.id_municipio.$error">
                  {{ v$.id_municipio.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="content">
              <fieldset class="fieldset">
                <legend>Execução</legend>
                <div class="field">
                  <RadioGeneric
                    v-model="valAdl.id_execucao"
                    :options="execucoes"
                    name="id_execucao"
                    :inline="true"
                  />
                </div>
              </fieldset>
              <span class="is-error" v-if="v$.id_execucao.$error">
                {{ v$.id_execucao.$errors[0].$message }}
              </span>
            </div>
            <div class="content" v-if="valAdl.id_execucao == 1">
              <fieldset class="fieldset">
                <legend>Tipo</legend>
                <div class="field">
                  <RadioGeneric
                    v-model="valAdl.id_tipo"
                    :options="tipos"
                    name="id_tipo"
                    :inline="true"
                  />
                </div>
              </fieldset>
            </div>

            <div class="field">
              <label class="label">Referência</label>
              <div class="control">
                <DatePicker
                  v-model="valAdl.dt_adl"
                  mode="month"
                  :error="false"
                  placeholder=""
                  :class="{ 'is-danger': v$.dt_adl.$error }"
                />
                <span class="is-error" v-if="v$.dt_adl.$error">
                  {{ v$.dt_adl.$errors[0].$message }}
                </span>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="save" @cancel="null" @aux="null" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import valAdlService from '@/services/gerenciamento/valAdl.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const { currentUser } = useCurrentUser()

var id_prop = ref(0)

const valAdl = reactive({
  id_val_adl: 0,
  id_municipio: 0,
  id_execucao: 0,
  id_tipo: 2,
  dt_adl: '',
})

const execucoes = [
  { id: 1, nome: 'Estado' },
  { id: 2, nome: 'Município' },
]

const tipos = [
  { id: 1, nome: 'Município' },
  { id: 2, nome: 'Colegiado' },
]

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_execucao: { required$, minValue: combo$(1) },
  id_municipio: { required$, minValue: combo$(1) },
  dt_adl: { required$ },
}

const v$ = useValidate(rules, valAdl)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await valAdlService.update(valAdl)
      msg = 'ValAdl alterado com sucesso!'
    } else {
      resultado = await valAdlService.create(valAdl)
      msg = 'ValAdl inserido com sucesso!'
    }

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(msg)
      valAdl.id_val_adl = resultado.master
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(valAdl.id_val_adl) > 0)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await valAdlService.getValAdl(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(valAdl, result)
    }
  } else {
    Object.assign(valAdl, {
      id_municipio: 0,
      id_execucao: 0,
      id_tipo: 2,
      dt_adl: '',
    })
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
