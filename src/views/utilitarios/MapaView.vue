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
            <section v-show="hasRows">
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
                  <Check v-model="selQuarts" :options="quadras" :columns-count="8" />
                </div>
              </div>
              <div class="columns">
                <div class="column has-text-right">
                  <span class="has-text-right export">
                    <button
                      class="button is-info is-outlined is-small"
                      title="Imprimir"
                      @click="printMap"
                    >
                      <font-awesome-icon icon="fa-solid fa-print" />
                    </button>
                  </span>
                </div>
              </div>
              <!-- CONTÊINER DO MAPA -->
              <div class="mapa-container" style="height: 500px; width: 100%; position: relative">
                <!-- Div onde o OpenLayers vai injetar o canvas do mapa -->
                <div id="map" style="width: 100%; height: 100%"></div>
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
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import Loader from '@/components/general/MyLoader.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import Check from '@/components/forms/GenericCheckBox.vue'
import { exportarMapaParaPDF } from '@/utils/mapa/mapPrinter.js'

import utilitariosService from '@/services/utilitarios.service'
import auxiliarService from '@/services/general/auxiliar.service'
import { useCurrentUser } from '@/composables/currentUser'

// Import fundamental do CSS do OpenLayers
import 'ol/ol.css'

// Imports OpenLayers
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import OSM from 'ol/source/OSM.js'
import Feature from 'ol/Feature.js'
import LineString from 'ol/geom/LineString.js'
import Point from 'ol/geom/Point.js'
import { Stroke, Style, Circle as CircleStyle, Fill } from 'ol/style.js'
import { fromLonLat } from 'ol/proj.js'

const { currentUser } = useCurrentUser()
const toast = useToast()

// Estados principais
const title = ref('Percurso dos Agentes')
const isLoading = ref(false)
const hasRows = ref(false)

// Dados dos combos, quadras e seleção
const atividades = ref([])
const agentes = ref([])
const quadras = ref([])
const selQuarts = ref([])

const polylinesPorQuadra = reactive({})

const filter = reactive({
  id_municipio: '',
  id_atividade: 0,
  dt_inicial: '',
  dt_final: '',
  ano: '2026',
  agente: '',
})

// Variáveis de referência do OpenLayers
let map = null
let vectorSource = null
let vectorLayer = null

// Estilo para linha
const estiloLinha = new Style({
  stroke: new Stroke({
    color: '#ff0000',
    width: 4,
  }),
})

// Estilo para o Ponto Isolado (1 ponto único)
const estiloPontoIsolado = new Style({
  image: new CircleStyle({
    radius: 7, // Tamanho do círculo
    fill: new Fill({ color: '#ff0000' }), // Cor de preenchimento
    stroke: new Stroke({
      color: '#ffffff', // Borda branca para destacar
      width: 2,
    }),
  }),
})

// Inicializador do Mapa OpenLayers
function initMap() {
  if (map) {
    // Se o mapa já existe, re-calcula o tamanho para evitar renderização incorreta
    setTimeout(() => map.updateSize(), 100)
    return
  }

  vectorSource = new VectorSource()

  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: '#ff0000',
        width: 4,
      }),
    }),
  })

  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ],
    view: new View({
      center: fromLonLat([-48.548, -22.594]),
      zoom: 7,
    }),
  })
}

async function printMap() {
  try {
    const opt = {
      titulo: `Percurso do Agente: ${filter.agente}`,
      nomeArquivo: 'Sisaweb 3 - percurso.pdf',
    }
    await exportarMapaParaPDF(map, opt)
  } catch (error) {
    console.error('Erro ao gerar impressão:', error)
  }
}

// Quando a tela do resultado é exibida (hasRows === true), inicializamos o mapa
watch(hasRows, async (val) => {
  if (val) {
    await nextTick() // Aguarda o DOM renderizar a div#map
    initMap()
  }
})

