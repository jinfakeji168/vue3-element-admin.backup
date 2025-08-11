<script setup lang="ts">
defineOptions({
  name: "UserDialog",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageVO } from "@/api/system/user";
import DeptAPI from "@/api/system/dept";
import RoleAPI from "@/api/system/role";
import { deepChangeOption } from "@/utils";
import { StatusEnum } from "@/enums/MenuTypeEnum";

/** 定义组件属性 */
const visible = defineModel("visible", { type: Boolean, default: false });
const title = defineModel("title", { type: String, default: "" });

/** 表单项类型定义 */
interface FormItem {
  label: string;
  prop: keyof UserForm;
  type: "input" | "tree-select" | "select" | "switch";
  readonly?: (form: UserForm) => boolean;
  showOn?: (form: UserForm) => boolean;
  multiple?: boolean;
  maxlength?: number;
}

/** 表单配置项 */
const formItems: FormItem[] = [
  { label: $t("login.username"), prop: "username", type: "input", readonly: (form) => !!form.uid },
  { label: $t("yongHuNiCheng"), prop: "nickname", type: "input" },
  { label: $t("suoShuBuMen"), prop: "department_id", type: "tree-select" },
  { label: $t("jiaoSe"), prop: "roles", type: "select", multiple: true },
  { label: $t("login.password"), prop: "password", type: "input", showOn: (form) => !form.uid },
  { label: $t("queRenMiMa"), prop: "password2", type: "input", showOn: (form) => !form.uid },
  { label: $t("shouJiHaoMa"), prop: "mobile", type: "input", maxlength: 11 },
  { label: $t("youXiang"), prop: "email", type: "input", maxlength: 50 },
  { label: $t("zhuangTai"), prop: "status", type: "switch" },
];

/** 事件处理 */
const emit = defineEmits(["success"]);

/** 组件状态与引用 */
const userFormRef = ref();
const loading = ref(false);

/** 表单数据与配置 */
const formData = reactive<UserForm>({
  status: 1,
});
const deptOptions = ref<OptionType[]>([]);
const roleOptions = ref<OptionType[]>([]);

/** 表单校验规则 */
const rules = {
  username: [{ required: true, message: $t("yongHuMingBuNengWei"), trigger: "blur" }],
  nickname: [{ required: true, message: $t("yongHuNiChengBuNeng"), trigger: "blur" }],
  // department_id: [{ required: true, message: $t("suoShuBuMenBuNengW"), trigger: "blur" }],
  roles: [{ required: true, message: $t("yongHuJiaoSeBuNeng"), trigger: "blur" }],
  password: [
    {
      required: true,
      message: $t("miMaZhiShaoXuYao_6"),
      trigger: "blur",
      pattern: /^.{6,}$/,
    },
  ],
  password2: [{ required: true, message: $t("queRenMiMaBuNengWe"), trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: $t("qingShuRuZhengQueDe_2"),
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: $t("qingShuRuZhengQueDe_3"),
      trigger: "blur",
    },
  ],
};

/** 表单提交处理 */
async function submitHandler() {
  await userFormRef.value?.validate();
  loading.value = true;
  try {
    if (formData.uid) {
      await UserAPI.update(formData);
    } else {
      await UserAPI.add(formData);
    }
    closeHandler();
    emit("success");
  } finally {
    loading.value = false;
  }
}

/** 关闭处理 */
function closeHandler() {
  userFormRef.value?.resetFields();
  userFormRef.value?.clearValidate();
  visible.value = false;
  formData.uid = undefined;
  formData.status = 1;
}

/** 加载选项数据 */
async function loadOptions() {
  const [deptData, roleData] = await Promise.all([DeptAPI.getOptions(), RoleAPI.options()]);

  deptOptions.value = deepChangeOption(deptData, [
    ["label", "title"],
    ["value", "id"],
  ]);
  roleOptions.value = deepChangeOption(roleData, [
    ["label", "title"],
    ["value", "id"],
  ]);
}

/** 设置表单数据 */
function setFormData(data?: UserPageVO) {
  if (data) {
    nextTick(() => {
      Object.assign(formData, data);
      formData.roles = data.roles?.map((item) => item.id);
    });
  }
}

// 组件挂载时加载选项
onMounted(loadOptions);

// 暴露方法供父组件调用
defineExpose({ setFormData });
</script>

<template>
  <el-drawer v-model="visible" :title="title" append-to-body @close="closeHandler">
    <el-form ref="userFormRef" :model="formData" :rules="rules" label-width="80px">
      <template v-for="item in formItems" :key="item.prop">
        <el-form-item v-if="!item.showOn || item.showOn(formData)" :label="item.label" :prop="item.prop">
          <el-input
            v-if="item.type === 'input'"
            v-model="formData[item.prop as keyof UserForm]"
            :readonly="item.readonly?.(formData)"
            :maxlength="item.maxlength"
            :placeholder="$t('qingShuRuItemlabel', [item.label])"
          />
          <el-tree-select
            v-else-if="item.type === 'tree-select'"
            v-model="formData[item.prop as keyof UserForm]"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            :placeholder="$t('qingXuanZeItemlabel', [item.label])"
          />
          <el-select
            v-else-if="item.type === 'select'"
            v-model="formData[item.prop as keyof UserForm]"
            :multiple="item.multiple"
            :placeholder="$t('qingXuanZeItemlabel_0', [item.label])"
          >
            <el-option v-for="opt in roleOptions" :key="opt.value" :label="opt.label" :value="opt.value" :disabled="opt.disabled" />
          </el-select>
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="formData[item.prop as keyof UserForm]"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitHandler">{{ $t("queDing") }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>
