<template>
  <div v-if="temLegendas" class="legenda-flutuante box">
    <div v-for="legenda in legendas" :key="legenda.id || legenda.titulo" class="secao-legenda mb-3">
      <!-- Título da camada -->
      <h6 class="title is-6 mb-2">{{ legenda.titulo || 'Legenda' }}</h6>

      <!-- Tipo: Polígono -->
      <template v-if="legenda.id === 'poligono'">
        <div v-for="(item, index) in legenda.itens" :key="index" class="item-legenda">
          <span class="square-cor" :style="{ backgroundColor: item.cor }"></span>
          <span class="label-faixa">{{ item.rotulo }}</span>
        </div>
      </template>

      <!-- Tipo: Ponto -->
      <template v-else-if="legenda.id === 'pontos'">
        <div v-for="(item, index) in legenda.itens" :key="index" class="item-legenda-ponto">
          <span
            class="circulo-legenda"
            :style="{
              width: (item.raio || 6) * 2 + 'px',
              height: (item.raio || 6) * 2 + 'px',
              backgroundColor: item.cor,
            }"
          ></span>
          <span class="label-faixa">{{ item.rotulo }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Recebe a lista de legendas como Prop do componente pai
const props = defineProps({
  legendas: {
    type: Array,
    default: () => [],
  },
})

// Computed apenas para validar a exibição da caixa flutuante
const temLegendas = computed(() => props.legendas && props.legendas.length > 0)
</script>

<style scoped>
/* Transfira o CSS exclusivo da legenda para cá */
.legenda-flutuante {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-height: 350px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.95);
}

.item-legenda,
.item-legenda-ponto {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.square-cor {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.circulo-legenda {
  display: inline-block;
  border-radius: 50%;
  flex-shrink: 0;
}

.secao-legenda:not(:last-child) {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
</style>
