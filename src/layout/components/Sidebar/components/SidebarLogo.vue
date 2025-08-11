<template>
  <div class="logo-container">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <router-link :key="+collapse" class="wh-full flex-center" to="/">
        <img :src="logo" class="logo-image" />
        <span v-if="!collapse" class="logo-title">{{ website_name }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import defaultSettings from "@/settings";

import { useStore } from "@/store/modules/common";
const store = useStore();
const logo = ref("");
const website_name = ref("");
async function initWebSiteInfo() {
  logo.value = await store.keyByConfigValue("website_logo");
  website_name.value = await store.keyByConfigValue("website_name");
  website_name.value = website_name.value + "后台";
  document.title = website_name.value;
  const el = (document.createElement("link").href = logo.value);
  document.getElementsByTagName("link")[0].href = el;
}
initWebSiteInfo();
defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;

  .logo-image {
    width: 1.4286rem;
    height: 1.4286rem;
  }

  .logo-title {
    flex-shrink: 0; /* 防止容器在空间不足时缩小 */
    margin-left: 0.7143rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
  }
}

.layout-top,
.layout-mix {
  .logo-container {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo-container {
      width: $sidebar-width-collapsed;
    }
  }
}
</style>
