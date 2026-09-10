<template>
  <div class="main-container p-4">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />

        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">{{ title }}</p>
          </header>

          <div class="card-content">
            <!-- SEÇÃO DE FILTROS -->
            <section v-if="!hasRows">
              <div class="columns">
                <div class="column is-6 is-offset-3" v-if="currentUser.tipo < 4">
                  <div class="content">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio v-model:sel="filter.id_municipio" :tipo="99" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Atividade</legend>
                      <div class="field">
                        <RadioGeneric
                          v-model="filter.id_atividade"
                          :options="atividades"
                          name="id_atividade"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>

              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Data Inicial</label>
                    <div class="control">
                      <DatePicker v-model="filter.dt_inicial" placeholder="Escolha a data" />
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Data Final</label>
                    <div class="control">
                      <DatePicker v-model="filter.dt_final" placeholder="Escolha a data" />
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button class="button is-primary is-fullwidth" @click="buscar">
                    Buscar Agentes
                  </button>
                </div>
              </div>
            </section>

            <!-- SEÇÃO DO RESULTADO E MAPA -->
            <section v-if="hasRows">
              <div class="columns mb-4">
                <div class="column is-6 is-offset-3">
                  <div class="content">
                    <label class="label">Agentes</label>
                    <div class="control">
                      <CmbGeneric v-model:sel="filter.agente" :data="agentes" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- CHECKBOXES DOS QUARTEIRÕES -->
              <div class="columns mb-4" v-if="quadras.length > 0">
                <div class="column">
                  <label class="label">Quarteirões Trabalhados:</label>
                  <Check v-model="selQuarts" :options="quadras" :columns-count="4" />
                </div>
              </div>

              <!-- CONTÊINER DO MAPA -->
              <div class="map-wrapper" style="height: 700px; width: 100%">
                <l-map
                  v-model:zoom="zoom"
                  :center="center"
                  style="height: 100%; width: 100%"
                  @ready="onMapReady"
                >
                  <l-tile-layer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    layer-type="base"
                    name="OpenStreetMap"
                  ></l-tile-layer>

                  <!-- MULTÍPLAS POLYLINES (UMA PARA CADA QUARTEIRÃO SELECIONADO) -->
                  <l-polyline
                    v-for="(latLngs, idQuadra) in polylinesPorQuadra"
                    :key="idQuadra"
                    :lat-lngs="latLngs"
                    color="#0066cc"
                    :weight="3"
                    :opacity="0.8"
                  />
                </l-map>
              </div>

              <div class="mt-4">
                <button class="button is-light" @click="hasRows = false">
                  ← Voltar aos filtros
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LMap, LTileLayer, LPolyline } from '@vue-leaflet/vue-leaflet'

import Loader from '@/components/general/MyLoader.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import Check from '@/components/forms/GenericCheckBox.vue'

import utilitariosService from '@/services/utilitarios.service'
import auxiliarService from '@/services/general/auxiliar.service'
import { useCurrentUser } from '@/composables/currentUser'

if (typeof window !== 'undefined') {
  window.L = L
}

const { currentUser } = useCurrentUser()
const toast = useToast()

// Estados principais
const title = ref('Percurso dos Agentes')
const isLoading = ref(false)
const hasRows = ref(false)
const mapRef = ref(null)

// Configuração inicial do Mapa
const zoom = ref(8)
const center = ref([-23.55052, -46.633308])

// Dados dos combos, quadras e seleção
const atividades = ref([])
const agentes = ref([])
const quadras = ref([])
const selQuarts = ref([])

// Dicionário/Objeto reativo para guardar os pontos de cada quarteirão:
// Estrutura: { [idQuadra]: [[lat1, lng1], [lat2, lng2], ...] }
const polylinesPorQuadra = reactive({})

const filter = reactive({
  id_municipio: '',
  id_atividade: 0,
  dt_inicial: '',
  dt_final: '',
  ano: '2026',
  agente: '',
})

function onMapReady(mapObject) {
  mapRef.value = mapObject
  nextTick(() => {
    mapObject.invalidateSize()
  })
}

// Carregamento inicial de opções
async function loadInicial() {
  try {
    const res = await auxiliarService.getAtividadeCombo(2)
    atividades.value = res.error ? [] : res
  } catch (err) {
    console.error('Erro ao carregar atividades:', err)
  }
}

