<template>
  <div style="overflow-y: scroll">
    <div class="main_container">
      <el-card class="container" v-if="mounted">
        <template #header>
          <div class="flex_row">
            <span :class="{ isnull: !notNull }">
              <span style="color: red">*</span>
              原文
              {{ notNull ? "" : "(请输入原文内容)" }}
            </span>
            <el-button size="small" :disabled="disabled" type="primary" @click="currentEditIndex == -1 ? (currentEditIndex = -2) : (currentEditIndex = -1)">
              {{ currentEditIndex == -1 ? "预览" : "编辑" }}
            </el-button>
          </div>
        </template>
        <div class="content_item" v-if="type == 'rich'">
          <div v-html="formData![keys[0]]" v-show="currentEditIndex != -1"></div>
          <WangEditor class="origin" v-model="formData![keys[0]]" v-show="currentEditIndex == -1" />
        </div>
        <el-input :disabled="currentEditIndex != -1" v-model="formData![keys[0]]" v-else />
      </el-card>

      <el-card class="container" v-for="(item, index) of formData![keys[1]]" :key="item.lang">
        <template #header>
          <div class="flex_row">
            <span>{{ item.name }}</span>
            <el-button size="small" :disabled="disabled" type="primary" @click="currentEditIndex == index ? (currentEditIndex = -2) : (currentEditIndex = index)">
              {{ currentEditIndex == index ? "预览" : "编辑" }}
            </el-button>
          </div>
        </template>
        <div class="content_item" v-if="type == 'rich'">
          <div v-html="formData![keys[1]]![index].content" v-show="currentEditIndex != index"></div>
          <WangEditor v-model="formData![keys[1]]![index].content" v-show="currentEditIndex == index" />
        </div>
        <el-input :disabled="currentEditIndex != index" v-model="formData![keys[1]]![index].content" v-else />
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
const props = withDefaults(defineProps<{ keys: string[]; type?: "rich" | "public"; disabled?: boolean; required?: boolean }>(), {
  type: "rich",
  required: true,
});
const currentEditIndex = ref(-2);

const emits = defineEmits(["initBefore"]);
watch(formData, (val) => {
  if (!val) return;
  val[props.keys[1]] ??= [];
  val[props.keys[0]] ??= "";
  getLangOptions();
});
/**用来保证wangeditor在值准备好之后生成，否则会有bug */
const mounted = ref(false);
async function getLangOptions() {
  const langList = await store.getLangListAsync();
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
  mounted.value = true;
  emits("initBefore");
}
const notNull = computed(() => !props.required || (unref(formData)[props.keys[0]] && unref(formData)[props.keys[0]] != "<p><br></p>"));

function validate() {
  return Promise.resolve(notNull.value);
}
function clearValidate() {}
defineExpose({ validate, clearValidate });
</script>

<style lang="scss" scoped>
.main_container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
:deep(.container) {
  > .el-card__header {
    padding: 8px;
    .flex_row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .isnull {
      color: red;
    }
  }
  > .el-card__body {
    padding: 8px;
    .content_item {
      width: 100%;
      grid-column: 1/3;
      overflow: auto;
      & > div:first-of-type {
        border: 1px solid #eee;
        padding: 10px;
        min-height: 140px;
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
    // z-index: 99;
  }
}
.origin {
  border: 1px solid #eee;
}
</style>
