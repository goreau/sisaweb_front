<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Usuários</p>
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
              <div class="columns" v-if="tpUser == 1">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">Regional</label>
                    <div class="control">
                      <CmbTerritorio :id_prop="id_prop" :tipo="2" :sel="id_regional" @selTerr="id_regional = $event" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns" v-if="tpUser < 3">
                <div class="column is-5 is-offset-3">
                  <div class="field">
                    <label class="label">GVE</label>
                    <div class="control">
                      <CmbTerritorio :id_prop="id_prop" :tipo="9" :sel="id_gve" @selTerr="id_gve = $event" />
                    </div>
                  </div>
                </div>
              </div>
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
              <span class="icon is-small is-left" ref="myspan3">
                <font-awesome-icon icon="fa-solid fa-user-secret" />
              </span>
              <span class="icon is-small is-left" ref="myspan4">
                <font-awesome-icon icon="fa-solid fa-power-off" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import authService from "@/services/auth.service";
import MyTable from '@/components/general/MyTable.vue';
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import { ref, onMounted, reactive } from "vue";
import { useRouter } from 'vue-router';
import { useCurrentUser } from '@/composables/currentUser';

const { currentUser } = useCurrentUser();

const router = useRouter();


var tpUser = ref(0);

var id_regional = ref(0);
var id_gve = ref(0);
var id_municipio = ref(0);
var hasRows = ref(false);
var dataTable = ref([]);
var id_user = 1;
const tableName = 'UsuariosSW';

const filter = reactive({
  id_regional,
  id_gve,
  id_municipio
})

var myspan = ref(null);
var myspan2 = ref(null);
var myspan3 = ref(null);
var myspan4 = ref(null);

const columns = ref([]);

function newFilter() {
  hasRows.value = false;
}

function loadData() {
  localStorage.setItem('userSW', JSON.stringify(filter));

  authService.list(JSON.stringify(filter))
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
    { title: 'Nome', field: 'nome', minWidth: 200, responsive: 3 },
    { title: 'Login', field: 'login', minWidth: 150 },
    { title: 'Local', field: 'local', minWidth: 150 },
    { title: 'Nivel', field: 'role', minWidth: 150 },
    { title: 'Responsável', field: 'owner', minWidth: 100 },
    {
      title: 'Ações', responsive: 0, minWidth: 350,
      formatter: (cell) => {
        const row = cell.getRow().getData();

        const btEdit = document.createElement('button');
        btEdit.type = 'button';
        btEdit.title = 'Editar';
        btEdit.disabled = id_user != row.id_prop;
        btEdit.style.cssText = 'height: fit-content; margin-left: 1rem;';
        btEdit.classList.add('button', 'is-primary', 'is-outlined');
        btEdit.innerHTML = myspan.value.innerHTML;
        btEdit.addEventListener('click', () => {
          router.push(`/editUser/${row.id}`);
        });

        /* const teste = document.createElement('div');
          teste.classList.add('icon', 'is-small');
          teste.innerHTML='<span><font-awesome-icon icon=\"fa-solid fa-envelope\" /></span>';*/

        const btDel = document.createElement('button');
        btDel.type = 'button';
        btDel.title = 'Excluir';
        btDel.disabled = id_user != row.id_prop;
        btDel.style.cssText = 'height: fit-content; margin-left: 1rem;';
        btDel.classList.add('button', 'is-danger', 'is-outlined');
        btDel.innerHTML = myspan2.value.innerHTML;
        btDel.addEventListener('click', async () => {
          const ok = await this.$refs.confirmDialog.show({
            title: 'Excluir',
            message: 'Deseja mesmo excluir esse usuário?',
            okButton: 'Confirmar',
          })
          if (ok) {
            authService.delete(row.id)
              .then(resp => {
                if (resp.status == '200') {
                  location.reload();
                } else {
                  this.message = resp;
                  this.showMessage = true;
                  this.type = "alert";
                  this.caption = "Usuário";
                  setTimeout(() => (this.showMessage = false), 3000);
                }
              })
              .catch(err => {
                this.message = err;
                this.showMessage = true;
                this.type = "alert";
                this.caption = "Usuário";
                setTimeout(() => (this.showMessage = false), 3000);
              })
          }
        });

        const btImpess = document.createElement('button');
        btImpess.type = 'button';
        btImpess.title = 'Logar como';
        btImpess.style.cssText = 'height: fit-content; margin-left: 1rem;';
        btImpess.classList.add('button', 'is-info', 'is-outlined');
        btImpess.innerHTML = myspan3.value.innerHTML;
        btImpess.addEventListener('click', async () => {
          const user = { username: row.username, password: 'AH@g654321' };
          const resp = await authService.impersonate(user);
          if (resp) {
            this.$store.commit('auth/loginSuccess', resp);
            location.href = router.resolve({ name: 'home' }).href;
            //this.$router.push({ name: 'home' });
          }
          /* .then(
             () => {
               document.getElementById('main').className = "main";
               this.$router.push({ name: 'home' });
             },

           );*/
        });

        const btReset = document.createElement('button');
        btReset.type = 'button';
        btReset.title = 'Reset';
        btReset.style.cssText = 'height: fit-content; margin-left: 1rem;';
        btReset.classList.add('button', 'is-warning');
        btReset.innerHTML = myspan4.value.innerHTML;
        btReset.addEventListener('click', async () => {
          const ok = await this.$refs.confirmDialog.show({
            title: 'Reset',
            message: 'Deseja reiniciar o usuário para o padrão inicial?',
            okButton: 'Confirmar',
          })
          if (ok) {
            authService.restart(row)
              .then(resp => {
                if (resp.status == '200') {
                  this.message = resp.data;
                  this.showMessage = true;
                  this.type = "success";
                  this.caption = "Usuário";
                  setTimeout(() => (this.showMessage = false), 3000);
                } else {
                  this.message = resp;
                  this.showMessage = true;
                  this.type = "alert";
                  this.caption = "Usuário";
                  setTimeout(() => (this.showMessage = false), 3000);
                }
              })
              .catch(err => {
                this.message = err;
                this.showMessage = true;
                this.type = "alert";
                this.caption = "Usuário";
                setTimeout(() => (this.showMessage = false), 3000);
              })
          }
        });


        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(btEdit);
        buttonHolder.appendChild(btDel);

        if (id_user == 1) { //this.currentUser.nivel == 1) {
          buttonHolder.appendChild(btImpess);
          buttonHolder.appendChild(btReset);
        }

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
