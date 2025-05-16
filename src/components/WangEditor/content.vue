<template>
  <div style="overflow-y: scroll">
    <div class="main_container">
      <el-card class="container">
        <template #header>
          <div class="flex_row">
            <span>原文</span>
            <el-button type="primary" @click="currentEditIndex == -1 ? (currentEditIndex = -2) : (currentEditIndex = -1)">
              {{ currentEditIndex == -1 ? "预览" : "编辑" }}
            </el-button>
          </div>
        </template>
        <div class="content_item" v-if="type == 'rich'">
          <div v-html="formData![keys[0]]" v-if="currentEditIndex != -1"></div>
          <WangEditor class="origin" v-model="formData![keys[0]]" v-else />
        </div>
        <el-input v-model="formData![keys[0]]" v-else />
      </el-card>

      <el-card class="container" v-for="(item, index) of formData![keys[1]]" :key="item.lang">
        <template #header>
          <div class="flex_row">
            <span>{{ item.name }}</span>
            <el-button type="primary" @click="currentEditIndex == index ? (currentEditIndex = -2) : (currentEditIndex = index)">
              {{ currentEditIndex == index ? "预览" : "编辑" }}
            </el-button>
          </div>
        </template>
        <div class="content_item" v-if="type == 'rich'">
          <div v-html="formData![keys[1]]![index].content" v-if="currentEditIndex != index"></div>
          <WangEditor v-model="formData![keys[1]]![index].content" v-else />
        </div>
        <el-input v-model="formData![keys[1]]![index].content" v-else />
      </el-card>
    </div>
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
const currentEditIndex = ref(-2);

const rules = {
  [props.keys[0]]: [
    {
      required: true,
      message: "请输入原文",
      trigger: "blur",
    },
  ],
};

const emits = defineEmits(["initBefore"]);
watch(formData, (val) => {
  if (!val) return;
  val[props.keys[1]] ??= [];
  val[props.keys[0]] ??= "";
  console.log("eeeeeeee");

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
  emits("initBefore");
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
.main_container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
:deep(.container) {
  .flex_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  > .el-card__body {
    .content_item {
      width: 100%;
      max-height: 50vh;
      grid-column: 1/3;
      overflow: auto;
      & > div:first-of-type {
        border: 1px solid #eee;
        padding: 10px;
        min-height: 80px;
        border-radius: 5px;
        background: white;
        width: 100%;
      }
      .editor-wrapper {
        z-index: 999;
      }
    }
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
