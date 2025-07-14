<template>
  <div class="conteudo">
    <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <div class="tile is-6">
          <nav>
            <router-link to="/home" id="logo_url">
              <img src="@/assets/aedes.png" alt="img" id="logo" />
            </router-link>
          </nav>
          <p class="title">Sisaweb - Versão 3</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.conteudo {
  height: 6rem;
  background-color: $base-bg;
  border-bottom: 4px solid #020538;
  padding: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}



nav {

  padding: 1px 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

nav #logo_url {
  margin: auto;
  margin-left: 0;
}

#logo {
  width: 8rem;
}

.title {
  //color: darkgoldenrod;
  -webkit-text-stroke: 1px rgb(2, 4, 27);
  /* width and color */
  font-size: 2vw;
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(28, 14, 156);
}

@media only screen and (max-width: 320px) {

  .title {
    font-size: 2rem;
  }

}
</style>
