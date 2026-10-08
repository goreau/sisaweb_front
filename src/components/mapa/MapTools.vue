<!-- components/BarraFerramentas.vue -->
<template>
  <div class="toolbar-container card p-2">
    <div class="field has-addons">
      <button
        class="button is-info is-outlined"
        title="Reiniciar e Escolher Novo Mapa"
        @click="$emit('reiniciar')"
      >
        <span class="icon is-small">
          <i class="fas fa-arrow-left"></i>
        </span>
      </button>
      <button
        class="button is-info is-outlined"
        title="Centralizar no Mapa Atual"
        @click="$emit('centralizar')"
      >
        <span class="icon is-small">
          <i class="fas fa-expand-arrows-alt"></i>
        </span>
      </button>

      <div class="toolbar-divider"></div>

      <button class="button is-info is-outlined" title="Construir" @click="$emit('construir')">
        <span class="icon is-small">
          <i class="fas fa-wrench"></i>
        </span>
      </button>
      <button class="button is-info is-outlined" title="Classes e cores" @click="$emit('paleta')">
        <span class="icon is-small">
          <i class="fas fa-palette"></i>
        </span>
      </button>

      <div class="toolbar-divider"></div>

      <button class="button is-info is-outlined" title="Grade" @click="$emit('grade')">
        <span class="icon is-small">
          <i class="fas fa-table-cells-large"></i>
        </span>
      </button>
      <button class="button is-info is-outlined" title="Pontos Aleatórios" @click="$emit('pontos')">
        <span class="icon is-small">
          <i class="fas fa-grip"></i>
        </span>
      </button>

      <div class="toolbar-divider"></div>

      <button class="button is-info is-outlined" title="Fundo" @click="$emit('tile')">
        <span class="icon is-small">
          <i class="fas fa-eye"></i>
        </span>
      </button>
      <button
        class="button is-info is-outlined"
        title="Exibe/Oculta legenda"
        @click="$emit('legenda')"
      >
        <span class="icon is-small">
          <i class="fas fa-list"></i>
        </span>
      </button>
      <button class="button is-info is-outlined" title="Label" @click="$emit('label')">
        <span class="icon is-small">
          <i class="fas fa-tag"></i>
        </span>
      </button>

      <!-- Espaço reservado para futuras ferramentas (Ex: filtros, cores, camadas) -->
      <!-- <slot></slot> -->
    </div>
  </div>
</template>

<script setup>
defineEmits([
  'reiniciar',
  'centralizar',
  'construir',
  'paleta',
  'legenda',
  'label',
  'grade',
  'pontos',
])
</script>

<style scoped>
.toolbar-container {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 1000; /* Garante que a barra fique por cima dos tiles do OpenLayers */
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.toolbar-divider {
  width: 0.8rem;
  height: 24px;
}
</style>
