<template>
  <TabPanel value="User" class="user-settings-container h-full">
    <div class="flex flex-col h-full">
      <h2 class="text-2xl font-bold mb-2">{{ $t('userSettings.title') }}</h2>
      <Divider class="mb-3" />

      <!-- No Authentication Message -->
      <div class="flex flex-col gap-4">
        <p class="text-gray-600">
          {{ $t('userSettings.noAuthenticationMessage') }}
        </p>
      </div>
    </div>
  </TabPanel>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider'
import TabPanel from 'primevue/tabpanel'
</script>
