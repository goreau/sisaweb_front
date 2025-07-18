<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Área de Transmissão</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric :sel="censitario.id_area" :data="areas" @selGen="censitario.id_area = $event" />
                  </div>
                </div>
              </div>
              <div class="column is-8">
                <div class="content">
                  <label class="label">Censitário</label>
                  <div class="control">
                    <CmbGeneric :sel="censitario.id_censitario" :data="censitarios"
                      @selGen="censitario.id_censitario = $event" />
                  </div>
                </div>
              </div>
            </div>
            <br>
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <button class="button is-link aux-btn is-fullwidth" @click="insert">Inserir</button>
              </div>
            </div>
            <hr>
            <p class="divisor">Censitários incluídos</p>
            <MySimpleTable :tableData="filhos" :columns="columns" :onRowDelete="removerFilho" />
          </div>
          <div style="display: none;">
            <span class="icon is-small is-left" ref="myspan">
              <font-awesome-icon icon="fa-solid fa-edit" />
            </span>
            <span class="icon is-small is-left" ref="myspan2">
              <font-awesome-icon icon="fa-solid fa-trash" />
            </span>
          </div>
          <footer class="card-footer">
            <footerCard @submit="voltar" @cancel="null" @aux="null" :cFooter="cFooter" />
          </footer>
        </div>
        <Modal v-if="showModal" @confirm="handleConfirm" @cancel="handleCancel">
          <!-- Conteúdo específico do modal -->
          <p class="divisor">Quarteirões</p>
          <Check v-model="selecionados" :options="quarteiroes" :checked-ids="qChecked" :columns-count="4" />
        </Modal>
      </div>
    </div>
  </div>
</template>

<script setup>
import Message from "@/components/general/CustomMessage.vue";
import Loader from "@/components/general/MyLoader.vue";
import footerCard from '@/components/general/FooterCard.vue';
import MySimpleTable from '@/components/general/MySimpleTable.vue';
import areaService from "@/services/cadastro/area.service";
import Modal from "@/components/forms/GenericModal.vue";
import Check from "@/components/forms/GenericCheckBox.vue";
import censitarioService from "@/services/cadastro/censitario.service";
import quarteiraoService from "@/services/cadastro/quarteirao.service";
import CmbGeneric from "@/components/forms/CmbGeneric.vue";
import { ref, onMounted, watch, reactive } from "vue";
import { useAreaNavStore } from '@/stores/areaNavStore';
import { useRouter } from 'vue-router';

const store = useAreaNavStore();
const router = useRouter();

const columns = ref([]);

const showModal = ref(false);

//var tpUser = ref(0);
//var nvUser = ref(0);
var areas = ref([]);
var censitarios = ref([]);
var filhos = ref([]);

var myspan = ref(null);
var myspan2 = ref(null);

var quarteiroes = ref([]);
var selecionados = ref([]);
var currentCens = ref(0);
var qChecked = ref([]);

/*var id_area = ref(0);
var fantArea = ref('');
var id_censitario = ref(0);
var quarteiroes = ref([]);
var fantCensitario = ref('');*/

const censitario = reactive({
  id_area: 0,
  fantArea: '',
  id_censitario: 0,
  fantCensitario: '',
  quarteiroes: []
});


var isLoading = ref(false);
var message = ref('');
var caption = ref('');
var type = ref('');
var showMessage = ref(false);
var cFooter = ref({
  strSubmit: 'Inserir',
  strCancel: 'Voltar',
  strAux: '',
  aux: false
});

function handleConfirm() {
  const index = filhos.value.findIndex(f => f.id_censitario === currentCens.value);

  if (index !== -1) {
    filhos.value[index].quarteiroes = selecionados.value.map(id => ({
      id_quarteirao: id
    }));
  }
  selecionados.value = [];
  //console.log('Valor confirmado:', selecionados.value);
  showModal.value = false;
}

function handleCancel() {
  showModal.value = false;
}

function insert() {
  filhos.value = [...filhos.value, JSON.parse(JSON.stringify(censitario))];
}

function voltar() {
  store.setFilhos(filhos.value);
  router.push({ name: 'areanav', query: { returnFrom: 'filho' } });
}

watch(
  () => censitario.id_area,
  (val) => {
    censitarioService.getCombo(JSON.stringify({ id_area: val }))
      .then((res) => {
        censitarios.value = res.data;
      })
      .catch((err) => {
        console.log(err.response);
        censitarios.value = [];
      })
  });

watch(() => censitario.id_area, (id) => {
  const item = areas.value.find(a => a.id === Number(id));
  censitario.fantArea = item?.nome || '';
});

watch(() => censitario.id_censitario, (id) => {
  const item = censitarios.value.find(a => a.id === Number(id));
  censitario.fantCensitario = item?.nome || '';
});

onMounted(() => {
  const obj = store.objetoPrincipal;
  let id_mun = obj?.id_municipio;
  filhos.value = obj?.filhos ?? [];

  areaService.getCombo(JSON.stringify({ id_municipio: id_mun }))
    .then((res) => {
      areas.value = res.data;
    })
    .catch((err) => {
      console.log(err.response);
      areas.value = [];
    })
  columns.value = [
    { title: 'Area', field: 'fantArea', minWidth: 100, responsive: 3 },
    { title: 'Censitario', field: 'fantCensitario', minWidth: 150 },
    {
      title: 'Ações', responsive: 0, minWidth: 150,
      formatter: () => `
        <button class="btn-view button is-small is-info" title="Quarteirões">
          <span class="icon is-small">
            <i class="fas fa-edit"></i>
          </span>
        </button>
        <button class="btn-delete button is-small is-danger" title="Excluir">
          <span class="icon is-small">
            <i class="fas fa-trash"></i>
          </span>
        </button>
      `,
      cellClick: (e, cell) => {
        const rowData = cell.getRow().getData();
        const deleteBtn = e.target.closest('.btn-delete');
        const viewBtn = e.target.closest('.btn-view');

        if (deleteBtn) {
          handleDelete(rowData.id_censitario);
        } else if (viewBtn) {
          handleView(rowData);
        }
      }

    }
  ]
});

function handleDelete(cens) {
  // console.log(filhos.value.map(f => ({ id: f.id_censitario, tipo: typeof f.id_censitario })));
  //console.log('Valor que está tentando remover:', cens, typeof cens);
  filhos.value = filhos.value.filter(f => f.id_censitario !== cens);
}

function handleView(row) {
  currentCens.value = row.id_censitario;
  quarteiraoService.getCombo(JSON.stringify({ id_censitario: row.id_censitario }))
    .then((res) => {
      quarteiroes.value = res.data;
    })
    .catch((err) => {
      console.log(err.response);
      quarteiroes.value = [];
    })

  const index = filhos.value.findIndex(f => f.id_censitario === currentCens.value);

  if (index !== -1) {
    qChecked.value = filhos.value[index].quarteiroes.map(q => q.id_quarteirao);//filhos.value[index].quarteiroes;
  }

  showModal.value = true;
}
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
