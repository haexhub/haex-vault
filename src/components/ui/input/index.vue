<template>
  <span>
    <fieldset class="join w-full">
      <slot name="prepend" />

      <span class="input-group join-item">
        <span
          v-if="prependIcon || prependLabel"
          class="input-group-text"
        >
          <label v-if="prependLabel">
            {{ prependLabel }}
          </label>
          <Icon :name="prependIcon" />
        </span>

        <div class="grow relative">
          <input
            :id
            :name="name ?? id"
            :placeholder="placeholder || label"
            :type
            :autofocus
            class="input input-floating peer join-item"
            v-bind="$attrs"
            v-model="input"
            ref="inputRef"
            :readonly="read_only"
          />

          <label
            v-if="label"
            :for="id"
            class="input-floating-label"
          >
            {{ label }}
          </label>
        </div>

        <span
          v-if="appendIcon || appendLabel"
          class="input-group-text"
        >
          <label
            v-if="appendLabel"
            class=""
          >
            {{ appendLabel }}
          </label>
          <Icon :name="appendIcon" />
        </span>
      </span>

      <slot name="append" />

      <button
        v-if="withCopyButton"
        class="btn btn-outline btn-accent join-item h-auto"
        @click="copy(`${input}`)"
        type="button"
      >
        <Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" />
      </button>
    </fieldset>

    <span
      class="flex flex-col px-2 pt-0.5"
      v-show="errors"
    >
      <span
        v-for="error in errors"
        class="label-text-alt text-error"
      >
        {{ error }}
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { type ZodSchema } from 'zod';

const inputRef = useTemplateRef('inputRef');
defineExpose({ inputRef });

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<
      | 'button'
      | 'checkbox'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      | 'image'
      | 'month'
      | 'number'
      | 'password'
      | 'radio'
      | 'range'
      | 'reset'
      | 'search'
      | 'submit'
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week'
    >,
    default: 'text',
  },
  label: String,
  name: String,
  prependIcon: {
    type: String,
    default: '',
  },
  prependLabel: String,
  appendIcon: {
    type: String,
    default: '',
  },
  appendLabel: String,
  rules: Object as PropType<ZodSchema>,
  checkInput: Boolean,
  withCopyButton: Boolean,
  autofocus: Boolean,
  read_only: Boolean,
});

const input = defineModel<string | number | undefined | null>({
  default: '',
  required: true,
});

onMounted(() => {
  if (props.autofocus && inputRef.value) inputRef.value.focus();
});

const errors = defineModel<string[] | undefined>('errors');

const id = useId();

watch(input, () => checkInput());

watch(
  () => props.checkInput,
  () => {
    checkInput();
  }
);

const emit = defineEmits(['error']);

const checkInput = () => {
  if (props.rules) {
    const result = props.rules.safeParse(input.value);
    //console.log('check result', result.error, props.rules);
    if (!result.success) {
      errors.value = result.error.errors.map((error) => error.message);
      emit('error', errors.value);
    } else {
      errors.value = [];
    }
  }
};

const { copy, copied } = useClipboard();
</script>
