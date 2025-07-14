<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Área</p>
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
import areaService from "@/services/cadastro/area.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import {
  required$,
  combo$,
} from "@/components/forms/validators";
import { ref, onMounted, reactive } from "vue";
import { useCurrentUser } from '@/composables/currentUser'


const { currentUser } = useCurrentUser()

//var tpUser = ref(0);
//var nvUser = ref(0);

var id_prop = ref(0);

var codigo = ref("");
var id_municipio = ref(0);


var area = reactive({
  id_municipio,
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
  id_municipio: { required$, minValue: combo$(1) }
}

const v$ = useValidate(rules, area);


function create() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    areaService.create(area).then(
      (response) => {
        showMessage.value = true;
        message.value = "Área cadastrada com sucesso.";
        type.value = "success";
        caption.value = "Área";
        setTimeout(() => (showMessage.value = false), 3000);
      },
      (error) => {
        message.value = error;
        showMessage.value = true;
        type.value = "alert";
        caption.value = "Área";
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
    caption.value = "Área";
    setTimeout(() => (showMessage.value = false), 3000);
  }
}

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
