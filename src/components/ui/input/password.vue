<template>
  <UiInput
    :check-input
    :label="label || t('password')"
    :placeholder="placeholder || t('password')"
    :rules
    :type="type"
    :autofocus
    v-model="value"
  >
    <template #append>
      <button
        class="btn btn-outline btn-accent join-item h-auto"
        @click="tooglePasswordType"
        type="button"
      >
        <Icon :name="type === 'password' ? 'mdi:eye' : 'mdi:eye-off'" />
      </button>
    </template>
  </UiInput>
</template>

<script setup lang="ts">
import type { ZodSchema } from 'zod';

const { t } = useI18n();
const value = defineModel<string | number | null | undefined>();

defineProps({
  label: String,
  placeholder: String,
  checkInput: Boolean,
  rules: Object as PropType<ZodSchema>,
  autofocus: Boolean,
});

const type = ref<'password' | 'text'>('password');

const tooglePasswordType = () => {
  type.value = type.value === 'password' ? 'text' : 'password';
};
</script>

<i18n lang="json">
{
  "de": {
    "password": "Passwort"
  },
  "en": {
    "password": "Password"
  }
}
</i18n>
