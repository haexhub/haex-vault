<template>
  <div class="h-full">
    <NuxtLayout name="app">
      <template #sidebar>
        <div class="w-full">
          <UiMenu class="bg-red-200">
            <li
              class="motion-preset-slide-left motion-ease-spring-bouncier w-full flex"
            >
              <UiSidebarSubmenuLink
                to="appearance"
                class="px-4 py-2 w-full rounded-lg"
              >
                <Icon name="pajamas:appearance" />
                {{ t('appearance') }}
              </UiSidebarSubmenuLink>
            </li>
            <li
              class="motion-preset-slide-left motion-ease-spring-bouncier px-4 py-2"
            >
              <UiSidebarSubmenuLink to="test">
                <Icon name="mdi:test-tube" />
                test
              </UiSidebarSubmenuLink>
            </li>

            <li
              class="motion-preset-slide-left motion-ease-spring-bouncier px-4 py-2"
            >
              <UiSidebarSubmenuLink to="test1">
                <Icon name="mdi:ab-testing" />
                test 2
              </UiSidebarSubmenuLink>
            </li>
          </UiMenu>
        </div>
      </template>

      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'settings',
});

const { t } = useI18n();
</script>

<i18n lang="json">
{
  "de": {
    "appearance": "Darstellung"
  },

  "en": {
    "appearance": "Appearance"
  }
}
</i18n>
