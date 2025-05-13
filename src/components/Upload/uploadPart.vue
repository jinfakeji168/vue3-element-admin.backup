<template>
  <div class="flex-y-center">
    <el-upload ref="upload" class="upload-demo" :on-change="onchange" :auto-upload="false" :limit="1" :show-file-list="false">
      <img v-if="previewURL" :src="previewURL" class="previewImg" />
      <!-- <template #trigger></template> -->
      <el-button type="primary" style="margin-left: 10px">选择</el-button>
    </el-upload>
    <el-button class="ml-3" type="success" @click="visible = true">选择</el-button>
  </div>
  <uploadList v-model="visible" @choose="chooseHandler"></uploadList>
</template>
<script setup lang="ts">
import { UploadFile, UploadInstance } from "element-plus";
import uploadList from "./uploadList.vue";
import api from "@/api/file/index";
const visible = ref(false);

const previewURL = defineModel<string>();

async function submitUpload(file: UploadFile) {
  const res = await api.upload(file);
  if (res) {
    previewURL.value = import.meta.env.VITE_APP_File_API_URL + res.path;
  }
}
function onchange(data: any) {
  if (!data) return;
  submitUpload(data.raw);
}
function chooseHandler(url: string) {
  previewURL.value = url;
}
</script>

<style lang="scss" scoped>
.upload-demo {
  max-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.previewImg {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
</style>
