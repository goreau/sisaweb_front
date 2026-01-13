<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-four-fifths">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Fórum</p>
          </header>
          <div class="card-content">
            <div class="content">
              <section class="section">
                <div class="container">
                  <div class="forum-controls mb-4">
                    <div class="columns is-multiline is-vcentered">
                      <!-- Input de filtro -->
                      <div class="column is-full-mobile is-half-tablet">
                        <div class="field">
                          <label class="label">Filtrar posts</label>
                          <div class="control">
                            <input
                              class="input"
                              type="text"
                              placeholder="Digite título ou autor"
                              v-model="filter"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Select de agrupamento -->
                      <div class="column is-full-mobile is-one-quarter-tablet">
                        <div class="field">
                          <label class="label">Sistema</label>
                          <div class="control">
                            <CmbGeneric
                              :data="sistemas"
                              v-model:sel="sistemaSelecionado"
                            ></CmbGeneric>
                          </div>
                        </div>
                      </div>

                      <!-- Botões -->
                      <div
                        class="column is-full-mobile is-one-quarter-tablet has-text-right-tablet"
                      >
                        <div class="columns is-mobile is-gapless">
                          <div class="column">
                            <button class="button is-info is-fullwidth" @click="filterMine">
                              Minhas
                            </button>
                          </div>
                          <div class="column">
                            <button class="button is-primary is-fullwidth" @click="abrirTopico">
                              Novo
                            </button>
                          </div>
                          <div class="column" v-if="currentUser.nivel == 1">
                            <button class="button is-danger is-fullwidth" @click="gerenciar">
                              Gerenciamento
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Lista de posts -->
                  <ForumPostAccordion
                    v-for="post in visiblePosts"
                    :key="post.id"
                    :post="post"
                    :isOpen="openPostId === post.id"
                    @toggle="onToggle(post.id, $event)"
                    @reply="abrirReplica"
                  />

                  <!-- Botão para carregar mais (futuro infinite scroll) -->
                  <div v-if="hasMore" class="has-text-centered mt-4">
                    <button class="button is-link" @click="loadMore" :disabled="loading">
                      <span v-if="!loading">Carregar mais</span>
                      <span v-else>Carregando...</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  Modal Replica-->
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Responder</p>
          <button class="delete" aria-label="close" @click="fecharModal"></button>
        </header>
        <section class="modal-card-body">
          <label class="label">Mensagem</label>
          <textarea
            class="textarea"
            placeholder="Sua mensagem aqui"
            v-model="newReplica.texto"
          ></textarea>
          <label class="label">Imagem</label>
          <div class="file has-name is-boxed is-fullwidth">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="documento"
                accept="image/png, image/jpeg, image/jpg"
                @change="onFileReplicaChange"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
              </span>
              <span class="file-name">
                {{ newReplica.fileName || 'Nenhum arquivo selecionado' }}
              </span>
            </label>
          </div>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <button class="button is-success" @click="salvaReplica">Postar</button>
            <button class="button" @click="fecharModal">Cancelar</button>
          </div>
        </footer>
      </div>
    </div>

    <!--  Modal Topico-->
    <div class="modal" :class="{ 'is-active': showTopico }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Novo Tópico</p>
          <button class="delete" aria-label="close" @click="fecharNew"></button>
        </header>
        <section class="modal-card-body">
          <fieldset class="fieldset">
            <legend>Sistema</legend>
            <RadioGeneric
              v-model="newTopico.sistema"
              :options="sistemas"
              name="id_sistema"
              :inline="true"
            />
          </fieldset>
          <label class="label">Título</label>
          <input class="input" type="text" placeholder="Text input" v-model="newTopico.titulo" />
          <label class="label">Mensagem</label>
          <textarea
            class="textarea"
            placeholder="Sua mensagem aqui"
            v-model="newTopico.texto"
          ></textarea>
          <label class="label">Imagem</label>
          <div class="file has-name is-boxed is-fullwidth">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                name="documento"
                @change="onFileTopicoChange"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
              </span>
              <span class="file-name">
                {{ newTopico.fileName || 'Nenhum arquivo selecionado' }}
              </span>
            </label>
          </div>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <button class="button is-success" @click="salvaTopico">Postar</button>
            <button class="button" @click="fecharNew">Cancelar</button>
          </div>
        </footer>
      </div>
    </div>
    <!-- fim modal -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import ForumPostAccordion from '@/components/general/MyAccordionForum.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import forumService from '@/services/forum/forum.service.js'
import { useToast } from 'vue-toastification'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
const { currentUser } = useCurrentUser()

