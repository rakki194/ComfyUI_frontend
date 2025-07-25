<template>
  <PackActionButton
    v-bind="$attrs"
    :label="
      label ??
      (nodePacks.length > 1 ? $t('manager.installSelected') : $t('g.install'))
    "
    :severity="variant === 'black' ? undefined : 'secondary'"
    :variant="variant"
    :loading="isInstalling"
    :loading-message="$t('g.installing')"
    @action="installAllPacks"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'

import PackActionButton from '@/components/dialog/content/manager/button/PackActionButton.vue'
import { useComfyManagerStore } from '@/stores/comfyManagerStore'
import {
  IsInstallingKey,
  ManagerChannel,
  ManagerDatabaseSource,
  SelectedVersion
} from '@/types/comfyManagerTypes'
import type { components } from '@/types/comfyRegistryTypes'

type NodePack = components['schemas']['Node']

const { nodePacks, variant, label } = defineProps<{
  nodePacks: NodePack[]
  variant?: 'default' | 'black'
  label?: string
}>()

const isInstalling = inject(IsInstallingKey, ref(false))

const onClick = (): void => {
  isInstalling.value = true
}

const managerStore = useComfyManagerStore()

const createPayload = (installItem: NodePack) => {
  const isUnclaimedPack = installItem.publisher?.name === 'Unclaimed'
  const versionToInstall = isUnclaimedPack
    ? SelectedVersion.NIGHTLY
    : (installItem.latest_version?.version ?? SelectedVersion.LATEST)

  return {
    id: installItem.id,
    repository: installItem.repository ?? '',
    channel: ManagerChannel.DEV,
    mode: ManagerDatabaseSource.CACHE,
    selected_version: versionToInstall,
    version: versionToInstall
  }
}

const installPack = (item: NodePack) =>
  managerStore.installPack.call(createPayload(item))

const installAllPacks = async () => {
  if (!nodePacks?.length) return

  isInstalling.value = true

  const uninstalledPacks = nodePacks.filter(
    (pack) => !managerStore.isPackInstalled(pack.id)
  )
  if (!uninstalledPacks.length) return

  await Promise.all(uninstalledPacks.map(installPack))
  managerStore.installPack.clear()
}
</script>
