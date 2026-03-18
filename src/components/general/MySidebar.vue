<!-- src/components/general/MySidebar.vue -->
<template>
  <div class="menu-content" v-show="showMenu">
    <SidebarMenu
      :menu="menuData"
      :relative="true"
      @update:collapsed="onToggleCollapse"
      :showOneChild="true"
    />
  </div>
</template>

<script setup>
import { SidebarMenu } from 'vue-sidebar-menu'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { originalMenuData } from '@/menus/menu'
import { useCurrentUser } from '@/composables/currentUser'

const route = useRoute()
const showMenu = ref(false)
const collapsed = ref(true)
const menuData = ref([])

const { currentUser } = useCurrentUser()
var isAdmin = false

let cUser = currentUser
if (cUser.value) {
  isAdmin = cUser.value.tipo == 1
}

const processMenu = (items) => {
  return items.map((item) => {
    // 1. Verifica se o item atual deve ser desabilitado/escondido
    const isDisabled = item.requiresAdmin && !isAdmin

    // 2. Se o item tem filhos, processa eles recursivamente
    const updatedChildren =
      item.child && item.child.length > 0 ? processMenu(item.child) : item.child

    return {
      ...item,
      disabled: isDisabled,
      child: updatedChildren,
    }
  })
}

function onToggleCollapse(c) {
  collapsed.value = c
}
watch(
  () => route.path,
  (newPath) => {
    showMenu.value = !['/', '/login', '/forgot', '/reset'].includes(newPath)

    menuData.value = processMenu(originalMenuData)
  },
  { immediate: true },
)
</script>

<style lang="scss">
@use 'vue-sidebar-menu/src/scss/vue-sidebar-menu.scss' with (
  $primary-color: #a07210,
  $base-bg: #bc9c56,

  $item-color: #080692
);
.v-sidebar-menu .vsm--link_level-3 {
  background-color: #cfa03b;
}
.v-sidebar-menu.vsm_expanded .vsm--link_level-2.vsm--link_open {
  color: var(--vsm-item-open-color);
  background-color: #dba93e;
}
</style>
