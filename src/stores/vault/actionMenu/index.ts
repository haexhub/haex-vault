import { type IActionMenuItem } from '~/components/ui/button/types';
import de from './de.json';
import en from './en.json';

export const useVaultActionMenuStore = defineStore('vaultActionMenu', () => {
  const { t } = useI18n({
    messages: {
      de: { vaultActionMenu: de },
      en: { vaultActionMenu: en },
    },
  });

  const menu = computed<IActionMenuItem[]>(() => [
    {
      label: t('vaultActionMenu.group.create'),
      icon: 'mdi:folder-plus-outline',
      to: {
        name: 'vaultGroupCreate',
        params: { groupId: useVaultGroupStore().currentGroupId },
        query: {
          ...useRouter().currentRoute.value.query,
        },
      },
    },
    {
      label: t('vaultActionMenu.entry.create'),
      icon: 'mdi:key-plus',
      to: {
        name: 'vaultEntryCreate',
        params: { groupId: useVaultGroupStore().currentGroupId },
        query: {
          ...useRouter().currentRoute.value.query,
        },
      },
    },
  ]);

  return { menu };
});
