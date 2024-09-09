<script setup lang="ts">
import { provide } from 'vue';
import FileUpload from './components/FileUpload.vue'
import { wrap } from 'comlink';
import type { ExposedInterface } from '@/workers/vips.worker';
import vipsWorker from '@/workers/vips.worker?worker';

const workerInstance = new vipsWorker();
const vips = wrap<ExposedInterface>(workerInstance);

provide('vips', vips);
</script>

<template>
  <div>
    <FileUpload />
  </div>
</template>
