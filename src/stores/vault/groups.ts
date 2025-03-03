import { eq, isNull, sql } from 'drizzle-orm';
import {
  vaultGroup,
  type InsertVaultGroup,
  type SelectVaultEntry,
  type SelectVaultGroup,
} from '~/database/schemas/vault';

export const useVaultGroupStore = defineStore(
  'vaultGroupStore',
  () => {
    const groups = ref<SelectVaultGroup[]>([]);
    const folder = ref<ITreeItem[]>([]);

    const currentGroupId = computed<string | null>({
      get: () =>
        getSingleRouteParam(useRouter().currentRoute.value.params.groupId) ||
        null,
      set: (newGroupId) => {
        console.log('set groupId', newGroupId);
        useRouter().currentRoute.value.params.groupId = newGroupId ?? '';
      },
    });

    const currentGroup = ref<SelectVaultGroup>();

    const currentGroupItems = reactive<{
      entries: SelectVaultEntry[];
      groups: SelectVaultGroup[];
    }>({
      entries: [],
      groups: [],
    });

    watch(
      currentGroupId,
      async () => {
        //const { getByParentIdAsync } = useVaultGroupStore();
        const { getByGroupAsync } = useVaultEntryStore();
        currentGroup.value = groups.value.find(
          (group) => group.id === currentGroupId.value
        );
        currentGroupItems.groups =
          (await getByParentIdAsync(currentGroupId.value)) ?? [];
        currentGroupItems.entries =
          (await getByGroupAsync(currentGroupId.value)) ?? [];
        console.log('search current group', groups.value, currentGroup.value);
      },
      { immediate: true }
    );
    const isGroupActive = (id?: string | null) =>
      computed(() => currentGroupId.value == id);

    return {
      createAsync,
      currentGroup,
      currentGroupId,
      currentGroupItems,
      folder,
      getAsync,
      getByParentIdAsync,
      getFolders,
      groups,
      isGroupActive,
      navigateToGroupAsync,
      navigateToGroupEntriesAsync,
      updateAsync,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies({
        sameSite: 'strict',
      }),
    },
  }
);

const createAsync = async (group: InsertVaultGroup) => {
  const { currentVault, refreshDatabaseAsync } = useVaultStore();
  const { currentGroupId } = useVaultGroupStore();

  group.id = crypto.randomUUID();
  group.parentId = group.parentId || currentGroupId;
  console.log('store create group', group);
  await currentVault?.drizzle.insert(vaultGroup).values(group);

  await refreshDatabaseAsync();
  return group.id;
};

const updateAsync = async (group: InsertVaultGroup) => {
  const { currentVault, refreshDatabaseAsync } = useVaultStore();

  console.log('store edit group', group);

  const update = await currentVault?.drizzle
    .update(vaultGroup)
    .set(group)
    .where(eq(vaultGroup.id, group.id));

  await refreshDatabaseAsync();
  console.log('edit finish', update);
  return group.id;
};

const getAsync = async (param?: {
  groupId?: string | null;
  parentId?: string | null;
}) => {
  try {
    const { currentVault } = useVaultStore();

    if (typeof currentVault?.database?.close !== 'function') {
      return;
    }

    if (param?.groupId) {
      const groups = await currentVault.drizzle
        .select()
        .from(vaultGroup)
        .where(eq(vaultGroup.id, param.groupId));

      console.log('found groups by groupId', groups);
      return groups;
    } else if (param?.parentId === null) {
      const groups = await currentVault.drizzle
        .select()
        .from(vaultGroup)
        .where(isNull(vaultGroup.parentId))
        .orderBy(sql`${vaultGroup.order} nulls last`);

      console.log('found groups', groups);
      return groups;
    }
  } catch (error) {
    console.error(error);
  }
};

const getByParentIdAsync = async (parentId?: string | null) => {
  try {
    const { currentVault } = useVaultStore();

    if (typeof currentVault?.database?.close !== 'function') {
      return;
    }

    if (parentId) {
      const groups = await currentVault.drizzle
        .select()
        .from(vaultGroup)
        .where(eq(vaultGroup.parentId, parentId))
        .orderBy(sql`${vaultGroup.order} nulls last`);

      console.log('found groups', groups);
      return groups;
    } else {
      const groups = await currentVault.drizzle
        .select()
        .from(vaultGroup)
        .where(isNull(vaultGroup.parentId))
        .orderBy(sql`${vaultGroup.order} nulls last`);

      console.log('found groups', groups);
      return groups;
    }
  } catch (error) {
    console.error(error);
  }
};

const getFolders = (groups: SelectVaultGroup[]) => {
  // Store references to nodes by their IDs
  const nodeMap: Record<string, ITreeItem> = {};

  const result: ITreeItem[] = [];

  groups
    ?.sort((a, b) => a.order ?? 0 - (b.order ?? 0))
    ?.forEach((group) => {
      console.log('groupId', group.id, group.parentId);
      nodeMap[group.id] = {
        ...group,
        children: [],
        type: 'folder',
        value: group.id,
        order: group.order,
      };
    });

  groups?.forEach((group) => {
    //console.log('loop over group', group.name, group.order);
    const node = nodeMap[group.id];

    if (group.parentId !== null) {
      nodeMap[group.parentId].children?.push(node);
    } else {
      result.push(node);
    }
  });
  //console.log('group tree', result);
  return result;
};

const navigateToGroupAsync = (
  groupId?: string | null,
  read_only: boolean = true
) =>
  navigateTo(
    useLocaleRoute()({
      name: 'vaultGroupEdit',
      params: {
        vaultId: useRouter().currentRoute.value.params.vaultId,
        groupId,
      },
      query: {
        ...useRouter().currentRoute.value.query,
        readonly: JSON.stringify(read_only),
      },
    })
  );

const navigateToGroupEntriesAsync = (groupId?: string | null) =>
  navigateTo(
    useLocaleRoute()({
      name: 'vaultGroupEntries',
      params: {
        vaultId: useRouter().currentRoute.value.params.vaultId,
        groupId,
      },
      query: {
        ...useRouter().currentRoute.value.query,
      },
    })
  );
