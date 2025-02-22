<template>
  <VaultEntry
    v-model="vaultEntry"
    @submit="onCreateAsync"
    @back="onBackAsync"
    @reject="onRejectAsync"
    :title="t('title')"
    icon="iconoir:key-plus"
  >
    <!-- <template #bottom="{ onClose }">
      <button
        class="btn btn-error flex-1 flex-nowrap"
        @click="onClose"
        type="button"
      >
        {{ t('abort') }}
        <Icon name="mdi:close" />
      </button>

      <button
        class="btn btn-primary flex-1 flex-nowrap text-nowrap"
        type="button"
        @click="onCreateAsync"
      >
        {{ t('create') }}
        <Icon name="mdi:check" />
      </button>
    </template> -->
  </VaultEntry>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { type SelectVaultEntry } from '~/database/schemas/vault';

definePageMeta({
  name: 'vaultEntryCreate',
});

const { t } = useI18n();

const check = ref(false);

const vaultEntry = ref<SelectVaultEntry>({
  createdAt: '',
  id: '',
  note: '',
  password: '',
  title: '',
  updateAt: null,
  username: '',
  url: '',
  urlAliases: '',
  tags: '',
  icon: '',
});

const errors = ref({});

const { currentGroup } = storeToRefs(useVaultGroupStore());
const onCreateAsync = async () => {
  try {
    check.value = true;

    if (!vaultEntry.value) return;
    vaultEntry.value.icon =
      vaultEntry.value.icon || currentGroup.value?.icon || '';
    const { createAsync } = useVaultEntryStore();
    await createAsync(vaultEntry.value);

    return onCloseAsync();
  } catch (error) {
    console.log(error);
  }
};

const locale = useLocaleRoute();
const { currentGroupId } = storeToRefs(useVaultGroupStore());

const onRejectAsync = async (to?: RouteLocationNormalizedLoadedGeneric) => {
  if (to) return navigateTo(to);
  else return onCloseAsync();
};

const onBackAsync = async () => {
  return onCloseAsync();
};

const onCloseAsync = async () => {
  await navigateTo(
    locale({
      name: 'vaultGroupEntries',
      params: {
        groupId: currentGroupId.value,
      },
      query: { ...useRouter().currentRoute.value.query },
    })
  );
};
</script>

<i18n lang="json">
{
  "de": {
    "title": "Eintrag erstellen",
    "create": "Anlegen",
    "abort": "Abbrechen",
    "entry": {
      "title": "Titel",
      "username": "Nutzername",
      "password": "Passwort"
    }
  },
  "en": {
    "title": "Create Entry",
    "create": "Create",
    "abort": "Abort",
    "entry": {
      "title": "Title",
      "username": "Username",
      "password": "Password"
    }
  }
}
</i18n>
