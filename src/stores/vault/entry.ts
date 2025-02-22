import { eq, isNull, sql } from 'drizzle-orm';
import {
  type InsertVaultEntry,
  type SelectVaultEntry,
  vaultEntry,
  vaultEntryHistory,
  vaultGroupEntry,
} from '~/database/schemas/vault';

export const useVaultEntryStore = defineStore('vaultEntryStore', () => {
  const currentEntryId = computed({
    get: () =>
      getSingleRouteParam(useRouter().currentRoute.value.params.entryId),
    set: (entryId) => {
      console.log('set entryId', entryId);
      useRouter().currentRoute.value.params.entryId = entryId ?? '';
    },
  });

  return {
    currentEntryId,
    createAsync,
    getByGroupAsync,
    getAsync,
    hasChanges,
    navigateToEntryAsync,
    updateAsync,
  };
});

const hasChanges = (
  vaultEntry: SelectVaultEntry,
  originally?: SelectVaultEntry
) => {
  if (!originally) {
    if (
      vaultEntry.note?.length ||
      vaultEntry.password?.length ||
      vaultEntry.tags?.length ||
      vaultEntry.title?.length ||
      vaultEntry.url?.length ||
      vaultEntry.urlAliases?.length ||
      vaultEntry.username?.length
    ) {
      return true;
    } else {
      return false;
    }
  }
  return JSON.stringify(originally ?? {}) !== JSON.stringify(vaultEntry);
};

const getByGroupAsync = async (groupId?: string | null) => {
  try {
    const { currentVault } = useVaultStore();
    console.log('get entries by groupId', groupId || null);
    if (typeof currentVault?.database?.close !== 'function') {
      return [];
    }

    if (groupId) {
      const entries = await currentVault.drizzle
        .select()
        .from(vaultGroupEntry)
        .innerJoin(vaultEntry, eq(vaultEntry.id, vaultGroupEntry.entryId))
        .where(eq(vaultGroupEntry.groupId, groupId));

      console.log('found entries by groupId', entries);
      return entries.map((entry) => entry.vault_entry);
    } else {
      const entries = await currentVault.drizzle
        .select()
        .from(vaultGroupEntry)
        .innerJoin(vaultEntry, eq(vaultEntry.id, vaultGroupEntry.entryId))
        .where(isNull(vaultGroupEntry.groupId));

      console.log('found entries', entries);
      return entries.map((entry) => entry.vault_entry);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getAsync = async (entryId: string | null) => {
  if (!entryId) return null;

  try {
    const { currentVault } = useVaultStore();

    if (typeof currentVault?.database?.close !== 'function') {
      throw new Error('Datenbank ist nicht geladen');
    }

    const entry = await currentVault.drizzle
      .select()
      .from(vaultEntry)
      .where(eq(vaultEntry.id, entryId));

    console.log('found entry by id', entry);
    return entry.at(0);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createAsync = async (entry: InsertVaultEntry) => {
  const { currentVault } = useVaultStore();
  const { currentGroupId } = useVaultGroupStore();

  entry.id = crypto.randomUUID();
  entry.createdAt = null;
  entry.updateAt = null;
  console.log('store create entry', entry, currentGroupId);
  await currentVault?.drizzle.transaction(async (tx) => {
    await tx.insert(vaultEntry).values(entry);
    await tx
      .insert(vaultGroupEntry)
      .values({ entryId: entry.id, groupId: currentGroupId });
  });

  return entry.id;
};

const updateAsync = async (
  new_entry: InsertVaultEntry,
  old_entry: InsertVaultEntry
) => {
  if (!new_entry.id || new_entry.id !== old_entry.id) return;

  const { currentVault } = useVaultStore();

  return currentVault?.drizzle.transaction(async (tx) => {
    for (const key of Object.keys(new_entry)) {
      if (!isKey(new_entry, key) && !isKey(old_entry, key)) continue;

      if (new_entry[key] !== old_entry[key]) {
        console.log('difference', key, new_entry[key], old_entry[key]);

        await tx.insert(vaultEntryHistory).values({
          id: crypto.randomUUID(),
          changedProperty: `${key}`,
          entryId: new_entry.id,
          newValue: `${new_entry[key]}`,
          oldValue: `${old_entry[key]}`,
        });
      }
    }

    return await tx
      .update(vaultEntry)
      .set(new_entry)
      .where(eq(vaultEntry.id, new_entry.id!))
      .returning();
  });
};

const navigateToEntryAsync = async (entryId: string) =>
  navigateTo(
    useLocaleRoute()({
      name: 'vaultEntryEdit',
      params: {
        ...useRouter().currentRoute.value.params,
        entryId,
      },
      query: {
        ...useRouter().currentRoute.value.query,
        readonly: JSON.stringify(true),
      },
    })
  );
