<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-three-fifths">
        <div class="card" style="min-height: 60vh">
          <header class="card-header">
            <p class="card-header-title is-centered">Trocar Proprietário de Registros - Parcial</p>
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
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-userCad'"
                        v-model:sel="filterAplica.id_area"
                        :data="dataArea"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-4 is-offset-2">
                  <div class="content">
                    <label class="label">Usuário</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-userCad'"
                        v-model:sel="filterAplica.id_usuario"
                        :data="dataUser"
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
import uniformizaUserService from '@/services/gerenciamento/uniformizaUser.service'
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
var dataArea = ref([])
var dataUser = ref([])
var execucoes = ref([])

const filter = reactive({
  id_municipio: 0,
})

const filterAplica = reactive({
  id_area: 0,
  id_usuario: 0,
})

const columns = ref([])

function newFilter() {
  hasRows.value = false
}

async function loadData() {
  localStorage.setItem('unifSW', JSON.stringify(filter))

  const result = await uniformizaUserService.getData(JSON.stringify(filter))
  if (result.error) {
    console.log(result.error)
  } else {
    dataArea.value = result.data.areas
    dataUser.value = result.data.users
    hasRows.value = true
  }
}

async function processa() {
  if (filterAplica.id_area == 0 || filterAplica.id_usuario == 0) {
    toast.warning('Você precisa escolher a área e o usuário ao qual serão atribuidos os dados!')
  }
  const area = dataArea.value.find((a) => a.id === Number(filterAplica.id_area))
  const user = dataUser.value.find((a) => a.id === Number(filterAplica.id_usuario))

  const ok = await confirmDialog.value.show({
    title: 'Transferência',
    message: `Todos os cadastros da <b>área ${area.nome}</b> serão transferidos para o usuário <b>${user.nome}</b>! Confirma?`,
    okButton: 'Confirmar',
  })
  if (ok) {
    const resultado = await uniformizaUserService.update({
      id_area: filterAplica.id_area,
      id_usuario: filterAplica.id_usuario,
    })
    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(`Transferência executada com sucesso!`)
      hasRows.value = false
    }
  }
}

onMounted(() => {
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
