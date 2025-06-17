<template>
  <div v-if="!isIdle" ref="progressBarsRef" class="graph-progress-bars">
    <div class="bars-container">
      <!-- Workflow progress bar -->
      <div class="progress-bar workflow-progress">
        <div class="progress-fill" :style="{ width: `${progress}%` }" />
      </div>
      <!-- Node progress bar -->
      <div v-if="nodeProgress !== null" class="progress-bar node-progress">
        <div class="progress-fill" :style="{ width: `${nodeProgress}%` }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useExecutionStore } from '@/stores/executionStore'

const executionStore = useExecutionStore()
const progressBarsRef = ref<HTMLElement | null>(null)

// Use computed properties to unwrap the refs and convert from fractions (0-1) to percentages (0-100)
const progress = computed(() => (executionStore.executionProgress || 0) * 100)
const nodeProgress = computed(() =>
  executionStore.executingNodeProgress !== null
    ? executionStore.executingNodeProgress * 100
    : null
)
const isIdle = computed(() => executionStore.isIdle)

function updatePosition() {
  if (!progressBarsRef.value) return

  // Find the menu element
  const menuElement = document.querySelector('.comfyui-menu') as HTMLElement
  if (!menuElement) return

  // Get the menu's position and dimensions
  const menuRect = menuElement.getBoundingClientRect()

  // Place our progress bars at the bottom of the menu with same width
  progressBarsRef.value.style.top = `${menuRect.bottom}px`
  progressBarsRef.value.style.left = `${menuRect.left}px`
  progressBarsRef.value.style.width = `${menuRect.width}px`
}

// Update position when any of these events happen
onMounted(() => {
  // Initial positioning
  setTimeout(updatePosition, 0)

  // Update position when window resizes
  window.addEventListener('resize', updatePosition)

  // Update position periodically to handle dynamic UI changes
  const interval = setInterval(updatePosition, 1000)

  // Clean up interval on unmount
  onBeforeUnmount(() => {
    clearInterval(interval)
    window.removeEventListener('resize', updatePosition)
  })
})
</script>

<style scoped>
.graph-progress-bars {
  position: fixed;
  z-index: 999;
  pointer-events: none;
  overflow: visible;
  width: 100%;
}

.bars-container {
  width: 100%;
  display: block;
}

.progress-bar {
  width: 100%;
  height: 2px;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.progress-bar.node-progress {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
}

.progress-fill {
  height: 100%;
  background: #3498db;
  transition: width 0.2s ease-out;
}

.node-progress .progress-fill {
  background: #2ecc71;
}

/* Dark theme support */
:root[data-theme='dark'] .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .progress-bar.node-progress {
  background: rgba(255, 255, 255, 0.05);
}
</style>
