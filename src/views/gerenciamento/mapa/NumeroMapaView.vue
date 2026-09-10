<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Definir link do mapa</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio
                  v-enter-to-next="'form-cens'"
                  v-model:sel="filter.id_municipio"
                  :tipo="99"
                />
              </div>
            </div>
            <div class="content">
              <label class="label">Área</label>
              <div class="control">
                <CmbGeneric
                  v-enter-to-next="'form-cens'"
                  v-model:sel="filter.id_area"
                  :data="areas"
                />
              </div>
            </div>
          </div>
          <hr />
          <div class="columns">
            <div class="column is-6 is-offset-3">
              <button class="button is-link aux-btn is-outlined is-fullwidth" @click="processa">
                Gerar Valor Padrão
              </button>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import avulsosService from '@/services/gerenciamento/avulsos.service'
import Loader from '@/components/general/MyLoader.vue'
import areaService from '@/services/cadastro/area.service'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { currentUser } = useCurrentUser()

var areas = ref([])

var id_prop = ref(0)
var confirmDialog = ref(null)

var isLoading = ref(false)

var filter = reactive({
  id_area: 0,
  id_municipio: 0,
})

async function processa() {
  const ok = await confirmDialog.value.show({
    title: 'Número Mapa',
    message: `Atualizar os campos id_mapa do cadastro de quarteirões para o padrão conforme os critérios escolhidos! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await avulsosService.numeroMapa(filter)
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(`Valores gerados com sucesso! ${resultado.master} registros atualizados.`)
    }
  }
}

watch(
  () => filter.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  },
)

onMounted(async () => {
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
