<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="!configData">
      <template #header>
        <el-tabs v-model="currentTab" :beforeLeave="beforeLeaveHandler">
          <el-tab-pane :label="$t('jiBenGongNeng')" name="basicFeature"></el-tab-pane>
          <el-tab-pane :label="$t('anZhuangBao')" name="package"></el-tab-pane>
          <el-tab-pane :label="$t('shouYePeiZhi')" name="homeConfig"></el-tab-pane>
          <el-tab-pane :label="$t('chuKuanMoKuai')" name="expense"></el-tab-pane>
          <el-tab-pane :label="$t('guiJi')" name="collection"></el-tab-pane>
          <el-tab-pane :label="$t('dengLuZhuCe')" name="register"></el-tab-pane>
          <el-tab-pane :label="$t('chongZhiPeiZhi')" name="recharge"></el-tab-pane>
          <el-tab-pane :label="$t('liangHuaPeiZhi')" name="quantitationConfig"></el-tab-pane>
          <el-tab-pane :label="$t('touZiPeiZhi')" name="investmentConfig"></el-tab-pane>
          <el-tab-pane :label="$t('fenXiangJiangLi')" name="shareConfig"></el-tab-pane>
          <el-tab-pane :label="$t('anQuanSheZhi')" name="securityConfig"></el-tab-pane>
        </el-tabs>
      </template>
      <template v-if="configData">
        <component :is="componentMap[currentTab].default" :configData="configData" ref="configRef"></component>
      </template>
      <template #footer>
        <div class="text-center">
          <el-button @click="resetHandler">{{ $t("zhongZhi") }}</el-button>
          <el-button type="primary" @click="saveHandler" :loading="loading" :disabled="!hasAuth(`systemConfig:${currentTab}:save`)">{{ $t("baoCun") }}</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import systemConfig, { type Form, GoogleAuthStatus } from "@/api/system/systemConfig";

import { keyMap, type TabNames } from "./keyConfig";
import { hasAuth } from "@/plugins/permission";
import { useTemplateRef } from "vue";

const parts = import.meta.glob("./components/*.vue");
const componentMap = ref<Record<string, any>>({});
async function initPart() {
  for (const path in parts) {
    const name = path.replace("./components/", "").replace(".vue", "");
    componentMap.value[name] = await parts[path]();
  }
}
initPart();

const currentTab = ref<TabNames>("basicFeature");
const configEveryIndex = [];

const configData = ref<Form[]>();
let originConfigData: Form[] = [];
async function getSystemConfig() {
  const res = await systemConfig.getConfig();
  originConfigData = JSON.parse(JSON.stringify(res));
  configData.value = res;
  return Promise.resolve(res);
}
getSystemConfig();

/**获取当前被更改过的数据 */
function getCurrentTabChangeData() {
  let hasChange = unref(configData)?.filter((val) => keyMap[unref(currentTab)].includes(val.name as string));

  hasChange = hasChange?.filter((item, index) => {
    if (item.name == "register_account_status") {
      return item.values.join(",") != originConfigData.find((v) => v.name == item.name)?.values.join(",");
    } else if (item.name == "account_type_options") {
      return item.values.join(",") != originConfigData.find((v) => v.name == item.name)?.values.join(",");
    }
    return item.values != originConfigData.find((v) => v.name == item.name)?.values;
  });
  return hasChange;
}

import { useStore } from "@/store/modules/common";
const commonStore = useStore();

const configRef = useTemplateRef<InstanceType<(typeof componentMap.value)["securityConfig"]>>("configRef");
const loading = ref(false);
async function saveHandler() {
  const hasChange = getCurrentTabChangeData();
  console.log("🚀 ~ saveHandler ~ hasChange:", hasChange);

  if (hasChange?.length) {
    const googleStatus = await commonStore.getGoogleStatus();
    const enableGoogleVerify = await commonStore.keyByConfigValue("edit_address_is_google");
    const enableLogoGoogle = await commonStore.keyByConfigValue("update_logo_is_google");
    //判断是否是需要谷歌验证的字段
    const needGoogleverify = hasChange.some((i) => keyMap.securityConfig.includes(i.name || ""));
    const needGoogleverify1 = hasChange.some((i) => ["bep20_payment_wallet", "payment_wallet", "auto_payment_safety_value"].includes(i.name || ""));
    const needGoogleverify2 = hasChange.some((i) => ["website_logo"].includes(i.name || ""));
    if ((needGoogleverify && googleStatus) || (needGoogleverify1 && enableGoogleVerify == 1) || (needGoogleverify2 && enableLogoGoogle == 1)) {
      // await configRef.value.saveGoogleVerifyHandler();
      const res = await ElMessageBox.prompt($t("shuRuGuGeYanZhengM"), {});
      console.log("🚀 ~ saveHandler ~ res:", res);
      if (res.action == "confirm" && res.value) {
        await systemConfig.verifyGoogleAuth(res.value);
      } else {
        return;
      }
    } else if (needGoogleverify && !googleStatus) {
      ElMessage.error($t("qingXianBangDingGuG"));
      return;
    }
    try {
      loading.value = true;
      const res = await systemConfig.setConfig(hasChange);
      console.log(res);
      const result = await getSystemConfig();
      if (needGoogleverify) {
        console.log("🚀 ~ saveHandler ~ result:", result);
        commonStore.setNewConfig(result);
      }
    } finally {
      loading.value = false;
    }
  }
}

function beforeLeaveHandler(activeName: string, oldActiveName: string) {
  if (activeName == oldActiveName) return true;
  const hasChange = getCurrentTabChangeData();
  if (hasChange?.length) {
    return new Promise((resolve, inject) => {
      const res = ElMessageBox.confirm($t("dangQianYeMianYouWe"), $t("tiShi"), {
        confirmButtonText: $t("queDing_0"),
        cancelButtonText: $t("quXiao_0"),
        type: "warning",
      })
        .then(() => {
          //重置值
          resetHandler();
          return resolve(true);
        })
        .catch(() => {
          return inject();
        });
    });
  } else {
    return true;
  }
}
function resetHandler() {
  configData.value = JSON.parse(JSON.stringify(originConfigData));
}

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
