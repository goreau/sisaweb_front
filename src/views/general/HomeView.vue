<script setup>

</script>

<template>
  <div class="home">
    <br>
    <div class="columns">
      <div class="column is-full has-text-centered pt-6 mt-6">
        <div class="box">
          <div class="welcome_image"></div>
          <p class="title" style="margin-top: 5%;">Sisaweb - Versão 3</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome_image {
  background-image: url('../../assets/aedes.png');
  opacity: 0.3;
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
}

img {
  width: 18vw;
}

.title {
  margin-top: 4vw;
  font-size: 4vw;
  color: $primary-color;
}

.box {
  position: relative;
  display: inline-block;
  /* Make the width of box same as image */
  width: 100%;
}

.box .title {
  color: $primary-color;
  position: absolute;
  z-index: 1;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 40%;
  /* Adjust this value to move the positioned div up and down */
  text-align: center;
  width: 100%;
  /* Set the width of the positioned div */
}
</style>
