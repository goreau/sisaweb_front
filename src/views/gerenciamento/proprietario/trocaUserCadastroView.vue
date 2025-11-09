<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">
              Trocar Proprietário de Registros - Cadastros
            </p>
          </header>
          <div class="card-content">
            <section>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-model:sel="filter.id_municipio"
                        :tipo="99"
                        v-enter-to-next="'form-userCad'"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="field column is-4 is-offset-4">
                  <label class="label">&nbsp;</label>
                  <div class="control">
                    <button class="button is-link is-outlined is-fullwidth" @click="loadData">
                      <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
                      Carregar
                    </button>
                  </div>
                </div>
              </div>
              <hr />
            </section>
            <section v-show="hasRows">
              <div class="columns">
                <div class="column is-4 is-offset-1">
                  <div class="content">
                    <label class="label">Usuário a remover</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-userCad'"
                        v-model:sel="regExclui"
                        :data="dataTable"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-4 is-offset-2">
                  <div class="content">
                    <label class="label">Usuário que receberá</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-userCad'"
                        v-model:sel="regRecebe"
                        :data="dataTable"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <button class="button is-link aux-btn is-outlined is-fullwidth" @click="processa">
                    Processar a troca
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog ref="confirmDialog"></ConfirmDialog>
  </div>
</template>

<script setup>
import avulsosService from '@/services/gerenciamento/avulsos.service'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import ConfirmDialog from '@/components/general/ConfirmDialog.vue'
import { ref, onMounted, reactive } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const { currentUser } = useCurrentUser()

const toast = useToast()

var tpUser = ref(0)

var confirmDialog = ref(null)

var hasRows = ref(false)
var dataTable = ref([])
var execucoes = ref([])

const filter = reactive({
  id_municipio: 0,
  id_execucao: 0,
  dt_inicial: '',
  dt_final: '',
})

const regExclui = ref([])
const regRecebe = ref([])

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  localStorage.setItem('censSW', JSON.stringify(filter))

  const result = await avulsosService.getDuplicaCad(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataTable.value = result.data
    hasRows.value = true
  }
}

async function processa() {
  if (regExclui.value == 0 || regRecebe.value == 0) {
    toast.warning('Você precisa escolher os usuários envolvidos na troca!')
  }
  const sai = dataTable.value.find((a) => a.id === Number(regExclui.value))
  const fica = dataTable.value.find((a) => a.id === Number(regRecebe.value))

  const ok = await confirmDialog.value.show({
    title: 'Transferência',
    message: `Toda atividade do usuário ${sai.nome} será transferida para o usuário ${fica.nome}! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await avulsosService.trocaCad({ sai: regExclui.value, fica: regRecebe.value })
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(
        `Transferência executada com sucesso! ${resultado.master} registros transferidos.`,
      )
      hasRows.value = false
    }
  }
}

onMounted(() => {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  let cUser = currentUser
  if (cUser.value) {
    tpUser.value = cUser.value.tipo
    if (tpUser.value == 4) {
      loadData()
    }
  }
})
</script>

<style></style>
