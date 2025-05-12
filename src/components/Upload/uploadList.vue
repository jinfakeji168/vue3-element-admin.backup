<template>
  <el-dialog v-model="visible">
    <el-card>
      <template #header>
        <el-upload ref="upload" class="upload-demo" :on-change="upLoadFileHandler" :auto-upload="false" :limit="1" :show-file-list="false">
          <el-button>
            <template #icon type="primary">
              <Plus />
            </template>
            新增
          </el-button>
        </el-upload>
      </template>
      <el-table :data="dataList" style="height: 50vh" row-key="id" @selection-change="selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="path" label="图片">
          <template #default="{ row }">
            <el-image :src="baseUrl + row.path" fit="contain" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="chooseHandler(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
import api from "@/api/file/index";
import { get } from "http";

const baseUrl = import.meta.env.VITE_APP_File_API_URL;
const visible = defineModel<boolean>();

watch(visible, (val) => {
  if (val) {
    getList();
  }
});
const dataList = ref([]);

async function getList() {
  const value = await api.getList();
  dataList.value = value.data;
}

const emits = defineEmits(["choose"]);
function chooseHandler(row: any) {
  emits("choose", baseUrl + row.path);
  visible.value = false;
}

function selectionChangeHandler(data) {
  // console.log(data);
}

async function upLoadFileHandler(data: any) {
  const res = data.raw;
  const result = await api.upload(res);
  getList();
}
getList();
</script>

<style></style>
