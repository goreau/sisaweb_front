<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Quarteirão</p>
          </header>
          <div class="card-content">
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
            <div class="field">
              <label class="label">Número</label>
              <div class="control">
                <input class="input" type="text" placeholder="Número do Quarteirão" v-model="numero_quarteirao"
                  :class="{ 'is-danger': v$.numero_quarteirao.$error }" />
                <span class="is-error" v-if="v$.numero_quarteirao.$error">
                  {{ v$.numero_quarteirao.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Sub-Número</label>
              <div class="control">
                <input class="input" type="text" placeholder="Número do Quarteirão" v-model="sub_numero"
                  :class="{ 'is-danger': v$.sub_numero.$error }" />
                <span class="is-error" v-if="v$.sub_numero.$error">
                  {{ v$.sub_numero.$errors[0].$message }}
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
import censitarioService from "@/services/cadastro/censitario.service";
import areaService from "@/services/cadastro/area.service";
import quarteiraoService from "@/services/cadastro/quarteirao.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CmbGeneric from "@/components/forms/CmbGeneric.vue";
import {
  required$,
  combo$,
} from "@/components/forms/validators";
import { ref, onMounted, reactive, watch } from "vue";
import { useCurrentUser } from '@/composables/currentUser'


const { currentUser } = useCurrentUser()

//var tpUser = ref(0);
//var nvUser = ref(0);
var areas = ref([]);

var id_prop = ref(0);

var id_municipio = ref(0);
var id_area = ref(0);
var id_censitario = ref(0);
var numero_quarteirao = ref('');
var sub_numero = ref('');


var quarteirao = reactive({
  id_municipio,
  id_area,
  id_censitario,
  numero_quarteirao,
  sub_numero
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
  id_area: { required$, minValue: combo$(1) }
}

const v$ = useValidate(rules, quarteirao);


function create() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    quarteiraoService.create(quarteirao).then(
      (response) => {
        showMessage.value = true;
        message.value = "Quarteirão cadastrada com sucesso.";
        type.value = "success";
        caption.value = "Quarteirão";
        setTimeout(() => (showMessage.value = false), 3000);
      },
      (error) => {
        message.value = error;
        showMessage.value = true;
        type.value = "alert";
        caption.value = "Quarteirão";
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
    caption.value = "Quarteirão";
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

onMounted(() => {
  let cUser = currentUser;
  if (cUser.value) {
    id_prop.value = cUser.value.id;
  }

});
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
