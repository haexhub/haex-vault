<template>
  <UiTooltip
    :tooltip="tooltip ?? label"
    direction="right-end"
  >
    <NuxtLinkLocale
      :to
      class="flex items-center justify-center py-3 hover:text-primary cursor-pointer tooltip-toogle"
      :class="{ ['bg-base-300']: isActive }"
      @click="$emit('click')"
    >
      <i
        :class="icon"
        class="shrink-0 size-8"
      />
    </NuxtLinkLocale>
  </UiTooltip>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { isRouteActive } from '~/composables/helper';

const props = defineProps<{
  label: string;
  tooltip?: string;
  icon?: string;
  to: RouteLocationRaw;
}>();

const isActive = isRouteActive(props.to);

/* computed(() => {
  const found = useRouter()
    .getRoutes()
    .find((route) => route.name === useLocaleRoute()(props.to)?.name);
  console.log('found route', found, useRoute());
  return (
    found?.name === useRoute().name ||
    found?.children.some((child) => child.name === useRoute().name)
  );
}); */
</script>
