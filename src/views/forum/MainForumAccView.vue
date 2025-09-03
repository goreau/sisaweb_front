<template>
  <div class="main-container">
    <div class="columns is-centered">
      <div class="column is-four-fifths">
        <Loader :active="isLoading" />
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-centered">Fórum</p>
          </header>
          <div class="card-content">
            <div class="content">
              <section class="section">
                <div class="columns">
                  <div class="column is-9">
                    <div class="columns">Sistema:</div>
                    <div class="columns">Filtrar:</div>
                  </div>
                  <div class="column"><button>Minhas</button></div>
                  <div class="column">Novo</div>
                  <div class="column">Administrativo</div>
                </div>
              </section>
              <section>
                <div class="container">
                  <ForumPostAccordion
                    v-for="post in posts"
                    :key="post.id"
                    :post="post"
                    :isOpen="openPostId === post.id"
                    @toggle="onToggle(post.id, $event)"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ForumPostAccordion from '@/components/general/MyAccordionForum.vue'

const openPostId = ref(null)

const onToggle = (id, isOpen) => {
  openPostId.value = isOpen ? id : null
}

const posts = [
  {
    id: 1,
    title: 'Como configurar o Vue Router?',
    author: 'Maria',
    createdAt: '26/08/2025',
    replies: [
      {
        id: 11,
        author: 'João',
        createdAt: '26/08/2025',
        text: 'Você pode usar createRouter do Vue Router 4.',
        avatar: 'https://bulma.io/images/placeholders/96x96.png',
      },
      {
        id: 12,
        author: 'Ana',
        createdAt: '27/08/2025',
        text: 'Outra dica é usar lazy loading nas rotas.',
        avatar: '<i class="fas fa-user">',
      },
    ],
  },
  {
    id: 2,
    title: 'Problema com Pinia persist',
    author: 'Carlos',
    createdAt: '25/08/2025',
    replies: [],
  },
]
</script>
