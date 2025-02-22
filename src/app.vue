<template>
  <div>
    <NuxtLayout :data-theme="currentTheme">
      <NuxtPage keepalive />
      <NuxtSnackbar />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { currentTheme } = storeToRefs(useUiStore());
</script>

<style>
.fades-enter-active {
  transition: all 1s ease-out;
}

.fades-leave-active {
  transition: all 1s ease-out reverse;
}

.fades-enter-from,
.fades-leave-to {
  opacity: 0;
}
</style>
