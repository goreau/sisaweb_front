<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-8">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Mobile: Visita a imóveis</p>
          </header>
          <div class="card-content">
            <fieldset class="fieldset">
              <legend>Baixar Sisamob</legend>
              <div class="columns is-centered">
                <figure>
                  <img v-if="qrCode" :src="qrCode" alt="QR Code" class="qrcode" />
                </figure>
              </div>
            </fieldset>
            <br />
            <br />
            <p>
              Aponte a câmera para o QR Code e faça o dowload da versão mais atual do Sisamob ({{
                versao
              }}), ou <a :href="file">use o link</a> se preferir
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import mobGenericService from '@/services/mobile/mobGeneric.service'
import { onMounted, ref } from 'vue'

const qrCode = ref(null)
const file = ref('')
const versao = ref('')

onMounted(async () => {
  let link = {
    link: 'sisamob',
  }
  const result = await mobGenericService.qrCode(link)
  if (result) {
    qrCode.value = result.data
    file.value = result.file
    let partes = file.value.split('/')
    versao.value = partes.pop()
  }
})
</script>

<style scoped>
.qrcode {
  height: 20rem;
}
</style>
