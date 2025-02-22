interface IBottomMenuItem {
  label: string;
  icon?: string;
  action: () => Promise<void>;
}

interface IBottomMenu {
  show: boolean;
  items: IBottomMenuItem[];
}

export const useBottomMenuStore = defineStore('bottomMenuStore', () => {
  const mainMenu = reactive<IBottomMenu>({
    show: false,
    items: [
      {
        label: 'Create Folder',
        action: async () => {
          await useVaultGroupStore().createAsync({});
        },
        icon: 'mdi:folder-plus-outline',
      },
      {
        label: 'Create File',
        action: async () => {
          alert('boom');
        },
        icon: 'mdi:file-document-plus-outline',
      },
    ],
  });

  const leftMenu = reactive<IBottomMenu>({
    show: false,
    items: [],
  });

  const rightMenu = reactive<IBottomMenu>({
    show: false,
    items: [],
  });

  return {
    mainMenu,
    rightMenu,
    leftMenu,
  };
});
