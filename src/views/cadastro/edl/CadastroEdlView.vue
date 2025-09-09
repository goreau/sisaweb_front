<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-four-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Estação Disseminadora de Larvicida - EDL</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-6">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="edl.id_municipio"
                      @selTerr="edl.id_municipio = $event"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label class="label">Data de Instalação</label>
                  <div class="control">
                    <DatePicker
                      v-model="edl.dt_cadastro"
                      :error="false"
                      placeholder="Escolha a data"
                      :class="{ 'is-danger': v$.dt_cadastro.$error }"
                    />
                    <span class="is-error" v-if="v$.dt_cadastro.$error">
                      {{ v$.dt_cadastro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <label class="label">Cadastro</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Código da EDL"
                      v-model="edl.cadastro"
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
                      :sel="edl.id_area"
                      :data="areas"
                      @selGen="edl.id_area = $event"
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
                      :sel="edl.id_censitario"
                      :data="censitarios"
                      @selGen="edl.id_censitario = $event"
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
                      :sel="edl.id_quarteirao"
                      :data="quarteiraos"
                      @selGen="edl.id_quarteirao = $event"
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
                      placeholder="Nome do bairro"
                      v-model="edl.bairro"
                      :class="{ 'is-danger': v$.bairro.$error }"
                    />
                    <span class="is-error" v-if="v$.bairro.$error">
                      {{ v$.bairro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Endereço</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Endereço do imóvel"
                      v-model="edl.endereco"
                      :class="{ 'is-danger': v$.endereco.$error }"
                    />
                    <span class="is-error" v-if="v$.endereco.$error">
                      {{ v$.endereco.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Responsável</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Responsável pelo imóvel"
                      v-model="edl.responsavel"
                      :class="{ 'is-danger': v$.responsavel.$error }"
                    />
                    <span class="is-error" v-if="v$.responsavel.$error">
                      {{ v$.responsavel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Telefone</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="opcional"
                      v-model="edl.telefone"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo de Imóvel</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="edl.id_tipo_imovel"
                        :options="tipos_edl"
                        name="id_tipo_imovel"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Local de instalação</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="edl.id_local"
                        :options="locals"
                        name="id_local"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
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
                      v-model="edl.latitude"
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
                      v-model="edl.longitude"
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
            <hr />
            <div class="columns" v-if="edl.id_cadastro_edl > 0">
              <div class="column is-2 is-offset-4">
                <div class="field">
                  <label class="label">&nbsp;</label>
                  <label class="checkbox">
                    <input type="checkbox" value="1" v-model="edl.inativa" />
                    Inativa
                  </label>
                </div>
              </div>
              <div class="column is-3 is-offset-1">
                <div class="field">
                  <label class="label">Data de Inativação</label>
                  <div class="control">
                    <DatePicker
                      v-model="edl.dt_inativa"
                      :error="false"
                      placeholder="Escolha a data"
                      :class="{ 'is-danger': v$.dt_inativa.$error }"
                    />
                    <span class="is-error" v-if="v$.dt_inativa.$error">
                      {{ v$.dt_inativa.$errors[0].$message }}
                    </span>
                  </div>
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
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import edlCadastroService from '@/services/cadastro/edlCadastro.service'
import auxiliarService from '@/services/general/auxiliar.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$, coordenada$, requiredIf$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { requiredIf } from '@vuelidate/validators'

const toast = useToast()
const route = useRoute()
const { currentUser } = useCurrentUser()

var id_prop = ref(0)

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])
const tipos_edl = ref([])
const locals = ref([])

const edl = reactive({
  id_cadastro_edl: 0,
  id_municipio: 0,
  dt_cadastro: '',
  responsavel: '',
  endereco: '',
  telefone: '',
  cadastro: '',
  id_quarteirao: 0,
  bairro: '',
  id_local: 0,
  id_tipo_imovel: 0,
  latitude: '0',
  longitude: '0',
  inativa: false,
  dt_inativa: '',
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_cadastro: { required$ },
  responsavel: { required$ },
  endereco: { required$ },
  cadastro: { required$ },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  bairro: { required$ },
  id_local: { required$, minValue: combo$(1) },
  id_tipo_imovel: { required$, minValue: combo$(1) },
  latitude: { coordenada$ },
  longitude: { coordenada$ },
  dt_inativa: { requiredIf: requiredIf$(edl.inativa) },
}

const v$ = useValidate(rules, edl)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await edlCadastroService.update(edl)
      msg = 'EDL alterada com sucesso!'
    } else {
      resultado = await edlCadastroService.create(edl)
      msg = 'EDL inserida com sucesso!'
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

async function loadCombos() {
  const result = await auxiliarService.getGenericCombo(9)
  if (result.error) {
    console.log(result.error)
    tipos_edl.value = []
  } else {
    tipos_edl.value = result
  }

  const result1 = await auxiliarService.getGenericCombo(10)
  if (result.error) {
    console.log(result1.error)
    locals.value = []
  } else {
    locals.value = result1
  }
}

watch(
  () => edl.id_municipio,
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
  () => edl.id_area,
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
  () => edl.id_censitario,
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

onMounted(async () => {
  if (isEditMode.value) {
    const result = await edlCadastroService.getEdlCadastro(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(edl, result)
    }
  } else {
    Object.assign(edl, {
      id_cadastro_edl: 0,
      id_municipio: 0,
    })
  }

  loadCombos()

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
