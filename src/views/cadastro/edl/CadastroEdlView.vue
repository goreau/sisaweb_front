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
                      v-enter-to-next="'form-edl'"
                      v-model:sel="edl.id_municipio"
                      :tipo="99"
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
                      v-enter-to-next="'form-edl'"
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
                      v-enter-to-next="'form-edl'"
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
                  <fieldset class="fieldset">
                    <legend>Tipo de Imóvel</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-edl'"
                        v-model="edl.id_tipo_imovel"
                        :options="tipos_edl"
                        name="id_tipo_imovel"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column" v-show="isCad">
                <div class="content">
                  <label class="label">Imóvel</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-edl'"
                      v-model:sel="edl.id_imovel"
                      :data="imoveis"
                      :errclass="{ 'is-danger': v$.id_imovel.$error }"
                    />
                    <span class="is-error" v-if="v$.id_imovel.$error">
                      {{ v$.id_imovel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns" v-show="!isCad">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-edl'"
                      v-model:sel="edl.id_area"
                      :data="areas"
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
                      v-enter-to-next="'form-edl'"
                      v-model:sel="edl.id_censitario"
                      :data="censitarios"
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
                      v-enter-to-next="'form-edl'"
                      v-model:sel="edl.id_quarteirao"
                      :data="quarteiraos"
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
                      v-enter-to-next="'form-edl'"
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
                      v-enter-to-next="'form-edl'"
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
                      v-enter-to-next="'form-edl'"
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
                      v-enter-to-next="'form-edl'"
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
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Local de instalação</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-edl'"
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
                      v-enter-to-next="'form-edl'"
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
                      v-enter-to-next="'form-edl'"
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
                    <input
                      type="checkbox"
                      value="1"
                      v-model="edl.inativa"
                      v-enter-to-next="'form-edl'"
                    />
                    Inativa
                  </label>
                </div>
              </div>
              <div class="column is-3 is-offset-1">
                <div class="field">
                  <label class="label">Data de Inativação</label>
                  <div class="control">
                    <DatePicker
                      v-enter-to-next="'form-edl'"
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
import imovelService from '@/services/cadastro/imovel.service'

const toast = useToast()
const route = useRoute()
const { currentUser } = useCurrentUser()

var id_prop = ref(0)

var imoveis = ref([0])
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
  id_area: { requiredIf: requiredIf$(() => !isCad.value) },
  id_censitario: { requiredIf: requiredIf$(() => !isCad.value) },
  id_quarteirao: { required$, minValue: combo$(1) },
  bairro: { required$ },
  id_local: { required$, minValue: combo$(1) },
  id_tipo_imovel: { required$, minValue: combo$(1) },
  latitude: { coordenada$ },
  longitude: { coordenada$ },
  dt_inativa: { requiredIf: requiredIf$(edl.inativa) },
  id_imovel: { requiredIf: requiredIf$(() => isCad.value) },
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
const isCad = computed(() => [56, 57].includes(edl.id_tipo_imovel))

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

async function loadImoveis() {
  const ativ = edl.id_tipo_imovel == 56 ? 1 : 2
  const filter = { id_municipio: edl.id_municipio, id_atividade: ativ }
  const result = await imovelService.getCombo(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
    imoveis.value = []
  } else {
    imoveis.value = result
  }
}

async function loadAreas() {
  const result = await areaService.getCombo(JSON.stringify({ id_municipio: edl.id_municipio }))
  if (result.error) {
    console.log(result.error)
    areas.value = []
  } else {
    areas.value = result
  }
}

watch(
  () => edl.id_imovel,
  async (val) => {
    if (val == 0) return
    const result = await imovelService.getImovel(val)
    if (result.error) {
      console.log(result.error)
    } else {
      if (result.endereco !== '') {
        edl.endereco = result.endereco
      }
      if (result.proprietario !== '') {
        edl.responsavel = result.proprietario
      }

      edl.id_quarteirao = result.id_quarteirao
    }
  },
)

watch(
  () => edl.id_municipio,
  async () => {
    if (edl.id_tipo_imovel == 0) return
    if (!isCad.value) {
      loadAreas()
    } else {
      loadImoveis()
    }
  },
)

watch(
  () => edl.id_tipo_imovel,
  async () => {
    if (edl.id_municipio == 0) return
    if (isCad.value) {
      loadImoveis()
    } else {
      loadAreas()
    }
  },
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
  },
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
  },
)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await edlCadastroService.getEdlCadastro(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      console.log(result)
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
