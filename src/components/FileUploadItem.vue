<script lang="ts" setup>
import { defineProps, inject, ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import Badge from 'primevue/badge';

const props = defineProps<{
  file: File;
}>()

const $primevue = usePrimeVue();

const vips = inject('vips');
const link = ref('');

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
      return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

async function generateThumbnail(file: File) {
  if (file.size === 0) return;

  const fr = new FileReader();

  fr.onload = async (event) => {
    console.log('event', event);
    
    if (!event.target || !event.target.result || !vips) return;

    try {
      const thumbnail = await vips.getThumbnail(event.target.result, { width: 320, height: 320 });
      console.log('thumbnail', thumbnail);
      link.value = thumbnail;
    } catch (error) {
      console.error(error);
    }
  }

  fr.readAsArrayBuffer(file);
}

generateThumbnail(props.file)

</script>

<template>
  <div class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
      <div>
          <img role="presentation" :alt="file.name" :src="link" width="400" height="250" />
      </div>
      <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
      <div>{{ formatSize(file.size) }}</div>
      <Badge value="Pending" severity="warn" />
  </div>
</template>
