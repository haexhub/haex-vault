<template>
  <div class="h-full">
    <NuxtLayout name="app">
      <template #sidebar>
        <!-- <div class="pb-4 bg-red-300"> -->
        <VaultSidebarGroups />
        <!-- </div> -->
      </template>

      <!-- <div class="sm:px-4"> -->
      <NuxtPage />
      <!-- </div> -->
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'vaultGroup',
});

const { currentGroupId } = storeToRefs(useVaultGroupStore());

const { refreshDatabaseAsync } = useVaultStore();

watch(
  currentGroupId,
  async () => {
    //groups.value = (await getAsync()) || [];
    console.log('watch groups', currentGroupId);
    //await refreshDatabaseAsync();
  },
  { immediate: true }
);
onMounted(async () => await refreshDatabaseAsync());
</script>
