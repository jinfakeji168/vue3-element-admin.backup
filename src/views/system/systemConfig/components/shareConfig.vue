<template>
  <el-form label-width="240px">
    <el-form-item label="分享审核">
      <el-radio-group v-model="getI('is_auto_check').values">
        <el-radio :label="1">自动审核</el-radio>
        <el-radio :label="2">手动审核</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
</script>

<style></style>
