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
import { menuData } from '@/menus/menu'

const route = useRoute()
const showMenu = ref(false)
const collapsed = ref(true)

function onToggleCollapse(c) {
  collapsed.value = c
}
watch(
  () => route.path,
  (newPath) => {
    showMenu.value = !['/', '/login', '/forgot', '/reset'].includes(newPath)
  },
  { immediate: true }
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
