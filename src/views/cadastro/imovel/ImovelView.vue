<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
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
            <p class="card-header-title is-centered">Imóvel Cadastrado</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="imovel.id_municipio"
                      @selTerr="imovel.id_municipio = $event"
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
                  <label class="label">Número</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Número do Cadastro"
                      v-model="imovel.numero_imovel"
                      :class="{ 'is-danger': v$.numero_imovel.$error }"
                    />
                    <span class="is-error" v-if="v$.numero_imovel.$error">
                      {{ v$.numero_imovel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <div class="field">
                  <label class="label">Nome Fantasia</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Nome do Estabelecimento"
                      v-model="imovel.fantasia"
                      :class="{ 'is-danger': v$.fantasia.$error }"
                    />
                    <span class="is-error" v-if="v$.fantasia.$error">
                      {{ v$.fantasia.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="imovel.id_atividade"
                        :options="atividades"
                        name="id_atividade"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Responsabilidade</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="imovel.id_responsavel"
                        :options="responsaveis"
                        name="id_responsavel"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="field">
                  <label class="label">Proprietário</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Responsável pelo imóvel"
                      v-model="imovel.proprietario"
                      :class="{ 'is-danger': v$.proprietario.$error }"
                    />
                    <span class="is-error" v-if="v$.proprietario.$error">
                      {{ v$.proprietario.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <div class="field">
                  <label class="label">Observação</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="imovel.observacao"
                      :class="{ 'is-danger': v$.observacao.$error }"
                    />
                    <span class="is-error" v-if="v$.observacao.$error">
                      {{ v$.observacao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="imovel.id_area"
                      :data="areas"
                      @selGen="imovel.id_area = $event"
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
                      :sel="imovel.id_censitario"
                      :data="censitarios"
                      @selGen="imovel.id_censitario = $event"
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
                      :sel="imovel.id_quarteirao"
                      :data="quarteiraos"
                      @selGen="imovel.id_quarteirao = $event"
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
              <div class="column is-6">
                <div class="field">
                  <label class="label">Endereço</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Endereço do imóvel"
                      v-model="imovel.endereco"
                      :class="{ 'is-danger': v$.endereco.$error }"
                    />
                    <span class="is-error" v-if="v$.endereco.$error">
                      {{ v$.endereco.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label">Latitude</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="imovel.latitude"
                      v-decimal
                      :class="{ 'is-danger': v$.latitude.$error }"
                    />
                    <span class="is-error" v-if="v$.latitude.$error">
                      {{ v$.latitude.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label">Longitude</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="imovel.longitude"
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
            <div class="columns">
              <div class="column is-3">
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" value="1" v-model="imovel.tipo_area" />
                    Área densamente povoada
                  </label>
                </div>
              </div>
              <div class="column is-3">
                <div class="content">
                  <label class="label">Tipo de Atividade</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="imovel.id_atividade_imovel"
                      :data="tpAtiv"
                      @selGen="imovel.id_atividade_imovel = $event"
                      :errclass="{ 'is-danger': v$.id_atividade_imovel.$error }"
                    />
                    <span class="is-error" v-if="v$.id_atividade_imovel.$error">
                      {{ v$.id_atividade_imovel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label">Pontuação</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="imovel.pontuacao"
                      :class="{ 'is-danger': v$.pontuacao.$error }"
                    />
                    <span class="is-error" v-if="v$.pontuacao.$error">
                      {{ v$.pontuacao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" value="1" v-model="imovel.inativo" />
                    Inativo
                  </label>
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
import Message from '@/components/general/CustomMessage.vue'
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import imovelService from '@/services/cadastro/imovel.service'
import censitarioService from '@/services/cadastro/censitario.service'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
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
  numeric$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

const { currentUser } = useCurrentUser()

const atividades = [
  { id: 1, nome: 'Ponto Estratégico' },
  { id: 2, nome: 'Imóvel Especial' },
  { id: 3, nome: 'Larvitrampa' },
  { id: 12, nome: 'Obra' },
]
//var tpUser = ref(0);
//var nvUser = ref(0);
var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])
var responsaveis = ref([])
var tpAtiv = ref([])

var id_prop = ref(0)

var imovel = reactive({
  id_area: 0,
  id_municipio: 0,
  id_atividade: 0,
  fantasia: '',
  numero_imovel: '',
  proprietario: '',
  observacao: '',
  id_responsavel: 0,
  id_censitario: 0,
  id_quarteirao: 0,
  latitude: 0.0,
  longitude: 0.0,
  pontuacao: 0,
  inativo: 0,
  tipo_area: 0,
  id_atividade_imovel: 0,
})

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  fantasia: { minLengthIfFilled: minLengthIfFilled$(5) },
  numero_imovel: { required$, minLength: minLength$(1) },
  proprietario: { required$, minLength: minLength$(10) },
  observacao: { minLengthIfFilled: minLengthIfFilled$(3) },
  endereco: { minLengthIfFilled: minLengthIfFilled$(10) },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_atividade_imovel: { required$, minValue: combo$(1) },
  id_responsavel: { required$, minValue: combo$(1) },
  latitude: { coordenada$ },
  longitude: { coordenada$ },
  pontuacao: { numeric$ },
}

const v$ = useValidate(rules, imovel)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await imovelService.update(imovel)
      msg = 'Imóvel alterado com sucesso!'
    } else {
      resultado = await imovelService.create(imovel)
      msg = 'Imóvel inserido com sucesso!'
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

watch(
  () => imovel.id_atividade,
  async (val) => {
    const result = await auxiliarService.getAtividadeImCombo(5, val)
    if (result.error) {
      console.log(result.error)
      tpAtiv.value = []
    } else {
      tpAtiv.value = result
    }
  }
)

watch(
  () => imovel.id_municipio,
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
  () => imovel.id_area,
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
  () => imovel.id_censitario,
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

const isEditMode = computed(() => Number(route.params.id) > 0)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await imovelService.getImovel(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(imovel, result)
    }
  } else {
    Object.assign(imovel, {
      id_area: 0,
      id_municipio: 0,
      id_atividade: 0,
      fantasia: '',
      numero_imovel: '',
      proprietario: '',
      observacao: '',
      id_responsavel: 0,
      id_censitario: 0,
      id_quarteirao: 0,
      latitude: 0.0,
      longitude: 0.0,
      id_atividade_imovel: 0,
    })
  }
  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  const result = await auxiliarService.getGenericCombo(7)
  if (result.error) {
    console.log(result.error)
    responsaveis.value = []
  } else {
    responsaveis.value = result
  }
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
