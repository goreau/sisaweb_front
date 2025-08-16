<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Ciclo de Visita</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio
                  :tipo="99"
                  :sel="ciclo.id_municipio"
                  @selTerr="ciclo.id_municipio = $event"
                  :errclass="{ 'is-danger': v$.id_municipio.$error }"
                />
                <span class="is-error" v-if="v$.id_municipio.$error">
                  {{ v$.id_municipio.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Ciclo</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Código da Área"
                  v-model="ciclo.ciclo"
                  :class="{ 'is-danger': v$.ciclo.$error }"
                />
                <span class="is-error" v-if="v$.ciclo.$error">
                  {{ v$.ciclo.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Data</label>
              <div class="control">
                <DatePicker
                  v-model="ciclo.dt_termino"
                  :error="false"
                  placeholder="Escolha a data"
                  :class="{ 'is-danger': v$.ciclo.$error }"
                />
                <span class="is-error" v-if="v$.dt_termino.$error">
                  {{ v$.dt_termino.$errors[0].$message }}
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
import cicloService from '@/services/gerenciamento/ciclo.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$, numeric$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const { currentUser } = useCurrentUser()

var id_prop = ref(0)

const ciclo = reactive({
  id_ciclo: 0,
  id_municipio: 0,
  ciclo: '',
  dt_termino: '',
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  ciclo: { required$, numeric$ },
  id_municipio: { required$, minValue: combo$(1) },
  dt_termino: { required$ },
}

const v$ = useValidate(rules, ciclo)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await cicloService.update(ciclo)
      msg = 'Ciclo alterado com sucesso!'
    } else {
      resultado = await cicloService.create(ciclo)
      msg = 'Ciclo inserido com sucesso!'
    }

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(msg)
      ciclo.id_ciclo = resultado.master
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(ciclo.id_ciclo) > 0)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await cicloService.getCiclo(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(ciclo, result)
    }
  } else {
    Object.assign(ciclo, {
      id_municipio: 0,
      ciclo: '',
      dt_termino: '',
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
