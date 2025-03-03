<template>
  <VaultGroup
    @submit="onSaveAsync"
    @back="onBackAsync"
    @reject="onRejectAsync"
    @close="onCloseAsync"
    v-model="vaultGroup"
    v-model:read_only="read_only"
    :originally
  >
    <!-- <template #bottom="{ onSubmit, onClose }">
      <button
        class="btn btn-error flex-1 flex-nowrap"
        @click="onClose"
        type="button"
      >
        {{ t('abort') }}
        <Icon name="mdi:close" />
      </button>

      <button
        class="btn btn-primary flex-1 flex-nowrap"
        type="button"
        @click="onSubmit"
      >
        {{ t('save') }}
        <Icon name="mdi:check" />
      </button>
    </template> -->
  </VaultGroup>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { type SelectVaultGroup } from '~/database/schemas/vault';

definePageMeta({
  name: 'vaultGroupEdit',
});

const { read_only } = storeToRefs(useVaultStore());

const vaultGroup = ref<SelectVaultGroup>({
  color: '',
  description: '',
  icon: '',
  id: '',
  name: '',
  order: null,
  parentId: '',
});

const originally = ref<SelectVaultGroup>();

const onCloseAsync = async () => {
  if (read_only.value) return navigateToGroupEntriesAsync(vaultGroup.value.id);
  else read_only.value = true;
};
/* {
  await navigateTo(
    useLocaleRoute()({
      name: 'vaultGroupEntries',
      params: {
        ...useRouter().currentRoute.value.params,
      },
      query: {
        ...useRouter().currentRoute.value.query,
      },
    })
  );
}; */

const { currentGroupId } = storeToRefs(useVaultGroupStore());
const { getAsync, navigateToGroupEntriesAsync } = useVaultGroupStore();

const getGroupAsync = async () => {
  const group = (await getAsync({ groupId: currentGroupId.value }))?.at(0);
  console.log('found group', group);
  if (group) {
    vaultGroup.value = group;
    originally.value = { ...group };
  }
};
watch(currentGroupId, async () => getGroupAsync(), { immediate: true });

const { add } = useSnackbar();

const onSaveAsync = async (to?: RouteLocationNormalizedLoadedGeneric) => {
  try {
    const { updateAsync } = useVaultGroupStore();
    await updateAsync(vaultGroup.value);
    await getGroupAsync();
    read_only.value = true;
    if (to) {
      return navigateTo(to);
    }
  } catch (error) {
    add({
      type: 'error',
      text: JSON.stringify(error),
    });
    console.log(error);
  }
};

const onBackAsync = async () => {
  if (originally.value) vaultGroup.value = { ...originally.value };
  await navigateToGroupEntriesAsync(vaultGroup.value.id);
};

const onRejectAsync = async (to?: RouteLocationNormalizedLoadedGeneric) => {
  if (originally.value) vaultGroup.value = { ...originally.value };
  if (to) return navigateTo(to);
  else return onBackAsync;
};
</script>

<i18n lang="json">
{
  "de": {
    "title": "Gruppe anpassen",
    "abort": "Abbrechen",
    "save": "Speichern",
    "name": {
      "label": "Name"
    },
    "description": {
      "label": "Beschreibung"
    }
  },

  "en": {
    "title": "Edit Group",
    "abort": "Abort",
    "save": "Save",
    "name": {
      "label": "Name"
    },
    "description": {
      "label": "Description"
    }
  }
}
</i18n>
