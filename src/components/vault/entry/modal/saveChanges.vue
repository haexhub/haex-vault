<template>
  <UiDialog
    v-model:open="showConfirmation"
    :title="t('dialog.title')"
  >
    {{ t('dialog.question') }}
    <template #buttons>
      <button
        class="btn btn-outline btn-error focus:bg-primary"
        tabindex="10"
        @click="$emit('reject')"
      >
        {{ t('dialog.reject') }}
      </button>
      <button
        class="btn btn-outline focus:bg-primary"
        tabindex="11"
        ref="abortButtonRef"
        @click="showConfirmation = false"
      >
        {{ t('dialog.abort') }}
      </button>
      <button
        class="btn btn-outline btn-success"
        tabindex="12"
        @click="$emit('submit')"
      >
        {{ t('dialog.save') }}
      </button>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
const showConfirmation = defineModel<boolean>();
const abortButtonRef = useTemplateRef('abortButtonRef');

const { t } = useI18n();

onUpdated(() => {
  abortButtonRef.value?.focus();
});

defineEmits(['submit', 'reject']);
</script>

<i18n lang="json">
{
  "de": {
    "dialog": {
      "title": "Ungespeicherte Änderungen",
      "question": "Möchten Sie die Änderungen speichern?",
      "reject": "Verwerfen",
      "abort": "Abbrechen",
      "save": "Speichern"
    }
  },
  "en": {
    "dialog": {
      "title": "Unsaved Changes",
      "question": "Would you like to save the changes?",
      "reject": "Reject",
      "abort": "Abort",
      "save": "Save"
    }
  }
}
</i18n>
