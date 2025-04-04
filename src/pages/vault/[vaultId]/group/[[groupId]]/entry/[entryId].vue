<template>
  <VaultEntry
    :originally
    :title="t('title')"
    @back="onBackAsync"
    @reject="onRejectAsync"
    @submit="onSaveAsync"
    @close="onCloseAsync"
    :icon="currentGroup?.icon || ''"
    v-model:read_only="read_only"
    v-model="vaultEntry"
  >
  </VaultEntry>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';

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
const { currentGroup } = storeToRefs(useVaultGroupStore());
const { navigateToGroupEntriesAsync } = useVaultGroupStore();

const { add } = useSnackbar();

const getVaultEntryAsync = async () => {
  const foundEntry = await getAsync(currentEntryId.value);
  if (foundEntry?.details) {
    originally.value = JSON.parse(JSON.stringify(foundEntry));
    vaultEntry.value = foundEntry;
  }
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
  if (vaultEntry.value.details && originally.value?.details) {
    await updateAsync(vaultEntry.value.details, originally.value.details);
    await getVaultEntryAsync();

    if (to) {
      await navigateTo(localeRoute(to));
    } else {
      if (read_only.value)
        await navigateToGroupEntriesAsync(currentGroup.value?.id);
      else await navigateToEntryAsync(vaultEntry.value.details.id);
    }
  }
};

const onBackAsync = async () => {
  try {
    vaultEntry.value = JSON.parse(JSON.stringify(originally.value));
    read_only.value = true;
    useRouter().back();
    if (read_only.value) {
      /* */
    } else {
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

const onCloseAsync = async () => {
  console.log('reset vaule', originally.value);
  if (originally.value)
    vaultEntry.value = JSON.parse(JSON.stringify(originally.value));

  if (read_only.value)
    return navigateToGroupEntriesAsync(currentGroup.value?.id);
  else read_only.value = true;
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
