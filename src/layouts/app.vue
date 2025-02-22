<template>
  <div class="w-full h-full flex">
    <div class="flex w-full relative">
      <button
        class="top-3 left-2 absolute z-30 duration-1000 btn btn-square btn-primary transition-opacity btn-outline"
        @click="show = !show"
        :class="[show ? 'opacity-0' : 'opacity-100']"
      >
        <Icon
          name="mdi:menu"
          size="28"
        />
      </button>

      <UiSidebar :menu>
        <template #default>
          <slot name="sidebar" />
        </template>
      </UiSidebar>

      <div class="overflow-hidden md:blur-none transition-all relative w-full">
        <div class="h-full overflow-scroll">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { show, menu } = storeToRefs(useSidebarStore());
</script>

<i18n lang="json">
{
  "de": {
    "login": "Einloggen",
    "logout": "Abmelden",
    "logoutSuccess": "Erfolgreich abgemeldet"
  },

  "en": {
    "login": "Login",
    "logout": "Logout",
    "logoutSuccess": "Logout successfull"
  }
}
</i18n>