const sistemaSelecionado = ref(null)

watch(sistemaSelecionado, (novoValor, valorAntigo) => {
  filterSistema(novoValor)
})

// Lista completa (hoje você carrega tudo, amanhã pode mudar para paginado)
const posts = ref([])
const filter = ref('')
const openPostId = ref(null)
const loading = ref(false)
//const page = ref(1)
//const pageSize = 10
const hasMore = ref(true)
const batchSize = 10 // quantidade por vez
const currentIndex = ref(0)
const visiblePosts = ref([])
const filteredPosts = ref([])
const showModal = ref(false)
const showTopico = ref(false)

var newTopico = reactive({
  titulo: '',
  sistema: 1,
  texto: '',
  fileName: '',
  file: null,
})

var newReplica = reactive({
  id_topico: 0,
  texto: '',
  fileName: '',
  file: null,
})

function onFileReplicaChange(e) {
  const file = e.target.files[0]
  newReplica.fileName = file ? file.name : ''
  newReplica.file = file
}

function onFileTopicoChange(e) {
  const file = e.target.files[0]
  newTopico.fileName = file?.name || ''
  newTopico.file = file
}

async function salvaTopico() {
  const formData = new FormData()
  formData.append('titulo', newTopico.titulo)
  formData.append('texto', newTopico.texto)
  formData.append('sistema', newTopico.sistema)
  formData.append('file', newTopico.file)

  const result = await forumService.createTopico(formData)
  if (result.status) {
    toast.success(result.msg)
    loadData()
    fecharModal()
  } else {
    toast.error(result.error.msg)
  }
}

async function salvaReplica() {
  const formData = new FormData()
  formData.append('id_topico', newReplica.id_topico)
  formData.append('texto', newReplica.texto)
  formData.append('file', newReplica.file)

  const result = await forumService.createReplica(formData)
  if (result.status) {
    toast.success(result.msg)
    loadData()
    fecharModal()
  } else {
    toast.error(result.error.msg)
  }
}

const sistemas = [
  { id: 1, nome: 'Sisaweb' },
  { id: 2, nome: 'Chagas' },
  { id: 3, nome: 'Esquisto' },
  { id: 4, nome: 'Inseticida' },
  { id: 5, nome: 'Escorpio' },
  { id: 6, nome: 'Fórum' },
  { id: 7, nome: 'Sisarthro' },
]

// Abrir/fechar post (apenas 1 aberto)
const onToggle = (id, isOpen) => {
  openPostId.value = isOpen ? id : null
}

function abrirTopico() {
  showTopico.value = true
}

function abrirReplica(id) {
  newReplica.id_topico = id
  showModal.value = true
}

function fecharModal() {
  showModal.value = false
  newReplica.id = 0
}

function fecharNew() {
  showTopico.value = false
}

function filterMine() {
  filteredPosts.value = posts.value.filter((p) =>
    p.autor.toLowerCase().includes(currentUser.value.login),
  )
  visiblePosts.value = []
  currentIndex.value = 0
  fetchMore()
}

function gerenciar() {
  router.push(`/gerenciaForum`)
}

function applyFilter(term) {
  // ex: filtro por autor
  filteredPosts.value = posts.value.filter(
    (p) => p.titulo.toLowerCase().includes(term) || p.autor.toLowerCase().includes(term),
  )
  visiblePosts.value = []
  currentIndex.value = 0
  fetchMore()
}

function filterSistema(selectedValue) {
  if (selectedValue === 0 || selectedValue === null) {
    filteredPosts.value = [...posts.value]
    if (filter.value != '') {
      applyFilter(filter)
    }
  } else {
    filteredPosts.value = posts.value.filter((p) => p.id_sistema === selectedValue)
    visiblePosts.value = []
    currentIndex.value = 0
  }
  fetchMore()
}

// Carrega primeira página
function fetchMore() {
  const next = filteredPosts.value.slice(currentIndex.value, currentIndex.value + batchSize)
  visiblePosts.value.push(...next)
  currentIndex.value += batchSize
}

watch(
  () => filter.value,
  (val) => {
    applyFilter(val)
  },
)

async function loadData() {
  try {
    loading.value = true

    const result = await forumService.getItens()
    if (result.error) {
      console.log(result.error)
    } else {
      posts.value = result.data
      filteredPosts.value = [...posts.value]
    }
  } finally {
    loading.value = false
  }
  fetchMore()
}

// Inicializa
onMounted(loadData)
</script>

<style scoped>
.file.is-boxed .file-cta {
  padding: 0.5;
}
</style>
