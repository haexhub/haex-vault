<template>
  <button
    :type
    class="btn flex text-center items-center justify-center align-middle font-sans font-medium transition-all disabled:pointer-events-none rounded gap-2 duration-500"
    :class="{ 'p-1': icon }"
  >
    <i
      v-if="icon"
      :class="icon"
      class="text-inherit min-w-1 min-h-1"
    ></i>
    <Icon :name="prepandIcon" />
    <slot />
    <Icon :name="appendIcon" />
  </button>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: '',
  },

  type: {
    type: String as PropType<'reset' | 'submit' | 'button'>,
    default: 'button',
  },

  icon: {
    type: String || Array,
    default: '',
  },

  prepandIcon: {
    type: String,
    default: '',
  },

  appendIcon: {
    type: String,
    default: '',
  },
});
</script>
