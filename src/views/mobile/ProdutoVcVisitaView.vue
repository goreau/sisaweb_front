<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Correção em Visita a Imóvel</p>
          </header>
          <div class="card-content">
            <fieldset class="fieldset">
              <legend>Campos a alterar</legend>
              <div class="columns">
                <div class="column is-3">
                  <div class="content">
                    <label class="label">Produto Focal</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-mob-im'"
                        v-model:sel="vc_imovel.id_prod_focal"
                        :data="prod_focais"
                        :errclass="{ 'is-danger': v$.id_prod_focal.$error }"
                      />
                      <span class="is-error" v-if="v$.id_prod_focal.$error">
                        {{ v$.id_prod_focal.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="content">
                    <label class="label">Produto Perifocal</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-mob-im'"
                        v-model:sel="vc_imovel.id_prod_peri"
                        :data="prod_peris"
                        :errclass="{ 'is-danger': v$.id_prod_peri.$error }"
                      />
                      <span class="is-error" v-if="v$.id_prod_peri.$error">
                        {{ v$.id_prod_peri.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="content">
                    <label class="label">Produto Nebulização</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-mob-im'"
                        v-model:sel="vc_imovel.id_prod_neb"
                        :data="prod_nebs"
                        :errclass="{ 'is-danger': v$.id_prod_neb.$error }"
                      />
                      <span class="is-error" v-if="v$.id_prod_neb.$error">
                        {{ v$.id_prod_neb.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="content">
                    <label class="label">Produto BRI</label>
                    <div class="control">
                      <CmbGeneric
                        v-enter-to-next="'form-mob-im'"
                        v-model:sel="vc_imovel.id_prod_br"
                        :data="prod_peris"
                        :errclass="{ 'is-danger': v$.id_prod_br.$error }"
                      />
                      <span class="is-error" v-if="v$.id_prod_br.$error">
                        {{ v$.id_prod_br.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-4 is-offset-4">
                  <div class="field">
                    <label class="label">Agente</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-mob-im'"
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_imovel.new_agente"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset class="fieldset">
              <legend>Filtros</legend>
              <div class="columns">
                <div class="column is-6 is-offset-3">
                  <div class="content">
                    <label class="label">Município</label>
                    <div class="control">
                      <CmbTerritorio
                        v-enter-to-next="'form-mob-im'"
                        v-model:sel="vc_imovel.id_municipio"
                        :tipo="99"
                        :errclass="{ 'is-danger': v$.id_municipio.$error }"
                      />
                      <span class="is-error" v-if="v$.id_municipio.$error">
                        {{ v$.id_municipio.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-3 is-offset-3">
                  <div class="field">
                    <label class="label">Início</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-mob-im'"
                        v-model="vc_imovel.dt_inicio"
                        :error="false"
                        placeholder="Escolha a data"
                        :class="{ 'is-danger': v$.dt_inicio.$error }"
                      />
                      <span class="is-error" v-if="v$.dt_inicio.$error">
                        {{ v$.dt_inicio.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Final</label>
                    <div class="control">
                      <DatePicker
                        v-enter-to-next="'form-mob-im'"
                        v-model="vc_imovel.dt_final"
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
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Atividade</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-mob-im'"
                          v-model="vc_imovel.id_atividade"
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
                  <div class="content">
                    <fieldset class="fieldset">
                      <legend>Execução</legend>
                      <div class="field">
                        <RadioGeneric
                          v-enter-to-next="'form-mob-im'"
                          v-model="vc_imovel.id_execucao"
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
                <div class="column is-6 is-offset-3">
                  <div class="field">
                    <label class="label">Agente</label>
                    <div class="control">
                      <input
                        v-enter-to-next="'form-mob-im'"
                        class="input"
                        type="text"
                        placeholder="Executor da visita"
                        v-model="vc_imovel.agente"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <hr />
            <footer class="card-footer">
              <footerCard
                v-enter-to-next="'submit-action'"
                @submit="save"
                :ready="true"
                @cancel="null"
                @aux="null"
                :cFooter="cFooter"
              />
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import vc_folhaService from '@/services/mobile/mobVc_folha.service'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$, maxLength$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useMobileStore } from '@/stores/mobileStore'
import { useDefautValues } from '@/composables/defaultValues'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()

const { defValues } = useDefautValues('defaultValues', {
  prodFocal: 0,
  prodPeri: 0,
  prodNeb: 0,
  prodBr: 0,
})

const { currentUser } = useCurrentUser()
const store = useMobileStore()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])
var situacoes = ref([])
var controles = ref([])
var prod_focais = ref([])
var prod_peris = ref([])
var prod_nebs = ref([])

var imoveis = ref([])

var id_prop = ref(0)

var vc_imovel = reactive({
  id_municipio: 0,
  dt_inicio: '',
  dt_final: '',
  id_atividade: 0,
  id_execucao: 0,
  agente: '',
  id_prod_focal: 0,
  id_prod_peri: 0,
  id_prod_neb: 0,
  id_prod_br: 0,
  new_agente: '',
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Alterar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  dt_inicio: { required$ },
  dt_final: { required$ },
  id_prod_focal: { required$, minValue: combo$(1) },
  id_prod_peri: { required$, minValue: combo$(1) },
  id_prod_neb: { required$, minValue: combo$(1) },
  id_prod_br: { required$, minValue: combo$(1) },
  new_agente: { maxLength: maxLength$(30) },
}

const v$ = useValidate(rules, vc_imovel)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null

    resultado = await vc_folhaService.putProduto(vc_imovel)

    if (resultado.status) {
      vc_imovel.id_vc_imovel = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(vc_imovel.id_mob_vc_imovel) > 0)

async function loadCombos() {
  const result = await auxiliarService.getAtividadeCombo(2)
  if (result.error) {
    console.log(result.error)
    atividades.value = []
  } else {
    atividades.value = result
  }

  const result1 = await auxiliarService.getProdutoCombo(1)
  if (result1.error) {
    console.log(result1.error)
    prod_focais.value = []
  } else {
    prod_focais.value = result1
  }

  const result2 = await auxiliarService.getProdutoCombo(2)
  if (result2.error) {
    console.log(result2.error)
    prod_peris.value = []
  } else {
    prod_peris.value = result2
  }

  const result3 = await auxiliarService.getProdutoCombo(3)
  if (result3.error) {
    console.log(result3.error)
    prod_nebs.value = []
  } else {
    prod_nebs.value = result3
  }

  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]
}

watch(
  () => vc_imovel.id_prod_focal,
  (val) => (defValues.prodFocal = val),
)
watch(
  () => vc_imovel.id_prod_peri,
  (val) => (defValues.prodPeri = val),
)
watch(
  () => vc_imovel.id_prod_neb,
  (val) => (defValues.prodNeb = val),
)
watch(
  () => vc_imovel.id_prod_br,
  (val) => (defValues.prodBr = val),
)

onMounted(async () => {
  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  loadCombos()
})
</script>

<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
