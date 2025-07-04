<template>
  <el-dialog v-model="visible" title="详情" width="90%">
    <el-tabs v-model="activeTab" tab-position="left" type="border-card">
      <el-tab-pane v-for="(tab, index) of tabs" :key="index" :label="tab.name" :name="tab.key"></el-tab-pane>
      <el-card shadow="never" style="height: 65vh; overflow-y: auto">
        <component ref="comRef" :is="componentMap[activeTab]" v-bind="$attrs"></component>
      </el-card>
    </el-tabs>
    <template #footer>
      <div class="flex flex-row justify-end">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="saveHandler" :disabled="activeTab !== 'memberEdit'">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const visible = defineModel({ type: Boolean, default: false });

const activeTab = ref("memberEdit");
const tabs = reactive([
  {
    name: "会员编辑",
    key: "memberEdit",
  },
  {
    name: "会员账单",
    key: "memberBill",
  },
  {
    name: "投资订单",
    key: "investmentOrder",
  },
  {
    name: "提币订单",
    key: "withdrawOrder",
  },
  {
    name: "充币订单",
    key: "rechargeOrder",
  },
  {
    name: "会员日志",
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
