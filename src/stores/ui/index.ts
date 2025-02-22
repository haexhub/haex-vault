import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import de from './de.json';
import en from './en.json';

export const useUiStore = defineStore(
  'uiStore',
  () => {
    const { t } = useI18n({
      messages: {
        de: { ui: de },
        en: { ui: en },
      },
    });

    const breakpoints = useBreakpoints(breakpointsTailwind);

    const currentScreenSize = computed(() =>
      breakpoints.active().value.length > 0 ? breakpoints.active().value : 'xs'
    );

    const minWidth = 'min-w-xs';

    const availableThemes = ref([
      {
        value: 'dark',
        name: t('ui.dark'),
        icon: 'line-md:moon-rising-alt-loop',
      },
      {
        value: 'light',
        name: t('ui.light'),
        icon: 'line-md:moon-to-sunny-outline-loop-transition',
      },
      { value: 'soft', name: t('ui.soft'), icon: 'line-md:paint-drop' },
    ]);

    const currentTheme = ref(availableThemes.value[0].value);

    const header = reactive<{
      text: string | null | undefined;
      icon: string | null | undefined;
    }>({
      text: null,
      icon: null,
    });

    return {
      availableThemes,
      breakpoints,
      currentScreenSize,
      currentTheme,
      minWidth,
      header,
    };
  },
  { persist: true }
);
