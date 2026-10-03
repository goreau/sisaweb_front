<template>
  <div class="palette-builder">
    <h3>Seleção de Cores</h3>

    <!-- Seleção do Número de Classes -->
    <div class="field">
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <label class="label">Número de Intervalos (Classes)</label>
          <div class="control">
            <select class="select input" v-model.number="localDef.classes">
              <option v-for="n in [3, 4, 5, 6, 7]" :key="n" :value="n">{{ n }} Classes</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Renderização Reativa Dinâmica de Cores com Vue (sem manipuladores manuais do DOM) -->

    <div class="color-inputs">
      <div v-for="(color, index) in localDef.colors" :key="index" class="color-picker-item">
        <div class="columns is-centered">
          <div class="column is-flex is-justify-content-center is-align-items-center">
            <label>Nível {{ index + 1 }}:</label>
          </div>
          <div class="column">
            <input type="number" class="input" v-model="localDef.limites[index]" />
          </div>
          <div class="column is-flex is-justify-content-center is-align-items-center">
            <input type="color" v-model="localDef.colors[index]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Ações de Ajuste Rápido (Opcional) -->
    <div class="actions">
      <button type="button" class="btn-reset is-light" @click="resetToDefault">
        Restaurar Padrão
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, nextTick } from 'vue'

const props = defineProps({
  limitesAtuais: {
    type: Array,
    default: null,
  },
  classesAtuais: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['aplicar'])

const isSyncingProps = ref(false)
const STORAGE_KEY = 'map_theme_palette'

const DEFAULT_PALETTE = {
  classes: 5,
  limites: [20, 40, 60, 80, 100],
  colors: ['#bafada', '#86dd86', '#42da49', '#10a829', '#07420a'],
}

const localDef = reactive({
  classes: 5,
  limites: [],
  colors: [],
})

function getInitialConfig() {
  const temLimitesDoMapa = Array.isArray(props.limitesAtuais) && props.limitesAtuais.length > 0
  const numClasses = temLimitesDoMapa
    ? props.limitesAtuais.length
    : props.classesAtuais || DEFAULT_PALETTE.classes

  // A) PRIORIDADE 1: Se o Mapa forneceu valores de limites
  if (temLimitesDoMapa) {
    return {
      classes: numClasses,
      limites: [...props.limitesAtuais],
      colors: gerarOuAjustarCores(numClasses),
    }
  }

  // B) PRIORIDADE 2: Se não vieram dados do mapa, consulta o Storage
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object') {
        const cCount = parsed.classes || DEFAULT_PALETTE.classes
        return {
          classes: cCount,
          limites: Array.isArray(parsed.limites) ? parsed.limites : [...DEFAULT_PALETTE.limites],
          colors: Array.isArray(parsed.colors) ? parsed.colors : gerarOuAjustarCores(cCount),
        }
      }
    } catch (e) {
      console.error('Erro ao ler do localStorage:', e)
    }
  }

  // C) PRIORIDADE 3: Fallback Padrão
  return {
    classes: DEFAULT_PALETTE.classes,
    limites: [...DEFAULT_PALETTE.limites],
    colors: [...DEFAULT_PALETTE.colors],
  }
}

function gerarOuAjustarCores(alvoQuantidade) {
  let coresBase = []

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.colors) && parsed.colors.length > 0) {
        coresBase = [...parsed.colors]
      }
    }
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    /* empty */
  }

  if (coresBase.length === 0) {
    coresBase = [...DEFAULT_PALETTE.colors]
  }

  if (coresBase.length < alvoQuantidade) {
    while (coresBase.length < alvoQuantidade) {
      coresBase.push('#cccccc')
    }
  } else if (coresBase.length > alvoQuantidade) {
    coresBase = coresBase.slice(0, alvoQuantidade)
  }

  return coresBase
}

// 1. WATCH DE PROPS: Sincroniza o estado quando o Mapa enviar novos dados
watch(
  () => [props.limitesAtuais, props.classesAtuais],
  async () => {
    const novaConfig = getInitialConfig()

    isSyncingProps.value = true

    Object.assign(localDef, {
      classes: Number(novaConfig.classes),
      limites: [...novaConfig.limites],
      colors: [...novaConfig.colors],
    })

    await nextTick()
    isSyncingProps.value = false
  },
  { immediate: true, deep: true },
)

// 2. WATCH DE INTERAÇÃO DO USUÁRIO: Ajusta arrays quando o usuário muda o <select>
watch(
  () => localDef.classes,
  (newCount, oldCount) => {
    // Bloqueia se a mudança veio da carga das props
    if (isSyncingProps.value) return

    if (!newCount || newCount === oldCount) return

    if (newCount === localDef.limites.length && newCount === localDef.colors.length) {
      return
    }

    // 1. Ajusta cores
    const currentColors = [...localDef.colors]
    if (newCount > currentColors.length) {
      while (currentColors.length < newCount) currentColors.push('#cccccc')
    } else {
      currentColors.splice(newCount)
    }
    localDef.colors = currentColors

    // 2. Ajusta limites
    if (localDef.limites.length !== newCount) {
      const currentLimits = [...localDef.limites]
      if (newCount > currentLimits.length) {
        const lastVal = currentLimits[currentLimits.length - 1] || 100
        while (currentLimits.length < newCount) {
          currentLimits.push(lastVal + 10)
        }
      } else {
        currentLimits.splice(newCount)
      }
      localDef.limites = currentLimits
    }
  },
)

function resetToDefault() {
  localStorage.removeItem(STORAGE_KEY)
  const temLimitesDoMapa = Array.isArray(props.limitesAtuais) && props.limitesAtuais.length > 0

  localDef.classes = temLimitesDoMapa ? props.limitesAtuais.length : DEFAULT_PALETTE.classes
  localDef.limites = temLimitesDoMapa ? [...props.limitesAtuais] : [...DEFAULT_PALETTE.limites]
  localDef.colors = gerarOuAjustarCores(localDef.classes)
}

function submeter() {
  const configToSave = {
    classes: localDef.classes,
    limites: [...localDef.limites],
    colors: [...localDef.colors],
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave))
  emit('aplicar', configToSave)
}

defineExpose({
  submeter,
})
</script>

<style lang="scss" scoped>
.palette-builder {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .color-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .color-picker-item {
      //display: flex;
      justify-content: space-between;
      align-items: center;

      input[type='color'] {
        border: none;
        width: 50px;
        height: 40px;
        cursor: pointer;
        background: transparent;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;

    .btn-reset {
      background: transparent;
      border: 1px solid #ccc;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: #f0f0f0;
      }
    }
  }
}
</style>
