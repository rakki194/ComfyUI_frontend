<template>
  <BaseViewTemplate dark>
    <!-- h-full to make sure the stepper does not layout shift between steps
    as for each step the stepper height is different. Inherit the center element
    placement from BaseViewTemplate would cause layout shift. -->
    <Stepper
      class="h-full p-8 2xl:p-16"
      value="0"
      @update:value="handleStepChange"
    >
      <StepList class="select-none">
        <Step value="0">
          {{ $t('install.gpu') }}
        </Step>
        <Step value="1" :disabled="noGpu">
          {{ $t('install.installLocation') }}
        </Step>
        <Step value="2" :disabled="noGpu || hasError || highestStep < 1">
          {{ $t('install.migration') }}
        </Step>
        <Step value="3" :disabled="noGpu || hasError || highestStep < 2">
          {{ $t('install.desktopSettings') }}
        </Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="0">
          <GpuPicker v-model:device="device" />
          <div class="flex pt-6 justify-end">
            <Button
              :label="$t('g.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              :disabled="typeof device !== 'string'"
              @click="activateCallback('1')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <InstallLocationPicker
            v-model:install-path="installPath"
            v-model:path-error="pathError"
          />
          <div class="flex pt-6 justify-between">
            <Button
              :label="$t('g.back')"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('0')"
            />
            <Button
              :label="$t('g.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              :disabled="pathError !== ''"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <MigrationPicker
            v-model:source-path="migrationSourcePath"
            v-model:migration-item-ids="migrationItemIds"
          />
          <div class="flex pt-6 justify-between">
            <Button
              :label="$t('g.back')"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button
              :label="$t('g.next')"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="activateCallback('3')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
          <DesktopSettingsConfiguration v-model:auto-update="autoUpdate" />
          <MirrorsConfiguration
            v-model:python-mirror="pythonMirror"
            v-model:pypi-mirror="pypiMirror"
            v-model:torch-mirror="torchMirror"
            :device="device"
            class="mt-6"
          />
          <div class="flex mt-6 justify-between">
            <Button
              :label="$t('g.back')"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('2')"
            />
            <Button
              :label="$t('g.install')"
              icon="pi pi-check"
              icon-pos="right"
              :disabled="hasError"
              @click="install()"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </BaseViewTemplate>
</template>

<script setup lang="ts">
import type {
  InstallOptions,
  TorchDeviceType
} from '@comfyorg/comfyui-electron-types'
import Button from 'primevue/button'
import Step from 'primevue/step'
import StepList from 'primevue/steplist'
import StepPanel from 'primevue/steppanel'
import StepPanels from 'primevue/steppanels'
import Stepper from 'primevue/stepper'
import { computed, onMounted, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'

import DesktopSettingsConfiguration from '@/components/install/DesktopSettingsConfiguration.vue'
import GpuPicker from '@/components/install/GpuPicker.vue'
import InstallLocationPicker from '@/components/install/InstallLocationPicker.vue'
import MigrationPicker from '@/components/install/MigrationPicker.vue'
import MirrorsConfiguration from '@/components/install/MirrorsConfiguration.vue'
import { electronAPI } from '@/utils/envUtil'
import BaseViewTemplate from '@/views/templates/BaseViewTemplate.vue'

const device = ref<TorchDeviceType | null>(null)

const installPath = ref('')
const pathError = ref('')

const migrationSourcePath = ref('')
const migrationItemIds = ref<string[]>([])

const autoUpdate = ref(true)
const pythonMirror = ref('')
const pypiMirror = ref('')
const torchMirror = ref('')

/** Forces each install step to be visited at least once. */
const highestStep = ref(0)

const handleStepChange = (value: string | number) => {
  setHighestStep(value)
  // Log step change instead of tracking
  console.log('Install step change:', { step: value })
}

const setHighestStep = (value: string | number) => {
  const int = typeof value === 'number' ? value : parseInt(value, 10)
  if (!isNaN(int) && int > highestStep.value) highestStep.value = int
}

const hasError = computed(() => pathError.value !== '')
const noGpu = computed(() => typeof device.value !== 'string')

const electron = electronAPI()
const router = useRouter()
const install = async () => {
  const options: InstallOptions = {
    installPath: installPath.value,
    autoUpdate: autoUpdate.value,
    migrationSourcePath: migrationSourcePath.value,
    migrationItemIds: toRaw(migrationItemIds.value),
    pythonMirror: pythonMirror.value,
    pypiMirror: pypiMirror.value,
    torchMirror: torchMirror.value,
    // @ts-expect-error fixme ts strict error
    device: device.value
  }
  electron.installComfyUI(options)

  const nextPage =
    options.device === 'unsupported' ? '/manual-configuration' : '/server-start'
  await router.push(nextPage)
}

onMounted(async () => {
  if (!electron) return

  const detectedGpu = await electron.Config.getDetectedGpu()
  if (detectedGpu === 'mps' || detectedGpu === 'nvidia') {
    device.value = detectedGpu
  }

  // Log initial step instead of tracking
  console.log('Install step change:', {
    step: '0',
    gpu: detectedGpu
  })
})
</script>

<style scoped>
:deep(.p-steppanel) {
  @apply bg-transparent;
}
</style>
