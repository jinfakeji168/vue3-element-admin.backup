<template>
  <el-dialog v-model="visible" :title="$t('xiangQing')" width="90%">
    <el-tabs v-model="activeTab" tab-position="left" type="border-card">
      <el-tab-pane v-for="(tab, index) of tabs" :key="index" :label="tab.name" :name="tab.key"></el-tab-pane>
      <el-card shadow="never" style="height: 65vh; overflow-y: auto">
        <component ref="comRef" :is="componentMap[activeTab]" v-bind="$attrs"></component>
      </el-card>
    </el-tabs>
    <template #footer>
      <div class="flex flex-row justify-end">
        <el-button @click="visible = false">{{ $t("quXiao_0") }}</el-button>
        <el-button type="primary" @click="saveHandler" :disabled="activeTab !== 'memberEdit'" v-hasPerm="['memberListDetail:save']">{{ $t("baoCun") }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel({ type: Boolean, default: false });

const activeTab = ref("memberEdit");
const tabs = reactive([
  {
    name: $t("huiYuanBianJi"),
    key: "memberEdit",
  },
  {
    name: $t("huiYuanZhangDan"),
    key: "memberBill",
  },
  {
    name: $t("touZiDingDan"),
    key: "investmentOrder",
  },
  {
    name: $t("tiBiDingDan"),
    key: "withdrawOrder",
  },
  {
    name: $t("chongBiDingDan"),
    key: "rechargeOrder",
  },
  {
    name: $t("huiYuanRiZhi"),
    key: "memberLog",
  },
]);
const componentMap = ref<Record<string, any>>({});
async function getparts() {
  const components = import.meta.glob<any>("./parts/*");
  for (const key in components) {
    const name = key.replace("./parts/", "").replace(".vue", "");
    const component = await components[key]();
    componentMap.value[name] = component.default;
  }
}
getparts();

watch(visible, (val) => {
  if (!val) {
    activeTab.value = "memberEdit";
  }
});
const comRef = ref();
async function saveHandler() {
  try {
    const res = await comRef.value?.submitForm();
    visible.value = false;
  } finally {
  }
}
</script>

<style></style>
