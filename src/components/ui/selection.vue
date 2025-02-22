<template>
  <div class="max-w-sm">
    <select
      data-select='{
    "placeholder": "Select option...",
    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-base-content\" data-title></span></button>",
    "toggleClasses": "advance-select-toggle items-center",
    "dropdownClasses": "advance-select-menu max-h-44",
    "optionClasses": "advance-select-option selected:active",
    "optionTemplate": "<div><div class=\"flex items-center\"> <div class=\"me-2\" data-icon></div> <div class=\"font-semibold text-base-content\" data-title></div> </div> <div class=\"mt-1.5 text-sm text-base-content/80\" data-description></div> </div>",
    "extraMarkup": "<span class=\"icon-[tabler--caret-up-down] flex-shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
    }'
      class="hidden"
    >
      <option value="">Choose</option>
      <option
        value="5"
        selected
        data-select-option='{
        "description": "Recommended for beginners.",
        "icon": "<span class=\"icon-[tabler--circle-check] flex-shrink-0 size-4 text-base-content mt-1\"></span>"}'
      >
        Beginner-friendly
      </option>
      <option
        value="6"
        data-select-option='{
        "description": "Suitable for advanced users.",
        "icon": "<span class=\"icon-[tabler--target] flex-shrink-0 size-4 text-base-content mt-1\"></span>"}'
      >
        Advanced users
      </option>
    </select>
  </div>
</template>
