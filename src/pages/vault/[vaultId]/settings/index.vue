<template>
  <div class="flex flex-col self-center bg-teal-400 h-full">
    <div class="glass">Glass</div>
    <div class="bg-red-400 h-full">
      <select
        v-model="currentTheme"
        data-select='{
    "placeholder": "Select option...",
 
    "toggleClasses": "advance-select-toggle items-center",
    "dropdownClasses": "advance-select-menu max-h-44",
    "optionClasses": "advance-select-option selected:active",
    "optionTemplate": "<div><div class=\"flex items-center\"> <div class=\"me-2\" data-icon></div> <div class=\"font-semibold text-base-content\" data-title></div> </div> <div class=\"mt-1.5 text-sm text-base-content/80\" data-description></div> </div>",
    "extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
    }'
      >
        <option
          v-for="theme in availableThemes"
          :value="theme.value"
          :data-select-option="
            JSON.stringify({
              icon: `<Icon name='${theme.icon}' class='flex-shrink-0 size-4 text-base-content mt-1'/>`,
            })
          "
        >
          {{ theme.name }}
        </option>
      </select>

      <UiSelect :options="availableThemes">
        <template #option="{ option }">
          <div class="">
            {{ option.name }}
          </div>
        </template>
      </UiSelect>
      << {{ selectedTheme }}>>
    </div>

    <div class="flex flex-col gap-1">
      <div>
        <div class="flex items-center justify-between gap-4">
          <label
            class="label label-text"
            for="defaultTheme"
            >Default</label
          >
          <input
            type="radio"
            name="theme-radios"
            class="radio theme-controller"
            id="defaultTheme"
            value="default"
            checked
          />
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between gap-4">
          <label
            class="label label-text"
            for="corporateTheme"
            >Corporate</label
          >
          <input
            type="radio"
            name="theme-radios"
            class="radio theme-controller"
            id="corporateTheme"
            value="corporate"
          />
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between gap-4">
          <label
            class="label label-text"
            for="gourmentTheme"
            >Gourmet</label
          >
          <input
            type="radio"
            name="theme-radios"
            class="radio theme-controller"
            id="gourmentTheme"
            value="gourmet"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'appearance',
});

const { currentTheme, availableThemes } = storeToRefs(useUiStore());

const selectedTheme = ref();
</script>
