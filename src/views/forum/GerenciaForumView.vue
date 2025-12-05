<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <MyLoader :active="isLoading" />
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Fórum - Gerenciamento</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
            <button class="button is-primary is-outlined" @click="newFilter">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!hasRows">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">Sistema</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-forum'"
                        :data="sistemas"
                        v-model:sel="filter.sistema"
                      ></CmbGeneric>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Autor</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-forum'"
                        class="input"
                        type="text"
                        placeholder="Autor do post"
                        v-model="filter.autor"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Titulo</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-forum'"
                        class="input"
                        type="text"
                        placeholder="Título do post"
                        v-model="filter.titulo"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="field column is-3 is-offset-4">
                  <label class="label">&nbsp;</label>
                  <div class="control">
                    <button class="button is-link is-fullwidth" @click="loadData">
                      <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                      Carregar
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section v-if="hasRows">
              <MyDataTable
                :data="dataTable"
                :columns="columns"
                :logged-user="idUser"
                :pagination="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
                :buttons="['edit', 'delete']"
                :has-exports="true"
              />
            </section>
            <div style="display: none">
              <span class="icon is-small is-left" ref="myspan">
                <font-awesome-icon icon="fa-solid fa-edit" />
              </span>
              <span class="icon is-small is-left" ref="myspan2">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Editar Tópico</p>
          <button class="delete" aria-label="close" @click="fecharModal"></button>
        </header>
        <section class="modal-card-body">
          <section v-if="inEdit.isTopico">
            <fieldset class="fieldset">
              <legend>Sistema</legend>
              <RadioGeneric
                v-model="inEdit.sistema"
                :options="sistemas"
                name="id_sistema"
                :inline="true"
              />
            </fieldset>

            <label class="label">Título</label>
            <input class="input" type="text" placeholder="Text input" v-model="inEdit.titulo" />
          </section>
          <label class="label">Mensagem</label>
          <textarea
            class="textarea"
            placeholder="Sua mensagem aqui"
            v-model="inEdit.texto"
          ></textarea>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <button class="button is-success" @click="salvaEdit">Salvar</button>
            <button class="button" @click="fecharModal">Cancelar</button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import forumService from '@/services/forum/forum.service.js'
import { useToast } from 'vue-toastification'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import MyLoader from '@/components/general/MyLoader.vue'
import { useCurrentUser } from '@/composables/currentUser'

const toast = useToast()
var confirmDialog = ref(null)

const { currentUser } = useCurrentUser()

const dataTable = ref([])
var isLoading = ref(false)
var hasRows = ref(false)
const idUser = ref(0)

const filter = reactive({
  sistema: 0,
  autor: '',
  titulo: '',
})

const showModal = ref(false)

const inEdit = reactive({
  id: 0,
  sistema: 0,
  titulo: '',
  texto: '',
  isTopico: false,
})

const columns = [
  { headerName: 'Sistema', field: 'sistema' },
  { headerName: 'Titulo', field: 'titulo' },
  { headerName: 'Texto', field: 'texto' },
  { headerName: 'Autor', field: 'autor' },
  { headerName: 'Data', field: 'data' },
]

const sistemas = [
  { id: 1, nome: 'Sisaweb' },
  { id: 2, nome: 'Chagas' },
  { id: 3, nome: 'Esquisto' },
  { id: 4, nome: 'Inseticida' },
  { id: 5, nome: 'Escorpio' },
  { id: 6, nome: 'Fórum' },
  { id: 7, nome: 'Sisarthro' },
]

function newFilter() {
  hasRows.value = false
}

async function onEditRow(item) {
  inEdit.id = item.row.id
  inEdit.isTopico = item.row.fonte === 'T'
  inEdit.titulo = item.row.titulo
  inEdit.texto = item.row.texto
  inEdit.sistema = item.row.id_sistema

  showModal.value = true
}

function fecharModal() {
  showModal.value = false
}

async function salvaEdit() {
  const resultado = inEdit.isTopico
    ? await forumService.updateTopico(inEdit)
    : await forumService.updateReplica(inEdit)

  if (resultado.error) {
    toast.error(resultado.msg)
  } else {
    toast.success(resultado.msg)
    showModal.value = false
    loadData()
  }
}

async function onDeleteRow(item) {
  const ok = await confirmDialog.value.show({
    title: 'Excluir',
    message: 'Deseja mesmo excluir essa postagem?',
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado =
      item.row.fonte === 'T'
        ? await forumService.delTopico(item.row.id)
        : await forumService.delReplica(item.row.id)

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success('Pesquisa excluída com sucesso!')
      loadData()
    }
  }
}

async function loadData() {
  try {
    isLoading.value = true

    const result = await forumService.getLista(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
    } else {
      dataTable.value = result.data
      hasRows.value = true
    }
  } finally {
    isLoading.value = false
  }
}

// Inicializa
onMounted(() => {
  let cUser = currentUser
  if (cUser.value) {
    idUser.value = cUser.value.id
  }
})
</script>

<style scoped></style>
