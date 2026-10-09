<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mapas</p>
            <button class="button is-info is-outlined" @click="reload">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-rotate-back" />
              </span>
              <span>Reiniciar</span>
            </button>
          </header>
          <div class="card-content">
            <aside v-if="!hasSel" class="sidebar">
              <ItemArvore :nos="options" @selecionar="onSelecionarCamada" />
            </aside>

            <!-- Área do Mapa e Caixa de Ferramentas -->
            <main class="map-section">
              <MapTools
                v-if="hasSel"
                @reiniciar="onReiniciarMapa"
                @centralizar="onCentralizarMapa"
                @construir="onConstruir"
                @paleta="onPaleta"
                @legenda="onLegenda"
                @label="onLabel"
                @grade="onGrade"
                @tile="onTile"
                @pontos="onRandomPt"
                @print="onPrint"
              />
              <MapaViewer
                :key="mapKey"
                ref="mapaViewerRef"
                :selecao-atual="selecaoUsuario"
                v-model:loading="isLoading"
                v-model:labeling="isLabeling"
                @mapa-pronto="aoCarregarMapa"
                @legendaAtualizada="aoAtualizarLegenda"
                @estiloAtualizado="aoAtualizarEstiloDoMapa"
              />
              <LegendaMapa :legendas="legendasAtivas" v-if="temDadosLegenda" />
            </main>
            <Modal v-if="showForm" @confirm="handleForm" @cancel="cancelForm">
              <!-- Conteúdo específico do modal -->
              <FormularioConstrucao
                ref="formRef"
                v-model="opcoesConstrucao"
                @aplicar="onAplicarConstrucao"
              />
            </Modal>
            <Modal v-if="showPaleta" @confirm="handlePaleta" @cancel="cancelPaleta">
              <!-- Conteúdo específico do modal -->
              <PaletaCores
                ref="paletaRef"
                :limites-atuais="limitesDoMapa"
                :classes-atuais="numClassesDoMapa"
                @aplicar="onAplicarCores"
              />
            </Modal>
            <Modal
              v-if="showGradeOptions"
              @confirm="handleGradeOptions"
              @cancel="cancelGradeOptions"
            >
              <!-- Conteúdo específico do modal -->
              <div class="opcoes-rapidas">
                <input
                  class="input"
                  type="range"
                  v-model="gradeSize"
                  :min="300"
                  :max="2000"
                  :step="100"
                />
                {{ gradeSize }}m
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LegendaMapa from '@/components/mapa/LegendaMapa.vue'
import ItemArvore from '@/components/mapa/ItemArvore.vue'
import MapaViewer from '@/components/mapa/MapaViewer.vue'
import FormularioConstrucao from '@/components/mapa/FormularioConstrucao.vue'
import PaletaCores from '@/components/mapa/PaletaCores.vue'
import mapaService from '@/services/mapa.service'
import { onMounted, ref, nextTick, watch, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import MapTools from '@/components/mapa/MapTools.vue'
import Modal from '@/components/forms/GenericModal.vue'

const toast = useToast()

const instanceMapa = ref(null)
const mapaViewerRef = ref(null)
const formRef = ref(null)
const paletaRef = ref(null)

const options = ref([])
const selecaoUsuario = ref(null)

const mapKey = ref(0)

var hasSel = ref(false)
var showLegenda = ref(true)

var showGrade = ref(true)
var showPontos = ref(true)
var showGradeOptions = ref(false)
var gradeSize = ref(400)

var showTile = ref(true)

const isLoading = ref(false)
const isLabeling = ref(false)

const showForm = ref(false)

const showPaleta = ref(false)

const limitesDoMapa = ref([15.5, 30.0, 45.5, 60.0, 85.2])
const numClassesDoMapa = ref(5)

const configEstiloModal = ref({})

const opcoesConstrucao = reactive({
  dt_inicial: '',
  dt_final: '',
  variavel: '',
  classes: 5,
  exibirLegenda: true,
  tipo: 'poligono',
})

const legendasAtivas = ref([])

function reload() {
  legendasAtivas.value = []
  hasSel.value = false
  selecaoUsuario.value = null

  mapKey.value += 1
}

function aoAtualizarLegenda(novaLegenda) {
  if (!novaLegenda || !novaLegenda.itens || novaLegenda.itens.length === 0) return

  // Procura se já existe uma legenda para esta camada (usando um id ou o próprio título)
  const idChave = novaLegenda.id || novaLegenda.titulo
  const index = legendasAtivas.value.findIndex((item) => (item.id || item.titulo) === idChave)

  if (index !== -1) {
    // Atualiza a legenda existente mantendo a reatividade
    legendasAtivas.value[index] = novaLegenda
  } else {
    // Adiciona uma nova legenda ao array
    legendasAtivas.value.push(novaLegenda)
  }
}

// Função utilitária opcional caso o mapa emita quando uma camada for removida
/*function aoRemoverLegenda(idOuTituloCamada) {
  legendasAtivas.value = legendasAtivas.value.filter(
    (item) => (item.id || item.titulo) !== idOuTituloCamada,
  )
}*/

function aoAtualizarEstiloDoMapa(novaConfig) {
  configEstiloModal.value = { ...novaConfig }
  limitesDoMapa.value = novaConfig.limites
  numClassesDoMapa.value = novaConfig.classes
}

async function handleForm() {
  if (formRef.value) {
    // Aciona a validação/sincronização interna do formulário
    formRef.value.submeter()
  }
}

async function handlePaleta() {
  if (paletaRef.value) {
    // Executa a validação, grava no localStorage e dispara o @aplicar
    paletaRef.value.submeter()
  }
  showPaleta.value = false
}

async function handleGradeOptions() {
  mapaViewerRef.value.alternarGrade(true, gradeSize.value)
  showGradeOptions.value = false
}

async function cancelGradeOptions() {
  showGradeOptions.value = false
}

async function onAplicarCores(novaPaleta) {
  opcoesConstrucao.classes = novaPaleta.classes
  opcoesConstrucao.limites = novaPaleta.limites
  opcoesConstrucao.colors = novaPaleta.colors

  // 2. Chama diretamente a função leve do mapa (sem loading de backend!)
  if (mapaViewerRef.value) {
    mapaViewerRef.value.redefinirEstiloLocal(novaPaleta)
  }
}

async function onAplicarConstrucao(dadosAtualizados) {
  if (dadosAtualizados) {
    // Atualiza as chaves do objeto reactive sem quebrar a reatividade
    Object.assign(opcoesConstrucao, dadosAtualizados)
  }

  showLegenda.value = opcoesConstrucao.exibirLegenda

  showForm.value = false

  try {
    isLoading.value = true
    // 2. Chamada ao Backend Node.js
    // Envia os parâmetros necessários para filtrar no banco/módulo

    const payload = {
      colegiado: selecaoUsuario.value?.colegiadoSlug,
      municipioId: selecaoUsuario.value?.idMunicipio,
      camada: selecaoUsuario.value?.camada,
      atividade: opcoesConstrucao.atividade,
      variavel: opcoesConstrucao.variavel,
      dt_inicial: opcoesConstrucao.dt_inicial,
      dt_final: opcoesConstrucao.dt_final,
      tipo: opcoesConstrucao.tipo,
    }

    const resposta = await mapaService.getData(payload)

    if (resposta.length == 0) {
      toast.warning(
        'Nenhum registro atende aos parâmetros informados. Alteere os parãmetrso para uma nova consulta!',
      )
      return
    }

    const tabelaDados = resposta

    if (opcoesConstrucao.tipo == 'ponto') {
      if (mapaViewerRef.value) {
        mapaViewerRef.value.executarCarregamentoPontos(tabelaDados, opcoesConstrucao)
      }
    } else {
      if (selecaoUsuario.value.camada == 'quarteirao') {
        if (mapaViewerRef.value) {
          mapaViewerRef.value.atualizarCamadaComDados({
            dados: tabelaDados,
            chaveMapa: 'ID_AQ', // Nome da propriedade presente na Feature do OpenLayers
            chaveDados: 'id_aq', // Nome da chave no array vindo do backend
            estiloConfig: opcoesConstrucao,
          })
        }
      } else if (selecaoUsuario.value.camada == 'censitario') {
        if (mapaViewerRef.value) {
          mapaViewerRef.value.atualizarCamadaComDados({
            dados: tabelaDados,
            chaveMapa: 'CD_GEOCODI', // Nome da propriedade presente na Feature do OpenLayers
            chaveDados: 'censitario', // Nome da chave no array vindo do backend
            estiloConfig: opcoesConstrucao,
          })
        }
      } else {
        if (mapaViewerRef.value) {
          mapaViewerRef.value.atualizarCamadaComDados({
            dados: tabelaDados,
            chaveMapa: 'CODMUNIC', // Nome da propriedade presente na Feature do OpenLayers
            chaveDados: 'codmunic', // Nome da chave no array vindo do backend
            estiloConfig: opcoesConstrucao,
          })
        }
      }
    }

    // 2. Passa os dados tabulares para o MapaViewer fazer o JOIN com o GeoJSON local
  } catch (erro) {
    console.error('Erro ao buscar dados do mapa temático:', erro)
    // Aqui você pode disparar um aviso/toast do Bulma para o usuário
  } finally {
    isLoading.value = false
  }
}

function cancelForm() {
  showForm.value = false
}

function cancelPaleta() {
  showPaleta.value = false
}

async function onSelecionarCamada(payload) {
  //console.log('Camada selecionada pelo usuário:', payload)
  selecaoUsuario.value = payload

  hasSel.value = true
}

async function aoCarregarMapa(map) {
  instanceMapa.value = map
}

watch(hasSel, async () => {
  // Espera o Vue atualizar o layout/HTML na tela
  await nextTick()

  if (instanceMapa.value) {
    // Força o OpenLayers a recalcular o tamanho exato da div pai
    instanceMapa.value.updateSize()
  }
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result = await mapaService.getFontes()
    if (result.error) {
      toast.error(result.msg)
    } else {
      options.value = result
    }
  } finally {
    isLoading.value = false
  }
})

