<template>
  <nav
    class="tabs tabs-bordered overflow-x-auto"
    aria-label="Tabs"
    role="tablist"
    aria-orientation="horizontal"
  >
    <slot name="buttons" />
  </nav>

  <div class="mt-3">
    <slot />
  </div>
</template>
