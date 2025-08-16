<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Produto</p>
          </header>
          <div class="card-content">
            <div class="content">
              <label class="label">Tipo de Uso</label>
              <div class="control">
                <CmbGeneric
                  :data="tipos"
                  :sel="produto.tipo_uso"
                  @selGen="produto.tipo_uso = $event"
                />
                <span class="is-error" v-if="v$.tipo_uso.$error">
                  {{ v$.tipo_uso.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Codigo</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Código do Produto"
                  v-model="produto.codigo"
                  :class="{ 'is-danger': v$.codigo.$error }"
                />
                <span class="is-error" v-if="v$.codigo.$error">
                  {{ v$.codigo.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Nome</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Nome comercial"
                  v-model="produto.nome"
                  :class="{ 'is-danger': v$.nome.$error }"
                />
                <span class="is-error" v-if="v$.nome.$error">
                  {{ v$.nome.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Concentração</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="concentração"
                  v-model="produto.concentracao"
                  :class="{ 'is-danger': v$.concentracao.$error }"
                />
                <span class="is-error" v-if="v$.concentracao.$error">
                  {{ v$.concentracao.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Carga</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Valor da carga"
                  v-model="produto.carga"
                  :class="{ 'is-danger': v$.carga.$error }"
                />
                <span class="is-error" v-if="v$.carga.$error">
                  {{ v$.carga.$errors[0].$message }}
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Ordem</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="ordem na lista de produtos"
                  v-model="produto.ordem"
                  :class="{ 'is-danger': v$.ordem.$error }"
                />
                <span class="is-error" v-if="v$.ordem.$error">
                  {{ v$.ordem.$errors[0].$message }}
                </span>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <footerCard @submit="save" @cancel="null" @aux="details" :cFooter="cFooter" />
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/general/MyLoader.vue'
import footerCard from '@/components/general/FooterCard.vue'
import produtoService from '@/services/cadastro/produto.service'
import useValidate from '@vuelidate/core'
import CmbGeneric from '@/components/forms/CmbGeneric.vue'
import { required$, combo$ } from '@/components/forms/validators'
import { ref, onMounted, reactive, computed } from 'vue'
import { useCurrentUser } from '@/composables/currentUser'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const route = useRoute()
const { currentUser } = useCurrentUser()

var id_prop = ref(0)

const tipos = ref([])

const produto = reactive({
  id_produto: 0,
  tipo_uso: 0,
  codigo: '',
  nome: '',
  concentracao: '',
  carga: '',
  ordem: '',
})

var isLoading = ref(false)

var cFooter = ref({
  strSubmit: 'Salvar',
  strCancel: 'Cancelar',
  strAux: '',
  aux: false,
})

const rules = {
  codigo: { required$ },
  nome: { required$ },
  tipo_uso: { required$, minValue: combo$(1) },
  concentracao: { required$ },
  carga: { required$ },
  ordem: { required$ },
}

const v$ = useValidate(rules, produto)

async function save() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    var resultado = null
    var msg = ''
    if (isEditMode.value) {
      resultado = await produtoService.update(produto)
      msg = 'Produto alterado com sucesso!'
    } else {
      resultado = await produtoService.create(produto)
      msg = 'Produto inserido com sucesso!'
    }

    if (resultado.error) {
      toast.error(resultado.msg)
    } else {
      toast.success(msg)
    }
  } else {
    toast.warning('Corrija os erros para enviar as informações')
  }
}

const isEditMode = computed(() => Number(route.params.id) > 0)

onMounted(async () => {
  if (isEditMode.value) {
    const result = await produtoService.getProduto(route.params.id)
    if (result.error) {
      toast.error(result.msg)
    } else {
      Object.assign(produto, result)
    }
  } else {
    produto.id_produto = 0
  }

  tipos.value = [
    { id: 1, nome: 'Focal' },
    { id: 2, nome: 'Perifocal/BR' },
    { id: 3, nome: 'Nebulização' },
    { id: 4, nome: 'Inativo' },
  ]

  let cUser = currentUser
  if (cUser.value) {
    id_prop.value = cUser.value.id
  }
})
</script>


<style scoped>
.radio {
  display: block;
  margin-left: 0.5em !important;
}
</style>
