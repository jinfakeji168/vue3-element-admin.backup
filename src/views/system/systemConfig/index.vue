<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="!configData">
      <template #header>
        <el-tabs v-model="currentTab" :beforeLeave="beforeLeaveHandler">
          <el-tab-pane label="基本功能" name="basicFeature"></el-tab-pane>
          <el-tab-pane label="安装包" name="package"></el-tab-pane>
          <el-tab-pane label="首页配置" name="homeConfig"></el-tab-pane>
          <el-tab-pane label="出款模块" name="expense"></el-tab-pane>
          <el-tab-pane label="归集" name="collection"></el-tab-pane>
          <el-tab-pane label="登录/注册" name="register"></el-tab-pane>
          <el-tab-pane label="充值配置" name="recharge"></el-tab-pane>
          <el-tab-pane label="量化配置" name="quantitationConfig"></el-tab-pane>
          <el-tab-pane label="投资配置" name="investmentConfig"></el-tab-pane>
          <el-tab-pane label="分享奖励" name="shareConfig"></el-tab-pane>
          <el-tab-pane label="安全设置" name="securityConfig"></el-tab-pane>
        </el-tabs>
      </template>
      <template v-if="configData">
        <component :is="componentMap[currentTab].default" :configData="configData" ref="configRef"></component>
      </template>
      <template #footer>
        <div class="text-center">
          <el-button @click="resetHandler">重置</el-button>
          <el-button type="primary" @click="saveHandler" :loading="loading" :disabled="!hasAuth(`systemConfig:${currentTab}:save`)">保存</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import systemConfig, { type Form } from "@/api/system/systemConfig";
import { keyMap, type TabNames } from "./keyConfig";
import { hasAuth } from "@/plugins/permission";

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
  try {
    const res = await systemConfig.getConfig();
    console.log(res);
    originConfigData = JSON.parse(JSON.stringify(res));
    configData.value = res;
  } catch (error) {}
}
getSystemConfig();

/**获取当前被更改过的数据 */
function getCurrentTabChangeData() {
  let hasChange = unref(configData)?.filter((val) => keyMap[unref(currentTab)].includes(val.name as string));

  hasChange = hasChange?.filter((item, index) => {
    if (item.name == "register_account_status") {
      return item.values.join(",") != originConfigData.find((v) => v.name == item.name)?.values.join(",");
    }
    return item.values != originConfigData.find((v) => v.name == item.name)?.values;
  });
  return hasChange;
}
const loading = ref(false);
async function saveHandler() {
  const hasChange = getCurrentTabChangeData();
  if (hasChange?.length) {
    try {
      loading.value = true;
      const res = await systemConfig.setConfig(hasChange);
      console.log(res);
      getSystemConfig();
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
      const res = ElMessageBox.confirm("当前页面有未保存的配置，是否离开？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
