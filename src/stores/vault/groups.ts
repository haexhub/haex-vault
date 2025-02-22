import { eq, sql } from 'drizzle-orm';
import {
  vaultGroup,
  type InsertVaultGroup,
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

    watch(currentGroupId, () => {
      currentGroup.value = groups.value.find(
        (group) => group.id === currentGroupId.value
      );
    });
    const isGroupActive = (id?: string | null) =>
      computed(() => currentGroupId.value == id);

    return {
      createAsync,
      currentGroup,
      currentGroupId,
      folder,
      getAsync,
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
  vaultId?: string | null;
  groupId?: string | null;
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
    } else {
      const groups = await currentVault.drizzle
        .select()
        .from(vaultGroup)
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

  // Store the root nodes of the tree
  /* const rootNode: ITreeItem = {
    name: currentVault.value?.name,
    type: 'folder',
    value: '',
    children: [],
    id: '',
  }; */
  const result: ITreeItem[] = [];
  /* const _groups = JSON.parse(
    JSON.stringify(groups.value)
  ) as SelectVaultGroup[]; */
  groups
    ?.sort((a, b) => a.order ?? 0 - (b.order ?? 0))
    ?.forEach((group) => {
      console.log('groupId', group.id, group.parentId);
      nodeMap[group.id] = {
        ...group,
        children: [],
        type: 'folder',
        value: group.id,
        //isActive: useVaultGroupStore().isGroupActive(group.id),
        order: group.order,
      };
    });

  groups?.forEach((group) => {
    //console.log('loop over group', group.name, group.order);
    const node = nodeMap[group.id];

    if (group.parentId !== null) {
      nodeMap[group.parentId].children?.push(node);
    } else {
      //rootNode.children?.push(node);
      //nodeMap['root'].children?.push(node);
      //result.at(0)?.children?.push(node);
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
        ...useRouter().currentRoute.value.params,
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
        ...useRouter().currentRoute.value.params,
        groupId,
      },
      query: {
        ...useRouter().currentRoute.value.query,
      },
    })
  );
