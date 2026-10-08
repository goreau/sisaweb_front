<!-- components/FormularioConstrucao.vue -->
<template>
  <div class="formulario-construcao">
    <p>Opções:</p>
    <hr />
    <fieldset class="fieldset">
      <legend>Filtros</legend>
      <div class="columns">
        <div class="column is-6">
          <div class="field">
            <label class="label">Atividade</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="atividadeSelecionada" @change="aoMudarAtividade">
                  <option value="">Selecione uma atividade...</option>
                  <option v-for="atv in listaAtividades" :key="atv.id" :value="atv.id">
                    {{ atv.nome }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="field">
            <label class="label">Variável / Indicador</label>
            <div class="control">
              <div class="select is-fullwidth" :class="{ 'is-loading': !atividadeSelecionada }">
                <select v-model="formLocal.variavel" :disabled="!atividadeSelecionada">
                  <option value="">
                    {{
                      atividadeSelecionada
                        ? 'Selecione uma variável...'
                        : 'Escolha uma atividade primeiro'
                    }}
                  </option>
                  <option v-for="v in variaveisDisponiveis" :key="v.id" :value="v.id">
                    {{ v.nome }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-5 is-offset-1">
          <div class="field">
            <label class="label">Data Inicial</label>
            <div class="control">
              <DatePicker
                v-enter-to-next="'form-vc'"
                v-model="formLocal.dt_inicial"
                :error="false"
                placeholder="Escolha a data"
              />
            </div>
          </div>
        </div>
        <div class="column is-5">
          <div class="field">
            <label class="label">Data Final</label>
            <div class="control">
              <DatePicker
                v-enter-to-next="'form-vc'"
                v-model="formLocal.dt_final"
                :error="false"
                placeholder="Escolha a data"
              />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
    <fieldset class="fieldset">
      <legend>Opções</legend>
      <div class="field">
        <fieldset class="fieldset">
          <legend>Tipo de Mapa</legend>
          <div class="control">
            <label class="radio">
              <input type="radio" value="area" v-model="formLocal.tipo" />
              Área
            </label>
            <label class="radio">
              <input type="radio" value="poligono" v-model="formLocal.tipo" />
              Polígono
            </label>
            <label class="radio">
              <input type="radio" value="ponto" v-model="formLocal.tipo" />
              Ponto
            </label>
          </div>
        </fieldset>
      </div>

      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Número de Intervalos (Classes)</label>
            <div class="control">
              <input
                class="input"
                type="number"
                min="3"
                max="7"
                v-model.number="formLocal.classes"
              />
            </div>
          </div>
        </div>
        <div class="column">
          <div class="field">
            <fieldset class="fieldset">
              <legend>Modelo de distribuição</legend>
              <div class="control">
                <label class="radio">
                  <input type="radio" value="perc" v-model="formLocal.modelo" />
                  Percentil
                </label>
                <label class="radio">
                  <input type="radio" value="valor" v-model="formLocal.modelo" />
                  Valor
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import dadosAtividades from '@/data/mapaAtivVar.json'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'aplicar'])

const formLocal = reactive({
  dt_inicial: '',
  dt_final: '',
  atividade: 0,
  variavel: '',
  fantasia: '',
  classes: 5,
  tipo: 'poligono',
  modelo: 'perc',
  ...props.modelValue,
})

const listaAtividades = ref(dadosAtividades)
const atividadeSelecionada = ref('')

const variaveisDisponiveis = computed(() => {
  if (!atividadeSelecionada.value) return []

  const atividadeEncontrada = listaAtividades.value.find((a) => a.id === atividadeSelecionada.value)

  return atividadeEncontrada ? atividadeEncontrada.variaveis : []
})

// Reseta a variável selecionada se o usuário trocar a atividade
function aoMudarAtividade() {
  formLocal.atividade = atividadeSelecionada.value
  formLocal.variavel = '' // Limpa a variável anterior para evitar inconsistências
}

watch(
  () => formLocal.variavel,
  (novoId) => {
    if (!novoId) {
      formLocal.fantasia = ''
      return
    }

    // Busca na lista de variáveis que já está filtrada pela atividade
    const variavelEncontrada = variaveisDisponiveis.value.find((v) => v.id === novoId)

    // Atribui o nome encontrado à propriedade fantasia
    formLocal.fantasia = variavelEncontrada ? variavelEncontrada.nome : ''
  },
)

watch(
  () => props.modelValue,
  (novoValor) => {
    if (novoValor) {
      Object.assign(formLocal, novoValor)
      if (novoValor?.atividade) {
        atividadeSelecionada.value = novoValor.atividade
      }
    }
  },
  { deep: true, immediate: true },
)

// Método que será chamado pelo Modal Pai quando o usuário clicar no botão confirmar do Wrapper
function submeter() {
  emit('aplicar', { ...formLocal })
}

// Expõe a função para que o Pai possa acionar via template ref
defineExpose({
  submeter,
})
</script>