// 1. Busca Agentes
async function buscar() {
  isLoading.value = true
  limparTodasPolylines()

  try {
    const response = await utilitariosService.getAgentes(filter)
    agentes.value = response || []

    if (agentes.value.length === 0) {
      toast.error('Nenhuma atividade encontrada no período!')
      hasRows.value = false
    } else {
      hasRows.value = true
    }
  } catch (err) {
    console.error('Erro ao buscar agentes:', err)
    toast.error('Erro ao buscar dados!')
  } finally {
    isLoading.value = false
  }
}

// Limpa o estado das polylines do mapa
function limparTodasPolylines() {
  Object.keys(polylinesPorQuadra).forEach((key) => delete polylinesPorQuadra[key])
}

// 2. Busca Lista de Quadras do Agente Selecionado
async function getQuadras() {
  if (!filter.agente) return

  isLoading.value = true
  limparTodasPolylines()
  selQuarts.value = [] // Reseta os checkboxes marcados

  try {
    const response = await utilitariosService.getQuadras(filter)
    quadras.value = response || []

    if (quadras.value.length === 0) {
      toast.error('Nenhuma quadra encontrada para este agente!')
    }
  } catch (err) {
    console.error('Erro ao buscar quadras:', err)
  } finally {
    isLoading.value = false
  }
}

// 3. Busca os pontos de UM quarteirão específico e adiciona no mapa
async function carregarPontosQuadra(idQuadra) {
  isLoading.value = true
  try {
    // Monte os parâmetros do backend informando o idQuadra selecionado
    const params = {
      ...filter,
      id_quadra: idQuadra,
    }

    const response = await utilitariosService.getPontos(params)

    if (response && response.length > 0) {
      // Converte para [[lat, lng], [lat, lng], ...]
      const coords = response.map((item) => [parseFloat(item.latitude), parseFloat(item.longitude)])

      // Armazena no dicionário no ID da quadra correspondente
      polylinesPorQuadra[idQuadra] = coords

      // Enquadra o mapa para exibir todas as polylines visíveis no momento
      reajustarBoundsMapa()
    } else {
      toast.warning(`Nenhum ponto encontrado para o quarteirão selecionado.`)
    }
  } catch (err) {
    console.error(`Erro ao carregar pontos do quarteirão ${idQuadra}:`, err)
    toast.error('Erro ao carregar os pontos do quarteirão.')
  } finally {
    isLoading.value = false
  }
}

// Reajusta o enquadramento (zoom/centro) do mapa com base nas polylines ativas
function reajustarBoundsMapa() {
  if (!mapRef.value) return

  const todasCoordenadas = Object.values(polylinesPorQuadra).flat()

  if (todasCoordenadas.length > 0) {
    nextTick(() => {
      mapRef.value.fitBounds(todasCoordenadas, { padding: [30, 30] })
    })
  }
}

// WATCH 1: Ao trocar o agente, recarrega a lista de quadras
watch(
  () => filter.agente,
  () => {
    getQuadras()
  },
)

// WATCH 2: Monitora seleções nos checkboxes dos quarteirões (selQuarts)
watch(
  () => [...selQuarts.value],
  async (novosSelecionados, antigosSelecionados) => {
    const antigos = antigosSelecionados || []

    // 1. Identifica quarteirões NOVOS marcados -> Busca no backend
    const marcados = novosSelecionados.filter((id) => !antigos.includes(id))
    for (const idQuadra of marcados) {
      if (!polylinesPorQuadra[idQuadra]) {
        await carregarPontosQuadra(idQuadra)
      }
    }

    // 2. Identifica quarteirões DESMARCADOS -> Remove a polyline instantaneamente
    const desmarcados = antigos.filter((id) => !novosSelecionados.includes(id))
    for (const idQuadra of desmarcados) {
      delete polylinesPorQuadra[idQuadra]
    }

    // Se houver alteração, ajusta o enquadramento do mapa
    if (desmarcados.length > 0) {
      reajustarBoundsMapa()
    }
  },
)

onMounted(() => {
  loadInicial()
})
</script>

<style scoped>
.map-wrapper {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
}
</style>
