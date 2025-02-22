<template>
  <div
    v-if="currentVault"
    class="flex flex-col grow"
  >
    <button
      class="hover:bg-primary/20 px-4 py-4 text-start"
      :class="{
        'bg-primary/60': useVaultGroupStore().isGroupActive().value,
      }"
      @click="goTo('')"
    >
      <span class="sticky left-4">
        {{ currentVault.name }}
      </span>
    </button>
    <!-- <NuxtLinkLocale
      :to="{
        name: 'vaultGroupEntries',

        query: {},
      }"
      class="hover:bg-primary/20 sticky left-4 px-4 py-2 bg-teal-200"
      :class="{
        'bg-primary/60': isActive('').value,
      }"
    >
      {{ currentVault.name }}
    </NuxtLinkLocale> -->

    <!-- <button
        class="btn btn-square"
        @click="toogle"
      >
        <Icon
          class="transition duration-500"
          :class="{ 'rotate-180': isVisible }"
          name="mdi:chevron-down"
        />
      </button>
    </div>
    <button
      class="btn collapse-toggle hidden"
      ref="content"
      data-collapse="#method-collapse-heading"
    >
      {{ currentVault.name }}
      <Icon
        class="collapse-open:rotate-180"
        name="mdi:chevron-down"
      />
    </button>
    <div
      id="method-collapse-heading"
      class="collapse hidden w-full overflow-hidden transition-[height] duration-300"
      aria-labelledby="method-collapse"
    > -->

    <!-- <UiTree>
      <template
        v-for="(group, index) in folder"
        :key="`id-${group.id!}`"
      >
        <UiTreeFolder
          :tabindex="index"
          :children="
            group.children?.sort((a, b) => b.order ?? 0 - (a.order ?? 0))
          "
          @edit="editGroup"
          @click="goTo"
          v-bind="group"
        >
        </UiTreeFolder>
      </template>
    </UiTree> -->

    <UiTree2
      v-model="folder"
      @edit="editGroup"
      @click="goTo"
      @update="onUpdate"
    />
  </div>
</template>

<script setup lang="ts">
const { currentVault } = storeToRefs(useVaultStore());
const { folder } = storeToRefs(useVaultGroupStore());
const { currentScreenSize } = storeToRefs(useUiStore());

const checkFolderAsync = async (
  parentId: string | null | undefined,
  item: ITreeItem,
  order: number = 0
) => {
  if (item.parentId !== parentId || item.order !== order) {
    console.log('parent has changed', item, parentId);
    await useVaultGroupStore().updateAsync({
      id: item.id!,
      name: item.name,
      parentId,
      order,
    });
  }

  if (!item.children) return;

  for (const [index, child] of item.children.entries()) {
    await checkFolderAsync(item.id, child, index);
  }
};
const onUpdate = async () => {
  for (const [index, item] of folder.value.entries()) {
    await checkFolderAsync(null, item, index);
  }
};

const goTo = async (groupId?: string) => {
  console.log('goto');
  await navigateTo(
    useLocalePath()({
      name: 'vaultGroupEntries',
      params: {
        groupId, //: encodeURIComponent(groupId ?? ''),
      },
      query: {
        ...useRoute().query,
        showSidebar:
          currentScreenSize.value === '' ||
          currentScreenSize.value === 'sm' ||
          currentScreenSize.value === 'xs'
            ? 'false'
            : 'true',
      },
    })
  );
  //console.log('new route', useRoute().path);
  //await navigateTo(useLocaleRoute()({ params: { groupId } }));
};

const editGroup = async (groupId?: string) => {
  console.log('edit group', groupId);
  await navigateTo(
    useLocalePath()({
      name: 'vaultGroupEdit',
      params: {
        groupId, //: encodeURIComponent(groupId ?? ''),
      },
      query: {
        ...useRoute().query,
        showSidebar: currentScreenSize.value === 'xs' ? 'false' : 'true',
        readonly: JSON.stringify(false),
      },
    })
  );
};
</script>
