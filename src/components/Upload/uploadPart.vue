<template>
  <div class="flex-y-center">
    <el-upload ref="upload" class="upload-demo" :on-change="onchange" :auto-upload="false" :limit="1" :show-file-list="false" :on-preview="handlePictureCardPreview">
      <el-image v-if="previewURL && type == 'images'" :src="previewURL" class="previewImg" fit="contain" :preview-src-list="[previewURL]" preview-teleported :z-index="9999" />
      <el-input v-else-if="previewURL && type == 'files'" v-model="previewURL" style="width: 500px" />
      <template #trigger>
        <el-button type="primary" style="margin-left: 10px" :loading="loading">上传</el-button>
      </template>
      <el-button class="ml-3" type="success" @click="visible = true" style="order: 3" v-if="type == 'images'">从列表选择</el-button>
    </el-upload>
  </div>
  <uploadList v-model="visible" @choose="chooseHandler"></uploadList>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script setup lang="ts">
import { UploadFile, UploadInstance, UploadProps } from "element-plus";
import uploadList from "./uploadList.vue";
import api from "@/api/file/index";

const props = withDefaults(
  defineProps<{
    type?: "images" | "files" | "videos" | "audio";
  }>(),
  {
    type: "images",
  }
);

const visible = ref(false);

const previewURL = defineModel<string>();
const loading = ref(false);
async function submitUpload(file: UploadFile) {
  loading.value = true;
  const res = await api.upload(file, props.type);

  if (res) {
    previewURL.value = import.meta.env.VITE_APP_File_API_URL + res.path;
    loading.value = false;
  }
}
function onchange(data: any) {
  if (!data) return;
  submitUpload(data.raw);
}
function chooseHandler(url: string) {
  previewURL.value = url;
}

const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
:deep(.upload-demo) {
  max-height: 100px;
  gap: 10px;
  display: flex;
  align-items: center;
  > div:first-of-type {
    order: 2;
  }
}
.previewImg {
  width: 100px;
  height: 100px;
  object-fit: contain;
}
</style>
