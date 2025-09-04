<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-8">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Imóveis</p>
          </header>
          <div class="card-content">
            <fieldset class="fieldset">
              <legend>Identificação</legend>
              <div class="columns">
                <div class="column is-6" v-if="isCadastro">
                  <div class="content">
                    <label class="label">Imóvel</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="imovel.id_imovel"
                        :data="imoveis"
                        @selGen="imovel.id_imovel = $event"
                        :errclass="{ 'is-danger': v$.id_imovel.$error }"
                      />
                      <span class="is-error" v-if="v$.id_imovel.$error">
                        {{ v$.id_imovel.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3" v-if="!isCadastro">
                  <div class="content">
                    <label class="label">Ordem</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="N° de Ordem"
                        v-model="imovel.ordem"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-3" v-if="!isCadastro">
                  <div class="content">
                    <label class="label">Casa</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="N° do Imóvel"
                        v-model="imovel.casa"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Situação</legend>
                      <div class="field">
                        <RadioGeneric
                          v-model="imovel.id_situacao"
                          :options="situacoes"
                          name="id_situacao"
                          :inline="true"
                        />
                      </div>
                      <span class="is-error" v-if="v$.id_situacao.$error">
                        {{ v$.id_situacao.$errors[0].$message }}
                      </span>
                    </fieldset>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Ambiente</legend>
              <div class="columns">
                <div class="column is-2 is-offset-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Hora</label>
                      <div class="control">
                        <input
                          class="input"
                          type="time"
                          placeholder="Opcional"
                          v-model="imovel.hora"
                        />
                        <span class="is-error" v-if="v$.hora.$error">
                          {{ v$.hora.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Umidade</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.umidade"
                        />
                        <span class="is-error" v-if="v$.umidade.$error">
                          {{ v$.umidade.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Temperatura</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.temperatura"
                        />
                        <span class="is-error" v-if="v$.temperatura.$error">
                          {{ v$.temperatura.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Moradores</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.moradores"
                        />
                        <span class="is-error" v-if="v$.moradores.$error">
                          {{ v$.moradores.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Pesquisa Larvária</legend>
              <div class="columns">
                <div class="column is-2 is-offset-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Com com_larvas</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.com_larva"
                        />
                        <span class="is-error" v-if="v$.com_larva.$error">
                          {{ v$.com_larva.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Amostra</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.amostra"
                        />
                        <span class="is-error" v-if="v$.amostra.$error">
                          {{ v$.amostra.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label"><i>Ae aegypti</i></label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.aegypti"
                        />
                        <span class="is-error" v-if="v$.aegypti.$error">
                          {{ v$.aegypti.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label"><i>Ae albopictus</i></label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.albopictus"
                        />
                        <span class="is-error" v-if="v$.albopictus.$error">
                          {{ v$.albopictus.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Intra</legend>
              <div class="columns">
                <div class="column is-2 is-offset-1">
                  <div class="content">
                    <div class="field">
                      <label class="label">Amostra</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.intra_amostra"
                        />
                        <span class="is-error" v-if="v$.amostra.$error">
                          {{ v$.amostra.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Macho</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.intra_aeg_macho"
                        />
                        <span class="is-error" v-if="v$.intra_aeg_macho.$error">
                          {{ v$.intra_aeg_macho.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Fêmea</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.intra_aeg_femea"
                        />
                        <span class="is-error" v-if="v$.intra_aeg_femea.$error">
                          {{ v$.intra_aeg_femea.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Macho</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.intra_alb_macho"
                        />
                        <span class="is-error" v-if="v$.intra_alb_macho.$error">
                          {{ v$.intra_alb_macho.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Fêmea</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.intra_alb_femea"
                        />
                        <span class="is-error" v-if="v$.intra_alb_femea.$error">
                          {{ v$.intra_alb_femea.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Peri</legend>
              <div class="columns">
                <div class="column is-2 is-offset-1">
                  <div class="content">
                    <div class="field">
                      <label class="label">Amostra</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peri_amostra"
                        />
                        <span class="is-error" v-if="v$.peri_amostra.$error">
                          {{ v$.peri_amostra.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Macho</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peri_aeg_macho"
                        />
                        <span class="is-error" v-if="v$.peri_aeg_macho.$error">
                          {{ v$.peri_aeg_macho.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Fêmea</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peri_aeg_femea"
                        />
                        <span class="is-error" v-if="v$.peri_aeg_femea.$error">
                          {{ v$.peri_aeg_femea.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Macho</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peri_alb_macho"
                        />
                        <span class="is-error" v-if="v$.peri_alb_macho.$error">
                          {{ v$.peri_alb_macho.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="content">
                    <div class="field">
                      <label class="label">Fêmea</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peri_alb_femea"
                        />
                        <span class="is-error" v-if="v$.peri_alb_femea.$error">
                          {{ v$.peri_alb_femea.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <hr />
            <section v-if="colImoveis.length > 0">
              <p class="divisor">Imóveis</p>
              <MyDataTable
                :loggedUser="{ id: 0, tipo: 0 }"
                :data="colImoveis"
                :columns="columns"
                :pagination="false"
                @edit="onEditRow"
                @delete="onDeleteRow"
                :buttons="['edit', 'delete']"
              />
            </section>
            <hr />
            <div class="columns">
              <div class="column is-6 is-offset-3">
                <button class="button is-link aux-btn is-fullwidth" @click="insert">Salvar</button>
              </div>
            </div>
            <hr />
          </div>
          <footer class="card-footer">
            <footerCard
              @submit="save"
              :ready="readyToGo"
              :customBack="true"
              @cancel="voltar"
              @aux="null"
              :cFooter="cFooter"
            />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import MyDataTable from '@/components/general/MyDataTable.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import useValidate from '@vuelidate/core'
import {
  required$,
  combo$,
  numeric$,
  maxLength$,
  decimal$,
  horaValida$,
  requiredIf$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useVcAladoStore } from '@/stores/vcAladoStore'
import { useRouter } from 'vue-router'
//import { useToast } from 'vue-toastification'
import { generateId } from '@/utils/myUtils'
import imovelService from '@/services/cadastro/imovel.service'

//const toast = useToast()
//const route = useRoute()
const router = useRouter()

const { currentUser } = useCurrentUser()
const store = useVcAladoStore()

var colImoveis = ref([])
const columns = ref([])

var id_prop = ref(0)
const isCadastro = ref(false)

const situacoes = ref([])
const imoveis = ref([])

var imovel = reactive({
  id: 0,
  ordem: 1,
  casa: '',
  id_imovel: 0,
  id_situacao: 0,
  hora: '',
  umidade: '',
  temperatura: '',
  moradores: 0,
  com_larva: 0,
  amostra: '',
  aegypti: '',
  albopictus: 0,
  intra_amostra: '',
  intra_aeg_macho: 0,
  intra_aeg_femea: 0,
  intra_alb_macho: 0,
  intra_alb_femea: '',
  peri_amostra: '',
  peri_aeg_macho: 0,
  peri_aeg_femea: 0,
  peri_alb_macho: 0,
  peri_alb_femea: '',
})

var isLoading = false

var cFooter = ref({
  strSubmit: 'Voltar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  ordem: { requiredIf: requiredIf$(!isCadastro.value), numeric$ },
  casa: { maxLength: maxLength$(40) },
  id_imovel: { requiredIf: requiredIf$(isCadastro.value) },
  id_situacao: { required$, minValue: combo$(1) },
  hora: { horaValida$ },
  moradores: { numeric$ },
  umidade: { decimal$ },
  temperatura: { decimal$ },
  com_larva: { numeric$ },
  amostra: { numeric$ },
  aegypti: { numeric$ },
  albopictus: { numeric$ },
  intra_amostra: { numeric$ },
  intra_aeg_macho: { numeric$ },
  intra_aeg_femea: { numeric$ },
  intra_alb_macho: { numeric$ },
  intra_alb_femea: { numeric$ },
  peri_amostra: { numeric$ },
  peri_aeg_macho: { numeric$ },
  peri_aeg_femea: { numeric$ },
  peri_alb_macho: { numeric$ },
  peri_alb_femea: { numeric$ },
}

const v$ = useValidate(rules, imovel)

function insert() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    if (imovel.id != 0) {
      const index = colImoveis.value.findIndex((item) => item.id === imovel.id)
      if (index !== -1) {
        colImoveis.value[index] = { ...imovel }
      }
    } else {
      imovel.id = generateId()
      colImoveis.value.push({ ...imovel })
    }
    limpar()
  }
}

function limpar() {
  let vazio = {
    id: 0,
    id_imovel: 0,
    ordem: imovel.ordem + 1,
    casa: '',
    id_situacao: 0,
    hora: '',
    umidade: '',
    temperatura: '',
    moradores: 0,
    com_larva: 0,
    amostra: '',
    aegypti: '',
    albopictus: 0,
    intra_amostra: '',
    intra_aeg_macho: 0,
    intra_aeg_femea: 0,
    intra_alb_macho: 0,
    intra_alb_femea: '',
    peri_amostra: '',
    peri_aeg_macho: 0,
    peri_aeg_femea: 0,
    peri_alb_macho: 0,
    peri_alb_femea: '',
  }
  Object.assign(imovel, vazio)
}

const readyToGo = computed(() => {
  return colImoveis.value.length > 0
})

function onEditRow(item) {
  const row = colImoveis.value.find((a) => a.id === item.row.id)

  //let row = colImoveis.value.splice(item.index, 1)
  Object.assign(imovel, row)
}

function onDeleteRow(item) {
  colImoveis.value.splice(item.index, 1)
}

async function save() {
  store.updateImoveis(colImoveis.value)
  router.push({ name: 'vcAlado', query: { returnFrom: 'imoveis' } })
}

function voltar() {
  router.push({ name: 'vcAlado', query: { returnFrom: 'imoveis' } }) // params: { id: 0 }
}

async function loadCombos() {
  situacoes.value = [
    { id: 1, nome: 'Trabalhado' },
    { id: 2, nome: 'Pendente' },
  ]

  if (isCadastro.value) {
    let id_mun = store.objetoAlado.id_municipio
    let id_ativ = store.objetoAlado.id_atividade
    const filter = { id_municipio: id_mun, id_atividade: id_ativ }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  }
}

watch(
  () => imovel.id_situacao,
  (id) => {
    const item = situacoes.value.find((a) => a.id === Number(id))
    imovel.fant_sit = item?.nome || ''
  }
)

onMounted(async () => {
  /* if (route.query.returnFrom === 'recipiente') {
    console.log('voltou')
  } else {
    Object.assign(colImoveis, JSON.parse(JSON.stringify(store.objetoVisita.imoveis)))
  }*/

  Object.assign(colImoveis.value, JSON.parse(JSON.stringify(store.objetoAlado.imoveis)))

  isCadastro.value = store.objetoAlado.id_tipo == 1

  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  columns.value = [
    { label: 'Ordem', field: 'ordem' },
    { label: 'Situação', field: 'fant_sit' },
    { label: 'Ações', field: 'acoes' },
  ]

  loadCombos()
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
