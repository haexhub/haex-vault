<template>
  <div class="h-full overflow-scroll">
    <div
      class="flex flex-col gap-4 w-full p-4"
      @keyup.enter="$emit('submit', vaultEntry)"
    >
      <UiInput
        v-if="!read_only"
        :read_only
        :check-input="check"
        :label="t('entry.title')"
        :placeholder="t('entry.title')"
        :rules="vaultEntrySchema.title"
        :with-copy-button="read_only"
        autofocus
        ref="titleRef"
        v-model.trim="vaultEntry.title"
      />

      <UiInput
        v-if="!read_only || vaultEntry.username"
        :read_only
        :check-input="check"
        :label="t('entry.username')"
        :placeholder="t('entry.username')"
        :rules="vaultEntrySchema.username"
        :with-copy-button="read_only"
        v-model.trim="vaultEntry.username"
      />

      <UiInputPassword
        v-if="!read_only || vaultEntry.password"
        :read_only
        :check-input="check"
        :rules="vaultEntrySchema.password"
        :with-copy-button="read_only"
        v-model.trim="vaultEntry.password"
      />

      <UiInputUrl
        v-if="!read_only || vaultEntry.url"
        :label="t('entry.url')"
        :placeholder="t('entry.url')"
        :read_only
        :with-copy-button="read_only"
        v-model="vaultEntry.url"
      />

      <UiTextarea
        v-if="!read_only || vaultEntry.note"
        v-model="vaultEntry.note"
        :read_only
        :label="t('entry.note')"
        :placeholder="t('entry.note')"
        @keyup.enter.stop
        class="h-52"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { openUrl } from '@tauri-apps/plugin-opener';
import {
  vaultEntrySchema,
  type SelectVaultEntry,
} from '~/database/schemas/vault';

const { t } = useI18n();

const vaultEntry = defineModel<SelectVaultEntry>({ required: true });
const check = defineModel<boolean>('check-input');

const id = reactive({
  details: useId(),
  keyValue: useId(),
  history: useId(),
  content: {},
});

defineProps({
  icon: String,
  read_only: Boolean,
  title: String,
  withCopyButton: Boolean,
});

defineEmits<{
  submit: [vaultEntry: SelectVaultEntry];
  close: [void];
}>();
</script>

<i18n lang="json">
{
  "de": {
    "create": "Anlegen",
    "abort": "Abbrechen",
    "entry": {
      "title": "Titel",
      "username": "Nutzername",
      "password": "Passwort",
      "url": "Url",
      "note": "Notiz"
    }
  },
  "en": {
    "create": "Create",
    "abort": "Abort",
    "entry": {
      "title": "Title",
      "username": "Username",
      "password": "Password",
      "url": "Url",
      "note": "Note"
    }
  }
}
</i18n>
