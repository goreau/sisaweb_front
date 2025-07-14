<template>
  <section class="section has-text-centered">
    <div class="welcome_image" />
    <p>Você não tem permissão para acessar esta página.</p>
    <router-link to="/home">Voltar para o início</router-link>
  </section>
</template>

<script setup>
// Nada necessário aqui, exceto se quiser lógica adicional
</script>

<style scoped>
.welcome_image {
  background-image: url('../../assets/negado.png');
  height: 200px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
  margin-top: 5rem;
  margin-bottom: 5rem;
}

p {
  padding: 3rem;
}
</style>
