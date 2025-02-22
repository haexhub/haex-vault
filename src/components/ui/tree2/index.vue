<template>
  <div
    aria-orientation="vertical"
    class="rounded min-w-fit w-full"
    ref="el"
    role="tree"
  >
    <div
      :class="{
        'selected': useVaultGroupStore().isGroupActive(item.id).value,
        'text-base-content': !item.color,
      }"
      :data-tree-view-item="JSON.stringify({ value: item.value })"
      :key="item.id ?? item.value"
      :name="item.name"
      :style="{ color: item.color || '' }"
      :value="item.value"
      class="accordion-item active motion-preset-slide-left motion-ease-spring-bouncier"
      isDir
      role="treeitem"
      v-for="item in items"
    >
      <div
        class="accordion-heading tree-view-selected:bg-primary/80 flex items-center rounded-md hover:bg-primary/20 group"
      >
        <button
          :aria-controls="controlId"
          class="accordion-toggle btn btn-sm btn-circle btn-text shrink-0"
        >
          <Icon
            class="accordion-item-active:rotate-45 size-4 transition-all duration-300"
            name="tabler:plus"
          />
        </button>
        <button
          @click.stop="$emit('click', item.value)"
          class="cursor-pointer rounded-md px-1.5 w-full"
        >
          <div class="flex items-center gap-x-2">
            <Icon
              :name="item.icon || 'mdi:folder-outline'"
              class="shrink-0"
            />

            <div class="flex whitespace-nowrap">
              {{ item.name }}
            </div>
          </div>
        </button>
        <button
          @click.stop="$emit('edit', item.value)"
          class="sticky right-2 btn btn-sm btn-circle btn-text shrink-0 group-hover:flex hidden ml-auto"
        >
          <Icon
            name="mdi:pencil-outline"
            class="size-4 transition-all duration-300"
          />
        </button>
      </div>

      <div
        :aria-labelledby="id"
        :id="controlId"
        class="accordion-content w-full transition-[height] duration-300"
        role="group"
      >
        <div class="tree-view-space min-h-1">
          <slot>
            <UiTree2
              @click="(value) => $emit('click', value)"
              @edit="(value) => $emit('edit', value)"
              @update="(value) => $emit('update', value)"
              v-if="item.children"
              v-model="item.children"
            />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from 'vue-draggable-plus';

const id = useId();
const controlId = useId();

const el = ref<HTMLElement | null>(null);

const items = defineModel<ITreeItem[]>({ default: () => [] });

const emit = defineEmits<{
  click: [value: string | undefined];
  edit: [value: string | undefined];
  update: [void];
}>();

useDraggable(el, items, {
  animation: 150,
  ghostClass: 'bg-opacity-20',
  group: 'vault',
  swapThreshold: 0.65,
  fallbackOnBody: true,
  fallbackTolerance: 3,

  onEnd() {
    emit('update');
  },
});
</script>
