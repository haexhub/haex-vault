<template>
  <div>
    <button
      class="btn"
      @click="onFind"
    >
      Find
    </button>
  </div>
</template>

<script setup lang="ts">
import { usePowerSyncStore } from '~/stores/powersync';

definePageMeta({
  name: 'test42',
});

const { setupPowerSync, findList } = usePowerSyncStore();
await setupPowerSync();

const list = ref();

const onFind = async () => {
  list.value = await findList('');
};
</script>