// --- MÉTODOS DA BARRA DE FERRAMENTAS ---

// 1. Ação do Botão "Voltar / Reiniciar"
const onReiniciarMapa = async () => {
  // Limpa a seleção e volta a exibir a sidebar
  hasSel.value = false
  selecaoUsuario.value = null

  // Chama o método interno do MapaViewer para limpar o GeoJSON renderizado
  if (mapaViewerRef.value && mapaViewerRef.value.limparCamadas) {
    mapaViewerRef.value.limparCamadas()
    temDadosLegenda.value = false
  }

  await nextTick()

  // Recalcula o tamanho do mapa ao reexibir a sidebar (30%/70%)
  if (mapaViewerRef.value) {
    mapaViewerRef.value.updateSize()
  }
}

// 2. Ação do Botão "Centralizar"
const onCentralizarMapa = () => {
  if (mapaViewerRef.value && mapaViewerRef.value.centralizarVisao) {
    mapaViewerRef.value.centralizarVisao()
  }
}

const temDadosLegenda = computed(() => {
  return (
    showLegenda.value &&
    legendasAtivas.value.some((legenda) => legenda.itens && legenda.itens.length > 0)
  )
})

const onConstruir = () => {
  showForm.value = true
}
const onPaleta = () => {
  showPaleta.value = true
}
const onLegenda = () => {
  showLegenda.value = !showLegenda.value
}
const onLabel = () => {
  isLabeling.value = !isLabeling.value
}
const onGrade = () => {
  if (showGrade.value) {
    showGradeOptions.value = showGrade.value
  } else {
    mapaViewerRef.value.alternarGrade(false)
  }
  showGrade.value = !showGrade.value
}
const onRandomPt = () => {
  mapaViewerRef.value.alternarRandomPt(showPontos.value)
  showPontos.value = !showPontos.value
}
const onTile = () => {
  showTile.value = !showTile.value
  mapaViewerRef.value.alternarTileLayer(showTile.value)
}

