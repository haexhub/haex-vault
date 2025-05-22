<template>
  <div>
    <UiButton>ola</UiButton>
    <UiInput v-model="test" with-copy-button>
      <template #append>
        <UiButton>
          <Icon name="mdi:plus" />
        </UiButton>
      </template>
    </UiInput>

    <UiDropdown
      class="btn btn-circle"
      dropdown-class="[--offset:20]"
      :items="[1, 2, 3]"
    >
      <template #activator> aa </template>
    </UiDropdown>

    <UiDropdown :items="[1, 2, 3]" class="btn">
      <template #activator> bb <Icon name="mdi:menu" /> </template>
    </UiDropdown>
    <div>
      <button
        type="button"
        class="btn btn-primary"
        :data-overlay="`#${basicModal}`"
      >
        Open modal
      </button>

      <div
        id="basic-modal"
        class="overlay modal overlay-open:opacity-100 hidden overlay-open:duration-300 [--tab-accessibility-limited:false]"
        role="dialog"
        tabindex="-1"
      >
        <div
          class="modal-dialog overlay-open:opacity-100 overlay-open:duration-300"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Dialog Title</h3>
              <button
                type="button"
                class="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                data-overlay="#basic-modal"
              >
                <span class="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div class="modal-body">
              This is some placeholder content to show the scrolling behavior
              for modals. Instead of repeating the text in the modal, we use an
              inline style to set a minimum height, thereby extending the length
              of the overall modal and demonstrating the overflow scrolling.
              When content becomes longer than the height of the viewport,
              scrolling will move the modal as needed.
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-soft btn-secondary"
                data-overlay="#basic-modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UiDialog
      class="btn btn-primary btn-outline shadow-md md:btn-lg shrink-0 flex-1 whitespace-nowrap flex-nowrap"
    >
      <template #trigger>
        <Icon name="mdi:plus" />
        open
      </template>
    </UiDialog>
    <!-- <div class="dropdown relative inline-flex">
      <button
        id="dropdown-default"
        type="button"
        class="dropdown-toggle btn btn-primary"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Dropdown"
      >
        Dropdown
        <span
          class="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"
        ></span>
      </button>
      <ul
        class="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="dropdown-default"
      >
        <li><a class="dropdown-item" href="#">My Profile</a></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><a class="dropdown-item" href="#">Billing</a></li>
        <li><a class="dropdown-item" href="#">FAQs</a></li>
      </ul>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const test = ref();
const open = ref(false);
const basicModal = "basic-modal";
</script>
