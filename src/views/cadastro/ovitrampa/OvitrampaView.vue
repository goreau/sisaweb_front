<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Ovitrampa</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-6 is-offset-2">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="ovitrampa.id_municipio"
                      @selTerr="ovitrampa.id_municipio = $event"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Cadastro</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Número do Cadastro"
                      v-model="ovitrampa.cadastro"
                      :class="{ 'is-danger': v$.cadastro.$error }"
                    />
                    <span class="is-error" v-if="v$.cadastro.$error">
                      {{ v$.cadastro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="ovitrampa.id_area"
                      :data="areas"
                      @selGen="ovitrampa.id_area = $event"
                      :errclass="{ 'is-danger': v$.id_area.$error }"
                    />
                    <span class="is-error" v-if="v$.id_area.$error">
                      {{ v$.id_area.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <label class="label">Censitário</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="ovitrampa.id_censitario"
                      :data="censitarios"
                      @selGen="ovitrampa.id_censitario = $event"
                      :errclass="{ 'is-danger': v$.id_censitario.$error }"
                    />
                    <span class="is-error" v-if="v$.id_censitario.$error">
                      {{ v$.id_censitario.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <label class="label">Quarteirão</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="ovitrampa.id_quarteirao"
                      :data="quarteiraos"
                      @selGen="ovitrampa.id_quarteirao = $event"
                      :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                    />
                    <span class="is-error" v-if="v$.id_quarteirao.$error">
                      {{ v$.id_quarteirao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-2">
                <div class="field">
                  <label class="label">Bairro</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Bairro de instalação"
                      v-model="ovitrampa.bairro"
                      :class="{ 'is-danger': v$.bairro.$error }"
                    />
                    <span class="is-error" v-if="v$.bairro.$error">
                      {{ v$.bairro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-5">
                <div class="field">
                  <label class="label">Endereço</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Endereço do imóvel"
                      v-model="ovitrampa.endereco"
                      :class="{ 'is-danger': v$.endereco.$error }"
                    />
                    <span class="is-error" v-if="v$.endereco.$error">
                      {{ v$.endereco.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-5">
                <div class="field">
                  <label class="label">Morador</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Responsável pelo imóvel"
                      v-model="ovitrampa.morador"
                      :class="{ 'is-danger': v$.morador.$error }"
                    />
                    <span class="is-error" v-if="v$.morador.$error">
                      {{ v$.morador.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Motivo</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="ovitrampa.motivo"
                      :data="motivos"
                      @selGen="ovitrampa.motivo = $event"
                      :errclass="{ 'is-danger': v$.motivo.$error }"
                    />
                    <span class="is-error" v-if="v$.motivo.$error">
                      {{ v$.motivo.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <label class="label">Periodicidade</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="ovitrampa.periodicidade"
                      :data="periodicidades"
                      @selGen="ovitrampa.periodicidade = $event"
                      :errclass="{ 'is-danger': v$.periodicidade.$error }"
                    />
                    <span class="is-error" v-if="v$.periodicidade.$error">
                      {{ v$.periodicidade.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3 is-offset-1">
                <div class="field">
                  <label class="label">&nbsp;</label>
                  <label class="checkbox">
                    <input type="checkbox" value="1" v-model="ovitrampa.prioritario" />
                    Prioritário
                  </label>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4 is-offset-2">
                <div class="field">
                  <label class="label">Latitude</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="ovitrampa.latitude"
                      v-decimal
                      :class="{ 'is-danger': v$.latitude.$error }"
                    />
                    <span class="is-error" v-if="v$.latitude.$error">
                      {{ v$.latitude.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Longitude</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="ovitrampa.longitude"
                      v-decimal
                      :class="{ 'is-danger': v$.longitude.$error }"
                    />
                    <span class="is-error" v-if="v$.longitude.$error">
                      {{ v$.longitude.$errors[0].$message }}
                    </span>
                  </div>
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
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import ovitrampaService from '@/services/cadastro/ovitrampa.service'
import censitarioService from '@/services/cadastro/censitario.service'
import auxiliarService from '@/services/general/auxiliar.service'
import areaService from '@/services/cadastro/area.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import {
  required$,
  minLengthIfFilled$,
  combo$,
  coordenada$,
  minLength$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

//var tpUser = ref(0);
//var nvUser = ref(0);
var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])
var periodicidades = ref([])
var motivos = ref([])

var id_prop = ref(0)

var ovitrampa = reactive({
  id_ovitrampa: 0,
  id_area: 0,
  id_municipio: 0,
  bairro: '',
  cadastro: '',
  morador: '',
  id_censitario: 0,
  id_quarteirao: 0,
  latitude: 0.0,
  longitude: 0.0,
  periodicidade: 0,
  prioritario: 0,
  motivo: 0,
})

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  bairro: { minLengthIfFilled: minLengthIfFilled$(5) },
  cadastro: { required$, minLength: minLength$(1) },
  morador: { required$, minLength: minLength$(10) },
  endereco: { minLengthIfFilled: minLengthIfFilled$(10) },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  motivo: { required$, minValue: combo$(1) },
  latitude: { coordenada$ },
  longitude: { coordenada$ },
  periodicidade: { required$, minValue: combo$(1) },
}

const v$ = useValidate(rules, ovitrampa)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await ovitrampaService.update(ovitrampa)
      msg = 'Ovitrampa alterada com sucesso!'
    } else {
      resultado = await ovitrampaService.create(ovitrampa)
      msg = 'Ovitrampa inserida com sucesso!'
    }

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      ovitrampa.id_ovitrampa = resultado.master
      toast.success(msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

watch(
  () => ovitrampa.id_atividade,
  async (val) => {
    const result = await auxiliarService.getAtividadeCombo(5, val)
    if (result.error) {
      console.log(result.error)
      motivos.value = []
    } else {
      motivos.value = result
    }
  }
)

watch(
  () => ovitrampa.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  }
)

watch(
  () => ovitrampa.id_area,
  async (val) => {
    const result = await censitarioService.getCombo(JSON.stringify({ id_area: val }))
    if (result.error) {
      console.log(result.error)
      censitarios.value = []
    } else {
      censitarios.value = result
    }
  }
)

watch(
  () => ovitrampa.id_censitario,
  async (val) => {
    const result = await quarteiraoService.getCombo(JSON.stringify({ id_censitario: val }))
    if (result.error) {
      console.log(result.error)
      quarteiraos.value = []
    } else {
      quarteiraos.value = result
    }
  }
)

const isEditMode = computed(() => Number(ovitrampa.id_ovitrampa) > 0)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await ovitrampaService.getOvitrampa(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(ovitrampa, result)
    }
  } else {
    Object.assign(ovitrampa, {
      id_area: 0,
      id_municipio: 0,
      bairro: '',
      cadastro: '',
      morador: '',
      id_censitario: 0,
      id_quarteirao: 0,
      latitude: 0.0,
      longitude: 0.0,
      periodicidade: 0,
      motivo: 0,
    })
  }
  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  const result = await auxiliarService.getAuxOvitrampa(1)
  if (result.error) {
    console.log(result.error)
    motivos.value = []
  } else {
    motivos.value = result
  }

  const result2 = await auxiliarService.getAuxOvitrampa(2)
  if (result2.error) {
    console.log(result2.error)
    periodicidades.value = []
  } else {
    periodicidades.value = result2
  }
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
