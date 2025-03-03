import Database from '@tauri-apps/plugin-sql';
import { drizzle, SqliteRemoteDatabase } from 'drizzle-orm/sqlite-proxy';
//import Database from "tauri-plugin-sql-api";
import * as schema from '@/database/schemas/vault';
import { copyFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { resolveResource } from '@tauri-apps/api/path';

interface IOpenVaults {
  [vaultPath: string]: {
    database: Database;
    path: string;
    password: string;
    name: string;
    drizzle: SqliteRemoteDatabase<typeof schema>;
  };
}

export const useVaultStore = defineStore(
  'vaultStore',
  () => {
    const currentVaultId = computed<string | undefined>({
      get: () =>
        getSingleRouteParam(useRouter().currentRoute.value.params.vaultId),
      set: (newVaultId) => {
        useRouter().currentRoute.value.params.vaultId = newVaultId ?? '';
      },
    });

    const read_only = computed<boolean>({
      get: () => {
        console.log(
          'query showSidebar',
          useRouter().currentRoute.value.query.readonly
        );
        return JSON.parse(
          getSingleRouteParam(useRouter().currentRoute.value.query.readonly) ||
            'false'
        );
      },
      set: (readonly) => {
        console.log('set readonly', readonly);
        const route = useRoute();
        const router = useRouter();
        router.replace({
          query: {
            ...router.currentRoute.value.query,
            readonly: JSON.stringify(readonly ? true : false),
          },
        });
      },
    });

    const openVaults = ref<IOpenVaults | undefined>();

    const currentVault = computed(() => {
      console.log(
        'compute currentVault',
        currentVaultId.value,
        openVaults.value
      );
      return openVaults.value?.[currentVaultId.value ?? ''];
    });

    const openAsync = async ({
      path = '',
      password,
    }: {
      path: string;
      password: string;
    }) => {
      const sqlitePath = path?.startsWith('sqlite:') ? path : `sqlite:${path}`;

      console.log('try to open db', path, password);
      const db = await Database.load(sqlitePath);

      const vaultId = await getVaultIdAsync(sqlitePath);

      console.log('opened db', path.split('/').at(-1));

      openVaults.value = {
        ...openVaults.value,
        [vaultId]: {
          database: db,
          path,
          password,
          name: path.split('/').at(-1) ?? path,
          drizzle: drizzle<typeof schema>(
            async (sql, params, method) => {
              let rows: any = [];
              let results = [];

              // If the query is a SELECT, use the select method
              if (isSelectQuery(sql)) {
                rows = await db.select(sql, params).catch((e) => {
                  console.error('SQL Error:', e);
                  return [];
                });
              } else {
                // Otherwise, use the execute method
                rows = await db.execute(sql, params).catch((e) => {
                  console.error('SQL Error:', e);
                  return [];
                });
                return { rows: [] };
              }

              rows = rows.map((row: any) => {
                return Object.values(row);
              });

              // If the method is "all", return all rows
              results = method === 'all' ? rows : rows[0];

              return { rows: results };
            },
            // Pass the schema to the drizzle instance
            { schema: schema, logger: true }
          ),
        },
      };

      /* const test = await db.select('SELECT * FROM vault_group');
      console.log('vault store open db', db.path, currentVaultId.value, test); */

      const { addVaultAsync } = useLastVaultStore();
      await addVaultAsync({ path });

      return vaultId;
    };

    const refreshDatabaseAsync = async () => {
      console.log('refreshDatabaseAsync');
      if (!currentVault.value?.database.close) {
        return navigateTo(useLocaleRoute()({ name: 'vaultOpen' }));
      }

      const { groups, folder, currentGroup } = storeToRefs(
        useVaultGroupStore()
      );
      const { getAsync, getFolders } = useVaultGroupStore();
      groups.value = (await getAsync()) ?? [];
      folder.value = getFolders(groups.value);
      currentGroup.value = groups.value.find(
        (group) => group.id === currentGroup.value?.id
      );
    };

    const createAsync = async ({
      path,
      password,
    }: {
      path: string;
      password: string;
    }) => {
      /* const existDb = await exists('default.db', {
        baseDir: BaseDirectory.Resource,
      }); */

      const existDb = await resolveResource('resources/default.db');
      if (!existDb) throw new Error('Keine Datenbank da');
      await copyFile(existDb, path);
      return await openAsync({ path, password });
    };

    const closeAsync = async () => {
      if (!currentVaultId.value) return;

      if (
        typeof openVaults.value?.[currentVaultId.value]?.database?.close ===
        'function'
      ) {
        console.log('close db', openVaults.value?.[currentVaultId.value]);
        return openVaults.value?.[currentVaultId.value]?.database?.close();
      }
      delete openVaults.value?.[currentVaultId.value];
    };

    return {
      closeAsync,
      createAsync,
      currentVault,
      currentVaultId,
      openAsync,
      openVaults,
      refreshDatabaseAsync,
      read_only,
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

const getVaultIdAsync = async (path: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(path);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(''); // convert bytes to hex string
  console.log('vaultId', hashHex);
  return hashHex;
};

function isSelectQuery(sql: string): boolean {
  const selectRegex = /^\s*SELECT\b/i;
  return selectRegex.test(sql);
}
