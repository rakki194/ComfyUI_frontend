<template>
  <div class="flex flex-col gap-6 w-[600px]">
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-neutral-100">
        {{ $t('install.desktopAppSettings') }}
      </h2>

      <p class="text-neutral-400 my-0">
        {{ $t('install.desktopAppSettingsDescription') }}
      </p>
    </div>

    <div class="flex flex-col bg-neutral-800 p-4 rounded-lg">
      <!-- Auto Update Setting -->
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-medium text-neutral-100">
            {{ $t('install.settings.autoUpdate') }}
          </h3>
          <p class="text-sm text-neutral-400 mt-1">
            {{ $t('install.settings.autoUpdateDescription') }}
          </p>
        </div>
        <ToggleSwitch v-model="autoUpdate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleSwitch from 'primevue/toggleswitch'

const autoUpdate = defineModel<boolean>('autoUpdate', { required: true })
</script>
