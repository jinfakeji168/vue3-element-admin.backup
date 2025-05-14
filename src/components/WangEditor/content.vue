<template>
  <div style="height: 70vh; overflow-y: scroll">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item class="row_item" label="说明原文" :prop="props.keys[0]">
        <WangEditor class="origin" v-model="formData![props.keys[0]]" v-if="props.type == 'rich'" />
        <el-input v-model="formData![props.keys[0]]" v-else />
      </el-form-item>

      <el-form-item class="row_item" :label="item.name" prop="" v-for="(item, index) of formData![props.keys[1]]" :key="item.lang">
        <div class="content_item" v-if="props.type == 'rich'">
          <div v-html="formData![props.keys[1]]![index].content" v-if="currentEditIndex != index"></div>
          <WangEditor v-model="formData![props.keys[1]]![index].content" v-else />
          <el-button style="margin-top: 10px" @click="currentEditIndex == index ? (currentEditIndex = -1) : (currentEditIndex = index)">
            {{ currentEditIndex == index ? "确认" : "编辑" }}
          </el-button>
        </div>
        <el-input v-model="formData![props.keys[1]]![index].content" v-else />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/modules/common";
import { FormInstance } from "element-plus";
const store = useStore();

const formData = defineModel<any>();
/**keys 对应原文和翻译list的key */
const props = withDefaults(defineProps<{ keys: string[]; type?: "rich" | "public" }>(), {
  type: "rich",
});
const currentEditIndex = ref(-1);

const rules = {
  [props.keys[0]]: [
    {
      required: true,
      message: "请输入原文",
      trigger: "blur",
    },
  ],
};

watch(formData, (val) => {
  if (!val) return;
  if (!val[props.keys[1]]) {
    val[props.keys[1]] = [];
  }
  if (!val[props.keys[0]]) {
    val[props.keys[0]] = "";
  }
  getLangOptions();
});

async function getLangOptions() {
  const langList = await store.getLangList;
  //translation
  for (let item of langList) {
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

const formRef = ref<FormInstance>();
function validate() {
  return formRef.value?.validate();
}
function clearValidate() {
  formRef.value?.clearValidate();
}
defineExpose({ validate, clearValidate });
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
.origin {
  border: 1px solid #eee;
}
</style>
