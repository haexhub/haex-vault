<template>
  <VaultCard>
    <template #header>
      <div
        class="flex flex-wrap items-start justify-between w-full px-2 py-3 h-full"
      >
        <div class="w-full flex gap-2 justify-between items-center">
          <div>
            <button
              v-if="currentGroup?.id"
              class="btn btn-square btn-primary btn-outline"
              @click="gotoParentGroupAsync"
            >
              <Icon
                name="mdi:chevron-left"
                size="32"
              />
            </button>
          </div>
          <div>
            <button class="btn btn-square btn-primary btn-outline">
              <Icon
                name="mdi:magnify"
                size="26"
              />
            </button>
          </div>
        </div>
        <div
          class="flex flex-col items-center w-full h-14 gap-2"
          :style="{ color: currentGroup?.color || '' }"
        >
          <button @click="navigateToGroupAsync(currentGroup?.id)">
            <Icon :name="currentGroup?.icon ?? 'mdi:folder-outline'" />
            <h5>{{ currentGroup?.name ?? currentVault?.name }}</h5>
          </button>
        </div>
      </div>
    </template>

    <div>
      <VaultGroupList v-if="entries?.length">
        <VaultGroupListButton
          v-for="entry in entries"
          class="group"
          @click="navigateToEntryAsync(entry.id)"
        >
          <Icon :name="entry.icon || currentGroup?.icon || 'mdi:key-outline'" />
          <div
            class="flex flex-col items-start text-base-content group-hover:text-accent-content"
          >
            <h6 class="font-semibold">{{ entry.title }}</h6>
            <span class="text-xs">{{ entry.username }}</span>
          </div>
        </VaultGroupListButton>
      </VaultGroupList>

      <!-- <UiTable
        v-if="entries?.length"
        :headers
        :items="entries"
        @select="onSelect"
        @db-click="(entry) => navigateToEntryAsync(entry.id)"
        autofocus
      >
        <template #column-icon="{ item }">
          <div class="flex justify-center">
            <Icon :name="item" />
          </div>
        </template>
      </UiTable> -->
    </div>
    <UiButtonAction
      :menu
      class="bottom-4 right-4"
    />
  </VaultCard>
  <!-- <div class="h-full flex flex-col relative pt-24">
    <div
      class="transition-all duration-500 fixed top-0 right-0 h-24 flex items-center bg-base-100 z-10 border-b rounded-b border-primary"
      :class="[show ? 'left-96' : 'left-0']"
    >
      <div :class="{ 'pl-14': !show }">overview</div>
    </div>
    <div class="h-full">
      <VaultGroupList>
        <VaultGroupListButton v-for="entry in entries">
          <Icon
            v-if="entry.icon"
            :name="entry.icon"
          />
          <div class="flex flex-col items-start">
            <span>{{ entry.title }}</span>
            <span>{{ entry.username }}</span>
            <span>{{ entry.url }}</span>
          </div>
        </VaultGroupListButton>
      </VaultGroupList>

      <UiTable
        v-if="entries?.length"
        :headers
        :items="entries"
        @select="onSelect"
        @db-click="onDbClick"
        autofocus
      >
        <template #column-icon="{ item }">
          <div class="flex justify-center">
            <Icon :name="item" />
          </div>
        </template>
      </UiTable>
    </div>
    <UiButtonAction
      :menu
      class="top-4 right-4"
    />
  </div> -->
</template>

<script setup lang="ts">
import { type SelectVaultEntry } from '~/database/schemas/vault';

definePageMeta({
  name: 'vaultGroupEntries',
});

const { currentVault } = storeToRefs(useVaultStore());
const { menu } = storeToRefs(useVaultActionMenuStore());
const { currentGroupId, currentGroup } = storeToRefs(useVaultGroupStore());
const { navigateToGroupAsync } = useVaultGroupStore();
const { getByGroupAsync, navigateToEntryAsync } = useVaultEntryStore();

const entries = ref<SelectVaultEntry[] | null | undefined>([]);

watchEffect(async () => {
  entries.value = await getByGroupAsync(currentGroupId.value);
});

const { t } = useI18n();

const headers: ITableHeader[] = [
  { 'item-value': 'icon' },
  { 'item-value': 'title', 'label': t('title') },
  { 'item-value': 'username', 'label': t('name') },
  { 'item-value': 'url', 'label': t('url') },
];

const onSelect = (items: SelectVaultEntry | SelectVaultEntry[]) => {
  console.log('selected', items);
};

const gotoParentGroupAsync = async () => {
  return navigateTo(
    useLocaleRoute()({
      name: 'vaultGroupEntries',
      params: {
        ...(useRouter().currentRoute.value.params ?? {}),
        groupId: currentGroup.value?.parentId,
      },
      query: useRouter().currentRoute.value.query,
    })
  );
};
</script>

<i18n lang="json">
{
  "de": {
    "title": "Titel",
    "name": "Name",
    "url": "Url"
  },
  "en": {
    "title": "Title",
    "name": "Name",
    "url": "Url"
  }
}
</i18n>
