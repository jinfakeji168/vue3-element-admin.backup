<template>
  <el-dialog v-model="dialogVisible" title="添加会员" width="40%">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="用户类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio-button :label="1">邮箱</el-radio-button>
          <el-radio-button :label="2">手机号</el-radio-button>
          <el-radio-button :label="3">用户名</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户账户" prop="account">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item label="安全密码" prop="secure_password">
        <el-input v-model="form.secure_password" type="password" />
      </el-form-item>
      <el-form-item label="用户邀请码">
        <el-input v-model="form.invita_code" />
      </el-form-item>
      <el-form-item label="上级邀请码" prop="invite_id">
        <el-input v-model="form.invite_id" />
      </el-form-item>
      <el-form-item label="语言类型" prop="lang_id">
        <el-select v-model="form.lang_id" placeholder="请选择语言类型" filterable>
          <el-option :label="item.name" :value="item.id" v-for="item of store.langList" :key="item.id" :disabled="item.status == StatusEnum.True" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useStore } from "@/store/modules/common";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import api, { type MemberAdd } from "@/api/members/memberList";
import { reactive, ref } from "vue";
const store = useStore();
const dialogVisible = defineModel<boolean>();

const form = ref<MemberAdd>({
  type: 1,
});
const formRef = ref();
const rules = reactive({
  type: [{ required: true, message: "请选择用户类型", trigger: "change" }],
  account: [{ required: true, message: "请输入用户账户", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
  secure_password: [{ required: true, message: "请输入安全密码", trigger: "blur" }],
  lang_id: [{ required: true, message: "请选择语言类型", trigger: "change" }],
});
const loading = ref(false);
const emits = defineEmits(["finally"]);
async function submitForm() {
  const valid = await formRef.value.validate().catch(() => false);
  if (valid) {
    //  提交表单的逻辑
    loading.value = true;
    console.log("form:", form.value);
    try {
      await api.add(form.value);
    } finally {
      loading.value = false;
    }
    dialogVisible.value = false;
    emits("finally");
  } else {
    console.log("error submit!!");
    return false;
  }
}

watch(dialogVisible, (val) => {
  if (!val) {
    formRef.value?.resetFields();
    formRef.value?.clearValidate();
  }
});
</script>
