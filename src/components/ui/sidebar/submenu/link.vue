<template>
  <NuxtLinkLocale
    :to="_to"
    exact-active-class="bg-primary"
    class="w-full bg-purple-400"
  >
    <slot />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  to: RouteLocationRaw;
}>();

const { currentScreenSize } = storeToRefs(useUiStore());

const _to = computed<RouteLocationRaw>(() => {
  if (typeof props.to === 'string') {
    if (props.to.includes('/')) {
      return {
        path: props.to,
        query: {
          ...useRoute().query,
          showSidebar: currentScreenSize.value === 'xs' ? 'false' : 'true',
        },
      };
    } else {
      return {
        name: props.to,
        query: {
          ...useRoute().query,
          showSidebar: currentScreenSize.value === 'xs' ? 'false' : 'true',
        },
      };
    }
  }

  return {
    ...props.to,
    query: {
      ...useRoute().query,
      showSidebar: currentScreenSize.value === 'xs' ? 'false' : 'true',
    },
  };
});
</script>
