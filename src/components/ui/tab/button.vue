<template>
  <button
    type="button"
    class="tab active-tab:tab-active"
    :class="{ active }"
    :id
    :data-tab
    role="tab"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  dataTab: String,
  active: {
    type: Boolean,
    default: false,
  },
  id: String,
});
</script>
