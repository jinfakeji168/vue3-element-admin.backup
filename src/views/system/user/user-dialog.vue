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
  { label: "用户名", prop: "username", type: "input", readonly: (form) => !!form.uid },
  { label: "用户昵称", prop: "nickname", type: "input" },
  { label: "所属部门", prop: "department_id", type: "tree-select" },
  { label: "角色", prop: "roles", type: "select", multiple: true },
  { label: "密码", prop: "password", type: "input", showOn: (form) => !form.uid },
  { label: "确认密码", prop: "password2", type: "input", showOn: (form) => !form.uid },
  { label: "手机号码", prop: "mobile", type: "input", maxlength: 11 },
  { label: "邮箱", prop: "email", type: "input", maxlength: 50 },
  { label: "状态", prop: "status", type: "switch" },
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
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  department_id: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roles: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  password: [
    {
      required: true,
      message: "密码至少需要6位字符",
      trigger: "blur",
      pattern: /^.{6,}$/,
    },
  ],
  password2: [{ required: true, message: "确认密码不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
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
            :placeholder="'请输入' + item.label"
          />
          <el-tree-select
            v-else-if="item.type === 'tree-select'"
            v-model="formData[item.prop as keyof UserForm]"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            :placeholder="'请选择' + item.label"
          />
          <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop as keyof UserForm]" :multiple="item.multiple" :placeholder="'请选择' + item.label">
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
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitHandler">确 定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
