<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <el-tabs v-model="currentTab">
          <el-tab-pane label="基本功能" name="basicFeature"></el-tab-pane>
          <el-tab-pane label="安装包" name="package"></el-tab-pane>
          <el-tab-pane label="首页配置" name="homeConfig"></el-tab-pane>
          <el-tab-pane label="出款模块" name="expense"></el-tab-pane>
        </el-tabs>
      </template>
      <template v-if="configData">
        <component :is="componentMap[currentTab].default" :configData="configData"></component>
      </template>
      <template #footer>
        <div class="text-center">
          <el-button @click="resetHandler">重置</el-button>
          <el-button type="primary" @click="saveHandler">保存</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import systemConfig, { type Form } from "@/api/system/systemConfig";

const parts = import.meta.glob("./components/*.vue");
const componentMap = ref<Record<string, any>>({});
async function initPart() {
  for (const path in parts) {
    const name = path.replace("./components/", "").replace(".vue", "");
    componentMap.value[name] = await parts[path]();
  }
}
initPart();

const currentTab = ref("basicFeature");
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

async function saveHandler() {
  const hasChange = unref(configData)?.filter((item, index) => item.values != originConfigData[index].values);
  console.log("🚀 ~ saveHandler ~ hasChange:", hasChange);
}
function resetHandler() {}

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