const onPrint = () => {
  mapaViewerRef.value.printMap({
    titulo: `${selecaoUsuario.value.municipioNome}: ${opcoesConstrucao.fantasia}`,
    nomeArquivo: 'Sisaweb 3 - mapa.pdf',
  })
}
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  width: 100%;
  /* Define uma altura fixa ou baseada na tela do navegador */
  height: calc(100vh - 300px); /* Ajuste os 120px de acordo com seu Header/Navbar */
  min-height: 500px; /* Garantia para telas menores */
  padding: 0; /* Remove o padding padrão do card do Bulma para o mapa encostar nas bordas */
  overflow: hidden;
}

.sidebar {
  width: 320px;
  height: 100%;
  overflow-y: auto;
}

.map-section {
  flex: 1; /* Ocupa 100% do espaço restante automaticamente quando a sidebar esconde */
  height: 100%;
  position: relative;
  min-width: 0;
}

.legenda-flutuante {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 250px;
}

.item-legenda {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.square-cor {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-right: 8px;
  flex-shrink: 0;
}

.item-legenda-ponto {
  display: flex;
  align-items: center;
  min-height: 28px; /* Mantém o alinhamento mesmo com tamanhos variados */
  margin-bottom: 4px;
}

.circulo-legenda {
  border-radius: 50%;
  border: 1px solid #08306b;
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
}
</style>
