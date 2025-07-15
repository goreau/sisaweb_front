<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Imóvel Cadastrado</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio :id_prop="id_prop" :tipo="99" :sel="id_municipio" @selTerr="id_municipio = $event"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }" />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Número</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Número do Cadastro" v-model="numero_imovel"
                      :class="{ 'is-danger': v$.numero_imovel.$error }" />
                    <span class="is-error" v-if="v$.numero_imovel.$error">
                      {{ v$.numero_imovel.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <div class="field">
                  <label class="label">Nome Fantasia</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Nome do Estabelecimento" v-model="fantasia"
                      :class="{ 'is-danger': v$.fantasia.$error }" />
                    <span class="is-error" v-if="v$.fantasia.$error">
                      {{ v$.fantasia.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo</legend>
                    <div class="field">
                      <RadioGeneric v-model="id_atividade.value" :options="atividades" name="id_atividade"
                        :inline="true" />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Responsabilidade</legend>
                    <div class="field">
                      <RadioGeneric v-model="id_responsavel.value" :options="responsaveis" name="id_responsavel"
                        :inline="true" />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="field">
                  <label class="label">Proprietário</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Responsável pelo imóvel" v-model="proprietario"
                      :class="{ 'is-danger': v$.proprietario.$error }" />
                    <span class="is-error" v-if="v$.proprietario.$error">
                      {{ v$.proprietario.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <div class="field">
                  <label class="label">Observação</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="observacao"
                      :class="{ 'is-danger': v$.observacao.$error }" />
                    <span class="is-error" v-if="v$.observacao.$error">
                      {{ v$.observacao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Área</label>
                  <div class="control">
                    <CmbGeneric :sel="id_area" :data="areas" @selGen="id_area = $event"
                      :errclass="{ 'is-danger': v$.id_area.$error }" />
                    <span class="is-error" v-if="v$.id_area.$error">
                      {{ v$.id_area.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <label class="label">Censitário</label>
                  <div class="control">
                    <CmbGeneric :sel="id_censitario" :data="censitarios" @selGen="id_censitario = $event"
                      :errclass="{ 'is-danger': v$.id_censitario.$error }" />
                    <span class="is-error" v-if="v$.id_censitario.$error">
                      {{ v$.id_censitario.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-4">
                <div class="content">
                  <label class="label">Quarteirão</label>
                  <div class="control">
                    <CmbGeneric :sel="id_quarteirao" :data="quarteiraos" @selGen="id_quarteirao = $event"
                      :errclass="{ 'is-danger': v$.id_quarteirao.$error }" />
                    <span class="is-error" v-if="v$.id_quarteirao.$error">
                      {{ v$.id_quarteirao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="field">
                  <label class="label">Endereço</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Responsável pelo imóvel" v-model="proprietario"
                      :class="{ 'is-danger': v$.proprietario.$error }" />
                    <span class="is-error" v-if="v$.proprietario.$error">
                      {{ v$.proprietario.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <div class="field">
                  <label class="label">Observação</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="observacao"
                      :class="{ 'is-danger': v$.observacao.$error }" />
                    <span class="is-error" v-if="v$.observacao.$error">
                      {{ v$.observacao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>



            <div class="field">
              <label class="label">Codigo</label>
              <div class="control">
                <input class="input" type="text" placeholder="Código da Área" v-model="codigo"
                  :class="{ 'is-danger': v$.codigo.$error }" />
                <span class="is-error" v-if="v$.codigo.$error">
                  {{ v$.codigo.$errors[0].$message }}
                </span>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="create" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Message from "@/components/general/CustomMessage.vue";
import Loader from "@/components/general/MyLoader.vue";
import footerCard from '@/components/general/FooterCard.vue'
import imovelService from "@/services/cadastro/imovel.service";
import censitarioService from "@/services/cadastro/censitario.service";
import auxiliarService from "@/services/general/auxiliar.service";
import RadioGeneric from "@/components/forms/RadioGeneric.vue";
import areaService from "@/services/cadastro/area.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CmbGeneric from "@/components/forms/CmbGeneric.vue";
import {
  required$,
  minLengthIfFilled$,
  combo$,
  minLength$,
} from "@/components/forms/validators";
import { ref, onMounted, reactive, watch } from "vue";
import { useCurrentUser } from '@/composables/currentUser'
import quarteiraoService from "@/services/cadastro/quarteirao.service";


const { currentUser } = useCurrentUser()

const atividades = [
  { id: 1, nome: 'Ponto Estratégico' },
  { id: 2, nome: 'Imóvel Especial' },
  { id: 3, nome: 'Larvitrampa' },
  { id: 12, nome: 'Obra' },
];
//var tpUser = ref(0);
//var nvUser = ref(0);
var areas = ref([]);
var censitarios = ref([]);
var quarteiraos = ref([]);
var responsaveis = ref([]);

var id_prop = ref(0);

var codigo = ref("");
var id_municipio = ref(0);
var id_atividade = ref(0);
var fantasia = ref('');
var numero_imovel = ref(0);
var proprietario = ref('');
var observacao = ref('');
var id_responsavel = ref(0);
var id_area = ref(0);
var id_censitario = ref(0);
var id_quarteirao = ref(0);



var imovel = reactive({
  id_municipio,
  id_atividade,
  fantasia,
  numero_imovel,
  proprietario,
  observacao,
  id_responsavel,
  id_area,
  id_censitario,
  id_quarteirao,
  codigo,
});

var isLoading = ref(false);
var message = ref('');
var caption = ref('');
var type = ref('');
var showMessage = ref(false);
var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false
});

const rules = {
  codigo: { required$ },
  id_municipio: { required$, minValue: combo$(1) },
  fantasia: { minLengthIfFilled: minLengthIfFilled$(5) },
  numero_imovel: { required$, minLength: minLength$(1) },
  proprietario: { required$, minLength: minLength$(10) },
  observacao: { minLengthIfFilled: minLengthIfFilled$(3) },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_quarteirao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_responsavel: { required$, minValue: combo$(1) },
}

const v$ = useValidate(rules, imovel);


function create() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    imovelService.create(imovel).then(
      (response) => {
        showMessage.value = true;
        message.value = "Imóvel cadastrado com sucesso.";
        type.value = "success";
        caption.value = "Imóvel";
        setTimeout(() => (showMessage.value = false), 3000);
      },
      (error) => {
        message.value = error;
        showMessage.value = true;
        type.value = "alert";
        caption.value = "Imóvel";
        setTimeout(() => (showMessage.value = false), 3000);
      }
    )
      .finally(() => {
        document.getElementById("login").classList.remove("is-loading");
      });
  } else {
    message.value = "Corrija os erros para enviar as informações";
    showMessage.value = true;
    type.value = "alert";
    caption.value = "Imóvel";
    setTimeout(() => (showMessage.value = false), 3000);
  }
}

watch(
  () => id_municipio.value,
  (val) => {
    areaService.getCombo(JSON.stringify({ id_municipio: val }))
      .then((res) => {
        areas.value = res.data;
      })
      .catch((err) => {
        console.log(err.response);
        areas.value = [];
      })
  });

watch(
  () => id_area.value,
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

watch(
  () => id_censitario.value,
  (val) => {
    quarteiraoService.getCombo(JSON.stringify({ id_censitario: val }))
      .then((res) => {
        quarteiraos.value = res.data;
      })
      .catch((err) => {
        console.log(err.response);
        quarteiraos.value = [];
      })
  });

onMounted(() => {
  let cUser = currentUser;
  if (cUser.value) {
    id_prop.value = cUser.value.id;
  }

  auxiliarService.getGenericCombo(7)
    .then((res) => {
      responsaveis.value = res.data;
    })
    .catch((err) => {
      console.log(err.response);
      responsaveis.value = [];
    })
});
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
