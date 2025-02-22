<template>
  <UiTable
    v-if="history?.length"
    :headers
    :items="_history"
    autofocus
  >
    <template #column-oldValue="{ item }: { item: string }">
      <UiInput
        :model-value="item"
        with-copy-button
        class="min-w-24"
      />
    </template>
  </UiTable>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { type SelectVaultEntryHistory } from '~/database/schemas/vault';

const props = defineProps({
  entryId: String,
  history: {
    type: Array as PropType<SelectVaultEntryHistory[]>,
    default: () => [],
  },
});

const _history = computed(
  () =>
    props.history?.map((change) => ({
      changedProperty: t(change.changedProperty!),
      createdAt: new Date(change.createdAt!).toLocaleDateString(),
      newValue: change.newValue,
      oldValue: change.oldValue,
    })) ?? []
);

const { t } = useI18n();
const headers: ITableHeader[] = [
  { 'item-value': 'changedProperty', 'label': t('changedProperty') },
  { 'item-value': 'oldValue', 'label': t('oldValue') },
  { 'item-value': 'newValue', 'label': t('newValue') },
  { 'item-value': 'createdAt', 'label': t('createdAt') },
];
</script>

<i18n lang="json">
{
  "de": {
    "changedProperty": "Änderung",
    "createdAt": "geändert am",
    "newValue": "neuer Wert",
    "oldValue": "alter Wert",
    "password": "Passwort",
    "title": "Titel",
    "url": "Url",
    "username": "Nutzername"
  },
  "en": {
    "changedProperty": "Changes",
    "createdAt": "changed at",
    "newValue": "new Value",
    "oldValue": "old Value",
    "password": "Password",
    "title": "Title",
    "url": "Url",
    "username": "Username"
  }
}
</i18n>
