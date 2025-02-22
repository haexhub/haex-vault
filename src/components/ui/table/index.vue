<template>
  <div class="w-full overflow-x-auto rounded-lg px-1 pb-1 max-h-full">
    <table class="table table-pin-rows rounded">
      <thead>
        <tr>
          <th v-for="header in headers">{{ header?.label }}</th>
        </tr>
      </thead>
      <tbody ref="tableRef">
        <tr
          :class="{ 'bg-primary/10': selected.has(row) }"
          :tabindex="index + 2"
          @click.exact="toogleSelect(row)"
          @click.shift.exact="toogleMultiSelect(row)"
          @dblclick="$emit('dbClick', row)"
          @focus="toogleSelect(row)"
          @keyup.enter="selected.has(row) ? $emit('dbClick', row) : ''"
          class="cursor-pointer hover h-10"
          v-for="(row, index) in items"
        >
          <td
            v-for="column in headers"
            tabindex="-1"
          >
            <slot
              :name="`column-${column['item-value']}`"
              :item="row[column['item-value']]"
              :row
            >
              {{ row[column['item-value']] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends { [key: string]: any}">
const props = defineProps({
  headers: {
    type: Array as PropType<ITableHeader[]>,
    default: () => [],
  },
  items: Array as PropType<T[]>,
  autofocus: Boolean,
});

const emit = defineEmits<{ select: [T[] | T]; dbClick: [T] }>();

const selected = ref(new Set<T>()) as Ref<Set<T>>;

const toogleSelect = (item: T) => {
  if (selected.value.has(item)) {
    selected.value.delete(item);
  } else {
    selected.value.clear();
    selected.value.add(item);
    emit('select', item);
  }
};

const toogleMultiSelect = (item: T) => {
  if (selected.value.has(item)) {
    selected.value.delete(item);
  } else {
    selected.value.add(item);
  }

  emit('select', Array.from(selected.value));
};
const tableRef = useTemplateRef('tableRef');
onMounted(() => {
  if (props.autofocus && tableRef.value) tableRef.value?.focus();
});
</script>
