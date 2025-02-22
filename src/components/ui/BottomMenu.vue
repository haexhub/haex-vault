<template>
  <div
    class="bg-slate-200 h-10 fixed bottom-0 justify-center items-center flex right-0 z-10 transition-all duration-700 w-full"
    :class="{ 'pl-96': show }"
  >
    <div class="w-full relative flex h-full">
      <div class="w-full flex items-center justify-around bg-red-500">
        <UiButton
          icon="i-[clarity--scissors-line]  size-full"
          class="size-10 hover:shadow hover:text-primary"
        />

        <UiButton
          icon="i-[material-symbols--file-copy-outline]"
          class="size-10 hover:shadow hover:text-primary"
        />
      </div>

      <div
        class="-mt-6 dropdown relative inline-flex [--placement:top] max-sm:[--placement:top-end] [--strategy:absolute]"
      >
        <button
          id="dropdown-outside"
          type="button"
          class="dropdown-toggle btn btn-primary btn-lg btn-square rotate-45"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Dropdown"
        >
          <Icon
            name="mdi:plus"
            size="46"
            class="-rotate-45 dropdown-open:rotate-180 transition"
          />
        </button>
        <ul
          class="dropdown-menu dropdown-open:opacity-100 dropdown-open:ease-in dropdown-open:scale-100 mt-0 hidden min-w-60 origin-top-left rtl:origin-top-right scale-0 transition duration-400 ease-out rtl:left-0"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-outside"
        >
          <li
            v-for="item in mainMenu.items"
            class="dropdown-item cursor-pointer p-2.5 shrink-0"
            @click="item.action"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="size-8"
            />
            {{ item.label }}
          </li>
        </ul>
      </div>
      <!-- <div
        class="-mt-7 relative flex justify-center"
        ref="target"
      >
        <ul
          class="absolute flex flex-col items-center justify-center overflow-hidden bottom-20 transition-all ease-in-out duration-500 gap-1"
          :class="[mainMenu.show ? 'max-h-full py-14' : 'max-h-0 py-0']"
        >
          <li
            v-for="item in mainMenu.items"
            class="items-center justify-center flex bg-slate-200 hover:bg-slate-300 rounded-full gap-4 cursor-pointer p-2.5 shrink-0"
            @click="item.action"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="size-8 text-slate-800"
            />
            {{ item.label }}
          </li>
        </ul>

        <div class="size-14 rotate-45 shrink-0 rounded">
          <button
            @click.prevent="mainMenu.show = !mainMenu.show"
            class="btn btn-square btn-primary size-full"
          >
            <Icon
              name="mdi:plus"
              size="50"
              class="transition-transform rotate-45"
              :class="{ 'rotate-90': mainMenu.show }"
            />
          </button>
        </div>
      </div> -->

      <div class="bg-orange-300 w-full">a</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

const { leftMenu, rightMenu, mainMenu } = storeToRefs(useBottomMenuStore());
const { show } = storeToRefs(useSidebarStore());
const target = ref();
onClickOutside(target, (event) => (mainMenu.value.show = false));
</script>
