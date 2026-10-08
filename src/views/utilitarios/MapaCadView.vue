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
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-cens'"
                        v-model:sel="filter.id_area"
                        :data="areas"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- SEÇÃO DO RESULTADO E MAPA -->
            <section v-show="hasRows">
              <!-- CHECKBOXES DOS CENSITARIOS -->
              <div
                class="columns mb-4"
                v-if="censitarios.length > 0"
                :class="{ 'disabled-container': isLoading }"
              >
                <div class="column">
                  <label class="label">Censitários:</label>
                  <Check v-model="selCens" :options="censitarios" :columns-count="8" />
                </div>
              </div>

              <!-- CONTÊINER DO MAPA -->
              <div class="mapa-container" style="height: 700px; width: 100%; position: relative">
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
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import Loader from '@/components/general/MyLoader.vue'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import Check from '@/components/forms/GenericCheckBox.vue'
import { useCurrentUser } from '@/composables/currentUser'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import mapaService from '@/services/mapa.service'
import { useRouter } from 'vue-router'

// Import fundamental do CSS do OpenLayers
import 'ol/ol.css'

// Imports OpenLayers
import OLMap from 'ol/Map.js'
import View from 'ol/View.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'
import { Stroke, Style, Fill, Text } from 'ol/style.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import { fromLonLat } from 'ol/proj.js'
import { createEmpty, extend } from 'ol/extent.js'

const { currentUser } = useCurrentUser()
const toast = useToast()
const router = useRouter()

let map

// Estados principais
const title = ref('Mapa de cadastro')
const isLoading = ref(false)
const hasRows = ref(false)

// Dados dos combos, quadras e seleção
const areas = ref([])
const censitarios = ref([])
const selCens = ref([])

let setoresSource
let quadrasSource
let setoresLayer
let quadrasLayer

const filter = reactive({
  id_municipio: '',
  id_area: '',
  censitario: '',
  quadras: new Set(),
})

const cacheSetores = new Map()

const selecaoCumulativa = {
  setores: new Set(), // Armazena os CD_GEOCODI ativos
  quadras: new Set(), // Armazena todos os ID_AQ ativos de todos os setores marcados
}

// --- Estilos ---
const setorStyle = new Style({
  stroke: new Stroke({ color: '#ff0000', width: 3 }),
  fill: new Fill({ color: 'rgba(255, 0, 0, 0.05)' }),
})

const quadraStyle = new Style({
  stroke: new Stroke({ color: '#0066ff', width: 1.5 }),
  fill: new Fill({ color: 'rgba(0, 102, 255, 0.2)' }),
})

function adicionarSetorEQuadras(cdGeocodi, listaQuadrasFormatadas) {
  if (!setoresLayer || !quadrasLayer) return

  selecaoCumulativa.setores.add(String(cdGeocodi))

  listaQuadrasFormatadas.forEach((idQuadra) => {
    selecaoCumulativa.quadras.add(idQuadra)
  })

  // Atualiza as camadas no OpenLayers
  setoresLayer.changed()
  quadrasLayer.changed()

  ajustarZoomMutiplo()
}

function removerSetorEQuadras(cdGeocodi, listaQuadrasFormatadas) {
  if (!setoresLayer || !quadrasLayer) return

  selecaoCumulativa.setores.delete(String(cdGeocodi))

  listaQuadrasFormatadas.forEach((idQuadra) => {
    selecaoCumulativa.quadras.delete(idQuadra)
  })

  // Atualiza as camadas no OpenLayers
  setoresLayer.changed()
  quadrasLayer.changed()

  ajustarZoomMutiplo()
}

