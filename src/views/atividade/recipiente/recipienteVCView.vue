<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Recipientes VC</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Grupo</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-rec'"
                      v-model:sel="recipiente.id_grupo_rec"
                      :data="grupos"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-8">
                <div class="content">
                  <label class="label">Tipo</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-rec'"
                      v-model:sel="recipiente.id_tipo_rec"
                      :data="tipos"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4">
                <div class="field">
                  <label class="label">Existentes</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="number"
                      placeholder="Opcional"
                      v-model.number="recipiente.existente"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Com Água</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="number"
                      placeholder="Opcional"
                      v-model.number="recipiente.agua"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Com Larvas</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="number"
                      placeholder="Opcional"
                      v-model.number="recipiente.larva"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <div class="field">
                  <label class="label">Amostra</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.amostra"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label">Examinadas</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="number"
                      placeholder="Opcional"
                      v-model.number="recipiente.examinadas"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label"><i>Ae aegypti</i></label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="number"
                      placeholder="Opcional"
                      v-model.number="recipiente.aegypti"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label"><i>Ae albopictus</i></label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-rec'"
                      class="input"
                      type="number"
                      placeholder="Opcional"
                      v-model.number="recipiente.albopictus"
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="columns">
              <div
                class="column is-6 is-offset-3"
                data-focus-type="custom-submit-group"
                v-enter-to-next="'submit-action'"
              >
                <button class="button is-link aux-btn is-fullwidth submit-btn" @click="insert">
                  {{ fantBt }}
                </button>
              </div>
            </div>
            <hr />
            <span v-if="Array.isArray(colRecipientes) && colRecipientes.length > 0">
              <p class="divisor">Recipientes</p>
              <MyDataTable
                :loggedUser="{ id: 0, tipo: 0 }"
                :data="colRecipientes || []"
                :columns="columns"
                :buttons="['edit', 'delete']"
                :pagination="false"
                :hasExports="false"
                :calcHeight="true"
                @edit="onEditRow"
                @delete="onDeleteRow"
              />
            </span>
          </div>
          <footer class="card-footer">
            <footerCard
              v-enter-to-next="'submit-action'"
              @submit="voltar"
              @cancel="abandonar"
              @aux="null"
              :cFooter="cFooter"
            />
          </footer>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import MyDataTable from '@/components/general/MyDataTable.vue'
import auxiliarService from '@/services/general/auxiliar.service'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import { ref, onMounted, watch, reactive } from 'vue'
import { useVcVisitaStore } from '@/stores/vcVisitaStore'
import { useRouter, useRoute } from 'vue-router'
import { generateId } from '@/utils/myUtils'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'

const store = useVcVisitaStore()
const router = useRouter()
const route = useRoute()

const fantBt = ref('Inserir')

var confirmDialog = ref(null)
var grupos = ref([])
var tipos = ref([])

const idEmEdicao = ref(null)
var colRecipientes = ref([])
const columns = ref([])

const idImovel = ref(0)

var recipiente = reactive({
  id: 0,
  id_grupo_rec: 0,
  fantGrupo: '',
  id_tipo_rec: 0,
  fantTipo: '',
  existente: 0,
  agua: 0,
  larva: 0,
  amostra: '',
  examinadas: 0,
  aegypti: 0,
  albopictus: 0,
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar Alterações',
  strCancel: 'Voltar',
  strAux: '',
  aux: false,
})

function insert() {
  if (idEmEdicao.value !== null) {
    // --- MODO EDIÇÃO ---
    // Acha o índice apenas na hora de salvar, usando o ID seguro
    const index = colRecipientes.value.findIndex((r) => r.id === idEmEdicao.value)

    if (index !== -1) {
      colRecipientes.value[index] = { ...recipiente }
    }

    // Reseta o controle de edição
    idEmEdicao.value = null
  } else {
    // --- MODO INSERÇÃO ---
    recipiente.id = generateId() // Garante um ID único
    colRecipientes.value.push({ ...recipiente })
  }

  limpar()

  store.updateRecipientes(idImovel.value, colRecipientes.value)
}

async function abandonar() {
  if (store.isDirtyRec) {
    const ok = await confirmDialog.value.show({
      title: 'Sair',
      message: 'Você tem alterações não salvas. Deseja salvá-las antes de voltar?',
      okButton: 'Confirmar',
    })
    if (ok) {
      insert()
    } else {
      limpar()
    }
  }
  router.push({ name: 'vigImoveis' })
}

async function voltar() {
  if (idEmEdicao.value !== null) {
    const ok = await confirmDialog.value.show({
      title: 'Sair',
      message: 'Você tem alterações não salvas. Deseja salvá-las antes de voltar?',
      okButton: 'Confirmar',
    })
    if (ok) {
      insert()
    } else {
      limpar()
    }
  }
  router.push({ name: 'vigImoveis' })
}

function limpar() {
  let vazio = {
    id_grupo_rec: 0,
    id_tipo_rec: 0,
    existente: 0,
    agua: 0,
    larva: 0,
    amostra: '',
    examinadas: 0,
    aegypti: 0,
    albopictus: 0,
  }
  Object.assign(recipiente, vazio)
  fantBt.value = 'Inserir'
}

watch(
  () => recipiente.id_grupo_rec,
  async (id) => {
    const item = grupos.value.find((a) => a.id === Number(id))
    recipiente.fantGrupo = item?.nome || ''
    const result = await auxiliarService.getTipoRecCombo(id)
    if (result.error) {
      console.log(result.error)
      tipos.value = []
    } else {
      tipos.value = result
    }
  },
)

watch(
  () => recipiente.id_tipo_rec,
  (id) => {
    if (tipos.value.length == 0) return
    const item = tipos.value.find((a) => a.id === Number(id))
    recipiente.fantTipo = item?.nome || ''
  },
)

function onEditRow(item) {
  const idBuscado = item.row.id || item.row.id_recipiente

  const itemEncontrado = colRecipientes.value.find((r) => r.id === idBuscado)

  if (itemEncontrado) {
    fantBt.value = 'Salvar'

    idEmEdicao.value = idBuscado

    Object.assign(recipiente, JSON.parse(JSON.stringify(itemEncontrado)))
  }
}

function onDeleteRow(item) {
  const idBuscado = item.row.id || item.row.id_recipiente

  const index = colRecipientes.value.findIndex((r) => r.id === idBuscado)

  if (index !== -1) {
    colRecipientes.value.splice(index, 1)
  }

  store.updateRecipientes(idImovel.value, colRecipientes.value)
}

onMounted(async () => {
  columns.value = [
    { headerName: 'Tipo', field: 'fantTipo' },
    { headerName: 'Existentes', field: 'existente' },
    { headerName: 'Com Larva', field: 'larva' },
    { headerName: 'Amostra', field: 'amostra' },
  ]

  idImovel.value = route.params.idImovel
  let oldData = store.objetoFolha.imoveis.find(
    (i) => i.id.toString() === idImovel.value,
  )?.recipientes

  colRecipientes.value = oldData ? [...oldData] : []

  const result = await auxiliarService.getGrupoRecCombo()
  if (result.error) {
    console.log(result.error)
    grupos.value = []
  } else {
    grupos.value = result
  }
})
</script>

<style scoped></style>
