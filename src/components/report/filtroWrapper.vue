<!-- src/components/FiltroWrapper.vue -->
<template>
  <div class="box">
    <div class="columns" v-if="currentUser.tipo < 3 && props.ativos?.gve">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <label class="label">GVE</label>
          <div class="control">
            <CmbTerritorio :tipo="9" :sel="filtros.id_gve" @selTerr="filtros.id_gve = $event" />
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-if="currentUser.tipo < 4 && props.ativos?.municipio">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <label class="label">Município</label>
          <div class="control">
            <CmbGeneric
              :sel="filtros.id_municipio"
              :data="municipios"
              @selGen="filtros.id_municipio = $event"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.datas">
      <div class="column is-3 is-offset-3">
        <div class="field">
          <label class="label">Data Inicial</label>
          <div class="control">
            <DatePicker v-model="filtros.dt_inicial" :error="false" placeholder="Escolha a data" />
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="field">
          <label class="label">Data Final</label>
          <div class="control">
            <DatePicker v-model="filtros.dt_final" :error="false" placeholder="Escolha a data" />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div class="buttons is-centered mt-4">
          <button class="button is-primary is-outlined is-fullwidth" @click="processar">
            Processar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import DatePicker from '../forms/MyDatePicker.vue'
import CmbTerritorio from '../forms/CmbTerritorio.vue'
import CmbGeneric from '../forms/CmbGeneric.vue'
import { useCurrentUser } from '@/composables/currentUser'
import auxiliarService from '@/services/general/auxiliar.service'

const emit = defineEmits(['submit'])

const props = defineProps(['ativos'])

const { currentUser } = useCurrentUser()

const municipios = ref([])

const filtros = reactive({
  id_gve: 0,
  id_municipio: '',
  dt_inicial: '',
  dt_final: '',
})

function processar() {
  emit('submit', filtros)
}

watch(
  () => filtros.id_gve,
  async (val) => {
    const result = await auxiliarService.getMunicipiosCombo(JSON.stringify({ id_gve: val }))
    if (result.error) {
      console.log(result.error)
      municipios.value = []
    } else {
      municipios.value = result
    }
  }
)

onMounted(async () => {
  const result = await auxiliarService.getMunicipiosCombo(JSON.stringify({}))
  if (result.error) {
    console.log(result.error)
    municipios.value = []
  } else {
    municipios.value = result
  }
})
</script>
