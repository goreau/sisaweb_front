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
    <div class="columns" v-if="props.ativos?.tipo_rel">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <fieldset class="fieldset">
            <legend>Tipo de Tratamento</legend>
            <div class="field">
              <RadioGeneric
                v-model="filtros.tipo_rel"
                :options="tipos_rel"
                name="tipo_rel"
                :inline="true"
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.ref_ativ > 0">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <fieldset class="fieldset">
            <legend>Tipo de Trabalho</legend>
            <div class="field">
              <RadioGeneric
                v-model="filtros.ref_ativ"
                :options="ref_ativs"
                name="ref_ativ"
                :inline="true"
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.atividade > 0">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <fieldset class="fieldset">
            <legend>Atividade</legend>
            <div class="field">
              <RadioGeneric
                v-model="filtros.id_atividade"
                :options="atividades"
                name="id_atividade"
                :inline="true"
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.execucao">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <fieldset class="fieldset">
            <legend>Execucao</legend>
            <div class="field">
              <RadioGeneric
                v-model="filtros.id_execucao"
                :options="execucoes"
                name="id_execucao"
                :inline="true"
              />
            </div>
          </fieldset>
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
    <div class="columns" v-if="props.ativos?.ano">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <div class="field">
            <label class="label">Ano</label>
            <div class="control">
              <input class="input" type="number" v-model="filtros.ano" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.area_nav">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <label class="label">Área de Transmissão</label>
          <div class="control">
            <CmbGeneric
              :sel="filtros.id_area_nav"
              :data="areas_nav"
              @selGen="filtros.id_area_nav = $event"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.variaveis > 0">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <label class="label">Variável</label>
          <div class="control">
            <CmbGeneric
              :sel="filtros.id_variavel"
              :data="variaveis"
              @selGen="filtros.id_variavel = $event"
            />
          </div>
          <span class="is-error" v-if="is_error.variavel">
              'Obrigatório informar um valor'
          </span>
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
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { useCurrentUser } from '@/composables/currentUser'
import auxiliarService from '@/services/general/auxiliar.service'
import area_navService from '@/services/cadastro/areaNav.service'
import reportService from '@/services/report.service'

const emit = defineEmits(['submit'])

const props = defineProps(['ativos', 'endpoint'])

const { currentUser } = useCurrentUser()

const municipios = ref([])
const atividades = ref([])
const ref_ativs = ref([])
const execucoes = ref([])
const variaveis = ref([])
const areas_nav = ref([])
const tipos_rel = ref([])

const STORAGE_KEY = 'consulta-reportsw'


const is_error = reactive({
  variavel: false
})

const filtros = reactive({
  id_gve: 0,
  id_municipio: '',
  id_atividade: 0,
  ref_ativ: 0,
  id_execucao: 0,
  id_variavel: 0,
  dt_inicial: '',
  dt_final: '',
  ano: '2025',
  id_area_nav: 0,
  tipo_rel: 0
})

function processar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtros))
  if (filtros.id_variavel > 0) {
    const opt = variaveis.value.find((o) => o.id === Number(filtros.id_variavel))
    filtros.fantVar = opt.nome
  } else if (props.ativos.variaveis){
    is_error.variavel = true
    return false
  }
  if (filtros.tipo_rel > 0) {
    const opt = tipos_rel.value.find((o) => o.id === Number(filtros.tipo_rel))
    filtros.fantVar = opt.nome
  }
  emit('submit', filtros)
}

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos_rel.value = [
        {id: 1, nome: 'Focal'},
        {id: 2, nome: 'Perifocal'},
        {id: 3, nome: 'Nebulização'},
        {id: 4, nome: 'BRI'}
    ]

  const result = await auxiliarService.getMunicipiosCombo(JSON.stringify({}))
  if (result.error) {
    console.log(result.error)
    municipios.value = []
  } else {
    municipios.value = result
  }
}

watch(
  () => props.ativos,
  async (val) => {
    if (props.ativos?.ano) {
      filtros.ano = new Date().getFullYear()
    } else {
      filtros.ano = 0
    }
    if (props.ativos?.atividade && props.ativos?.atividade > 0) {
      if (val.atividade == 2) {
        const result = await auxiliarService.getAtividadeCombo(2)
        if (result.error) {
          atividades.value = []
        } else {
          atividades.value = result
        }
        const result1 = await auxiliarService.getAtividadeCombo(3)
        if (result1.error) {
          atividades.value = []
        } else {
          atividades.value = [...atividades.value, ...result1]
        }
      } else if (val.atividade == 1) {
        const result1 = await auxiliarService.getAtividadeCombo(val.atividade)
        if (result1.error) {
          atividades.value = []
        } else {
          atividades.value = result1
        }
      }
    } else {
      filtros.id_atividade = 0
    }
    if (props.ativos?.ref_ativ && props.ativos?.ref_ativ > 0) {
      ref_ativs.value = [
        { id: 10, nome: 'Imóveis Cadastrados' },
        { id: 9, nome: 'Outras Atividades' },
      ]
    } else {
      filtros.ref_ativ = 0
    }
    if (props.ativos?.variaveis && props.ativos?.variaveis > 0) {
      const result = await reportService.getVariaveis(val.variaveis)
      if (result.error) {
        variaveis.value = []
      } else {
        variaveis.value = result
      }
    } else {
      filtros.id_variavel = 0
    }
  }
)

watch(
  () => filtros.id_municipio,
  async () => {
    if (props.endpoint != 'nav_previsao') return
    const result = await area_navService.getCombo(JSON.stringify(filtros))
    if (result.error) {
      console.log(result.error)
      areas_nav.value = []
    } else {
      areas_nav.value = result
    }
  }
)

watch(
  () => filtros.ano,
  async () => {
    if (props.endpoint != 'nav_previsao') return
    const result = await area_navService.getCombo(JSON.stringify(filtros))
    if (result.error) {
      console.log(result.error)
      areas_nav.value = []
    } else {
      areas_nav.value = result
    }
  }
)

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
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filtros, JSON.parse(saved))
  }
  loadCombos()
})
</script>
