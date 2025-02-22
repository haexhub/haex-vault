<template>
  <div class="relative w-full">
    <textarea
      v-bind="$attrs"
      class="textarea textarea-floating peer"
      :placeholder
      :id
      v-model="value"
      :readonly="!read_only"
    ></textarea>
    <label
      class="textarea-floating-label"
      :for="id"
      >{{ label }}</label
    >
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const id = useId();
defineProps({
  placeholder: String,
  label: String,
  read_only: Boolean,
});

const value = defineModel<string | null | undefined>();
</script>
