<!-- src/components/FiltroWrapper.vue -->
<template>
  <div class="box">
    <div class="columns" v-if="props.ativos?.tipo_rel">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <fieldset class="fieldset">
            <legend>Tipo</legend>
            <div class="field">
              <RadioGeneric
                v-enter-to-next="'form-report'"
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
    <div class="columns" v-if="currentUser.tipo < 3 && props.ativos?.gve">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <label class="label">GVE</label>
          <div class="control">
            <CmbTerritorio v-enter-to-next="'form-report'" v-model:sel="filtros.id_gve" :tipo="9" />
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
              v-enter-to-next="'form-report'"
              v-model:sel="filtros.id_municipio"
              :data="municipios"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="columns" v-if="props.ativos?.bairro">
      <div class="column is-6 is-offset-3">
        <div class="content">
          <label class="label">Bairro</label>
          <div class="control">
            <CmbGeneric
              v-enter-to-next="'form-report'"
              v-model:sel="filtros.id_bairro"
              :data="bairros"
            />
          </div>
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
                v-enter-to-next="'form-report'"
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
                v-enter-to-next="'form-report'"
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
                v-enter-to-next="'form-report'"
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
            <DatePicker
              v-enter-to-next="'form-report'"
              v-model="filtros.dt_inicial"
              :error="false"
              placeholder="Escolha a data"
            />
          </div>
        </div>
      </div>
      <div class="column is-3">
        <div class="field">
          <label class="label">Data Final</label>
          <div class="control">
            <DatePicker
              v-enter-to-next="'form-report'"
              v-model="filtros.dt_final"
              :error="false"
              placeholder="Escolha a data"
            />
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
              <input
                v-enter-to-next="'form-report'"
                class="input"
                type="number"
                v-model="filtros.ano"
              />
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
              v-enter-to-next="'form-report'"
              v-model:sel="filtros.id_area_nav"
              :data="areas_nav"
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
              v-enter-to-next="'form-report'"
              v-model:sel="filtros.id_variavel"
              :data="variaveis"
            />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div
          class="buttons is-centered mt-4"
          data-focus-type="custom-submit-group"
          v-enter-to-next="'submit-action'"
        >
          <button
            class="button is-primary is-outlined is-fullwidth"
            @click="processar"
            v-enter-to-next="'submit-action'"
          >
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
import bairroService from '@/services/cadastro/bairro.service'

const emit = defineEmits(['submit'])

const props = defineProps(['ativos', 'endpoint'])

const { currentUser } = useCurrentUser()

const municipios = ref([])
const atividades = ref([])
const ref_ativs = ref([])
const execucoes = ref([])
const variaveis = ref([])
const areas_nav = ref([])
const bairros = ref([])
const tipos_rel = ref([])
const filtrosAtivos = reactive({})

const STORAGE_KEY = 'consulta-reportsw'

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
  id_bairro: 0,
  tipo_rel: 0,
})

/**const filtrosAtivos = computed(() => {
  return Object.keys(filtros.value).reduce((acc, key) => {
    if (props.ativos.value[key] && filtros.value[key] !== '' && filtros.value[key] != null) {
      acc[key] = filtros.value[key]
    }
    return acc
  }, {})
filtrosAtivos.value = Object.keys(filtros).reduce((acc, key) => {
    if (props.ativos[key] && filtros[key] !== null && filtros[key] !== '') {
      acc[key] = filtros[key]
    }
    return acc
  }, {})

})*/

