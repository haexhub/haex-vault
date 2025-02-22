<template>
  <div
    :id
    role="tabpanel"
    :aria-labelledby
    class="hidden"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  ariaLabelledBy: String,
  id: String,
});
</script>
