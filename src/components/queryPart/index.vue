<script setup lang="ts">
import { computed, ref, h, onMounted, nextTick } from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElIcon, ElDatePicker, FormInstance } from "element-plus";
import { ArrowDown, ArrowUp, Search, RefreshLeft } from "@element-plus/icons-vue";

/** 查询表单数据模型 */
const model = defineModel<Record<string, any>>();

const props = withDefaults(
  defineProps<{
    config: QueryConfig[];
    collapsed?: boolean;
    column?: number;
  }>(),
  {
    collapsed: true,
    column: 4,
  }
);

const emit = defineEmits(["search", "reset"]);
const isCollapsed = ref(props.collapsed);
const formContentRef = ref<HTMLElement>();
const contentHeight = ref("auto");
const rowHeight = ref(0);

/** 更新表单数据处理函数 */
function updateFormHandler(key: string, value: any) {
  model.value![key] = value;
}

/** 重置处理函数 */
function resetHandler() {
  emit("reset");
}

/** 搜索处理函数 */
function searchHandler() {
  emit("search", model.value);
}

/** 渲染表单项函数 */
function renderFormItem(item: QueryConfig) {
  const formItemProps = {
    label: item.label,
    prop: item.modelKey,
    rules: item.rules,
  };

  const commonProps = {
    ...item.props,
  };

  let input;
  switch (item.type) {
    case "select":
      input = h(
        ElSelect,
        {
          modelValue: model.value?.[item.modelKey],
          "onUpdate:modelValue": (val: any) => updateFormHandler(item.modelKey, val),
          ...commonProps,
        },
        () => item.options?.map((opt) => h(ElOption, { label: opt.label, value: opt.value }))
      );
      break;
    case "date":
    case "datetime":
      input = h(ElDatePicker, {
        modelValue: model.value?.[item.modelKey],
        "onUpdate:modelValue": (val: any) => updateFormHandler(item.modelKey, val),
        type: item.type,
        valueFormat: item.type === "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss",
        ...commonProps,
      });
      break;
    case "daterange":
    case "datetimerange":
      input = h(ElDatePicker, {
        modelValue: model.value?.[item.modelKey],
        "onUpdate:modelValue": (val: any) => updateFormHandler(item.modelKey, val),
        type: item.type,
        valueFormat: item.type === "daterange" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss",
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        ...commonProps,
      });
      break;
    default:
      input = h(ElInput, {
        modelValue: model.value?.[item.modelKey],
        "onUpdate:modelValue": (val: any) => updateFormHandler(item.modelKey, val),
        ...commonProps,
      });
  }

  return h(ElFormItem, { style: {}, ...formItemProps }, () => input);
}

const formRef = ref<FormInstance>();
defineExpose({
  resetFields: () => unref(formRef)?.resetFields(),
});

/** 初始化表单高度处理函数 */
async function init_height_handler() {
  await nextTick();
  if (formContentRef.value) {
    const formItems = formContentRef.value.querySelectorAll(".el-form-item");
    if (formItems.length > 0) {
      rowHeight.value = (formItems[0] as HTMLElement).offsetHeight;
      const totalHeight = formContentRef.value.scrollHeight;
      contentHeight.value = isCollapsed.value ? `${rowHeight.value}px` : `${totalHeight}px`;
    }
  }
}

/** 切换折叠状态处理函数 */
function toggle_collapse_handler() {
  isCollapsed.value = !isCollapsed.value;
  contentHeight.value = isCollapsed.value ? `${rowHeight.value}px` : `${formContentRef.value?.scrollHeight}px`;
}

onMounted(() => {
  init_height_handler();
});

/** grid布局列数 */
const gridColumns = computed(() => `repeat(auto-fill, auto)`);
</script>

<template>
  <ElForm class="query-form" :model="model" ref="formRef" inline>
    <div class="form-wrapper">
      <div class="form-content" ref="formContentRef" :style="{ height: contentHeight }">
        <template v-for="(item, index) in config" :key="item.modelKey">
          <component :is="renderFormItem(item)" class="form-item" />
        </template>
        <div class="form-buttons">
          <ElButton type="primary" @click="searchHandler">
            <ElIcon><Search /></ElIcon>
            查询
          </ElButton>
          <ElButton @click="resetHandler">
            <ElIcon><RefreshLeft /></ElIcon>
            重置
          </ElButton>
          <ElButton link @click="toggle_collapse_handler">
            {{ isCollapsed ? "展开" : "收起" }}
            <ElIcon>
              <component :is="isCollapsed ? ArrowDown : ArrowUp" />
            </ElIcon>
          </ElButton>
        </div>
      </div>
    </div>
  </ElForm>
</template>

<style scoped lang="scss">
.query-form {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}

.form-wrapper {
  position: relative;
  width: 100%;
}

.form-content {
  display: grid;
  grid-template-columns: v-bind(gridColumns);
  gap: 36px;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}

:deep(.form-item) {
  margin: 0;
  .el-form-item__content {
    flex: 1;
  }
}

.form-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  grid-column: calc(v-bind(column)) / calc(v-bind(column) + 1);
  grid-row: 1/2;
}

:deep(.el-form-item) {
  margin: 0;
  width: 100%;
}
</style>
