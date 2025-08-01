<script setup lang="ts">
import { computed, ref, h, onMounted, nextTick } from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElIcon, ElDatePicker, FormInstance, ElRadioButton } from "element-plus";
import { ArrowDown, ArrowUp, Search, RefreshLeft } from "@element-plus/icons-vue";
import { ElInputNumber, ElRadio, ElRadioGroup, ElCheckbox, ElCheckboxGroup } from "element-plus";

/** 查询表单数据模型 */
const model = defineModel<Record<string, any>>();

const props = withDefaults(
  defineProps<{
    config: QueryConfig;
    collapsed?: boolean;
  }>(),
  {
    collapsed: true,
  }
);
const emit = defineEmits(["search", "reset"]);
/** 更新表单数据处理函数 */
function updateFormHandler(key: string | string[], value: any, index?: number) {
  if (Array.isArray(key)) {
    model.value![key[index!]] = value;
  } else {
    model.value![key] = value;
  }
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
function renderFormItem(item: QueryConfig["formItem"][0]) {
  const formItemProps = {
    label: item.label,
    rules: item.rules,
  };

  const commonProps = {
    ...item.props,
  };
  for (let k in commonProps) {
    commonProps.clearable = true;
    commonProps[k] = unref(commonProps[k]);
  }

  const modelKeys = Array.isArray(item.modelKey) ? item.modelKey : [item.modelKey];
  const placeholders = Array.isArray(item.props?.placeholder) ? item.props.placeholder : [item.props?.placeholder];

  const inputs = modelKeys.map((key, index) => {
    const inputProps = {
      modelValue: model.value?.[key],
      ...commonProps,
      "onUpdate:modelValue": (val: any) => updateFormHandler(modelKeys, val, index),
      placeholder: placeholders[index],
    };

    switch (item.type) {
      case "select":
        return h(ElSelect, inputProps, () => unref(item.options)?.map((opt) => h(ElOption, { label: opt.label, key: opt.value, value: opt.value })));
      case "date":
      case "datetime":
        return h(ElDatePicker, {
          ...inputProps,
          type: item.type,
          valueFormat: item.type === "date" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss",
        });
      case "daterange":
      case "datetimerange":
        return h(ElDatePicker, {
          ...inputProps,
          type: item.type,
          valueFormat: item.type === "daterange" ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss",
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",
        });
      case "inputnumber":
        return h(ElInputNumber, inputProps);
      case "radio":
        return h(ElRadioGroup, inputProps, () => unref(item.options)?.map((opt) => h(ElRadioButton, { label: opt.value, key: opt.value }, () => opt.label)));
      case "checkbox":
        return h(ElCheckboxGroup, inputProps, () => unref(item.options)?.map((opt) => h(ElCheckbox, { label: opt.value, key: opt.value }, () => opt.label)));
      case "textarea":
        return h(ElInput, { ...inputProps, type: "textarea" });
      default:
        return h(ElInput, inputProps);
    }
  });

  return h(
    "div",
    {},
    inputs.map((input, index) => {
      const prop = Array.isArray(item.modelKey) ? item.modelKey[index] : item.modelKey;
      return h(ElFormItem, { style: {}, ...formItemProps, prop, label: index == 0 ? item.label : "" }, () => input);
    })
  );
}

const formRef = ref<FormInstance>();
defineExpose({
  resetFields: () => unref(formRef)?.resetFields(),
});

const isCollapsed = ref(props.collapsed);
const formContentRef = ref<HTMLElement>();
const contentHeight = ref("auto");
const rowHeight = ref(0);

/** 初始化表单高度处理函数 */
async function init_height_handler() {
  await nextTick();
  if (formContentRef.value) {
    const formItems = formContentRef.value.querySelectorAll(".el-form-item");
    if (formItems.length > 0) {
      rowHeight.value = (formItems[0] as HTMLElement).offsetHeight;
      contentHeight.value = isCollapsed.value ? `${rowHeight.value}px` : `${formContentRef.value?.scrollHeight}px`;
    }
  }
}

/** 切换折叠状态处理函数 */
function toggle_collapse_handler() {
  isCollapsed.value = !isCollapsed.value;
  contentHeight.value = isCollapsed.value ? `${rowHeight.value}px` : `${formContentRef.value?.scrollHeight}px`;
}

/** 表单项排序值数组 */
const itemOrders = ref<number[]>([]);
const buttonOrders = ref(0);

/** 更新表单排序处理函数 */
function update_items_order_handler() {
  nextTick(() => {
    if (formContentRef.value) {
      const formItems = formContentRef.value.querySelectorAll(".el-form-item");
      const firstRowTop = formItems[0]?.getBoundingClientRect().top;
      const formWidth = formContentRef.value.offsetWidth;
      let firstRowWidth = 0;
      const formItemLength = props.config.formItem.length;
      // 重置排序数组
      itemOrders.value = Array(formItemLength).fill(formItemLength + 1);

      // 计算第一行的元素
      Array.from(formItems).forEach((item, index) => {
        const rect = (item as HTMLElement).getBoundingClientRect();
        if (rect.top === firstRowTop) {
          itemOrders.value[index] = index;
          const marginRight = getComputedStyle(item).marginRight.match(/\d+/) || [0];
          firstRowWidth += rect.width + Number(marginRight[0]);
        }
      });

      // 计算第一行剩余宽度是否足够放置按钮组
      const buttonsEl = formContentRef.value?.querySelector(".form-buttons") as HTMLElement;
      const buttonsWidth = buttonsEl?.offsetWidth || 0;
      const remainingWidth = formWidth - firstRowWidth;

      // 设置按钮组order
      buttonOrders.value = itemOrders.value.indexOf(formItemLength + 1);
      if (remainingWidth < buttonsWidth) {
        // 剩余宽度不够，按钮组order往前调整一位
        buttonOrders.value = buttonOrders.value > 0 ? buttonOrders.value - 2 : formItemLength;
      } else {
        buttonOrders.value = buttonOrders.value > 0 ? buttonOrders.value : formItemLength;
      }
      nextTick(() => {
        buttonsEl.style.flexGrow = "1";
      });
    }
  });
}

/** 是否只有一行表单项 */
const is_single_row = computed(() => {
  return itemOrders.value[itemOrders.value.length - 1] === props.config.formItem.length - 1;
});

/** 窗口尺寸变化处理函数 */
/**节流时间 */
const throttle_time = 300;

/**节流处理函数*/
function _throttle(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**窗口尺寸变化处理函数*/
const resize_handler = _throttle(() => {
  update_items_order_handler();
  init_height_handler();
}, throttle_time);

onMounted(() => {
  update_items_order_handler();
  init_height_handler();
  window.addEventListener("resize", resize_handler);
});

onUnmounted(() => {
  window.removeEventListener("resize", resize_handler);
});
</script>

<template>
  <ElForm class="query-form" :model="model" ref="formRef" inline v-bind="props.config">
    <div class="form-content" ref="formContentRef" :style="{ maxHeight: contentHeight }">
      <template v-for="(item, index) in config.formItem" :key="item.modelKey">
        <component :is="renderFormItem(item)" :style="{ order: itemOrders[index] }" />
      </template>
      <div class="form-buttons" :style="{ order: buttonOrders }">
        <ElButton type="primary" @click="searchHandler">
          <ElIcon><Search /></ElIcon>
          查询
        </ElButton>
        <ElButton @click="resetHandler">
          <ElIcon><RefreshLeft /></ElIcon>
          重置
        </ElButton>
        <ElButton v-if="!is_single_row" link @click="toggle_collapse_handler">
          {{ isCollapsed ? "展开" : "收起" }}
          <ElIcon>
            <component :is="isCollapsed ? ArrowDown : ArrowUp" />
          </ElIcon>
        </ElButton>
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

.form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 0;
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.form-buttons {
  white-space: nowrap;
  display: flex;
  justify-content: flex-end;
  // flex-grow: 1;
}

:deep(.el-form-item) {
  margin: 0;
  .el-form-item__content {
    flex: 1;
  }
}
</style>
