<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mapas</p>
            <button class="button is-info is-outlined" @click="goBack">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-rotate-back" />
              </span>
              <span>Voltar</span>
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
              />
              <MapaViewer
                ref="mapaViewerRef"
                :selecao-atual="selecaoUsuario"
                v-model:loading="isLoading"
                v-model:labeling="isLabeling"
                @mapa-pronto="aoCarregarMapa"
                @legendaAtualizada="aoAtualizarLegenda"
                @estiloAtualizado="aoAtualizarEstiloDoMapa"
              />
              <div v-if="temDadosLegenda" class="legenda-flutuante box">
                <h6 class="title is-6 mb-2">{{ dadosLegenda.titulo || 'Legenda' }}</h6>
                <span v-if="opcoesConstrucao.tipo == 'poligono'">
                  <div
                    v-for="(item, index) in dadosLegenda.itens"
                    :key="index"
                    class="item-legenda"
                  >
                    <span class="square-cor" :style="{ backgroundColor: item.cor }"></span>
                    <span class="label-faixa">{{ item.rotulo }}</span>
                  </div>
                </span>
                <!-- Dentro da legenda do seu template -->
                <span v-if="opcoesConstrucao.tipo == 'ponto'">
                  <div
                    v-for="(item, index) in dadosLegenda.itens"
                    :key="index"
                    class="item-legenda-ponto"
                  >
                    <!-- Desenha um círculo com o dobro do raio (diâmetro) -->
                    <span
                      class="circulo-legenda"
                      :style="{
                        width: item.raio * 2 + 'px',
                        height: item.raio * 2 + 'px',
                        backgroundColor: item.cor,
                      }"
                    ></span>
                    <span class="label-faixa">{{ item.rotulo }}</span>
                  </div>
                </span>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
const dadosLegenda = ref(null)

const options = ref([])
const selecaoUsuario = ref(null)

var hasSel = ref(false)
var showLegenda = ref(true)

var showGrade = ref(true)

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

function aoAtualizarLegenda(legenda) {
  dadosLegenda.value = legenda
}

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
  return showLegenda.value && dadosLegenda.value?.itens?.length > 0
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
  mapaViewerRef.value.alternarGrade(showGrade.value)
  showGrade.value = !showGrade.value
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
