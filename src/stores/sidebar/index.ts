import type { RouteLocationRaw } from 'vue-router';
import de from './de.json';
import en from './en.json';

export interface ISidebarMenuItem {
  label: string;
  icon: string;
  to?: RouteLocationRaw;
  click?: () => void;
  submenu?: ISidebarMenuItem[];
}

export interface ISidebarMenu {
  top: ISidebarMenuItem[];
  bottom: ISidebarMenuItem[];
}

export const useSidebarStore = defineStore('sidebarStore', () => {
  const { t } = useI18n({
    messages: {
      de: { sidebar: de },
      en: { sidebar: en },
    },
  });

  const router = useRouter();

  const { closeAsync } = useVaultStore();

  const menu = ref({
    top: [
      {
        label: t('sidebar.vault'),
        icon: 'i-[mdi--safe]',
        to: {
          name: 'vaultGroup',
          query: {
            showSidebar: 'true',
          },
        },
      },
    ],

    bottom: [
      {
        label: t('sidebar.settings'),
        icon: 'i-[ph--gear-six]',
        to: {
          name: 'settings',
          query: {
            showSidebar: 'true',
          },
        },
      },
      {
        label: t('sidebar.profile'),
        icon: 'i-[material-symbols--person-outline]',
        to: {
          name: 'profile',
          query: {
            showSidebar: 'true',
          },
        },
      },

      {
        label: t('sidebar.logout'),
        icon: 'i-[ph--arrow-square-right]',
        click: async () => {
          await closeAsync();
          await navigateTo(
            useLocaleRoute()({
              name: 'openVault',
            })
          );
        },
      },
    ],
  });

  const show = computed<boolean>({
    get: () => {
      console.log(
        'query showSidebar',
        router.currentRoute.value.query.showSidebar
      );
      return JSON.parse(
        getSingleRouteParam(router.currentRoute.value.query.showSidebar) ||
          'false'
      );
    },
    set: (showSidebar) => {
      console.log('set show', showSidebar, router.currentRoute.value);
      router.replace({
        //path: route.path,
        query: {
          ...(router.currentRoute.value.query || {}),
          showSidebar: JSON.stringify(showSidebar ? true : false),
        },
      });
    },
  });

  const toogleSidebar = () => {
    show.value = !show.value;
  };

  //const { logoutAsync } = useUserStore();

  return {
    menu,
    toogleSidebar,
    show,
  };
});
