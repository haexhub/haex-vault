<template>
  <VaultEntry
    :history="vaultEntryHistory"
    :originally
    :title="t('title')"
    @back="onBackAsync"
    @reject="onRejectAsync"
    @submit="onSaveAsync"
    icon="mdi:key-outline"
    v-model:read_only="read_only"
    v-model="vaultEntry"
  >
  </VaultEntry>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import {
  type SelectVaultEntryHistory,
  type SelectVaultEntry,
} from '~/database/schemas/vault';

definePageMeta({
  name: 'vaultEntryEdit',
});

const { t } = useI18n();

const vaultEntry = ref<SelectVaultEntry>({
  createdAt: '',
  icon: '',
  id: '',
  note: null,
  password: '',
  tags: '',
  title: '',
  updateAt: null,
  url: '',
  urlAliases: null,
  username: '',
});

const originally = ref<SelectVaultEntry>();
const vaultEntryHistory = ref<SelectVaultEntryHistory[]>();

const { read_only } = storeToRefs(useVaultStore());
const { currentEntryId } = storeToRefs(useVaultEntryStore());
const { getAsync, updateAsync } = useVaultEntryStore();
const { getAsync: getHistoryAsync } = useVaultEntryHistoryStore();

const { currentGroupId } = storeToRefs(useVaultGroupStore());

const { add } = useSnackbar();

const getVaultEntryAsync = async () => {
  const foundEntry = await getAsync(currentEntryId.value);
  if (foundEntry) {
    originally.value = { ...foundEntry };
    vaultEntry.value = foundEntry;
  }
};

const getVaultHistoryAsync = async () => {
  const history = await getHistoryAsync(currentEntryId.value);
  vaultEntryHistory.value = history ?? [];
};

watch(
  currentEntryId,
  async () => {
    try {
      await getVaultEntryAsync();
      //await getVaultHistoryAsync();
    } catch (error) {
      add({ type: 'error', text: 'Fehler beim lesen des Eintrages' });
    }
  },
  { immediate: true }
);

const localeRoute = useLocaleRoute();

const onSaveAsync = async (to?: RouteLocationNormalizedLoadedGeneric) => {
  if (vaultEntry.value && originally.value) {
    await updateAsync(vaultEntry.value, originally.value);
    await getVaultEntryAsync();
    await getVaultHistoryAsync();

    if (to) {
      await navigateTo(localeRoute(to));
    } else {
      await onBackAsync();
    }
  }
};

const router = useRouter();

const onBackAsync = async () => {
  try {
    if (read_only.value) {
      await navigateTo(
        localeRoute({
          name: 'vaultGroupEntries',
          params: {
            groupId: currentGroupId.value,
          },
          query: router.currentRoute.value.query,
        })
      );
    } else {
      read_only.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};

const onRejectAsync = async (to?: RouteLocationNormalizedLoadedGeneric) => {
  await getVaultEntryAsync();
  await getVaultHistoryAsync();

  if (to) {
    await navigateTo(localeRoute(to));
  } else {
    await onBackAsync();
  }
};
</script>

<i18n lang="json">
{
  "de": {
    "abort": "Abbrechen",
    "save": "Änderung speichern",
    "title": "Eintrag anpassen"
  },
  "en": { "abort": "Abort", "save": "Save Changes", "title": "Edit Entry" }
}
</i18n>
