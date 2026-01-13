<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader :active="isLoading" />
        <Message
          v-if="showMessage"
          @do-close="closeMessage"
          :msg="message"
          :type="type"
          :caption="caption"
        />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Bairro</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-nav-det'"
                      v-model:sel="censitario.id_area"
                      :data="areas"
                    />
                  </div>
                </div>
              </div>
              <div class="column is-8">
                <div class="content">
                  <label class="label">Censitário</label>
                  <div class="control">
                    <CmbGeneric
                      v-enter-to-next="'form-nav-det'"
                      v-model:sel="censitario.id_censitario"
                      :data="censitarios"
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
            <p class="divisor">Censitários incluídos</p>
            <section v-if="filhos.length > 0">
              <MyDataTable
                :loggedUser="{ id: 0, tipo: 0 }"
                :data="filhos"
                :columns="columns"
                calc-height="true"
                :pagination="false"
                @delete="handleDelete"
                @quarteirao="handleView"
                :buttons="['delete', 'quarteirao']"
              />
            </section>
          </div>
          <div style="display: none">
            <span class="icon is-small is-left" ref="myspan">
              <font-awesome-icon icon="fa-solid fa-edit" />
            </span>
            <span class="icon is-small is-left" ref="myspan2">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </span>
          </div>
          <footer class="card-footer">
            <footerCard
              v-enter-to-next="'submit-action'"
              @submit="voltar"
              @cancel="null"
              @aux="null"
              :cFooter="cFooter"
            />
          </footer>
        </div>
        <Modal v-if="showModal" @confirm="handleConfirm" @cancel="handleCancel">
          <!-- Conteúdo específico do modal -->
          <p class="divisor">Quarteirões</p>
          <Check
            v-model="selecionados"
            :options="quarteiroes"
            :checked-ids="qChecked"
            :columns-count="4"
          />
        </Modal>
      </div>
    </div>
  </div>
</template>

<script setup>
import Message from '@/components/general/CustomMessage.vue'
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import MyDataTable from '@/components/general/MyDataTable.vue'
import areaService from '@/services/cadastro/area.service'
import Modal from '@/components/forms/GenericModal.vue'
import Check from '@/components/forms/GenericCheckBox.vue'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import { ref, onMounted, watch, reactive } from 'vue'
import { useBairroStore } from '@/stores/bairroStore'
import { useRouter } from 'vue-router'

const store = useBairroStore()
const router = useRouter()

const columns = ref([])

const showModal = ref(false)

//var tpUser = ref(0);
//var nvUser = ref(0);
var areas = ref([])
var censitarios = ref([])
var filhos = ref([])

var myspan = ref(null)
var myspan2 = ref(null)

var quarteiroes = ref([])
var selecionados = ref([])
var currentCens = ref(0)
var qChecked = ref([])

const censitario = reactive({
  id_area: 0,
  fantArea: '',
  id_censitario: 0,
  fantCensitario: '',
  quarteiroes: [],
})

var isLoading = ref(false)
var message = ref('')
var caption = ref('')
var type = ref('')
var showMessage = ref(false)
var cFooter = ref({
  strSubmit: 'Inserir',
  strCancel: 'Voltar',
  strAux: '',
  aux: false,
})

function handleConfirm() {
  const index = filhos.value.findIndex((f) => f.id_censitario === currentCens.value)

  if (index !== -1) {
    filhos.value[index].quarteiroes = selecionados.value.map((id) => ({
      id_quarteirao: id,
    }))
  }
  selecionados.value = []
  //console.log('Valor confirmado:', selecionados.value);
  showModal.value = false
}

function handleCancel() {
  showModal.value = false
}

function insert() {
  filhos.value = [...filhos.value, JSON.parse(JSON.stringify(censitario))]
}

function voltar() {
  store.setFilhos(filhos.value)
  router.push({ name: 'bairro', query: { returnFrom: 'filho' } })
}

watch(
  () => censitario.id_area,
  async (val) => {
    const item = areas.value.find((a) => a.id === Number(val))
    censitario.fantArea = item?.nome || ''
    const result = await censitarioService.getCombo(JSON.stringify({ id_area: val }))
    if (result.error) {
      console.log(result.error)
      censitarios.value = []
    } else {
      censitarios.value = result
    }
  },
)

watch(
  () => censitario.id_censitario,
  (id) => {
    const item = censitarios.value.find((a) => a.id === Number(id))
    censitario.fantCensitario = item?.nome || ''
  },
)

onMounted(async () => {
  columns.value = [
    { headerName: 'Area', field: 'fantArea' },
    { headerName: 'Censitario', field: 'fantCensitario' },
  ]

  const obj = store.objetoPrincipal
  let id_mun = obj?.id_municipio
  filhos.value = obj?.filhos ?? []

  const result = await areaService.getCombo(JSON.stringify({ id_municipio: id_mun }))
  if (result.error) {
    console.log(result.error)
    areas.value = []
  } else {
    areas.value = result
  }
})

function handleDelete(dados) {
  const row = dados.row
  // O filtro
  // outras.value = outras.value.filter((f) => f.id !== row.id)
  filhos.value = filhos.value.filter((f) => f.id_censitario !== row.id_censitario)
}

async function handleView(item) {
  currentCens.value = item.row.id_censitario
  const result = await quarteiraoService.getCombo(
    JSON.stringify({ id_censitario: item.row.id_censitario }),
  )
  if (result.error) {
    console.log(result.error)
    quarteiroes.value = []
  } else {
    quarteiroes.value = result
  }

  const index = filhos.value.findIndex((f) => f.id_censitario === currentCens.value)

  if (index !== -1) {
    qChecked.value = filhos.value[index].quarteiroes.map((q) => q.id_quarteirao) //filhos.value[index].quarteiroes;
  }

  showModal.value = true
}
</script>

<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
