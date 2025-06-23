<template>
  <TabPanel value="Credits" class="credits-panel">
    <div class="flex flex-col h-full">
      <h2 class="text-2xl font-bold mb-2">{{ $t('credits.title') }}</h2>
      <Divider class="mb-3" />

      <div class="flex flex-col gap-4">
        <p class="text-gray-600">
          Credits functionality has been disabled as authentication is no longer
          supported.
        </p>
      </div>
    </div>
  </TabPanel>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider'
import TabPanel from 'primevue/tabpanel'
</script>
