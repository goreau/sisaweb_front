<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-11">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Captura de Alados</p>
          </header>
          <div class="card-content">
            <div class="columns">
              <div class="column is-4">
                <div class="content">
                  <label class="label">Município</label>
                  <div class="control">
                    <CmbTerritorio
                      v-enter-to-next="'form-mob-alado'"
                      v-model:sel="alado.id_municipio"
                      :tipo="99"
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
                      v-enter-to-next="'form-mob-alado'"
                      v-model="alado.dt_cadastro"
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
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Tipo</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-mob-alado'"
                        v-model="alado.ref_ativ"
                        :options="tipos"
                        name="ref_ativ"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
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
                        v-enter-to-next="'form-mob-alado'"
                        v-model="alado.id_atividade"
                        :options="atividades"
                        name="id_ativiidade"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
              <div class="column is-6">
                <div class="content">
                  <fieldset class="fieldset">
                    <legend>Execução</legend>
                    <div class="field">
                      <RadioGeneric
                        v-enter-to-next="'form-mob-alado'"
                        v-model="alado.id_execucao"
                        :options="execucoes"
                        name="id_execucao"
                        :inline="true"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <section v-if="alado.ref_ativ == 9">
              <fieldset class="fieldset">
                <legend>Local</legend>
                <div class="columns">
                  <div class="column is-4">
                    <div class="content">
                      <label class="label">Área</label>
                      <div class="control">
                        <CmbGeneric
                          v-enter-to-next="'form-mob-alado'"
                          v-model:sel="alado.id_area"
                          :data="areas"
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
                          v-enter-to-next="'form-mob-alado'"
                          v-model:sel="alado.id_censitario"
                          :data="censitarios"
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
                          v-enter-to-next="'form-mob-alado'"
                          v-model:sel="alado.id_quarteirao"
                          :data="quarteiraos"
                          :errclass="{ 'is-danger': v$.id_quarteirao.$error }"
                        />
                        <span class="is-error" v-if="v$.id_quarteirao.$error">
                          {{ v$.id_quarteirao.$errors[0].$message }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </section>
            <section>
              <fieldset class="fieldset">
                <legend>Identificação</legend>
                <div class="columns">
                  <div class="column is-6" v-if="isCadastro">
                    <div class="content">
                      <label class="label">Imóvel</label>
                      <div class="control">
                        <CmbGeneric
                          v-enter-to-next="'form-mob-alado'"
                          v-model:sel="alado.id_imovel"
                          :data="imoveis"
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
                          v-enter-to-next="'form-mob-alado'"
                          class="input"
                          type="text"
                          placeholder="N° de Ordem"
                          v-model="alado.ordem"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column is-3" v-if="!isCadastro">
                    <div class="content">
                      <label class="label">Casa</label>
                      <div class="control">
                        <input
                          v-enter-to-next="'form-mob-alado'"
                          class="input"
                          type="text"
                          placeholder="N° do Imóvel"
                          v-model="alado.casa"
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
                            v-enter-to-next="'form-mob-alado'"
                            v-model="alado.id_situacao"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="time"
                            placeholder="Opcional"
                            v-model="alado.hora"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.umidade"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.temperatura"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.moradores"
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
                <div class="columns is-centered">
                  <div class="column is-4 is-offset-4 colTit has-text-centered">
                    <label class="label">Larvas</label>
                  </div>
                  <div class="column is-4 colTit has-text-centered">
                    <label class="label">Pupas</label>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-2">
                    <div class="content">
                      <div class="field">
                        <label class="label">Com larvas</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.rec_larva"
                          />
                          <span class="is-error" v-if="v$.rec_larva.$error">
                            {{ v$.rec_larva.$errors[0].$message }}
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.am_larva"
                          />
                          <span class="is-error" v-if="v$.am_larva.$error">
                            {{ v$.am_larva.$errors[0].$message }}
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.aegypti"
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
                        <label class="label"><i>Ae albopictus </i></label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.albopictus"
                          />
                          <span class="is-error" v-if="v$.albopictus.$error">
                            {{ v$.albopictus.$errors[0].$message }}
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.pupa_aegypti"
                          />
                          <span class="is-error" v-if="v$.pupa_aegypti.$error">
                            {{ v$.pupa_aegypti.$errors[0].$message }}
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.pupa_albopictus"
                          />
                          <span class="is-error" v-if="v$.pupa_albopictus.$error">
                            {{ v$.pupa_albopictus.$errors[0].$message }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset class="fieldset">
                <legend>Intra</legend>
                <div class="columns is-centered">
                  <div class="column is-4 is-offset-2 colTit has-text-centered">
                    <label class="label">Ae. aegypti</label>
                  </div>
                  <div class="column is-4 colTit has-text-centered">
                    <label class="label">Ae. albopictus</label>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-2 is-offset-1">
                    <div class="content">
                      <div class="field">
                        <label class="label">Amostra</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.am_intra"
                          />
                          <span class="is-error" v-if="v$.am_intra.$error">
                            {{ v$.am_intra.$errors[0].$message }}
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.intra_aeg_macho"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.intra_aeg_femea"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.intra_alb_macho"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.intra_alb_femea"
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
                <div class="columns is-centered">
                  <div class="column is-4 is-offset-2 colTit has-text-centered">
                    <label class="label">Ae. aegypti</label>
                  </div>
                  <div class="column is-4 colTit has-text-centered">
                    <label class="label">Ae. albopictus</label>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-2 is-offset-1">
                    <div class="content">
                      <div class="field">
                        <label class="label">Amostra</label>
                        <div class="control">
                          <input
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.am_peri"
                          />
                          <span class="is-error" v-if="v$.am_peri.$error">
                            {{ v$.am_peri.$errors[0].$message }}
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.peri_aeg_macho"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.peri_aeg_femea"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.peri_alb_macho"
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
                            v-enter-to-next="'form-mob-alado'"
                            class="input"
                            type="text"
                            placeholder="Opcional"
                            v-model="alado.peri_alb_femea"
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
            </section>
            <div class="columns">
              <div class="column is-4 is-offset-4">
                <div class="field">
                  <label class="label">Agente</label>
                  <div class="control">
                    <input
                      v-enter-to-next="'form-mob-alado'"
                      class="input"
                      type="text"
                      placeholder="Executor da visita"
                      v-model="alado.agente"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {{ isCadastro }}
          <footer class="card-footer">
            <footerCard
              v-enter-to-next="'submit-action'"
              @submit="save"
              :ready="readyToGo"
              @cancel="null"
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
import aladoService from '@/services/mobile/mobAlado.service'
import auxiliarService from '@/services/general/auxiliar.service'
import RadioGeneric from '@/components/forms/RadioGeneric.vue'
import useValidate from '@vuelidate/core'
import CmbTerritorio from '@/components/forms/CmbTerritorio.vue'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import DatePicker from '@/components/forms/MyDatePicker.vue'
import {
  required$,
  combo$,
  maxLength$,
  requiredIf$,
  numeric$,
  horaValida$,
  decimal$,
  minValueIf$,
} from '@/components/forms/validators'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import imovelService from '@/services/cadastro/imovel.service'
import cadastroEdlService from '@/services/cadastro/edlCadastro.service'
import areaService from '@/services/cadastro/area.service'
import censitarioService from '@/services/cadastro/censitario.service'
import quarteiraoService from '@/services/cadastro/quarteirao.service'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
//const router = useRouter()//useRouter

const { currentUser } = useCurrentUser()

const atividades = ref([])
var execucoes = ref([])
var tipos = ref([])
var situacoes = ref([])
var controles = ref([])

var imoveis = ref([])
var areas = ref([])
var censitarios = ref([])
var quarteiraos = ref([])

var id_prop = ref(0)
const isCadastro = ref(false)

var readyToGo = ref(false)

var alado = reactive({
  id_mob_alado: 0,
  id_municipio: 0,
  dt_cadastro: '',
  id_atividade: 0,
  id_execucao: 0,
  ref_ativ: 0,
  id_area: 0,
  id_censitario: 0,
  id_quarteirao: 0,
  agente: '',
  ordem: 1,
  casa: '',
  id_imovel: 0,
  id_situacao: 0,
  hora: '',
  umidade: 0,
  temperatura: 0,
  moradores: 0,
  rec_larva: 0,
  am_larva: '',
  aegypti: 0,
  albopictus: 0,
  pupa_aegypti: 0,
  pupa_albopictus: 0,
  am_intra: '',
  intra_aeg_macho: 0,
  intra_aeg_femea: 0,
  intra_alb_macho: 0,
  intra_alb_femea: 0,
  am_peri: '',
  peri_aeg_macho: 0,
  peri_aeg_femea: 0,
  peri_alb_macho: 0,
  peri_alb_femea: 0,
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
  dt_cadastro: { required$ },
  id_situacao: { required$, minValue: combo$(1) },
  ref_ativ: { required$, minValue: combo$(1) },
  id_execucao: { required$, minValue: combo$(1) },
  id_atividade: { required$, minValue: combo$(1) },
  id_area: { minValueIf: minValueIf$(1, () => !isCadastro.value) },
  id_censitario: { minValueIf: minValueIf$(1, () => !isCadastro.value) },
  id_quarteirao: { minValueIf: minValueIf$(1, () => !isCadastro.value) },
  agente: { required$ },
  ordem: { requiredIf: requiredIf$(!isCadastro.value), numeric$ },
  casa: { maxLength: maxLength$(40) },
  id_imovel: { requiredIf: requiredIf$(isCadastro.value) },
  hora: { horaValida$ },
  moradores: { numeric$ },
  umidade: { decimal$ },
  temperatura: { decimal$ },
  rec_larva: { numeric$ },
  am_larva: { numeric$ },
  aegypti: { numeric$ },
  albopictus: { numeric$ },
  pupa_aegypti: { numeric$ },
  pupa_albopictus: { numeric$ },
  am_intra: { numeric$ },
  intra_aeg_macho: { numeric$ },
  intra_aeg_femea: { numeric$ },
  intra_alb_macho: { numeric$ },
  intra_alb_femea: { numeric$ },
  am_peri: { numeric$ },
  peri_aeg_macho: { numeric$ },
  peri_aeg_femea: { numeric$ },
  peri_alb_macho: { numeric$ },
  peri_alb_femea: { numeric$ },
}

const v$ = useValidate(rules, alado)

function canSend() {
  readyToGo.value = true
}

/*const readyToGo = true  computed(() => {
  return Array.isArray(store.objetoVisita?.filhos) && store.objetoVisita.filhos.length > 0
})*/

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    if (isEditMode.value) {
      resultado = await aladoService.update(alado)
    }

    if (resultado.status) {
      alado.id_alado = resultado.master
      toast.success(resultado.msg)
    } else {
      toast.error(resultado.error.msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

watch(
  () => alado.ref_ativ,
  async (val) => {
    let at = val == 10 ? 1 : 4
    const result = await auxiliarService.getAtividadeCombo(at)
    if (result.error) {
      atividades.value = []
    } else {
      atividades.value = result
      if (at == 1) {
        const result1 = await auxiliarService.getAtividadeCombo(9)
        atividades.value = [...atividades.value, ...result1]
      }
    }
  },
)

watch(
  () => alado.id_atividade,
  async (val) => {
    if (alado.id_municipio == 0) return
    const filter = { id_municipio: alado.id_municipio, id_atividade: val }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  },
)

watch(
  () => alado.id_municipio,
  async (val) => {
    if (alado.id_atividade == 0) return
    const filter = { id_municipio: alado.id_municipio, id_atividade: val }
    const result = await imovelService.getCombo(JSON.stringify(filter))
    if (result.error) {
      console.log(result.error)
      imoveis.value = []
    } else {
      imoveis.value = result
    }
  },
)

watch(
  () => alado.id_area,
  async (val) => {
    const result = await censitarioService.getCombo(JSON.stringify({ id_area: val }))
    if (result.error) {
      console.log(result.error)
      censitarios.value = []
    } else {
      censitarios.value = result
    }
  },
)

watch(
  () => alado.id_censitario,
  async (val) => {
    const result = await quarteiraoService.getCombo(JSON.stringify({ id_censitario: val }))
    if (result.error) {
      console.log(result.error)
      quarteiraos.value = []
    } else {
      quarteiraos.value = result
    }
  },
)

const isEditMode = computed(() => Number(alado.id_mob_alado) > 0)

async function loadCombos() {
  execucoes.value = [
    { id: 1, nome: 'Estado' },
    { id: 2, nome: 'Município' },
    { id: 3, nome: 'ACS' },
  ]

  tipos.value = [
    { id: 10, nome: 'Imóveis Cadastrados' },
    { id: 9, nome: 'Outras Atividades' },
  ]

  situacoes.value = [
    { id: 1, nome: 'Trabalhado' },
    { id: 2, nome: 'Fechado' },
    { id: 3, nome: 'Desocupado' },
    { id: 4, nome: 'Temporada' },
    { id: 5, nome: 'Parcial' },
    { id: 6, nome: 'Recusa' },
  ]

  controles.value = [
    { id: 1, nome: 'Mecânico' },
    { id: 2, nome: 'Alternativo' },
  ]
}

onMounted(async () => {
  canSend()
  const ret = await aladoService.getMobAlado(route.params.id)
  if (ret.error) {
    toast.error(ret.msg)
  } else {
    isCadastro.value = ret.ref_ativ == 10
    ret.hora = ret.hora.slice(0, 5)
    ret.id_municipio = Number(ret.id_municipio)
    Object.assign(alado, ret)
  }

  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }

  if (isCadastro.value) {
    const filter = { id_municipio: alado.id_municipio, id_atividade: alado.id_atividade }

    if (alado.id_atividade == 16) {
      const result = await cadastroEdlService.getCombo(JSON.stringify(filter))
      if (result.error) {
        console.log(result.error)
        imoveis.value = []
      } else {
        imoveis.value = result
      }
    } else {
      const result = await imovelService.getCombo(JSON.stringify(filter))
      if (result.error) {
        console.log(result.error)
        imoveis.value = []
      } else {
        imoveis.value = result
      }
    }
  } else {
    const result = await areaService.getCombo(JSON.stringify({ id_municipio: alado.id_municipio }))
    if (result.error) {
      console.log(result.error)
      areas.value = []
    } else {
      areas.value = result
    }
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
