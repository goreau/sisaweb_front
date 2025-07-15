<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader v-if="isLoading" />
        <Message v-if="showMessage" @do-close="closeMessage" :msg="message" :type="type" :caption="caption" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Quarteirão</p>
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
            </div>
            <div class="columns">
              <div class="column is-3">
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
              </div>
              <div class="column is-3">
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
              <div class="column is-3">
                <div class="field">
                  <label class="label">Identificador</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="identificador"
                      :class="{ 'is-danger': v$.identificador.$error }" />
                    <span class="is-error" v-if="v$.identificador.$error">
                      {{ v$.identificador.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-3">
                <div class="content">
                  <label class="label">Ocupação</label>
                  <div class="control">
                    <CmbGeneric :sel="id_ocupacao" :data="ocupacaos" @selGen="id_ocupacao = $event"
                      :errclass="{ 'is-danger': v$.id_ocupacao.$error }" />
                    <span class="is-error" v-if="v$.id_ocupacao.$error">
                      {{ v$.id_ocupacao.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <p class="divisor">Imóveis por tipo</p>
            <div class="columns">
              <div class="column is-2 is-offset-1">
                <div class="field">
                  <label class="label">Residencial Térreo</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="resid_terrea"
                      :class="{ 'is-danger': v$.resid_terrea.$error }" />
                    <span class="is-error" v-if="v$.resid_terrea.$error">
                      {{ v$.resid_terrea.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Residencial 1º Andar</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="primeiro_andar"
                      :class="{ 'is-danger': v$.primeiro_andar.$error }" />
                    <span class="is-error" v-if="v$.primeiro_andar.$error">
                      {{ v$.primeiro_andar.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Acima 1º Andar - Trab</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="acima_primeiro_trab"
                      :class="{ 'is-danger': v$.acima_primeiro_trab.$error }" />
                    <span class="is-error" v-if="v$.acima_primeiro_trab.$error">
                      {{ v$.acima_primeiro_trab.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Acima 1º Andar - Não Trab</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="acima_primeiro_ntrab"
                      :class="{ 'is-danger': v$.acima_primeiro_ntrab.$error }" />
                    <span class="is-error" v-if="v$.acima_primeiro_ntrab.$error">
                      {{ v$.acima_primeiro_ntrab.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Não residencial Térreo</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="nao_residencia_terreo"
                      :class="{ 'is-danger': v$.nao_residencia_terreo.$error }" />
                    <span class="is-error" v-if="v$.nao_residencia_terreo.$error">
                      {{ v$.nao_residencia_terreo.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-2 is-offset-1">
                <div class="field">
                  <label class="label">Não residencial 1º Andar</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="nao_residencia_primeiro"
                      :class="{ 'is-danger': v$.nao_residencia_primeiro.$error }" />
                    <span class="is-error" v-if="v$.nao_residencia_primeiro.$error">
                      {{ v$.nao_residencia_primeiro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Praça</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="praca"
                      :class="{ 'is-danger': v$.praca.$error }" />
                    <span class="is-error" v-if="v$.praca.$error">
                      {{ v$.praca.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Terreno Baldio</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="baldio"
                      :class="{ 'is-danger': v$.baldio.$error }" />
                    <span class="is-error" v-if="v$.baldio.$error">
                      {{ v$.baldio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Obra</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="obra"
                      :class="{ 'is-danger': v$.obra.$error }" />
                    <span class="is-error" v-if="v$.obra.$error">
                      {{ v$.obra.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Imóvel Cadastrado</label>
                  <div class="control">
                    <input class="input" type="text" placeholder="Opcional" v-model="cadastrado"
                      :class="{ 'is-danger': v$.cadastrado.$error }" />
                    <span class="is-error" v-if="v$.cadastrado.$error">
                      {{ v$.cadastrado.$errors[0].$message }}
                    </span>
                  </div>
                </div>
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
import auxiliarService from "@/services/general/auxiliar.service";
import areaService from "@/services/cadastro/area.service";
import censitarioService from "@/services/cadastro/censitario.service";
import quarteiraoService from "@/services/cadastro/quarteirao.service";
import useValidate from "@vuelidate/core";
import CmbTerritorio from "@/components/forms/CmbTerritorio.vue";
import CmbGeneric from "@/components/forms/CmbGeneric.vue";
import {
  required$,
  combo$,
  minLengthIfFilled$,
} from "@/components/forms/validators";
import { ref, onMounted, reactive, watch } from "vue";
import { useCurrentUser } from '@/composables/currentUser'

//nao_residencia_primeiro, praca, baldio, obra, sk_quarteirao, id_usuario, id_municipio, id_mapa, id_ocupacao, identificador, cadastrado, dt_atualiza
const { currentUser } = useCurrentUser()

var areas = ref([]);
var censitarios = ref([]);
var ocupacaos = ref([]);


var id_prop = ref(0);

var id_municipio = ref(0);
var id_area = ref(0);
var id_censitario = ref(0);
var numero_quarteirao = ref('');
var sub_numero = ref('');
var identificador = ref('');
var id_ocupacao = ref('');
var resid_terrea = ref(0);
var primeiro_andar = ref(0);
var acima_primeiro_trab = ref(0);
var acima_primeiro_ntrab = ref(0);
var nao_residencia_terreo = ref(0);
var nao_residencia_primeiro = ref(0);
var praca = ref(0);
var baldio = ref(0);
var obra = ref(0);
var cadastrado = ref(0);

var quarteirao = reactive({
  id_municipio,
  id_area,
  id_censitario,
  numero_quarteirao,
  sub_numero,
  identificador,
  id_ocupacao,
  resid_terrea,
  primeiro_andar,
  acima_primeiro_trab,
  acima_primeiro_ntrab,
  nao_residencia_terreo,
  nao_residencia_primeiro,
  praca,
  baldio,
  obra,
  cadastrado
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
  numero_quarteirao: { required$ },
  sub_numero: { required$ },
  id_municipio: { required$, minValue: combo$(1) },
  id_area: { required$, minValue: combo$(1) },
  id_censitario: { required$, minValue: combo$(1) },
  id_ocupacao: { required$, minValue: combo$(1) },
  identificador: { minLengthIfFilled: minLengthIfFilled$(1) },
  resid_terrea: { required$ },
  primeiro_andar: { required$ },
  acima_primeiro_trab: { required$ },
  acima_primeiro_ntrab: { required$ },
  nao_residencia_terreo: { required$ },
  nao_residencia_primeiro: { required$ },
  praca: { required$ },
  baldio: { required$ },
  obra: { required$ },
  cadastrado: { required$ }
}

const v$ = useValidate(rules, quarteirao);


function create() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    quarteiraoService.create(quarteirao).then(
      (response) => {
        showMessage.value = true;
        message.value = "Quarteirão cadastrado com sucesso.";
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

onMounted(() => {
  let cUser = currentUser;
  if (cUser.value) {
    id_prop.value = cUser.value.id;
  }
  auxiliarService.getGenericCombo(1)
    .then((res) => {
      ocupacaos.value = res.data;
    })
    .catch((err) => {
      console.log(err.response);
      ocupacaos.value = [];
    })
});
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}

.divisor {
  text-align: center;
  padding: 1rem 0 2rem 0;
  font-weight: bold;
}
</style>
