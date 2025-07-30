<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader v-if="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Equipe</p>
          </header>
          <div class="card-content">
            <section>
              <div class="content">
                <label class="label">Município</label>
                <div class="control">
                  <CmbTerritorio :id_prop="id_prop" :tipo="99" :sel="equipe.id_municipio"
                    @selTerr="equipe.id_municipio = $event" :errclass="{ 'is-danger': v$.id_municipio.$error }" />
                  <span class="is-error" v-if="v$.id_municipio.$error">
                    {{ v$.id_municipio.$errors[0].$message }}
                  </span>
                </div>
              </div>
            </section>
            <section v-show="hasRows">
              <div class="field">
                <label class="label">Coordenador</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.coordenador"
                    :class="{ 'is-danger': v$.coordenador.$error }" />
                  <span class="is-error" v-if="v$.coordenador.$error">
                    {{ v$.coordenador.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Supervisor</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.supervisor"
                    :class="{ 'is-danger': v$.supervisor.$error }" />
                  <span class="is-error" v-if="v$.supervisor.$error">
                    {{ v$.supervisor.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">ACS</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.acs"
                    :class="{ 'is-danger': v$.acs.$error }" />
                  <span class="is-error" v-if="v$.acs.$error">
                    {{ v$.acs.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">ACV</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.acv"
                    :class="{ 'is-danger': v$.acv.$error }" />
                  <span class="is-error" v-if="v$.acv.$error">
                    {{ v$.acv.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Trios</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.trio"
                    :class="{ 'is-danger': v$.trio.$error }" />
                  <span class="is-error" v-if="v$.trio.$error">
                    {{ v$.trio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">IEC</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.iec"
                    :class="{ 'is-danger': v$.iec.$error }" />
                  <span class="is-error" v-if="v$.iec.$error">
                    {{ v$.iec.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Laboratório</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.laboratorio"
                    :class="{ 'is-danger': v$.laboratorio.$error }" />
                  <span class="is-error" v-if="v$.laboratorio.$error">
                    {{ v$.laboratorio.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Data Alteração</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Código da Área" v-model="equipe.atualizado" readonly />
                </div>
              </div>
            </section>
          </div>
          <footer class="card-footer">
            <footerCard @submit="save" @cancel="null" @aux="null" :cFooter="cFooter" v-show="hasRows" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from "@/components/general/MyLoader.vue";
import footerCard from '@/components/general/FooterCard.vue'
import equipeService from "@/services/cadastro/equipe.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import {
  required$,
  combo$,
  numeric$,
} from "@/components/forms/validators";
import { ref, onMounted, reactive, watch } from "vue";
import { useCurrentUser } from '@/composables/currentUser';

import { useToast } from "vue-toastification";

const toast = useToast();

const { currentUser } = useCurrentUser()

var id_prop = ref(0);
var hasRows = ref(false);

const equipe = reactive({
  id_equipe: 0,
  id_municipio: 0,
  coordenador: 0,
  supervisor: 0,
  acs: 0,
  acv: 0,
  trio: 0,
  iec: 0,
  laboratorio: 0,
  atualizado: ''
});

var isLoading = ref(false);

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false
});

const rules = {
  coordenador: { numeric$ },
  id_municipio: { required$, minValue: combo$(1) },
  supervisor: { numeric$ },
  acs: { numeric$ },
  acv: { numeric$ },
  trio: { numeric$ },
  iec: { numeric$ },
  laboratorio: { numeric$ },
}

const v$ = useValidate(rules, equipe);


async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null;
    var msg = '';
    if (isEditMode) {
      resultado = await equipeService.update(equipe);
      msg = "Equipe atualizada com sucesso!";
    } else {
      resultado = await equipeService.create(equipe);
      msg = "Equipe cadastrada com sucesso!";
    }

    if (resultado.error) {
      toast.error(resultado.msg);
    } else {
      toast.success(msg);
    }
  } else {
    toast.warning("Corrija os erros para enviar as informações");
  }
}

var isEditMode = false;

watch(() => equipe.id_municipio, async (val) => {
  const result = await equipeService.found(val);
  if (result.error) {
    toast.error(result.msg);
  } else {
    if (result.id_equipe) {
      Object.assign(equipe, result);
      isEditMode = true;
    } else {
      Object.assign(equipe, {
        id_equipe: 0,
        coordenador: 0,
        supervisor: 0,
        acs: 0,
        acv: 0,
        trio: 0,
        iec: 0,
        laboratorio: 0,
        atualizado: ''
      });
    }
    hasRows.value = true;
  }

})

onMounted(async () => {
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
