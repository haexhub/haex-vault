<template>
  <div data-nested-draggable="">
    <div
      :data-tree-view-item="{
        isDir,
        value,
      }"
      class="accordion-item"
      role="treeitem"
      :id
      :class="isActive ? 'active' : ''"
    >
      <div
        class="accordion-heading tree-view-selected:bg-base-200/60 flex w-full items-center gap-x-0.5 rounded-md py-0.5"
      >
        <button
          class="accordion-toggle btn btn-sm btn-circle btn-text"
          :aria-expanded="isActive"
          :aria-controls="controlId"
          @click="isActive = !isActive"
        >
          <span
            class="icon-[tabler--plus] text-base-content/80 accordion-item-active:rotate-45 size-4 transition-all duration-300"
          ></span>
        </button>
        <div
          class="tree-view-selected:bg-base-200/60 grow cursor-pointer rounded-md px-1.5"
        >
          <div class="flex items-center gap-x-3">
            <span
              class="icon-[tabler--folder] text-base-content size-4 flex-shrink-0"
            ></span>
            <div class="grow">
              <span class="text-base-content">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        :id="controlId"
        class="accordion-content w-full overflow-hidden transition-[height] duration-300"
        role="group"
        :aria-labelledby="id"
      >
        <div
          class="tree-view-space"
          data-nested-draggable=""
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isDir: Boolean,
  value: [String, Number],
});

const id = useId();
const controlId = useId();
const isActive = ref(false);
</script>
