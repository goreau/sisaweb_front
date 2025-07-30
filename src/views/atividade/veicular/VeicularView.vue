<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Nebulização Veicular</p>
          </header>
          <div class="card-content">
            <fieldset class="fieldset">
              <legend>Identificação</legend>
              <div class="columns">
                <div class="column is-5">
                  <div class="content">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        :tipo="99"
                        :sel="nav.id_municipio"
                        @selTerr="nav.id_municipio = $event"
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
                    <label class="label">Data</label>
                    <div class="control">
                      <DatePicker
                        v-model="nav.dt_cadastro"
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
                <div class="column is-5">
                  <div class="content">
                    <label class="label">Área de Transmissão</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="nav.id_area_nav"
                        :data="areas"
                        @selGen="nav.id_area_nav = $event"
                        :errclass="{ 'is-danger': v$.id_area_nav.$error }"
                      />
                      <span class="is-error" v-if="v$.id_area_nav.$error">
                        {{ v$.id_area_nav.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Motivo</legend>
                      <div class="field">
                        <RadioGeneric
                          v-model="nav.motivo"
                          :options="motivos"
                          name="motivo"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
                <div class="column">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Execução</legend>
                      <div class="field">
                        <RadioGeneric
                          v-model="nav.id_execucao"
                          :options="execucoes"
                          name="id_execucao"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Ciclo</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Nº de Ordem"
                        v-model="nav.ciclo"
                      />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Nº Máquina</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Patrimônio"
                        v-model="nav.maquina"
                      />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Viatura</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Prefixo ou Placa"
                        v-model="nav.viatura"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Motorista</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Identificação"
                        v-model="nav.motorista"
                      />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Operador</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Identificação"
                        v-model="nav.operador"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Tratamento</legend>
              <div class="columns">
                <div class="column">
                  <div class="content">
                    <label class="label">Produto</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="nav.id_prod_neb"
                        :data="prod_nebs"
                        @selGen="nav.id_prod_neb = $event"
                        :errclass="{ 'is-danger': v$.id_prod_neb.$error }"
                      />
                      <span class="is-error" v-if="v$.id_prod_neb.$error">
                        {{ v$.id_prod_neb.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Mistura</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Identificação"
                        v-model="nav.mistura"
                      />
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Consumo</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Identificação"
                        v-model="nav.qt_neb"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="columns">
              <div class="column">
                <fieldset class="fieldset">
                  <legend>Horário</legend>
                  <div class="columns">
                    <div class="column">
                      <div class="content">
                        <div class="field">
                          <label class="label">Início</label>
                          <div class="control">
                            <input
                              class="input"
                              type="time"
                              placeholder=""
                              v-model="nav.hora_inicio"
                            />
                            <span class="is-error" v-if="v$.hora_inicio.$error">
                              {{ v$.hora_inicio.$errors[0].$message }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column">
                      <div class="content">
                        <div class="field">
                          <label class="label">Término</label>
                          <div class="control">
                            <input
                              class="input"
                              type="time"
                              placeholder=""
                              v-model="nav.hora_termino"
                            />
                            <span class="is-error" v-if="v$.hora_termino.$error">
                              {{ v$.hora_termino.$errors[0].$message }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column">
                      <div class="content">
                        <div class="field">
                          <label class="label">Interrupção</label>
                          <div class="control">
                            <input
                              class="input"
                              type="time"
                              placeholder=""
                              v-model="nav.interrupcao"
                            />
                            <span class="is-error" v-if="v$.interrupcao.$error">
                              {{ v$.interrupcao.$errors[0].$message }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column">
                <fieldset class="fieldset">
                  <legend>Odômetro</legend>
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label">Km Rodados</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Identificação"
                            v-model="nav.km_rodado"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label">Km Fora</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Km rodados fora da aplicação"
                            v-model="nav.km_rodado"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <fieldset class="fieldset">
              <legend>Ambiente</legend>
              <div class="columns">
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Temp Inicial</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="°C" v-model="nav.temp_inicio" />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Temp Final</label>
                    <div class="control">
                      <input class="input" type="text" placeholder="°C" v-model="nav.temp_final" />
                    </div>
                  </div>
                </div>
                <div class="column is-8">
                  <fieldset class="fieldset">
                    <legend>Ocorrências</legend>
                    <GenericCheckBox
                      :options="ocorrencias"
                      :columnsCount="5"
                      :checkAll="false"
                      v-model="nav.ocorrencia"
                    />
                  </fieldset>
                </div>
              </div>
            </fieldset>
          </div>
          <footer class="card-footer">
            <footerCard @submit="save" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import veicularService from '@/services/atividade/veicular.service'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { required$, combo$, horaValida$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import areaNavService from '@/services/cadastro/areaNav.service'
import auxiliarService from '@/services/general/auxiliar.service'
import GenericCheckBox from '@/components/forms/GenericCheckBox.vue'

const toast = useToast()
const route = useRoute()
const { currentUser } = useCurrentUser()

var id_prop = ref(0)

const nav = reactive({
  id_area_nav: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_execucao: 0,
  motivo: 0,
  ciclo: 0,
  maquina: '',
  viatura: '',
  motorista: '',
  operador: '',
  id_prod_neb: 0,
  qt_neb: 0,
  mistura: 0,
  hora_inicio: '',
  hora_termino: '',
  interrupcao: '',
  temp_inicio: 0,
  temp_final: 0,
  ocorrencia: [],
})

const areas = ref([])
const motivos = ref([])
const execucoes = ref([])
const prod_nebs = ref([])
const ocorrencias = ref([])

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  dt_cadastro: { required$ },
  id_municipio: { required$, minValue: combo$(1) },
  id_area_nav: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  motivo: { required$, minValue: combo$(1) },
  ciclo: { required$ },
  maquina: { required$ },
  viatura: { required$ },
  motorista: { required$ },
  operador: { required$ },
  id_prod_neb: { required$, minValue: combo$(1) },
  qt_neb: { required$ },
  mistura: { required$ },
  hora_inicio: { horaValida$ },
  hora_termino: { horaValida$ },
  interrupcao: { horaValida$ },
}

const v$ = useValidate(rules, nav)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    nav.ocorrencia.splice(0, nav.ocorrencia.length, ...nav.ocorrencia.filter((v) => v !== 0))
    if (isEditMode.value) {
      resultado = await veicularService.update(nav)
      msg = 'Área alterada com sucesso!'
    } else {
      resultado = await veicularService.create(nav)
      msg = 'Área inserida com sucesso!'
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

watch(
  () => nav.id_municipio,
  async (val) => {
    const result = await areaNavService.getCombo(
      JSON.stringify({ id_municipio: val, tipo_area: 1 })
    )
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  }
)

async function loadCombos() {
  const result = await auxiliarService.getProdutoCombo(3)
  if (result.error) {
    console.log(result.error)
    prod_nebs.value = []
  } else {
    prod_nebs.value = result
  }

  const result3 = await auxiliarService.getGenericCombo(6)
  if (result3.error) {
    console.log(result3.error)
    ocorrencias.value = []
  } else {
    ocorrencias.value = result3
  }

  motivos.value = [
    { id: 1, nome: 'Dengue' },
    { id: 2, nome: 'Chikungunya' },
    { id: 3, nome: 'Febre Amarela' },
    { id: 4, nome: 'Zika' },
  ]

  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
  ]
}

function formatTimeToInput(value) {
  if (!value) return ''
  return value.slice(0, 5) // pega só "HH:mm"
}

onMounted(async () => {
  console.log(route)
  if (isEditMode.value) {
    const result = await veicularService.getVeicular(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      result.hora_inicio = formatTimeToInput(result.hora_inicio)
      result.hora_termino = formatTimeToInput(result.hora_termino)
      result.interrupcao = formatTimeToInput(result.interrupcao)

      Object.assign(nav, result)
    }
  } else {
    nav.id = 0
  }
  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }
  loadCombos()
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