function limparFiltros() {
  Object.keys(filtrosAtivos).forEach((k) => delete filtrosAtivos[k])
  if (props.ativos['ano'] && filtros.ano !== '' && filtros.ano != null) {
    filtrosAtivos.ano = filtros.ano
  }
  if (props.ativos['municipio'] && filtros.id_municipio !== '' && filtros.id_municipio != null) {
    filtrosAtivos.id_municipio = filtros.id_municipio
  }
  if (props.ativos['atividade'] && filtros.id_atividade !== '' && filtros.id_atividade != null) {
    filtrosAtivos.id_atividade = filtros.id_atividade
  }
  if (props.ativos['gve'] && filtros.id_gve !== '' && filtros.id_gve != null) {
    filtrosAtivos.id_gve = filtros.id_gve
  }
  if (props.ativos['execucao'] && filtros.id_execucao !== '' && filtros.id_execucao != null) {
    filtrosAtivos.id_execucao = filtros.id_execucao
  }
  if (props.ativos['variaveis'] && filtros.id_variavel !== '' && filtros.id_variavel != null) {
    filtrosAtivos.id_variavel = filtros.id_variavel
  }
  if (props.ativos['datas'] && filtros.dt_inicial !== '' && filtros.dt_inicial != null) {
    let dataIni = new Date(filtros.dt_inicial)

    dataIni.setHours(0, 0, 0, 0)
    filtrosAtivos.dt_inicial = dataIni
  }
  if (props.ativos['datas'] && filtros.dt_final !== '' && filtros.dt_final != null) {
    let dataFim = new Date(filtros.dt_final)

    dataFim.setHours(23, 59, 59, 999)

    filtrosAtivos.dt_final = dataFim
  }
  if (props.ativos['area_nav'] && filtros.id_area_nav !== '' && filtros.id_area_nav != null) {
    filtrosAtivos.id_area_nav = filtros.id_area_nav
  }
  if (props.ativos['bairro'] && filtros.id_bairro !== '' && filtros.id_bairro != null) {
    filtrosAtivos.id_bairro = filtros.id_bairro
  }
  filtrosAtivos.tipo_rel = filtros.tipo_rel
}

function processar() {
  limparFiltros()
  //console.log(filtros)
  //console.log(props.ativos)
  //console.log(filtrosAtivos)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtros))
  if (filtros.id_variavel > 0) {
    const opt = variaveis.value.find((o) => o.id === Number(filtros.id_variavel))
    filtros.fantVar = opt.nome
  }
  if (filtros.tipo_rel > 0) {
    const opt = tipos_rel.value.find((o) => o.id === Number(filtros.tipo_rel))
    filtros.fantVar = opt.nome
  }
  emit('submit', filtrosAtivos)
}

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos_rel.value = [
    { id: 1, nome: 'Focal' },
    { id: 2, nome: 'Perifocal' },
    { id: 3, nome: 'Nebulização' },
    { id: 4, nome: 'BRI' },
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
      const itemExtra = { id: 0, nome: 'Todas' } // Altere conforme sua necessidade

      if (val.atividade == 2) {
        const [res2, res3] = await Promise.all([
          auxiliarService.getAtividadeCombo(2),
          auxiliarService.getAtividadeCombo(3),
        ])

        const lista2 = res2.error ? [] : res2
        const lista3 = res3.error ? [] : res3

        atividades.value = [...lista2, ...lista3]
      } else if (val.atividade == 1) {
        const result = await auxiliarService.getAtividadeCombo(1)
        atividades.value = result.error ? [] : result
      }

      // 2. Insere o item extra no início (unshift) ou fim (push) da lista final
      if (atividades.value.length > 0 || val.atividade) {
        atividades.value.unshift(itemExtra)
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
    if (!props.ativos?.tipo_rel && props.ativos?.tipo_rel == 0) {
      filtros.tipo_rel = 0
    }
    if (!props.ativos?.tipo_rel && props.ativos?.tipo_rel == 0) {
      filtros.tipo_rel = 0
    }
    if (!props.ativos?.id_execucao && props.ativos?.id_execucao == 0) {
      filtros.id_execucao = 0
    }
  },
)

watch(
  () => filtros.id_municipio,
  async () => {
    const result1 = await bairroService.getCombo(JSON.stringify(filtros))
    if (result1.error) {
      console.log(result1.error)
      bairros.value = []
    } else {
      bairros.value = result1
    }
    if (props.endpoint != 'nav_previsao') return
    const result = await area_navService.getCombo(JSON.stringify(filtros))
    if (result.error) {
      console.log(result.error)
      areas_nav.value = []
    } else {
      areas_nav.value = result
    }
  },
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
  },
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
  },
)

onMounted(async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(filtros, JSON.parse(saved))
  }
  loadCombos()
})
</script>
