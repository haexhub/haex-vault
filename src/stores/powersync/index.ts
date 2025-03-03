import {
  PowerSyncDatabase,
  WASQLiteOpenFactory,
  WASQLiteVFS,
} from '@powersync/web';
import { AppSchema } from './appSchema';
import { Connector } from './connector';

export const usePowerSyncStore = defineStore('usePowerSync', () => {
  const powerSync = new PowerSyncDatabase({
    database: new WASQLiteOpenFactory({
      dbFilename: 'exampleVFS.db',
      vfs: WASQLiteVFS.OPFSCoopSyncVFS,
      flags: {
        enableMultiTabs: typeof SharedWorker !== 'undefined',
      },
    }),
    schema: AppSchema,
    flags: {
      // Web worker causes PowerSync engine fail to start (flaky behaviour).
      // Learn more: https://github.com/romatallinn/powersync-tauri/issues/4
      useWebWorker: false,
      enableMultiTabs: typeof SharedWorker !== 'undefined',
    },
  });

  const setupPowerSync = async () => {
    // Uses the backend connector that will be created in the next section
    const connector = new Connector();
    //await powerSync.connect(connector);
    await powerSync.init();
  };

  const findList = async (id: string) => {
    const result = await powerSync.get('SELECT * FROM lists WHERE id = ?', [
      id,
    ]);
    return result;
  };

  return {
    powerSync,
    setupPowerSync,
    findList,
  };
});
