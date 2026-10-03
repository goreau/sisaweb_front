<template>
  <div class="mapa-container">
    <!-- Div onde o OpenLayers vai injetar o canvas do mapa -->
    <div ref="mapaElemento" class="mapa-canvas"></div>

    <Loader :active="carregando" />
    <!-- Loader visual durante o carregamento
    <div
      v-if="carregando"
      class="mapa-loader is-flex is-align-items-center is-justify-content-center"
    >
      <span class="button is-loading is-large is-white is-outlined">Carregando mapa...</span>
    </div>-->
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick, shallowRef } from 'vue'
import mapaService from '@/services/mapa.service'
import Loader from '../general/MyLoader.vue'
import { carregarPontosTabulares } from '@/utils/mapa/geraPontos.js'
import {
  vincularDadosEAtualizarEstilo,
  aplicarEstiloCoropletico,
} from '@/utils/mapa/geraPoligonos.js'
import { criarGrade } from '@/utils/mapa/geraGrade.js'

// Importações do OpenLayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import GeoJSON from 'ol/format/GeoJSON'

import { fromLonLat } from 'ol/proj'
import { isEmpty as isEmptyExtent } from 'ol/extent'
import { defaults as defaultControls } from 'ol/control'
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style'

const props = defineProps({
  // Dados recebidos do evento @selecionar da árvore
  selecaoAtual: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['mapa-pronto', 'estiloAtualizado', 'legendaAtualizada'])

defineExpose({
  limparCamadas,
  centralizarVisao,
  executarCarregamentoPontos,
  carregarPontosTabulares,
  atualizarCamadaComDados,
  redefinirEstiloLocal,
  alternarGrade,
})

const mapaElemento = ref(null)

const carregando = defineModel('loading', { type: Boolean, default: false })
const mostrarRotulo = defineModel('labeling', { type: Boolean, default: false })

let instanceMapa = shallowRef(null)

let fonteVetorial = null
let camadaVetorialRef = ref(null)

let fontePontos = null
const camadaPontosRef = ref(null)

let fonteGrade = null

let ultimosDadosRecebidos = null
let ultimaConfigEstilo = null

////  pontos /////////////
const estiloPontoPadrao = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: 'rgba(255, 0, 0, 0.4)' }),
    stroke: new Stroke({ color: '#8B0000', width: 1.5 }),
  }),
})

async function executarCarregamentoPontos(listaPontos, estiloConfig) {
  // 1. Executa o módulo GIS de pontos
  const dadosLegenda = carregarPontosTabulares(camadaPontosRef.value, listaPontos, estiloConfig)

  // 2. Se gerou legenda, dispara o emit pelo Vue
  if (dadosLegenda) {
    emit('legendaAtualizada', dadosLegenda)
  }
}

//// poligono //////////

// Estilo padrão para os polígonos enquanto a caixa de ferramentas não é aplicada

async function atualizarCamadaComDados({ dados, chaveMapa, chaveDados, estiloConfig }) {
  // Executa o módulo de mapa
  const resultado = vincularDadosEAtualizarEstilo(
    camadaVetorialRef.value,
    dados,
    chaveMapa,
    chaveDados,
    estiloConfig,
  )

  if (!resultado) return

  // 1. Emite a atualização da legenda
  if (resultado.legenda) {
    emit('legendaAtualizada', resultado.legenda)
  }

  // 2. Se os limites foram recalculados dinamicamente, avisa a View/Modal
  if (resultado.novoEstiloConfig) {
    emit('estiloAtualizado', resultado.novoEstiloConfig)
  }
}

async function redefinirEstiloLocal(novaConfigPaleta) {
  if (!ultimosDadosRecebidos) {
    console.warn('Nenhum dado carregado no mapa para redefinir o estilo.')
    return
  }

  // Mescla a nova paleta mantendo as outras opções do mapa
  ultimaConfigEstilo = {
    ...ultimaConfigEstilo,
    classes: novaConfigPaleta.classes,
    colors: [...novaConfigPaleta.colors],
    limites: novaConfigPaleta.limites ? [...novaConfigPaleta.limites] : undefined,
  }

  // Re-aplica a estilização usando o cache
  aplicarEstiloCoropletico(camadaVetorialRef.value, ultimaConfigEstilo)
  camadaVetorialRef.value.changed()
}

function limparCamadas() {
  if (fonteVetorial) {
    fonteVetorial.clear()
  }
}

// Método para enquadrar os polígonos na tela
function centralizarVisao() {
  if (!instanceMapa.value || !fonteVetorial) return

  const extensao = fonteVetorial.getExtent()

  // Verifica se a extensão é válida (tem feições carregadas)
  if (extensao && !isEmptyExtent(extensao)) {
    instanceMapa.value.getView().fit(extensao, {
      padding: [50, 50, 50, 50],
      duration: 600, // Animação suave de zoom em milissegundos
    })
  }
}

//// grade /////
function alternarGrade(ativo) {
  if (ativo) {
    const extent = fonteVetorial.getExtent()

    fonteGrade = criarGrade(extent, 400)

    instanceMapa.value.addLayer(fonteGrade)
  } else {
    if (fonteGrade) {
      instanceMapa.value.removeLayer(fonteGrade)
      fonteGrade = null
    }
  }
}

