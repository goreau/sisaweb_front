<script setup>
import { RouterView } from 'vue-router' //RouterLink,
import Header from '@/components/general/MyHeader.vue'
import Footer from '@/components/general/MyFooter.vue'
import MySidebar from '@/components/general/MySidebar.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const mainDiv = ref(null)
const showMenu = ref(false)

///********************************** */
function onToggleCollapse(collapsed) {
  if (mainDiv.value) {
    if (collapsed) {
      mainDiv.value.className = 'main_colapsed'
    } else {
      mainDiv.value.className = 'main'
    }
  }
}

/********************************* */

watch(
  () => route.path,
  (newPath) => {
    showMenu.value =
      newPath !== '/' && newPath !== '/login' && newPath !== '/forgot' && newPath !== '/reset'
  },
  { immediate: true },
)

watch(mainDiv, (el) => {
  if (el) {
    onToggleCollapse(true)
  }
})

//onMounted(onToggleCollapse(true));
</script>

<template>
  <div>
    <Header />
    <div class="app-container">
      <div class="menu-content" v-show="showMenu">
        <MySidebar />
      </div>

      <!-- Conteúdo principal -->
      <main class="column is-10 main-content">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss">
@use '@fortawesome/fontawesome-free/css/all.css';
* {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1rem; // 16px base, responsivo
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

$toggle-btn-bg: red;
$toggle-btn-color: white;

/* Container que engloba menu + conteúdo */
.app-container {
  display: flex;
  height: calc(100vh - 6.2rem); // mesma altura que o header ocupa
  margin-top: 6.2rem; // em vez de padding-top
  overflow: hidden;
}

/* Menu lateral ocupando toda altura da app-container */
.menu-content {
  width: 250px;
  min-width: 200px; // garante responsividade
  max-width: 300px;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  font-size: clamp(14px, 1vw + 0.5rem, 18px);
}

body {
  font-size: clamp(14px, 1vw + 0.5rem, 18px);
}

/* Conteúdo principal */
.main-content {
  flex: 1;
  min-width: 0; // importante para tabelas não estourarem o flex
  overflow-y: auto;
  padding: 1.5rem;
}

.select {
  width: 100%;
}

.divisor {
  text-align: center;
  padding: 1rem 0 2rem 0;
  font-weight: bold;
}

.card {
  border: 0.5px solid #ccc;
  padding-top: 1rem;
}

.card-header p {
  color: rgb(23, 24, 102);
  font-size: larger;
}

.card-header .button {
  margin-right: 1rem;
}

.is-error {
  font-size: smaller;
  color: red;
  padding-left: 1rem;
}

.fieldset {
  background-color: #fff;
  border-radius: 6px;
  box-shadow:
    0 0.3em 0.3em -0.125em rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.02);
  color: #4a4a4a;
  display: block;
  padding: 1.25rem;
  border-color: #dbdbdb;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.fieldset > legend {
  color: #363636;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  background-color: #fff;
  padding: 0 5px;
  width: max-content;
  border: 0 none;
}

.btico {
  padding: 0.7rem;
}
</style>
