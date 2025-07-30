<template>
  <div class="column is-full">
    <div class="columns is-centered">
      <div class="column is-4">
        <div class="control">
          <button
            class="button is-link submit-btn is-fullwidth"
            id="login"
            @click="onSubmit"
            :disabled="!props.ready"
          >
            <span class="btico"><font-awesome-icon icon="fa-solid fa-check" /></span>
            {{ props.cFooter.strSubmit }}
          </button>
        </div>
      </div>
      <div class="column is-4" v-if="cFooter.aux">
        <div class="control">
          <button class="button is-link aux-btn is-fullwidth" @click="onAux">
            <span class="btico"><font-awesome-icon icon="fa-solid fa-list" /></span>
            {{ props.cFooter.strAux }}
          </button>
        </div>
      </div>
      <div class="column is-4">
        <div class="control">
          <button class="button is-link cancel-btn is-fullwidth" @click="onCancel">
            <span class="btico"><font-awesome-icon icon="fa-solid fa-ban" /></span>
            {{ props.cFooter.strCancel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  cFooter: {
    type: Object,
    required: true,
  },
  ready: {
    type: Boolean,
    default: true,
  },
  customBack: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['submit', 'aux', 'cancel'])

function onSubmit() {
  return emit('submit')
}

function onAux() {
  return emit('aux')
}

function onCancel() {
  if (props.customBack) {
    return emit('cancel')
  } else {
    if (router.path != '/') {
      router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-btn {
  background-color: #4f52a3;
  color: #e6e2db;
  font-weight: bold;
  border: 2px solid #13156e;
  padding: 1rem;
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.submit-btn:hover {
  background-color: transparent;
  color: #13156e;
  border: 2px solid #4f52a3;
}

.cancel-btn {
  background-color: #b8ae57;
  color: #463205;
  font-weight: bold;
  border: 2px solid #a3a4b3;
  padding: 1rem;
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.cancel-btn:hover {
  background-color: transparent;
  color: #a3a4b3;
  border: 2px solid #b8ae57;
}

.aux-btn {
  background-color: #509966;
  color: #e6e4df;
  font-weight: bold;
  border: 2px solid #1a8339;
  padding: 1rem;
  font-size: 1rem;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.aux-btn:hover {
  background-color: transparent;
  color: #1a8339;
  border: 2px solid #509966;
}

.btico {
  padding-right: 2rem;
  margin-left: -2rem;
}
</style>
