
<template>
  <div class="card">
      <Toast />
      <FileUpload name="demo[]" url="/api/upload" @upload="onTemplatedUpload($event)" :custom-upload="true" @uploader="onUploader" :multiple="true" accept="image/*" @select="onSelectedFiles">
          <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
              <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                  <div class="flex gap-2">
                      <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"></Button>
                      <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                      <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                  </div>
                  <ProgressBar :value="totalSizePercent" :showValue="false" class="md:w-20rem h-1 w-full md:ml-auto">
                      <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                  </ProgressBar>
              </div>
          </template>
          <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
              <div class="flex flex-col gap-8 pt-4">
                  <div v-if="files.length > 0">
                      <h5>Pending</h5>
                      <div class="grid grid-cols-3 gap-4">
                          <FileUploadItem v-for="(file, index) of files" :key="file.name + file.type + file.size" :file="file" />
                      </div>
                  </div>
              </div>
          </template>
          <template #empty>
              <div class="flex items-center justify-center flex-col">
                  <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                  <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
              </div>
          </template>
      </FileUpload>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from "primevue/usetoast";
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';
import Badge from 'primevue/badge';
import { isArray } from 'radash';
import FileUploadItem from './FileUploadItem.vue';

const $primevue = usePrimeVue();
const toast = useToast();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
      totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onTemplatedUpload = () => {
  toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

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

function onUploader(event) {
  const files = isArray(event.files) ? event.files : [event.files];

  console.log('Uploader', files);
  
}
</script>
