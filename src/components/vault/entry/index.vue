<template>
  <VaultCard @close="onBack">
    <template #header>
      <div class="flex flex-wrap items-center justify-between w-full px-2 py-3">
        <div class="w-full flex gap-2 justify-between items-center">
          <button
            class="btn btn-square btn-primary btn-outline"
            @click="onBack"
          >
            <Icon
              name="mdi:chevron-left"
              size="32"
            />
          </button>
          <slot name="buttons">
            <div
              v-if="read_only"
              class="h-full"
            >
              <button
                class="btn btn-square btn-primary btn-outline"
                @click="read_only = false"
              >
                <Icon
                  name="mdi:pencil-outline"
                  size="24"
                />
              </button>
            </div>
            <div
              v-else
              class="flex gap-2 h-full"
            >
              <button
                class="btn btn-square btn-error btn-outline"
                @click="onBack"
              >
                <Icon name="mdi:cancel" />
                <span class="hidden"> {{ t('abort') }} </span>
              </button>
              <button
                class="btn btn-square btn-success btn-outline"
                @click="onSubmit"
              >
                <Icon name="mdi:check" />
                <span class="hidden"> {{ t('create') }} </span>
              </button>
            </div>
          </slot>
        </div>

        <div
          class="flex flex-col items-center w-full h-14 gap-2"
          :class="{ '-ml-6': !show }"
        >
          <Icon
            :name="
              vaultEntry.icon || currentGroup?.icon || 'mdi:folder-outline'
            "
            size="28"
          />
          <h5
            v-show="read_only"
            class="max-w-full overflow-hidden whitespace-nowrap"
          >
            {{ vaultEntry.title }}
          </h5>
        </div>
      </div>
    </template>

    <div class="min-h-full">
      <div class="pt-3">
        <div
          id="vaultDetailsId"
          role="tabpanel"
          :aria-labelledby="id.details"
        >
          <VaultEntryDetails
            v-model="vaultEntry"
            :with-copy-button
            :read_only
            @submit="onSubmit"
          >
          </VaultEntryDetails>
        </div>

        <div
          id="tabs-basic-2"
          class="hidden"
          role="tabpanel"
          :aria-labelledby="id.keyValue"
        >
          {{ originally }}
        </div>

        <div
          id="tabs-basic-3"
          class="hidden"
          role="tabpanel"
          :aria-labelledby="id.history"
        >
          <VaultEntryHistory :history />
        </div>
      </div>

      <nav
        aria-label="Tabs Vault Entry"
        aria-orientation="horizontal"
        class="tabs tabs-bordered fixed bottom-0 left-0 w-full transition-all duration-700"
        role="tablist"
        :class="{ 'pl-96': show }"
      >
        <button
          :id="id.details"
          aria-controls="vaultDetailsId"
          aria-selected="true"
          class="tab active-tab:tab-active active w-full"
          data-tab="#vaultDetailsId"
          role="tab"
          type="button"
        >
          <Icon
            name="material-symbols:key-outline"
            class="me-2"
          />
          {{ t('tab.details') }}
        </button>
        <button
          :id="id.keyValue"
          aria-controls="tabs-basic-2"
          aria-selected="false"
          class="tab active-tab:tab-active w-full"
          data-tab="#tabs-basic-2"
          role="tab"
          type="button"
        >
          <Icon
            name="fluent:group-list-20-filled"
            class="me-2"
          />
          <span class="hidden sm:block">
            {{ t('tab.keyValue') }}
          </span>
        </button>
        <button
          :id="id.history"
          aria-controls="tabs-basic-3"
          aria-selected="false"
          class="tab active-tab:tab-active w-full"
          data-tab="#tabs-basic-3"
          role="tab"
          type="button"
        >
          <Icon
            name="material-symbols:history"
            class="me-2"
          />
          {{ t('tab.history') }}
        </button>
      </nav>
    </div>
  </VaultCard>
  <VaultEntryModalSaveChanges
    v-model="showConfirmation"
    @reject="onReject"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import {
  type SelectVaultEntry,
  type SelectVaultEntryHistory,
} from '~/database/schemas/vault';

const { t } = useI18n();

const vaultEntry = defineModel<SelectVaultEntry>({ required: true });

const { header } = storeToRefs(useUiStore());
const { show } = storeToRefs(useSidebarStore());
const { currentGroup } = storeToRefs(useVaultGroupStore());

watch(
  vaultEntry,
  () => {
    header.value.text = vaultEntry.value.title;
    header.value.icon = vaultEntry.value.icon || currentGroup.value?.icon;
  },
  { immediate: true }
);

const id = reactive({
  details: useId(),
  keyValue: useId(),
  history: useId(),
  content: {},
});

const read_only = defineModel<boolean>('read_only', { default: false });

const props = defineProps({
  history: Array as PropType<SelectVaultEntryHistory[]>,
  icon: String,
  originally: Object as PropType<SelectVaultEntry>,
  title: String,
  withCopyButton: Boolean,
});

const emit = defineEmits<{
  submit: [to?: RouteLocationNormalizedLoadedGeneric];
  close: [void];
  back: [void];
  reject: [to?: RouteLocationNormalizedLoadedGeneric];
}>();

const showConfirmation = ref(false);

const hasChanges = computed(() => {
  console.log('has changes', props.originally, vaultEntry.value);
  if (!props.originally) {
    if (
      vaultEntry.value.note?.length ||
      vaultEntry.value.password?.length ||
      vaultEntry.value.tags?.length ||
      vaultEntry.value.title?.length ||
      vaultEntry.value.url?.length ||
      vaultEntry.value.urlAliases?.length ||
      vaultEntry.value.username?.length
    ) {
      return true;
    } else {
      return false;
    }
  }
  return (
    JSON.stringify(props.originally ?? {}) !== JSON.stringify(vaultEntry.value)
  );
});

const to = ref<RouteLocationNormalizedLoadedGeneric>();

const isSaved = ref(false);
const isRejected = ref(false);

const onSubmit = () => {
  console.log('entry onSubmit');
  showConfirmation.value = false;
  isSaved.value = true;
  emit('submit', to.value);
};

const onReject = () => {
  console.log('entry onReject');
  showConfirmation.value = false;
  isRejected.value = true;
  emit('reject', to.value);
};

const onBack = () => {
  console.log('entry onBack', read_only.value);
  if (hasChanges.value) {
    showConfirmation.value = true;
  } else {
    emit('back');
  }
};

onBeforeRouteLeave((_to, _from, next) => {
  console.log('check before leave', _to, _from);
  to.value = _to;
  if (isSaved.value || isRejected.value) {
    isSaved.value = false;
    isRejected.value = false;
    next();
  } else if (hasChanges.value) {
    showConfirmation.value = true;
  } else {
    next();
  }
});
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
      "url": "Url"
    },
    "tab": {
      "details": "Details",
      "keyValue": "Extra",
      "history": "Verlauf"
    }
  },
  "en": {
    "create": "Create",
    "abort": "Abort",
    "entry": {
      "title": "Title",
      "username": "Username",
      "password": "Password",
      "url": "Url"
    },
    "tab": {
      "details": "Details",
      "keyValue": "Extra",
      "history": "History"
    }
  }
}
</i18n>
