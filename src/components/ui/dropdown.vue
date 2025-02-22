<template>
  <div
    class="dropdown relative inline-flex [--strategy:absolute]"
    :class="_direction"
  >
    <slot name="trigger">
      <button
        :id
        type="button"
        class="dropdown-toggle btn btn-primary"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Dropdown"
      >
        <Icon
          name="tabler:chevron-down"
          class="dropdown-open:rotate-180 transition"
        />
      </button>
    </slot>

    <div
      class="dropdown-menu dropdown-open:opacity-100 min-w-70 hidden"
      role="menu"
      aria-orientation="vertical"
      :aria-labelledby="id"
    >
      <slot> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  direction: {
    type: String as PropType<
      | 'bottom-end'
      | 'bottom-start'
      | 'bottom'
      | 'left-end'
      | 'left-start'
      | 'left'
      | 'right-end'
      | 'right-start'
      | 'right'
      | 'top-end'
      | 'top-start'
      | 'top'
    >,
    default: 'bottom-end',
  },
});

const _direction = computed(() => {
  return `[--placement:${props.direction}]`;
});

const id = useId();
</script>
