<template>
  <div class="control">
    <div class="select">
      <select @change="onChange($event)" class="input" :class="errclass">
        <option value="0">-- Selecione --</option>
        <option v-for="loc in territorios" :key="loc.id" :value="loc.id" :selected="loc.id == sel">
          {{ loc.nome }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import TerritorioService from "@/services/general/territorio.service.js";
import { onMounted, ref, watch } from "vue";

const territorios = ref([]);

const props = defineProps(['id_prop', 'sel', 'errclass', 'tipo']);

const emit = defineEmits(['selTerr']);

function onChange(event) {
  emit('selTerr', event.target.value);
}

function loadData() {
  TerritorioService.getCombo(props.tipo, props.id_prop)
    .then((res) => {
      territorios.value = res.data;
    })
    .catch((err) => {
      console.log(err.response);
      territorios.value = [];
    })
}

watch(
  () => props.tipo,
  (newVal) => {
    loadData(newVal)
  }
);

onMounted(() => {
  loadData(props.tipo);
});

</script>

<style scoped></style>