// Inicializa a instância base do OpenLayers
onMounted(async () => {
  try {
    carregando.value = true
    // Fonte e Camada Vetorial onde o GeoJSON será injetado
    fonteVetorial = new VectorSource()

    camadaVetorialRef.value = new VectorLayer({
      source: fonteVetorial,
      style: criarEstiloGeoJson,
    })

    fontePontos = new VectorSource()
    camadaPontosRef.value = new VectorLayer({
      source: fontePontos,
      style: estiloPontoPadrao,
    })

    await nextTick()
    // Criação do Mapa OpenLayers
    instanceMapa.value = new Map({
      target: mapaElemento.value,
      layers: [
        // Camada base do OpenStreetMap (Background)
        new TileLayer({
          source: new OSM(),
        }),
        // Camada dos Polígonos (GeoJSON)
        camadaVetorialRef.value,
        camadaPontosRef.value,
      ],
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
      }),
      view: new View({
        center: fromLonLat([-48.4337, -22.0706]), // Ponto inicial padrão (ajuste se necessário)
        zoom: 7,
      }),
    })

    emit('mapa-pronto', instanceMapa.value)
  } catch (error) {
    console.log(error)
  } finally {
    carregando.value = false
  }
})

// Garante a destruição limpa ao desmontar o componente Vue
onUnmounted(() => {
  if (instanceMapa.value) {
    instanceMapa.value.setTarget(null)
    instanceMapa.value = null
  }
})

// Observa mudanças na prop selecaoAtual para buscar o novo GeoJSON
watch(
  () => props.selecaoAtual,
  async (novaSelecao) => {
    if (!novaSelecao) return
    await carregarGeoJson(novaSelecao)
  },
  { deep: true },
)

watch(
  () => mostrarRotulo.value,
  // eslint-disable-next-line no-unused-vars
  (novoValor) => {
    if (camadaVetorialRef.value) {
      camadaVetorialRef.value.changed()
    }
  },
)

const criarEstiloGeoJson = (feature) => {
  var idValue = ''
  // Pega o valor do campo "ID" do GeoJSON da feature atual
  if (props.selecaoAtual.camada == 'quarteirao') {
    idValue = feature.get('ID')
  } else if (props.selecaoAtual.camada == 'censitario') {
    idValue = feature.get('CD_GEOCODI')
  } else {
    feature.get('CODMUNIC')
  }

  return new Style({
    // Preenchimento e Borda padrão do polígono
    fill: new Fill({
      color: 'rgba(50, 115, 220, 0.1)', // Azul do Bulma semi-transparente
    }),
    stroke: new Stroke({
      color: '#3273dc',
      width: 1.5,
    }),

    // Rótulo de texto dinâmico (só é renderizado se mostrarRotulos for true)
    text: mostrarRotulo.value
      ? new Text({
          text: String(idValue), // O texto que vai aparecer no polígono
          font: 'bold 12px sans-serif',
          fill: new Fill({ color: '#1a1a1a' }),

          // 1. Cor de fundo da caixa
          /*  backgroundFill: new Fill({
            color: 'rgba(255, 255, 255, 0.9)', // Branco com 90% de opacidade
          }),*/

          // 2. Borda ao redor do fundo
          /*  backgroundStroke: new Stroke({
            color: '#2980b9',
            width: 1.5,
          }),*/

          // 3. Espaçamento interno em pixels [Topo, Direita, Baixo, Esquerda]
          padding: [3, 6, 3, 6],

          // Garante que o rótulo apareça completo no centroide
          overflow: true,
          placement: 'point', // Força exibição mesmo se o polígono for pequeno
        })
      : null, // Se for false, não desenha o texto
  })
}

// Função que chama o backend Node.js e renderiza os polígonos
async function carregarGeoJson(dadosSelecao) {
  carregando.value = true

  try {
    const body = JSON.stringify({
      colegiadoSlug: dadosSelecao.colegiadoSlug,
      idMunicipio: dadosSelecao.idMunicipio ? `${dadosSelecao.idMunicipio}` : 999, // ex: 400
      camada: dadosSelecao.camada, // ex: censitario
    })

    var geojsonData = null

    // Substitua pela rota real da sua API Node.js
    const result = await mapaService.getMapa(body)
    if (result.error) {
      throw new Error('Falha ao obter o arquivo de mapa do servidor')
    } else {
      geojsonData = result
    }

    // 1. Limpa polígonos anteriores
    fonteVetorial.clear()

    // 2. Lê e converte o GeoJSON para Features do OpenLayers
    const leitorGeoJson = new GeoJSON()
    const features = leitorGeoJson.readFeatures(geojsonData, {
      featureProjection: 'EPSG:3857', // Projeção padrão do OpenLayers/OSM
    })

    // 3. Adiciona as geometrias na fonte vetorial
    fonteVetorial.addFeatures(features)

    // 4. Centraliza e ajusta o Zoom do mapa nos polígonos carregados
    if (features.length > 0) {
      const extensao = fonteVetorial.getExtent()
      instanceMapa.value.getView().fit(extensao, {
        padding: [30, 30, 30, 30],
        duration: 800, // Animação suave de transição de câmera (0.8s)
      })
    }
  } catch (erro) {
    console.error('Erro ao carregar GeoJSON no mapa:', erro)
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.mapa-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  padding: 2rem;
}

.mapa-canvas {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.mapa-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
  z-index: 10;
}
</style>
