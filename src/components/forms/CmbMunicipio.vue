<template>
  <div class="field has-addons">
    <div class="control is-expanded">
      <div class="select is-fullwidth">
        <select @change="onChange($event)" class="input" :class="errclass">
          <option value="0">-- Selecione --</option>
          <option v-for="mun in municipios" :key="mun.id" :value="mun.id" :selected="mun.id == sel">
            {{ mun.nome }}
          </option>
          <option value="999" :selected="sel == 999" :v-if="disabled">NÃO SE APLICA</option>
        </select>

      </div>
    </div>
  </div>
</template>

<script setup>
import TerritorioService from "@/services/general/territorio.service.js";
import { onMounted, ref } from "vue";


var municipios = ref([]);


const props = defineProps(['id_prop', 'sel', 'errclass']);

const emit = defineEmits(['selMun']);


function onChange(event) {
  emit('selMun', event.target.value);
}

function loadData() {

  TerritorioService.getComboMun(props.id_prop)
    .then((res) => {
      municipios.value = res.data;
    })
    .catch((err) => {
      console.log(err.response);
      municipios.value = [];
    })
}

onMounted(() => {
  loadData();
});
</script>

<style scoped></style>
