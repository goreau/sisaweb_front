<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Listagem de Pendência</p>
          </header>
          <div class="card-content">
            <section>
              <div class="coluns">
                <div class="column is-10 is-offset-1">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Atividade</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-quadra'"
                          v-model="filter.id_atividade"
                          :options="atividades"
                          name="id_atividade"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-model:sel="filter.id_municipio"
                        :tipo="99"
                        v-enter-to-next="'form-userIm'"
                        :errclass="{ 'is-danger': v$.id_municipio.$error }"
                      />
                      <span class="is-error" v-if="v$.id_municipio.$error">
                        {{ v$.id_municipio.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="coluns">
                <div class="column is-6 is-offset-3">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Execução</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-userIm'"
                          v-model="filter.id_execucao"
                          :options="execucoes"
                          name="id_execucao"
                          :inline="true"
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Data Inicial</label>
                    <div class="control">
                      <MyDatePicker
                        v-enter-to-next="'form-userIm'"
                        v-model="filter.dt_inicial"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_inicial.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_inicial.$error">
                        {{ v$.dt_inicial.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Data Final</label>
                    <div class="control">
                      <MyDatePicker
                        v-enter-to-next="'form-userIm'"
                        v-model="filter.dt_final"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_final.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_final.$error">
                        {{ v$.dt_final.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Agente</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-quadra'"
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="filter.agente"
                      />
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-6 is-offset-3">
                      <button
                        class="button is-link aux-btn is-outlined is-fullwidth"
                        @click="processa"
                      >
                        Visualizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import avulsosService from '@/services/gerenciamento/avulsos.service.js'
import auxiliarService from '@/services/general/auxiliar.service'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import MyDatePicker from '@/components/forms/MyDatePicker.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'
import useValidate from '@vuelidate/core'
import { required$, combo$, diferencaMaximaDias$ } from '@/components/forms/validators'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)

var execucoes = ref([])
var atividades = ref([])

const filter = reactive({
  id_municipio: 0,
  id_execucao: 0,
  id_atividade: 0,
  dt_inicial: '',
  dt_final: '',
  agente: '',
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_inicial: { required$ },
  dt_final: {
    required$,
    maximo31Dias: diferencaMaximaDias$('dt_inicial', 31),
  },
}

const v$ = useValidate(rules, filter)

async function processa() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    const resultado = await avulsosService.getListaPendencia(JSON.stringify(filter))
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      gerarPDF(resultado.data, resultado.filtros)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

async function gerarPDF(dados, filtros) {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF({ orientation: 'landscape' })

  // Título do relatório
  doc.setFontSize(16)
  doc.text('Listagem de imóveis pendentes', 14, 20)
  doc.setFontSize(8)
  doc.text(filtros, 14, 30)

  // Mapeia os dados do seu JSON para o formato que a tabela do jsPDF aceita
  const linhas = dados.map((item) => [
    item.area,
    item.quart,
    item.data,
    item.agente,
    item.situacao,
    item.ordem,
    item.casa,
    item.observacao || '-', // Se observacao for null, exibe um traço
  ])

  // Cria a tabela utilizando o autotable
  autoTable(doc, {
    startY: 35, // Posição vertical onde a tabela começa
    head: [['Área', 'Quart.', 'Data', 'Agente', 'Situação', 'Ordem', 'Casa', 'Observação']],
    body: linhas,
    theme: 'striped', // <-- Aplica a alternância de cores automaticamente nas linhas
    headStyles: {
      fillColor: [41, 128, 185], // Azul do cabeçalho
      textColor: [255, 255, 255],
    },
    styles: { fontSize: 8, cellPadding: 2 },
  })

  // Salva o arquivo diretamente no navegador do usuário
  doc.save('Sisaweb 3 - Listagem de Pendencia.pdf')
}

onMounted(async () => {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  const result = await auxiliarService.getAtividadeCombo(2)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }

  let cUser = currentUser
  if (cUser.value) {
    tpUser.value = cUser.value.tipo
  }
})
</script>

<style></style>
