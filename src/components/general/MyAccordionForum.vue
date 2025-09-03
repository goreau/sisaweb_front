<template>
  <div class="card forum-post">
    <!-- Cabeçalho do post -->
    <header class="card-header has-background-light" @click="toggleOpen">
      <p class="card-header-title">
        <a href="#" @click.stop.prevent="abrirTopico">{{ post.titulo }}</a> ({{ post.sistema }})
      </p>
      <span class="card-header-icon">
        <i class="fas" :class="open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </span>
    </header>

    <!-- Conteúdo resumido (autor, replies, último reply) -->
    <div class="card-content">
      <div class="columns is-mobile is-vcentered">
        <div class="column">
          <p class="is-size-7 has-text-grey">
            Criado por <strong>{{ post.autor }}</strong>
          </p>
          <p class="is-size-7 has-text-grey">Local: {{ post.municipio }}</p>
          <p class="is-size-7 has-text-grey">Em: {{ post.data }}</p>
        </div>
        <div class="column has-text-centered">
          <p class="has-text-grey">Replies</p>
          <p class="title is-6">{{ post.replicas.length }}</p>
        </div>
        <div class="column has-text-right">
          <p class="is-size-7 has-text-grey">Última resposta</p>
          <p>
            <strong>{{ lastReply?.autor || '-' }}</strong>
          </p>
          <p class="is-size-7 has-text-grey">
            {{ lastReply?.data || '-' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Conteúdo do tópico + replies (accordion) -->
    <transition name="slide">
      <div v-show="open" class="card-content replies">
        <!-- Texto do tópico -->
        <article class="media">
          <figure class="media-left">
            <p class="image is-48x48">
              <i class="fas fa-book"></i>
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ post.autor }}</strong>
                <small>{{ post.data }}</small>
                <br />
                {{ post.texto }}
              </p>
            </div>
          </div>
          <!-- Se houver imagem, mostrar com link -->
          <div class="media-right" v-if="post.imagem_url">
            <figure class="image is-128x128">
              <a :href="baseURL + post.imagem_url" target="_blank" rel="noopener">
                <img
                  :src="baseURL + post.imagem_url"
                  alt="Imagem"
                  class="mt-2"
                  style="max-width: 5rem; height: auto"
                />
              </a>
            </figure>
          </div>
        </article>

        <!-- Replies -->
        <article class="media" v-for="reply in post.replicas" :key="reply.id">
          <figure class="media-left">
            <p class="image is-48x48">
              <i class="fas fa-user"></i>
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ reply.autor }}</strong>
                <small>{{ reply.data }}</small>
                <br />
                {{ reply.texto }}
              </p>
            </div>
          </div>
          <!-- Se houver imagem na resposta -->
          <div class="media-right" v-if="reply.imagem_url">
            <figure class="image is-128x128">
              <a :href="baseURL + reply.imagem_url" target="_blank" rel="noopener">
                <img
                  :src="baseURL + reply.imagem_url"
                  alt="Imagem"
                  class="mt-2"
                  style="max-width: 5rem; height: auto"
                />
              </a>
            </figure>
          </div>
        </article>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const baseURL = import.meta.env.VITE_APP_BACK_API + 'uploads/forum/'

const props = defineProps({
  post: { type: Object, required: true },
  isOpen: { type: Boolean, default: false }, // controle externo
})

const emits = defineEmits(['toggle', 'reply'])

function abrirTopico() {
  emits('reply', props.post.id) // manda o id pro pai
}

const open = ref(props.isOpen)

const toggleOpen = () => {
  open.value = !open.value
  emits('toggle', open.value)
}

const lastReply = computed(() => {
  if (!props.post.replicas.length) return null
  return props.post.replicas[props.post.replicas.length - 1]
})
</script>

<style scoped>
.card {
  padding-top: 0;
}
/* Slide suave */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
