<template>
  <div class="graph-progress-bars" v-show="!isIdle">
    <!-- Workflow progress bar -->
    <div class="progress-bar workflow-progress">
      <div class="progress-fill" :style="{ width: executionProgress + '%' }" />
    </div>
    <!-- Node progress bar -->
    <div
      class="progress-bar node-progress"
      v-show="executingNodeProgress !== null"
    >
      <div
        class="progress-fill"
        :style="{ width: executingNodeProgress + '%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useExecutionStore } from '@/stores/executionStore'

const executionStore = useExecutionStore()
const { executionProgress, executingNodeProgress, isIdle } =
  storeToRefs(executionStore)
</script>

<style scoped>
.graph-progress-bars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
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
