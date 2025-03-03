<template>
  <UiList>
    <UiListButton
      v-for="group in groups"
      :key="group.id"
      @click="navigateToGroupEntriesAsync(group.id)"
    >
      <div class="flex justify-between w-full items-center">
        {{ group.name }}
        <Icon
          name="mdi:chevron-right"
          size="24"
        />
      </div>
    </UiListButton>
    {{ currentGroup?.icon }}
    <UiListButton
      v-for="entry in entries"
      :key="entry.id"
      @click="navigateToEntryAsync(entry.id)"
    >
      <div class="flex flex-col items-start">
        <div v-if="!entry.title && !entry.username && !entry.url">
          {{ entry.id }}
        </div>
        <div class="font-semibold">
          {{ entry.title }}
        </div>
        <span class="text-sm">
          {{ entry.username }}
        </span>
        <span class="text-sm">
          {{ entry.url }}
        </span>
      </div>
    </UiListButton>
    <VaultListEntry
      v-for="entry in entries"
      :group-icon="currentGroup?.icon"
      :entry
    />
  </UiList>
</template>

<script setup lang="ts">
import type {
  SelectVaultGroup,
  SelectVaultEntry,
} from '~/database/schemas/vault';

const groups = ref<SelectVaultGroup[]>([]);
const entries = ref<SelectVaultEntry[]>([]);

const { currentGroupId, currentGroup } = storeToRefs(useVaultGroupStore());
const { getByParentIdAsync, navigateToGroupEntriesAsync } =
  useVaultGroupStore();
const { getByGroupAsync, navigateToEntryAsync } = useVaultEntryStore();

watch(
  currentGroupId,
  async () => {
    groups.value = (await getByParentIdAsync(currentGroupId.value)) || [];
    entries.value = (await getByGroupAsync(currentGroupId.value)) || [];
  },
  { immediate: true }
);
</script>
