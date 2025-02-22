<template>
  <button
    type="button"
    class="dropdown-item"
  >
    <Icon
      v-if="icon"
      :name="icon"
      class="size-5 shrink-0"
    />

    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  icon: String,
  text: String,
});
</script>
