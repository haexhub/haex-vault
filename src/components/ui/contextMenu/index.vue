<template>
  <div
    class="dropdown relative inline-flex rtl:[--placement:bottom-end] [--trigger:contextmenu]"
  >
    <slot>
      <div
        class="dropdown-toggle py-3 px-4 w-96 h-25 flex justify-center items-center text-sm font-medium rounded-lg border-2 border-dashed border-primary bg-base-100 text-primary shadow-sm"
      >
        Right click
      </div>
    </slot>

    <div
      class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="default"
    >
      <slot name="menu">
        <!-- Core Actions -->
        <UiContextMenuButton
          v-for="(item, index) in menu"
          :key="`${item.text}-${index}`"
          v-bind="item"
          :context
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IContextMenuItem } from './types';

defineProps({
  menu: {
    type: Array as PropType<IContextMenuItem[]>,
    default: () => [],
  },
  context: {
    type: Object,
  },
});
</script>
