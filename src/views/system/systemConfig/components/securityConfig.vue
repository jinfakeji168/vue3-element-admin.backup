<template>
  <el-form label-width="350px">
    <el-form-item :label="$t('kaiQiXiuGaiYongHuY')">
      <el-switch v-model="getI('update_money_google_secret').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('kaiQiXiuGaiTiKuanD')">
      <el-switch v-model="getI('edit_address_is_google').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('kaiQiTiKuanShenHeD')">
      <el-switch v-model="getI('extract_check_is_google_code').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="'开启网站logo修改的谷歌验证'">
      <el-switch v-model="getI('update_logo_is_google').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="'开启轮播图修改的谷歌验证'">
      <el-switch v-model="getI('update_banner_is_google').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item :label="$t('miYue')" v-if="!googleStatus?.enabled">
      <qrcode v-if="googleVerifyInfo?.qr_code_url" :value="googleVerifyInfo?.qr_code_url" :width="180"></qrcode>
      <el-input style="width: 300px" v-model="googleVerify" :placeholder="$t('tianRuGuGeYanZheng')" />
      <el-button type="primary" @click="bindGoogleVerifyHandler" :loading="loading">{{ $t("queRenBangDing") }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import api, { type Form, GoogleAuthInfo, GoogleAuthStatus } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();
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
    return ElMessage.error($t("qingShuRuGuGeYanZh"));
  }
  loading.value = true;
  const res = await api.confirmGoogleAuth(googleVerify.value);
  loading.value = false;
  getGoogleStatus();
}
</script>

<style></style>
