<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Quarteirões</p>
            <button class="button is-info is-outlined" @click="newFilter" v-show="hasRows">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-repeat" />
              </span>
              <span>Refazer Consulta</span>
            </button>
            <button class="button is-primary is-outlined" @click="newUser">
              <span class="icon">
                <font-awesome-icon icon="fa-solid fa-plus-circle" />
              </span>
              <span>Novo</span>
            </button>
          </header>
          <div class="card-content">
            <section v-show="!hasRows">
              <div class="columns" v-if="tpUser < 4">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio :id_prop="id_prop" :tipo="99" :sel="id_municipio"
                        @selTerr="id_municipio = $event" />
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
            <section v-show="hasRows">
              <MyTable :tableData="dataTable" :columns="columns" :filtered="true" :tableName="tableName" />
            </section>
            <div style="display: none;">
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
  </div>
</template>

<script setup>
import quarteiraoService from "@/services/cadastro/quarteirao.service";
import MyTable from '@/components/general/MyTable.vue';
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import ConfirmDialog from "@/components/general/ConfirmDialog.vue";
import { ref, onMounted, reactive } from "vue";
import { useRouter } from 'vue-router';
import { useCurrentUser } from '@/composables/currentUser';

const { currentUser } = useCurrentUser();

const router = useRouter();


var tpUser = ref(0);

var confirmDialog = ref(null);

var id_municipio = ref(0);
var hasRows = ref(false);
var dataTable = ref([]);
var id_user = 1;
const tableName = 'CensitariosSW';

const filter = reactive({
  id_municipio
})

var myspan = ref(null);
var myspan2 = ref(null);


const columns = ref([]);

function newFilter() {
  hasRows.value = false;
}

function loadData() {
  localStorage.setItem('censSW', JSON.stringify(filter));

  quarteiraoService.getQuarteiraos(JSON.stringify(filter))
    .then((response) => {
      dataTable.value = response.data;
      hasRows.value = true;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => { });
}

onMounted(() => {
  columns.value = [
    { title: 'Município', field: 'municipio', minWidth: 200, responsive: 3 },
    { title: 'Área', field: 'area', minWidth: 100 },
    { title: 'Censitário', field: 'censitario', minWidth: 150 },
    { title: 'Número', field: 'numero', minWidth: 100 },
    { title: 'Sub-Número', field: 'sub_numero', minWidth: 100 },
    { title: 'Responsável', field: 'owner', minWidth: 100 },
    {
      title: 'Ações', responsive: 0, minWidth: 150,
      formatter: (cell) => {
        const row = cell.getRow().getData();

        const btEdit = document.createElement('button');
        btEdit.type = 'button';
        btEdit.title = 'Editar';
        btEdit.disabled = id_user != row.id_usuario;
        btEdit.style.cssText = 'height: fit-content; margin-left: 1rem;';
        btEdit.classList.add('button', 'is-primary', 'is-outlined');
        btEdit.innerHTML = myspan.value.innerHTML;
        btEdit.addEventListener('click', () => {
          router.push(`/editQuarteirao/${row.id}`);
        });

        /* const teste = document.createElement('div');
          teste.classList.add('icon', 'is-small');
          teste.innerHTML='<span><font-awesome-icon icon=\"fa-solid fa-envelope\" /></span>';*/

        const btDel = document.createElement('button');
        btDel.type = 'button';
        btDel.title = 'Excluir';
        btDel.disabled = id_user != row.id_usuario;
        btDel.style.cssText = 'height: fit-content; margin-left: 1rem;';
        btDel.classList.add('button', 'is-danger', 'is-outlined');
        btDel.innerHTML = myspan2.value.innerHTML;
        btDel.addEventListener('click', async () => {
          const ok = await confirmDialog.value.show({
            title: 'Excluir',
            message: 'Deseja mesmo excluir esse Quarteirão?',
            okButton: 'Confirmar',
          })
          if (ok) {
            censitarioService.delete(row.id)
              .then(resp => {
                if (resp.status == '200') {
                  location.reload();
                } else {
                  this.message = resp;
                  this.showMessage = true;
                  this.type = "alert";
                  this.caption = "Quarteirão";
                  setTimeout(() => (this.showMessage = false), 3000);
                }
              })
              .catch(err => {
                this.message = err;
                this.showMessage = true;
                this.type = "alert";
                this.caption = "Quarteirão";
                setTimeout(() => (this.showMessage = false), 3000);
              })
          }
        });




        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(btEdit);
        buttonHolder.appendChild(btDel);


        return buttonHolder;

      }
    }
  ]

  let cUser = currentUser;
  if (cUser.value) {
    tpUser.value = cUser.value.tipo;
    if (tpUser.value == 4) {
      loadData();
    }
  }
});
</script>

<style></style>
