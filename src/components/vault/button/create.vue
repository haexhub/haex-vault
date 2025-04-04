<template>
  <UiDialog
    :title="t('title')"
    v-model:open="open"
  >
    <template #trigger>
      <button
        class="btn btn-primary btn-outline shadow-md md:btn-lg shrink-0 flex-1 whitespace-nowrap flex-nowrap"
        @click="open = true"
      >
        <Icon name="mdi:plus" />
        {{ t('database.create') }}
      </button>
    </template>

    <div
      class="flex flex-col gap-4"
      @keyup.enter="onCreate"
    >
      <UiInput
        :check-input="check"
        :label="t('database.label')"
        :placeholder="t('database.placeholder')"
        :rules="vaultDatabaseSchema.name"
        autofocus
        prepend-icon="mdi:safe"
        v-model="database.name"
      />

      <UiInputPassword
        :check-input="check"
        :rules="vaultDatabaseSchema.password"
        prepend-icon="mdi:key-outline"
        v-model="database.password"
      />
    </div>

    <template #buttons>
      <UiButton
        class="btn-error"
        @click="onClose"
      >
        {{ t('abort') }}
      </UiButton>

      <UiButton
        class="btn-primary"
        @click="onCreate"
      >
        {{ t('create') }}
      </UiButton>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import { save } from '@tauri-apps/plugin-dialog';
import { useVaultStore } from '~/stores/vault';
import { vaultDatabaseSchema } from '@/database/schemas/vault';

const check = ref(false);
const open = ref();

const { t } = useI18n();

const database = reactive<{
  name: string;
  password: string;
  path: string | null;
  type: 'password' | 'text';
}>({
  name: '',
  password: '',
  path: '',
  type: 'password',
});

const initDatabase = () => {
  database.name = t('database.name');
  database.password = '';
  database.path = '';
  database.type = 'password';
};

initDatabase();

const { add } = useSnackbar();
const { createAsync } = useVaultStore();
const { show } = storeToRefs(useSidebarStore());

const onCreate = async () => {
  check.value = true;

  const nameCheck = vaultDatabaseSchema.name.safeParse(database.name);
  const passwordCheck = vaultDatabaseSchema.password.safeParse(
    database.password
  );

  console.log(
    'checks',
    database.name,
    nameCheck,
    database.password,
    passwordCheck
  );
  if (!nameCheck.success || !passwordCheck.success) return;

  open.value = false;
  try {
    database.path = await save({ defaultPath: `${database.name}.db` });

    console.log('data', database);
    if (database.path && database.password) {
      const vaultId = await createAsync({
        path: database.path,
        password: database.password,
      });
      show.value = true;

      await navigateTo(
        useLocaleRoute()({ name: 'vaultGroup', params: { vaultId } })
      );
    }
  } catch (error) {
    console.error(error);
    add({ type: 'error', text: JSON.stringify(error) });
  }
};

const onClose = () => {
  open.value = false;
  initDatabase();
};
</script>

<i18n lang="json">
{
  "de": {
    "database": {
      "label": "Datenbankname",
      "placeholder": "Passwörter",
      "create": "Neue Vault anlegen",
      "name": "Passwörter"
    },
    "title": "Neue Datenbank anlegen",
    "create": "Erstellen",
    "abort": "Abbrechen",
    "description": "Haex Vault für deine geheimsten Geheimnisse"
  },

  "en": {
    "database": {
      "label": "Databasename",
      "placeholder": "Databasename",
      "create": "Create new Vault",
      "name": "Passwords"
    },
    "title": "Create New Database",
    "create": "Create",
    "abort": "Abort",
    "description": "Haex Vault for your most secret secrets"
  }
}
</i18n>
