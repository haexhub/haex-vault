<template>
  <div class="h-full">
    <NuxtLayout name="app">
      <div class="h-screen">profile {{ useRoute().path }}</div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { NuxtLayout } from '#components';

definePageMeta({
  name: 'profile',
});
</script>
