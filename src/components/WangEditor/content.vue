<template>
  <div style="height: 70vh; overflow-y: scroll">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item class="row_item" label="说明原文" prop="original">
        <WangEditor v-model="formData![props.keys[0]]" />
      </el-form-item>

      <el-form-item class="row_item" :label="item.name" prop="" v-for="(item, index) of formData![props.keys[1]]" :key="item.lang">
        <div class="content_item">
          <div v-html="formData![props.keys[1]]![index].content" v-if="currentEditIndex != index"></div>
          <WangEditor v-model="formData![props.keys[1]]![index].content" v-else />
          <el-button style="margin-top: 10px" @click="currentEditIndex == index ? (currentEditIndex = -1) : (currentEditIndex = index)">
            {{ currentEditIndex == index ? "确认" : "编辑" }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/modules/common";
const store = useStore();
const rules = {};
const formData = defineModel<any>();
/**keys 对应原文和翻译list的key */
const props = defineProps<{ keys: string[] }>();
const currentEditIndex = ref(-1);

watch(formData, (val) => {
  if (!val) return;
  getLangOptions();
});

async function getLangOptions() {
  //translation
  for (let item of store.langList) {
    const result = unref(formData)[props.keys[1]]?.findIndex((val: any) => val.lang == item.mark);
    if (result !== undefined && result >= 0) {
      unref(formData)[props.keys[1]][result] = {
        lang: item.mark || "",
        name: item.name || "",
        content: unref(formData)[props.keys[1]]![result].content || "",
      };
    } else {
      unref(formData)[props.keys[1]].push({
        lang: item.mark || "",
        name: item.name || "",
        content: "",
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.content_item {
  width: 100%;
  & > div:first-of-type {
    border: 1px solid #eee;
    padding: 10px;
    min-height: 80px;
    border-radius: 5px;
    background: white;
    width: 100%;
  }
}
.row_item {
  :deep(.editor-wrapper) {
    z-index: 99;
  }
}
</style>
