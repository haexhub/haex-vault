import { eq } from 'drizzle-orm';
import { vaultEntryHistory } from '~/database/schemas/vault';

export const useVaultEntryHistoryStore = defineStore(
  'vaultEntryHistory',
  () => {
    return { getAsync };
  }
);

const getAsync = async (entryId: string | null | undefined) => {
  if (!entryId) return null;

  try {
    const { currentVault } = useVaultStore();

    if (typeof currentVault?.database?.close !== 'function') {
      throw new Error('Datenbank ist nicht geladen');
    }

    const history = await currentVault.drizzle
      .select()
      .from(vaultEntryHistory)
      .where(eq(vaultEntryHistory.entryId, entryId));

    console.log('found history ', history);
    return history;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