// Carregamento inicial de opções
async function loadInicial() {
  try {
    if (currentUser.value.tipo >= 4) {
      filter.id_municipio = Number(currentUser.value.unidade)
    }
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

// 2. Busca Lista de Quadras do Agente Selecionado
async function getQuadras() {
  if (!filter.agente) return

  isLoading.value = true
  selQuarts.value = []
  limparTodasPolylines()

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
    const params = {
      ...filter,
      id_quadra: idQuadra,
    }

    const response = await utilitariosService.getPontos(params)

    if (response && response.length > 0) {
      const coords = response.map((item) => [parseFloat(item.longitude), parseFloat(item.latitude)])

      // Passa o idQuadra no primeiro parâmetro
      desenharPolyline(idQuadra, coords)

      polylinesPorQuadra[idQuadra] = coords
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

// WATCH 1: Ao trocar o agente, recarrega a lista de quadras
watch(
  () => filter.agente,
  () => {
    getQuadras()
  },
)

// WATCH 2: Monitora seleções nos checkboxes dos quarteirões
watch(
  () => [...selQuarts.value],
  async (novosSelecionados, antigosSelecionados) => {
    const antigos = antigosSelecionados || []

    // 1. Identifica quarteirões NOVOS marcados -> Carrega e desenha
    const marcados = novosSelecionados.filter((id) => !antigos.includes(id))
    for (const idQuadra of marcados) {
      if (!polylinesPorQuadra[idQuadra]) {
        await carregarPontosQuadra(idQuadra)
      }
    }

    // 2. Identifica quarteirões DESMARCADOS -> Remove do OpenLayers
    const desmarcados = antigos.filter((id) => !novosSelecionados.includes(id))
    for (const idQuadra of desmarcados) {
      delete polylinesPorQuadra[idQuadra] // Limpa a referência no objeto local
      removerPolyline(idQuadra) // Remove a linha do mapa instantaneamente!
    }
  },
)

function limparTodasPolylines() {
  if (!vectorSource) return

  vectorSource.clear()
  reajustarZoomMapa()
}

onMounted(() => {
  loadInicial()
})

/**
 * Função para desenhar uma Polyline
 * @param {Array<Array<number>>} coordenadasExemplo Array [[long, lat], [long, lat]]
 */
function desenharPolyline(idQuadra, coordenadas) {
  if (!vectorSource || !coordenadas || coordenadas.length === 0) return

  let featureGeometria = null

  if (coordenadas.length === 1) {
    // CASO 1: Apenas 1 ponto isolado -> Cria um Point
    const pontoProjetado = fromLonLat(coordenadas[0])

    featureGeometria = new Feature({
      geometry: new Point(pontoProjetado),
    })

    // Aplica o estilo de círculo/marcador isolado
    featureGeometria.setStyle(estiloPontoIsolado)
  } else {
    // CASO 2: 2 ou mais pontos -> Cria uma LineString (Polyline)
    const coordenadasProjetadas = coordenadas.map((ponto) => fromLonLat(ponto))

    featureGeometria = new Feature({
      geometry: new LineString(coordenadasProjetadas),
    })

    // Aplica o estilo de linha
    featureGeometria.setStyle(estiloLinha)
  }

  // Define o idQuadra para podermos remover ao desmarcar o checkbox
  featureGeometria.set('idQuadra', idQuadra)

  // Adiciona na camada do OpenLayers
  vectorSource.addFeature(featureGeometria)

  // Reajusta o enquadramento do mapa
  reajustarZoomMapa()
}

function removerPolyline(idQuadra) {
  if (!vectorSource) return

  // Procura no OpenLayers a Feature com esse idQuadra
  const features = vectorSource.getFeatures()
  const featureParaRemover = features.find((f) => f.get('idQuadra') === idQuadra)

  if (featureParaRemover) {
    vectorSource.removeFeature(featureParaRemover)
  }

  // Reajusta o zoom considerando apenas as quadras restantes
  reajustarZoomMapa()
}

/**
 * Função utilitária para reajustar o enquadramento do mapa
 */
function reajustarZoomMapa() {
  if (!map || !vectorSource) return

  const extent = vectorSource.getExtent()
  // Verifica se o extent é válido (se existem linhas visíveis na tela)
  if (extent && isFinite(extent[0])) {
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      duration: 500,
    })
  }
}
</script>
