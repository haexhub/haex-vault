<template>
  <VaultEntry
    :originally
    :title="t('title')"
    @back="onBackAsync"
    @reject="onRejectAsync"
    @submit="onSaveAsync"
    @close="onClose"
    :icon="currentGroup?.icon || ''"
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

const vaultEntry = ref<IVaultEntryComplete>({
  details: {
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
  },
  history: [],
  keyValues: [],
});

const originally = ref<IVaultEntryComplete>();
//const vaultEntryHistory = ref<SelectVaultEntryHistory[]>();

const { read_only } = storeToRefs(useVaultStore());
const { currentEntryId } = storeToRefs(useVaultEntryStore());
const { getAsync, updateAsync, navigateToEntryAsync } = useVaultEntryStore();
const { getAsync: getHistoryAsync } = useVaultEntryHistoryStore();
const { currentGroup } = storeToRefs(useVaultGroupStore());

const { add } = useSnackbar();

const getVaultEntryAsync = async () => {
  const foundEntry = await getAsync(currentEntryId.value);
  if (foundEntry?.details) {
    originally.value = JSON.parse(JSON.stringify(foundEntry));
    vaultEntry.value = foundEntry;
  }
};

/* const getVaultHistoryAsync = async () => {
  const history = await getHistoryAsync(currentEntryId.value);
  vaultEntryHistory.value = history ?? [];
}; */

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
  if (vaultEntry.value.details && originally.value?.details) {
    await updateAsync(vaultEntry.value.details, originally.value.details);
    await getVaultEntryAsync();
    //await getVaultHistoryAsync();

    if (to) {
      await navigateTo(localeRoute(to));
    } else {
      await navigateToEntryAsync(vaultEntry.value.details.id);
    }
  }
};

const onBackAsync = async () => {
  try {
    if (read_only.value) {
      useRouter().back();
      /* */
    } else {
      read_only.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};

const onRejectAsync = async (to?: RouteLocationNormalizedLoadedGeneric) => {
  await getVaultEntryAsync();
  //await getVaultHistoryAsync();

  if (to) {
    await navigateTo(localeRoute(to));
  } else {
    await onBackAsync();
  }
};

const onClose = () => {
  console.log('reset vaule', originally.value);
  if (originally.value)
    vaultEntry.value = JSON.parse(JSON.stringify(originally.value));
  read_only.value = true;
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
