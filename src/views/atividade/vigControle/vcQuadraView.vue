<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Cadastro de Visita a Imóveis - Quadra</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      :tipo="99"
                      :sel="vc_linha.id_municipio"
                      @selTerr="vc_linha.id_municipio = $event"
                      :errclass="{ 'is-danger': v$.id_municipio.$error }"
                    />
                    <span class="is-error" v-if="v$.id_municipio.$error">
                      {{ v$.id_municipio.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="column is-2">
                <div class="field">
                  <label class="label">Data</label>
                  <div class="control">
                    <DatePicker
                      v-model="vc_linha.dt_cadastro"
                      :error="false"
                      placeholder="Escolha a data"
                      :class="{ 'is-danger': v$.dt_cadastro.$error }"
                    />
                    <span class="is-error" v-if="v$.dt_cadastro.$error">
                      {{ v$.dt_cadastro.$errors[0].$message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Atividade</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_linha.id_atividade"
                        :options="atividades"
                        name="id_atividade"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column is-3">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_linha.id_execucao"
                        :options="execucoes"
                        name="id_execucao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tpo de Trabalho</legend>
                    <div class="field">
                      <RadioGeneric
                        v-model="vc_linha.id_tipo"
                        :options="tipos"
                        name="id_tipo"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <section v-show="!navs">
              <div class="columns">
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_area"
                        :data="areas"
                        @selGen="vc_linha.id_area = $event"
                        :errclass="{ 'is-danger': v$.id_area.$error }"
                      />
                      <span class="is-error" v-if="v$.id_area.$error">
                        {{ v$.id_area.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Censitário</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_censitario"
                        :data="censitarios"
                        @selGen="vc_linha.id_censitario = $event"
                        :errclass="{ 'is-danger': v$.id_censitario.$error }"
                      />
                      <span class="is-error" v-if="v$.id_censitario.$error">
                        {{ v$.id_censitario.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Quarteirão</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_quarteirao"
                        :data="quarteiraos"
                        @selGen="vc_linha.id_quarteirao = $event"
                        :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                      />
                      <span class="is-error" v-if="v$.id_quarteirao.$error">
                        {{ v$.id_quarteirao.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section v-show="navs">
              <div class="columns">
                <div class="column is-6">
                  <div class="content">
                    <label class="label">Área</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_area_nav"
                        :data="areas_nav"
                        @selGen="vc_linha.id_area_nav = $event"
                        :errclass="{ 'is-danger': v$.id_area_nav.$error }"
                      />
                      <span class="is-error" v-if="v$.id_area_nav.$error">
                        {{ v$.id_area_nav.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="column is-4">
                  <div class="content">
                    <label class="label">Quarteirão</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="vc_linha.id_quarteirao"
                        :data="quarteiraos"
                        @selGen="vc_linha.id_quarteirao = $event"
                        :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                      />
                      <span class="is-error" v-if="v$.id_quarteirao.$error">
                        {{ v$.id_quarteirao.$errors[0].$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <hr />
            <fieldset class="fieldset">
              <legend>Total de imóveis por situação</legend>
              <div class="columns">
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Trabalhados</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.trab"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Fechados</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.fech"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Desabitados</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.desab"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Temporada</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.temp"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Parcial</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.parc"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Recusa</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.rec"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Tratamentos</legend>
              <div class="columns">
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Mecânico</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.mecanico"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Alternativo</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.alternativo"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Focal</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.focal"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Perifocal</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.perifocal"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Nebulização</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.nebulizacao"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">BR Aedes</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        placeholder="Opcional"
                        v-model="vc_linha.br_aedes"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>Recipiente Predominante</legend>
              <div class="columns">
                <div class="column is-4">
                  <div class="content">
                    <label class="label">Grupo</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="recipiente.id_grupo_rec"
                        :data="grupos_rec"
                        @selGen="recipiente.id_grupo_rec = $event"
                      />
                    </div>
                  </div>
                </div>
                <div class="column is-8">
                  <div class="content">
                    <label class="label">Tipo</label>
                    <div class="control">
                      <CmbGeneric
                        :sel="recipiente.id_tipo_rec"
                        :data="tipos_rec"
                        @selGen="recipiente.id_tipo_rec = $event"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="columns">
                  <div class="column is-2">
                    <div class="field">
                      <label class="label">Existentes</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.existente"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-2">
                    <div class="field">
                      <label class="label">Com Água</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.agua"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-2">
                    <div class="field">
                      <label class="label">Com Larvas</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.larva"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-2">
                    <div class="field">
                      <label class="label">Amostra</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.amostra"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-2">
                    <div class="field">
                      <label class="label">Examinadas</label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.examinadas"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-1">
                    <div class="field">
                      <label class="label"><i>Ae aeg</i></label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.aegypti"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-1">
                    <div class="field">
                      <label class="label"><i>Ae alb</i></label>
                      <div class="control">
                        <input
                          class="input"
                          type="text"
                          placeholder="Opcional"
                          v-model="recipiente.albopictus"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="columns">
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>Tratamento Focal</legend>
                  <div class="columns">
                    <div class="column is-7">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_focal"
                            :data="prod_focais"
                            @selGen="vc_linha.id_prod_focal = $event"
                            :errclass="{ 'is-danger': v$.id_prod_focal.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_focal.$error">
                            {{ v$.id_prod_focal.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-5">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_focal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>Tratamento Perifocal</legend>
                  <div class="columns">
                    <div class="column is-7">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_peri"
                            :data="prod_peris"
                            @selGen="vc_linha.id_prod_peri = $event"
                            :errclass="{ 'is-danger': v$.id_prod_peri.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_peri.$error">
                            {{ v$.id_prod_peri.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-5">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_peri"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>Nebulização</legend>
                  <div class="columns">
                    <div class="column is-7">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_neb"
                            :data="prod_nebs"
                            @selGen="vc_linha.id_prod_neb = $event"
                            :errclass="{ 'is-danger': v$.id_prod_neb.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_neb.$error">
                            {{ v$.id_prod_neb.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-5">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_neb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="column is-3">
                <fieldset class="fieldset">
                  <legend>BR Aedes</legend>
                  <div class="columns">
                    <div class="column is-7">
                      <div class="content">
                        <label class="label">Produto</label>
                        <div class="control">
                          <CmbGeneric
                            :sel="vc_linha.id_prod_br"
                            :data="prod_peris"
                            @selGen="vc_linha.id_prod_br = $event"
                            :errclass="{ 'is-danger': v$.id_prod_br.$error }"
                          />
                          <span class="is-error" v-if="v$.id_prod_br.$error">
                            {{ v$.id_prod_br.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-5">
                      <div class="field">
                        <label class="label">Consumo</label>
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="vc_linha.qt_br"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div class="columns">
              <div class="column is-4 is-offset-4">
                <div class="field">
                  <label class="label">Agente</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Executor da visita"
                      v-model="vc_linha.agente"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {{ navs }}
          <footer class="card-footer">
            <footerCard @submit="save" @cancel="null" @aux="null" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import vc_linhaService from '@/services/atividade/vc_linha.service'
import auxiliarService from '@/services/general/auxiliar.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import areaNavService from '@/services/cadastro/areaNav.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import { required$, combo$, numeric$, requiredIf$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useToast } from 'vue-toastification'

const toast = useToast()

const { currentUser } = useCurrentUser()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])
var prod_focais = ref([])
var prod_peris = ref([])
var prod_nebs = ref([])
var grupos_rec = ref([])
var tipos_rec = ref([])

var id_prop = ref(0)

var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var areas_nav = ref([])
var navs = ref(false)

var vc_linha = reactive({
  id_municipio: 0,
  dt_cadastro: '',
  id_atividade: 0,
  id_execucao: 0,
  id_area_nav: 0,
  id_quarteirao: 0,
  id_tipo: 0,
  trab: 0,
  fech: 0,
  temp: 0,
  rec: 0,
  desab: 0,
  parcial: 0,
  mecanico: 0,
  alternativo: 0,
  focal: 0,
  perifocal: 0,
  nebulizacao: 0,
  br_aedes: 0,
  id_prod_focal: 0,
  qt_focal: 0,
  id_prod_peri: 0,
  qt_peri: 0,
  id_prod_neb: 0,
  qt_neb: 0,
  id_prod_br: 0,
  qt_br: 0,
  agente: '',
})

var recipiente = reactive({
  id_grupo_rec: 0,
  id_tipo_rec: 0,
  existente: 0,
  agua: 0,
  larva: 0,
  amostra: '',
  examinadas: 0,
  aegypti: 0,
  albopictus: 0,
})

var isLoading = false

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  id_municipio: { required$, minValue: combo$(1) },
  id_area_nav: { requiredIf: requiredIf$(() => navs.value === true) },
  id_area: { requiredIf: requiredIf$(() => navs.value === false) },
  id_censitario: { requiredIf: requiredIf$(() => navs.value === false) },
  id_quarteirao: { required$, minValue: combo$(1) },
  dt_cadastro: { required$ },
  id_tipo: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_prod_focal: { required$ },
  id_prod_peri: { required$ },
  id_prod_neb: { required$ },
  id_prod_br: { required$ },
  trab: { numeric$ },
  fech: { numeric$ },
  rec: { numeric$ },
  parc: { numeric$ },
  temp: { numeric$ },
  desab: { numeric$ },
  mecanico: { numeric$ },
  alternativo: { numeric$ },
  focal: { numeric$ },
  perifocal: { numeric$ },
  nebulizacao: { numeric$ },
  br_aedes: { numeric$ },
  existente: { numeric$ },
  agua: { numeric$ },
  larva: { numeric$ },
  examinadas: { numeric$ },
  aegypti: { numeric$ },
  albopictus: { numeric$ },
  agente: { required$ },
}

const v$ = useValidate(rules, vc_linha)

const filtro = computed(() => [vc_linha.id_atividade, vc_linha.id_municipio])

watch(filtro, async ([novo1, novo2]) => {
  if (novo1 && novo2) {
    if (novo1 == 6 || novo1 == 7) {
      navs.value = true
      const resultado = await areaNavService.getCombo(JSON.stringify({ id_municipio: novo2 }))
      if (resultado.error) {
        areas_nav.value = []
      } else {
        areas_nav.value = await resultado
      }
    } else {
      navs.value = false
    }
  } else if (novo1) {
    navs.value = novo1 == 6 || novo1 == 7
  } else {
    areas_nav.value = []
  }
})

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    vc_linha.recipiente = recipiente
    const resultado = await vc_linhaService.createFolha(vc_linha)

    if (resultado.status) {
      vc_linha.id_vc_linha = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

async function loadCombos() {
  const resultr = await auxiliarService.getGrupoRecCombo()
  if (resultr.error) {
    console.log(resultr.error)
    grupos_rec.value = []
  } else {
    grupos_rec.value = resultr
  }

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

  tipos.value = [
    { id: 1, nome: 'Rotina' },
    { id: 2, nome: 'Pendência' },
    { id: 3, nome: 'Demanda' },
  ]
}

watch(
  () => recipiente.id_grupo_rec,
  async (id) => {
    const result = await auxiliarService.getTipoRecCombo(id)
    if (result.error) {
      console.log(result.error)
      tipos_rec.value = []
    } else {
      tipos_rec.value = result
    }
  }
)

watch(
  () => vc_linha.id_municipio,
  async (val) => {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: val }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
  }
)

watch(
  () => vc_linha.id_area,
  async (val) => {
    const result = await censitarioService.getCombo(JSON.stringify({ id_area: val }))
    if (result.error) {
      console.log(result.error)
      censitarios.value = []
    } else {
      censitarios.value = result
    }
  }
)

watch(
  () => vc_linha.id_censitario,
  async (val) => {
    const result = await quarteiraoService.getCombo(JSON.stringify({ id_censitario: val }))
    if (result.error) {
      console.log(result.error)
      quarteiraos.value = []
    } else {
      quarteiraos.value = result
    }
  }
)

watch(
  () => vc_linha.id_area_nav,
  async (val) => {
    const result = await areaNavService.getComboQuart(val)
    if (result.error) {
      console.log(result.error)
      quarteiraos.value = []
    } else {
      quarteiraos.value = result
    }
  }
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