async function toggleSetor(id_cens, isChecked) {
  const cens = censitarios.value.find((i) => i.id == id_cens)
  const cdStr = cens.nome

  if (isChecked) {
    let quadrasFormatadas

    // 1. Busca do cache ou faz o fetch
    if (cacheSetores.has(cdStr)) {
      quadrasFormatadas = cacheSetores.get(cdStr)
    } else {
      const dados = await quarteiraoService.getCombo(JSON.stringify({ id_censitario: id_cens }))

      if (dados.length == 0) {
        toast.warning('Nenhuma quadra cadastrada nesse setor censitário')
      } else {
        // Formata: ${id_area}Q${quart.id_quarteirao}
        quadrasFormatadas = dados.map((quart) => `${filter.id_area}Q${quart.nome}`)

        // Salva no cache a lista já formatada
        cacheSetores.set(cdStr, quadrasFormatadas)
      }
    }

    // 2. Chama a função de adicionar
    adicionarSetorEQuadras(cdStr, quadrasFormatadas)
  } else {
    // 3. Pega do cache e chama a função de remover instantaneamente
    const quadrasFormatadas = cacheSetores.get(cdStr) || []
    removerSetorEQuadras(cdStr, quadrasFormatadas)
  }
}

function ajustarZoomMutiplo() {
  if (!setoresSource || selecaoCumulativa.setores.size === 0) return

  // Filtra as feições dos setores que estão marcados no momento
  const feicoesAtivas = setoresSource.getFeatures().filter((feature) => {
    return selecaoCumulativa.setores.has(String(feature.get('CD_GEOCODI')))
  })

  if (feicoesAtivas.length > 0) {
    // Cria um limite (extent) vazio e expande para abranger todas as feições ativas
    const combinedExtent = createEmpty()
    feicoesAtivas.forEach((feature) => {
      extend(combinedExtent, feature.getGeometry().getExtent())
    })

    // Anima a câmera para enquadrar perfeitamente todos os setores visíveis
    map.getView().fit(combinedExtent, {
      padding: [50, 50, 50, 50], // Margem em pixels nas bordas da tela
      duration: 800, // Duração da transição em ms
    })
  }
}

const criarEstiloLabel = (feature, camada) => {
  var idValue = ''
  var cor = '#1a1a1a'
  // Pega o valor do campo "ID" do GeoJSON da feature atual
  if (camada == 'quarteirao') {
    idValue = feature.get('ID')
  } else if (camada == 'censitario') {
    const rawValue = String(feature.get('CD_GEOCODI') || '').trim()

    // Pega apenas os últimos 5 dígitos (se a string tiver ao menos 5 caracteres)
    idValue = rawValue.length >= 5 ? rawValue.slice(-5) : rawValue

    cor = '#ff0000'
  }

  return new Style({
    // Rótulo de texto dinâmico (só é renderizado se mostrarRotulos for true)
    text: new Text({
      text: String(idValue), // O texto que vai aparecer no polígono
      font: 'bold 12px sans-serif',
      fill: new Fill({ color: cor }),

      // 3. Espaçamento interno em pixels [Topo, Direita, Baixo, Esquerda]
      padding: [3, 6, 3, 6],

      // Garante que o rótulo apareça completo no centroide
      overflow: true,
      placement: 'point', // Força exibição mesmo se o polígono for pequeno
    }),
  })
}

