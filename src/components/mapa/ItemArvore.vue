<template>
  <ul class="tree-node">
    <li v-for="item in nos" :key="item.label">
      <!-- Linha da Pasta (Colegiado ou Município) -->
      <div
        v-if="item.tipo === 'colegiado' || item.tipo === 'municipio'"
        class="tree-item-row is-flex is-align-items-center is-clickable py-1 pr-3"
        :style="{ paddingLeft: `${nivel * 1.25 + 0.5}rem` }"
        @click.stop="toggle(item)"
      >
        <span class="mr-2">{{ item.aberto ? '📂' : '📁' }}</span>
        <!-- Exibe apenas o label limpo vindo do back -->
        <span class="is-size-7-mobile is-size-6-tablet">{{ item.label }}</span>
      </div>

      <!-- Linha do Arquivo (Camada) -->
      <div
        v-else
        class="tree-item-row is-flex is-align-items-center is-clickable py-1 pr-3 has-text-link"
        :style="{ paddingLeft: `${nivel * 1.25 + 0.5}rem` }"
        @click.stop="selecionarCamada(item)"
      >
        <span class="arrow-icon mr-2 has-text-grey-light">→</span>
        <span class="is-size-7-mobile is-size-6-tablet">{{ item.label }}</span>
      </div>

      <!-- Chamada recursiva repassando o contexto do pai se houver -->
      <ItemArvore
        v-if="
          (item.tipo === 'colegiado' || item.tipo === 'municipio') && item.aberto && item.children
        "
        :nos="item.children"
        :nivel="nivel + 1"
        :contextoPai="obterContextoAtual(item)"
        @selecionar="$emit('selecionar', $event)"
      />
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  nos: {
    type: Array,
    required: true,
  },
  nivel: {
    type: Number,
    default: 0,
  },
  // Recebe o contexto acumulado dos níveis superiores
  contextoPai: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['selecionar'])

const toggle = (item) => {
  item.aberto = !item.aberto
}

// Concatena o contexto acumulado até o nó atual
const obterContextoAtual = (item) => {
  const novoContexto = { ...props.contextoPai }

  if (item.tipo === 'colegiado') {
    novoContexto.colegiadoSlug = item.slug
    novoContexto.colegiadoNome = item.label
  } else if (item.tipo === 'municipio') {
    novoContexto.idMunicipio = item.id
    novoContexto.municipioNome = item.label
  }

  return novoContexto
}

// Ao clicar na camada, emite o payload completo que a API precisa para buscar o GeoJSON
const selecionarCamada = (item) => {
  const payloadCompleto = {
    ...props.contextoPai,
    camada: item.tipo_camada || item.label.toLowerCase(),
    labelCamada: item.label,
  }

  emit('selecionar', payloadCompleto)
}
</script>

<style scoped>
ul.tree-node,
ul.tree-node li {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.tree-item-row {
  border-radius: 4px;
  user-select: none;
  transition: background-color 0.15s ease;
}

.tree-item-row:hover {
  background-color: #f5f5f5;
}

.arrow-icon {
  font-family: monospace, sans-serif;
  font-weight: bold;
  font-size: 0.95rem;
  transition:
    color 0.15s ease,
    transform 0.15s ease;
  display: inline-block;
}

.tree-item-row:hover .arrow-icon {
  color: #3273dc !important;
  transform: translateX(2px);
}
</style>
