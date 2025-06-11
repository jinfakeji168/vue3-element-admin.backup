<template>
  <el-form label-width="350px">
    <el-form-item label="开启修改用户余额的谷歌验证码">
      <el-switch v-model="getI('update_money_google_secret').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item label="开启修改提款地址和出款安全值的谷歌验证码">
      <el-switch v-model="getI('edit_address_is_google').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item label="开启提款审核的谷歌验证码">
      <el-switch v-model="getI('extract_check_is_google_code').values" :active-value="1" :inactive-value="2" />
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
