<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Área</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Município</label>
              <div class="control">
                <CmbTerritorio :id_prop="id_prop" :tipo="99" :sel="area.id_municipio"
                  @selTerr="area.id_municipio = $event" :errclass="{ 'is-danger': v$.id_municipio.$error }" />
                <span class="is-error" v-if="v$.id_municipio.$error">
                  {{ v$.id_municipio.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Codigo</label>
              <div class="control">
                <input class="input" type="text" placeholder="Código da Área" v-model="area.codigo"
                  :class="{ 'is-danger': v$.codigo.$error }" />
                <span class="is-error" v-if="v$.codigo.$error">
                  {{ v$.codigo.$errors[0].$message }}
                </span>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="save" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from "@/components/general/MyLoader.vue";
import footerCard from '@/components/general/FooterCard.vue'
import areaService from "@/services/cadastro/area.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import {
  required$,
  combo$,
} from "@/components/forms/validators";
import { ref, onMounted, reactive, computed } from "vue";
import { useCurrentUser } from '@/composables/currentUser';
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const { currentUser } = useCurrentUser()

var id_prop = ref(0);


const area = reactive({
  id_area: 0,
  id_municipio: 0,
  codigo: '',
});

var isLoading = ref(false);

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


async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null;
    if (isEditMode.value) {
      resultado = await areaService.update(area);
    } else {
      resultado = await areaService.create(area);
    }

    if (resultado.error) {
      toast.error(resultado.msg);
    } else {
      toast.success("Área inserida com sucesso!");
    }
  } else {
    toast.warning("Corrija os erros para enviar as informações");
  }
}

const isEditMode = computed(() => Number(route.params.id) > 0);

onMounted(async () => {
  if (isEditMode.value) {
    const result = await areaService.getArea(route.params.id);
    if (result.error) {
      toast.error(result.msg);
    } else {
      Object.assign(area, result);
    }
  } else {
    Object.assign(area, {
      id_area: 0,
      id_municipio: 0,
      codigo: '',
    });
  }
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
