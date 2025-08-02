<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Recipientes</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Grupo</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="recipiente.id_grupo_rec"
                      :data="grupos"
                      @selGen="recipiente.id_grupo_rec = $event"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-8">
                <div class="content">
                  <label class="label">Tipo</label>
                  <div class="control">
                    <CmbGeneric
                      :sel="recipiente.id_tipo_rec"
                      :data="tipos"
                      @selGen="recipiente.id_tipo_rec = $event"
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
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.existente"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Com Água</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.agua"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="field">
                  <label class="label">Com Larvas</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.larva"
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
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.examinadas"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label"><i>Ae aegypti</i></label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.aegypti"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="field">
                  <label class="label"><i>Ae albopictus</i></label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Opcional"
                      v-model="recipiente.albopictus"
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <button class="button is-link aux-btn is-fullwidth" @click="insert">Inserir</button>
              </div>
            </div>
            <hr />
            <span v-show="colRecipientes.length > 0">
              <p class="divisor">Recipientes</p>
              <MyDataTable
                :data="colRecipientes"
                :columns="columns"
                :search="false"
                :pagination="false"
                @edit="onEditRow"
                @delete="onDeleteRow"
              />
            </span>
          </div>
          <footer class="card-footer">
            <footerCard
              @submit="voltar"
              @cancel="back"
              @aux="null"
              :customBack="true"
              :cFooter="cFooter"
            />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import MyDataTable from '@/components/general/gptTable.vue'
import auxiliarService from '@/services/general/auxiliar.service'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import { ref, onMounted, watch, reactive } from 'vue'
import { useMobileStore } from '@/stores/mobileStore'
import { useRouter, useRoute } from 'vue-router'

const store = useMobileStore()
const router = useRouter()
const route = useRoute()

const isImovel = ref(false)

//var tpUser = ref(0);
//var nvUser = ref(0);
var grupos = ref([])
var tipos = ref([])

var colRecipientes = ref([])
const columns = ref([])

var recipiente = reactive({
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
  strSubmit: 'Inserir',
  strCancel: 'Voltar',
  strAux: '',
  aux: false,
})

function insert() {
  colRecipientes.value.push({ ...recipiente })
  limpar()
}

function voltar() {
  store.updateRecipientes(colRecipientes)
  back()
}

function back() {
  if (isImovel.value) {
    router.push({ name: 'mobVcImovel', query: { returnFrom: 'recipiente' } }) // params: { id: 0 }
  } else {
    router.push({ name: 'mobVcVisita', query: { returnFrom: 'recipiente' } }) // params: { id: 0 }
  }
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
  }
)

watch(
  () => recipiente.id_tipo_rec,
  (id) => {
    const item = tipos.value.find((a) => a.id === Number(id))
    recipiente.fantTipo = item?.nome || ''
  }
)

function onEditRow(item) {
  let row = colRecipientes.value.splice(item.index, 1)
  Object.assign(recipiente, row[0])
}

function onDeleteRow(item) {
  colRecipientes.value.splice(item.index, 1)
}

onMounted(async () => {
  isImovel.value = route.query.from === 'mob_vc_imovel'

  const obj = store.visita
  let oldData = obj?.recipientes ?? []

  colRecipientes.value = oldData

  const result = await auxiliarService.getGrupoRecCombo()
  if (result.error) {
    console.log(result.error)
    grupos.value = []
  } else {
    grupos.value = result
  }

  columns.value = [
    { label: 'Tipo', field: 'fantTipo' },
    { label: 'Existentes', field: 'existente' },
    { label: 'Com Larva', field: 'larva' },
    { label: 'Amostra', field: 'amostra' },
    { label: 'Ações', field: 'acoes' },
  ]
})
</script>

<style scoped>
</style>
