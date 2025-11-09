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
                <div class="column is-3">
                  <div class="content">
                    <label class="label">Ordem</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-bri'"
                        class="input"
                        type="text"
                        placeholder="N° de Ordem"
                        v-model="imovel.ordem"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="content">
                    <label class="label">Casa</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-bri'"
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
                          v-enter-to-next="'form-bri'"
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
              <legend>Intra</legend>
              <fieldset class="fieldset">
                <legend>Cômodos</legend>
                <div class="columns">
                  <div class="column">
                    <div class="content">
                      <div class="field">
                        <label class="label">Existentes</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-bri'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.it_com_exist"
                          />
                          <span class="is-error" v-if="v$.it_com_exist.$error">
                            {{ v$.it_com_exist.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="content">
                      <div class="field">
                        <label class="label">Tratados</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-bri'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.it_com_trat"
                          />
                          <span class="is-error" v-if="v$.it_com_trat.$error">
                            {{ v$.it_com_trat.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="content">
                      <div class="field">
                        <label class="label">Acabamento</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-bri'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.it_com_nt_acab"
                          />
                          <span class="is-error" v-if="v$.it_com_nt_acab.$error">
                            {{ v$.it_com_nt_acab.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="content">
                      <div class="field">
                        <label class="label">Recusa</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-bri'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.it_com_nt_rec"
                          />
                          <span class="is-error" v-if="v$.it_com_nt_rec.$error">
                            {{ v$.it_com_nt_rec.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="content">
                      <div class="field">
                        <label class="label">Outros</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-bri'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="imovel.it_com_nt_ot"
                          />
                          <span class="is-error" v-if="v$.it_com_nt_ot.$error">
                            {{ v$.it_com_nt_ot.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <div class="columns">
                <div class="column">
                  <fieldset class="fieldset">
                    <legend>Paredes</legend>
                    <div class="columns">
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Existentes</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.it_paredes_exist"
                              />
                              <span class="is-error" v-if="v$.it_paredes_exist.$error">
                                {{ v$.it_paredes_exist.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Amostra</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.it_paredes_trat"
                              />
                              <span class="is-error" v-if="v$.it_paredes_trat.$error">
                                {{ v$.it_paredes_trat.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div class="column">
                  <fieldset class="fieldset">
                    <legend>Hotspots</legend>
                    <div class="columns">
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Existentes</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.it_hot_exist"
                              />
                              <span class="is-error" v-if="v$.it_hot_exist.$error">
                                {{ v$.it_hot_exist.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Tratados</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.it_hot_trat"
                              />
                              <span class="is-error" v-if="v$.it_hot_trat.$error">
                                {{ v$.it_hot_trat.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Peri</legend>
              <div class="columns">
                <div class="column">
                  <fieldset class="fieldset">
                    <legend>Cômodos</legend>
                    <div class="columns">
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Existentes</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.pr_exist"
                              />
                              <span class="is-error" v-if="v$.pr_exist.$error">
                                {{ v$.pr_exist.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Tratados</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.pr_trat"
                              />
                              <span class="is-error" v-if="v$.pr_trat.$error">
                                {{ v$.pr_trat.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div class="column">
                  <fieldset class="fieldset">
                    <legend>Paredes</legend>
                    <div class="columns">
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Existentes</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.pr_paredes_exist"
                              />
                              <span class="is-error" v-if="v$.pr_paredes_exist.$error">
                                {{ v$.pr_paredes_exist.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Tratados</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.pr_paredes_trat"
                              />
                              <span class="is-error" v-if="v$.pr_paredes_trat.$error">
                                {{ v$.pr_paredes_trat.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div class="column">
                  <fieldset class="fieldset">
                    <legend>Hotspots</legend>
                    <div class="columns">
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Existentes</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.pr_hot_exist"
                              />
                              <span class="is-error" v-if="v$.pr_hot_exist.$error">
                                {{ v$.pr_hot_exist.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="content">
                          <div class="field">
                            <label class="label">Tratados</label>
                            <div class="control">
                              <input
                                v-enter-to-next="'form-bri'"
                                class="input"
                                type="text"
                                placeholder="Opcional"
                                v-model="imovel.pr_hot_trat"
                              />
                              <span class="is-error" v-if="v$.pr_hot_trat.$error">
                                {{ v$.pr_hot_trat.$errors[0].$message }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </fieldset>
            <hr />
            <fieldset class="fieldset">
              <legend>Produto</legend>
              <div class="columns">
                <div class="column">
                  <div class="content">
                    <div class="field">
                      <label class="label">Cargas</label>
                      <div class="control">
                        <input
                          v-enter-to-next="'form-bri'"
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.cargas"
                        />
                        <span class="is-error" v-if="v$.cargas.$error">
                          {{ v$.cargas.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="content">
                    <div class="field">
                      <label class="label">Peso Inicial</label>
                      <div class="control">
                        <input
                          v-enter-to-next="'form-bri'"
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peso_ini"
                        />
                        <span class="is-error" v-if="v$.peso_ini.$error">
                          {{ v$.peso_ini.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="content">
                    <div class="field">
                      <label class="label">Peso Final</label>
                      <div class="control">
                        <input
                          v-enter-to-next="'form-bri'"
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="imovel.peso_fim"
                        />
                        <span class="is-error" v-if="v$.peso_fim.$error">
                          {{ v$.peso_fim.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <section v-if="colImoveis.length > 0">
              <p class="divisor">Imóveis</p>
              <MyDataTable
                :data="colImoveis"
                :columns="columns"
                :pagination="false"
                @edit="onEditRow"
                @delete="onDeleteRow"
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
              v-enter-to-next="'submit-action'"
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
import useValidate from '@vuelidate/core'
import {
  required$,
  combo$,
  numeric$,
  maxLength$,
  decimal$,
  requiredIf$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useVcBriStore } from '@/stores/vcBriStore'
import { useRouter } from 'vue-router'
//import { useToast } from 'vue-toastification'
import { generateId } from '@/utils/myUtils'

//const toast = useToast()
//const route = useRoute()
const router = useRouter()

const { currentUser } = useCurrentUser()
const store = useVcBriStore()

var colImoveis = ref([])
const columns = ref([])

var id_prop = ref(0)
const isCadastro = ref(false)

const situacoes = ref([])

//id_bri_det, id_bri,
var imovel = reactive({
  id: 0,
  ordem: 1,
  casa: '',
  id_imovel: 0,
  id_situacao: 0,
  it_com_exist: 0,
  it_com_trat: 0,
  it_com_nt_acab: 0,
  it_com_nt_rec: 0,
  it_com_nt_ot: 0,
  it_larva: 0,
  it_paredes_exist: 0,
  it_paredes_trat: 0,
  it_hot_exist: 0,
  it_hot_trat: 0,
  pr_exist: 0,
  pr_trat: 0,
  pr_paredes_exist: 0,
  pr_paredes_trat: 0,
  pr_hot_exist: 0,
  pr_hot_trat: 0,
  cargas: 0,
  peso_ini: 0,
  peso_fim: 0,
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
  it_com_exist: { required$, numeric$ },
  it_com_trat: { required$, numeric$ },
  it_com_nt_acab: { required$, numeric$ },
  it_com_nt_rec: { required$, numeric$ },
  it_com_nt_ot: { required$, numeric$ },
  it_larva: { required$, numeric$ },
  it_paredes_exist: { required$, numeric$ },
  it_paredes_trat: { required$, numeric$ },
  it_hot_exist: { required$, numeric$ },
  it_hot_trat: { required$, numeric$ },
  pr_exist: { required$, numeric$ },
  pr_trat: { required$, numeric$ },
  pr_paredes_exist: { required$, numeric$ },
  pr_paredes_trat: { required$, numeric$ },
  pr_hot_exist: { required$, numeric$ },
  pr_hot_trat: { required$, numeric$ },
  cargas: { required$, numeric$ },
  peso_ini: { required$, decimal$ },
  peso_fim: { required$, decimal$ },
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
    it_com_exist: 0,
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
  router.push({ name: 'vcBri', query: { returnFrom: 'imoveis' } })
}

function voltar() {
  router.push({ name: 'vcBri', query: { returnFrom: 'imoveis' } }) // params: { id: 0 }
}

async function loadCombos() {
  situacoes.value = [
    { id: 1, nome: 'Trabalhado' },
    { id: 2, nome: 'Fechado' },
    { id: 3, nome: 'Recusa' },
    { id: 4, nome: 'Desocupado' },
  ]
}

watch(
  () => imovel.id_situacao,
  (id) => {
    const item = situacoes.value.find((a) => a.id === Number(id))
    imovel.fant_sit = item?.nome || ''
  },
)

onMounted(async () => {
  /* if (route.query.returnFrom === 'recipiente') {
    console.log('voltou')
  } else {
    Object.assign(colImoveis, JSON.parse(JSON.stringify(store.objetoVisita.imoveis)))
  }*/

  Object.assign(colImoveis.value, JSON.parse(JSON.stringify(store.objetoBri.imoveis)))

  isCadastro.value = store.objetoBri.id_tipo == 1

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
