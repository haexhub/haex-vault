<template>
  <UiDialog v-model:open="isOpen">
    <!-- @close="initDatabase" -->
    <template #trigger>
      <button
        class="btn btn-primary btn-outline shadow-md btn-lg shrink-0 flex-1"
        @click="onLoadDatabase"
      >
        <Icon name="mdi:folder-open-outline" />
        {{ t('database.open') }}
      </button>
    </template>

    <UiInputPassword
      :check-input="check"
      :rules="vaultDatabaseSchema.password"
      @keyup.enter="onOpenDatabase"
      autofocus
      prepend-icon="mdi:key-outline"
      v-model="database.password"
    />

    <template #buttons>
      <button
        class="btn btn-error"
        @click="onClose"
      >
        {{ t('abort') }}
      </button>

      <button
        type="submit"
        class="btn btn-primary"
        @click="onOpenDatabase"
      >
        {{ t('open') }}
      </button>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import { open } from '@tauri-apps/plugin-dialog';
import { vaultDatabaseSchema } from '@/database/schemas/vault';

const { t } = useI18n();

const isOpen = defineModel('isOpen', { type: Boolean });

const props = defineProps({
  path: String,
});

const check = ref(false);

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
  database.name = '';
  database.password = '';
  database.path = '';
  database.type = 'password';
};

initDatabase();

const { add } = useSnackbar();

const handleError = (error: unknown) => {
  isOpen.value = false;
  add({ type: 'error', text: JSON.stringify(error) });
  //console.error(error);
};

const { openAsync } = useVaultStore();
//const { show } = storeToRefs(useSidebarStore());

const onLoadDatabase = async () => {
  try {
    database.path = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: 'HaexVault',
          extensions: ['db'],
        },
      ],
    });

    if (!database.path) return;

    isOpen.value = true;
  } catch (error) {
    handleError(error);
  }
};

const localePath = useLocalePath();
const onOpenDatabase = async () => {
  try {
    check.value = true;
    const path = database.path || props.path;
    const pathCheck = vaultDatabaseSchema.path.safeParse(path);
    const passwordCheck = vaultDatabaseSchema.password.safeParse(
      database.password
    );

    if (!pathCheck.success || !passwordCheck.success || !path) {
      add({ type: 'error', text: 'params falsch' });
      return;
    }

    //console.log('try to open', path);

    const vaultId = await openAsync({
      path,
      password: database.password,
    });

    onClose();

    await navigateTo(
      localePath({
        name: 'vaultGroup',
        params: {
          vaultId,
        },
        query: {
          showSidebar: 'true',
        },
      })
    );
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

const onClose = () => {
  initDatabase();
  isOpen.value = false;
};
</script>

<i18n lang="json">
{
  "de": {
    "open": "Öffnen",
    "abort": "Abbrechen",
    "database": {
      "open": "Vault öffnen"
    }
  },

  "en": {
    "open": "Open",
    "abort": "Abort",
    "database": {
      "open": "Open Vault"
    }
  }
}
</i18n>
