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
    <el-form-item label="验证码">
      <el-input style="width: 300px" v-model="saveGoogleVerify" placeholder="需要谷歌验证码进行修改" />
    </el-form-item>
    <el-form-item label="密钥" v-if="!googleStatus?.enabled">
      <qrcode v-if="googleVerifyInfo?.qr_code_url" :value="googleVerifyInfo?.qr_code_url" :width="180"></qrcode>
      <el-input style="width: 300px" v-model="googleVerify" placeholder="填入谷歌验证码进行绑定" />
      <el-button type="primary" @click="bindGoogleVerifyHandler" :loading="loading">确认绑定</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import api, { type Form, GoogleAuthInfo, GoogleAuthStatus } from "@/api/system/systemConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { useStore } from "@/store/modules/common";
import qrcode from "vue-qrcode";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}

const googleVerifyInfo = ref<GoogleAuthInfo>();
async function getGoogleVerifyInfo() {
  googleVerifyInfo.value = await api.getGoogleAuth();
}

const googleStatus = ref<GoogleAuthStatus>({
  enabled: true,
});
async function getGoogleStatus() {
  const res = await api.getGoogleAuthStatus();
  googleStatus.value.enabled = Boolean(res?.enabled);
  if (!googleStatus.value.enabled) {
    getGoogleVerifyInfo();
  }
}
getGoogleStatus();
const googleVerify = ref();
const loading = ref(false);
async function bindGoogleVerifyHandler() {
  if (!googleVerify.value) {
    return ElMessage.error("请输入谷歌验证码进行绑定");
  }
  loading.value = true;
  const res = await api.confirmGoogleAuth(googleVerify.value);
  loading.value = false;
  getGoogleStatus();
}

const saveGoogleVerify = ref();
async function saveGoogleVerifyHandler() {
  if (!saveGoogleVerify.value) {
    ElMessage.error("请输入谷歌验证码进行修改");
    return Promise.reject(false);
  }
  const res = await api.verifyGoogleAuth(saveGoogleVerify.value);
  return Promise.resolve(true);
}
defineExpose({
  saveGoogleVerifyHandler,
});
</script>

<style></style>
