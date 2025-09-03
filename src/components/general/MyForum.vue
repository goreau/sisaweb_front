<template>
  <div class="box forum-post">
    <!-- Cabeçalho do post -->
    <div class="columns is-vcentered is-mobile" @click="toggleOpen">
      <!-- Área 1: título, criador e data -->
      <div class="column is-half">
        <h2 class="title is-5">{{ post.title }}</h2>
        <p class="is-size-7 has-text-grey">
          Criado por <strong>{{ post.author }}</strong> em {{ post.createdAt }}
        </p>
      </div>

      <!-- Área 2: número de replies -->
      <div class="column is-one-quarter has-text-centered">
        <p class="has-text-grey">Replies</p>
        <p class="title is-6">{{ post.replies.length }}</p>
      </div>

      <!-- Área 3: último reply -->
      <div class="column is-one-quarter">
        <p class="is-size-7 has-text-grey">Última resposta por</p>
        <p>
          <strong>{{ lastReply?.author || '-' }}</strong>
        </p>
        <p class="is-size-7 has-text-grey">
          {{ lastReply?.createdAt || '-' }}
        </p>
      </div>
    </div>

    <!-- Replies -->
    <transition name="fade">
      <div v-show="open" class="mt-3">
        <article class="media" v-for="reply in post.replies" :key="reply.id">
          <figure class="media-left">
            <p class="image is-48x48">
              <img :src="reply.avatar" alt="avatar" />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ reply.author }}</strong>
                <small>{{ reply.createdAt }}</small>
                <br />
                {{ reply.text }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

const open = ref(false)

const toggleOpen = () => {
  open.value = !open.value
}

const lastReply = computed(() => {
  if (!props.post.replies.length) return null
  return props.post.replies[props.post.replies.length - 1]
})
</script>

<style scoped>
/* Transição suave ao abrir replies */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
</style>
