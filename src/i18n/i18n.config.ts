//import { de as store } from '@/stores/i18n';
//import { de as contextMenu } from '@/composables/i18n';
import de from '@/stores/sidebar/de.json';
import en from '@/stores/sidebar/en.json';

export default defineI18nConfig(() => {
  return {
    legacy: false,
    messages: {
      de: {
        sidebar: de,
      },
      en: {
        sidebar: en,
      },
    },
  };
});
