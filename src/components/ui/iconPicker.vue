<template>
  <UiSelect
    v-model="icon"
    :options="icons"
  >
    <template #value="{ value }">
      <Icon
        :name="value"
        v-if="value"
      />
    </template>
    <template #option="{ option }">
      <Icon :name="option ?? ''" />
    </template>
  </UiSelect>
</template>

<script setup lang="ts">
const icons = [
  'streamline:money-bank-institution-money-saving-bank-payment-finance',
  'material-symbols:star-outline-rounded',
  'pepicons-pop:smartphone-home-button',
  'majesticons:desktop-computer-line',
];

const icon = defineModel<string | undefined | null>({ default: '' });
</script>
