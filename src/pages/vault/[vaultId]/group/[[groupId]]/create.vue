<template>
  <VaultCard
    :title="t('title')"
    icon="mdi:folder-plus-outline"
  >
    <div
      class="flex flex-col gap-4 w-full p-4"
      @keyup.enter="onCreate"
    >
      <UiInput
        :check-input="check"
        :label="t('name.label')"
        :placeholder="t('name.label')"
        :rules="vaultGroupSchema.name"
        autofocus
        v-model:errors="errors.name"
        v-model="vaultGroup.name"
      />

      <UiInput
        v-model="vaultGroup.description"
        :check-input="check"
        :label="t('description.label')"
        :placeholder="t('description.label')"
        :rules="vaultGroupSchema.description"
      />

      <UiColorPicker v-model="vaultGroup.color" />

      <UiIconPicker v-model="vaultGroup.icon" />

      <div class="flex flex-wrap justify-end gap-4">
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
          @click="onCreate"
        >
          {{ t('create') }}
          <Icon name="mdi:check" />
        </button>
      </div>
    </div>
  </VaultCard>
</template>

<script setup lang="ts">
import {
  vaultGroupSchema,
  type InsertVaultGroup,
} from '~/database/schemas/vault';

definePageMeta({
  name: 'vaultGroupCreate',
});

const { t } = useI18n();

const check = ref(false);

const vaultGroup = ref<InsertVaultGroup>({
  name: '',
  description: '',
  id: '',
  color: null,
  icon: null,
  order: null,
  parentId: null,
});

const errors = ref({
  name: [],
  description: [],
});

const onClose = () => {
  useRouter().back();
};

const { currentGroupId } = storeToRefs(useVaultGroupStore());

const onCreate = async () => {
  try {
    check.value = true;

    if (errors.value.name.length || errors.value.description.length) return;

    const { createAsync } = useVaultGroupStore();
    const groupId = await createAsync(vaultGroup.value);

    console.log('created group with id', groupId);
    if (groupId) {
      currentGroupId.value = groupId;
      await navigateTo(
        useLocalePath()({
          name: 'vaultGroupEntries',
          params: {
            groupId,
          },
          query: {
            ...useRoute().query,
          },
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<i18n lang="json">
{
  "de": {
    "title": "Neue Gruppe anlegen",
    "abort": "Abbrechen",
    "create": "Anlegen",
    "name": {
      "label": "Name"
    },
    "description": {
      "label": "Beschreibung"
    }
  },

  "en": {
    "title": "Create new Group",
    "abort": "Abort",
    "create": "Create",
    "name": {
      "label": "Name"
    },
    "description": {
      "label": "Description"
    }
  }
}
</i18n>