async function initMap() {
  try {
    isLoading.value = true
    if (map) {
      map.setTarget(null) // Desvincula o canvas da <div id="map">
      map = null // Limpa a referência
    }

    // ZERA AS VARIÁVEIS DE SELEÇÃO E CACHE DO MUNICÍPIO ANTERIOR
    selecaoCumulativa.setores.clear()
    selecaoCumulativa.quadras.clear()
    cacheSetores.clear()

    let colegiado

    const res = await mapaService.getColegiado(filter.id_municipio)
    if (res.error) {
      throw new Error('Falha ao obter o arquivo de mapa do servidor')
    } else {
      colegiado = res
    }

    var body = {
      colegiadoSlug: colegiado,
      idMunicipio: filter.id_municipio,
      camada: 'censitario', // ex: censitario
    }

    var geojsonData = null

    // Substitua pela rota real da sua API Node.js
    const result = await mapaService.getMapa(JSON.stringify(body))
    if (result.error) {
      toast.error('Erro obtendo o mapa de setores censitários! Tente mais tarde.')
      router.replace('/home')
      return
    } else {
      geojsonData = result
    }

    // --- Camadas Vector ---
    const format = new GeoJSON()
    setoresSource = new VectorSource({
      features: format.readFeatures(geojsonData, {
        dataProjection: 'EPSG:4326', // Projeção padrão do GeoJSON (WGS84 - Lat/Lon)
        featureProjection: 'EPSG:3857', // Projeção do mapa do OpenLayers
      }),
    })

    body.camada = 'quarteirao'

    geojsonData = null

    // Substitua pela rota real da sua API Node.js
    const result2 = await mapaService.getMapa(JSON.stringify(body))
    if (result2?.error || !result2) {
      toast.error(
        'Essa funcionalidade só é possível para municípios que possuem o arquivo de mapa para quarteirões!',
      )
      router.replace('/home')
      return
    } else {
      geojsonData = result2
    }

    quadrasSource = new VectorSource({
      features: format.readFeatures(geojsonData, {
        dataProjection: 'EPSG:4326', // Projeção padrão do GeoJSON (WGS84 - Lat/Lon)
        featureProjection: 'EPSG:3857', // Projeção do mapa do OpenLayers
      }),
    })

    setoresLayer = new VectorLayer({
      source: setoresSource,
      style: function (feature) {
        const idSetor = String(feature.get('CD_GEOCODI'))
        // Exibe se o setor estiver no Set de setores selecionados
        if (selecaoCumulativa.setores.has(idSetor)) {
          return [setorStyle, criarEstiloLabel(feature, 'censitario')]
        }
        return null
      },
    })

    quadrasLayer = new VectorLayer({
      source: quadrasSource,
      style: function (feature) {
        const idQuadra = String(feature.get('ID_AQ'))
        // Exibe se a quadra estiver no Set global de quadras
        if (selecaoCumulativa.quadras.has(idQuadra)) {
          return [quadraStyle, criarEstiloLabel(feature, 'quarteirao')]
        }
        return null
      },
    })

    // --- Inicialização do Mapa ---
    map = new OLMap({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        setoresLayer,
        quadrasLayer,
      ],
      view: new View({
        center: fromLonLat([-48.548, -22.594]),
        zoom: 7,
      }),
    })
  } finally {
    isLoading.value = false
  }
}

watch(hasRows, async (val) => {
  if (val) {
    await nextTick() // Aguarda o DOM renderizar a div#map
    initMap()
  }
})

watch(
  () => filter.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  },
)

watch(
  () => filter.id_area,
  async (val) => {
    const result = await censitarioService.getCombo(JSON.stringify({ id_area: val }))
    if (result.error) {
      console.log(result.error)
      censitarios.value = []
    } else {
      censitarios.value = result
      hasRows.value = censitarios.value.length
    }
  },
)

watch(
  () => [...selCens.value],
  async (novosSelecionados, antigosSelecionados = []) => {
    // 1. Identifica os setores NOVOS (que entraram na seleção)
    const marcados = novosSelecionados.filter((id) => !antigosSelecionados.includes(id))

    // 2. Identifica os setores REMOVIDOS (estavam antes, mas não estão mais)
    const desmarcados = antigosSelecionados.filter((id) => !novosSelecionados.includes(id))

    // 3. Aplica o toggle para cada setor marcado
    for (const id of marcados) {
      await toggleSetor(id, true)
    }

    // 4. Aplica o toggle para cada setor desmarcado
    for (const id of desmarcados) {
      await toggleSetor(id, false)
    }
  },
)

onMounted(() => {
  if (currentUser.value.tipo >= 4) {
    filter.id_municipio = Number(currentUser.value.unidade)
  }
})
</script>
