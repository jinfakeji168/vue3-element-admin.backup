<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="用户账号" prop="account">
        <el-select remote :remoteMethod="remoteMethodHandler" filterable clearable :loading="remoteLoading" v-model="formData.account" placeholder="请输入用户账号">
          <el-option v-for="item in memberList" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type AddProxyForm } from "@/api/report/proxyList";
import { searchMember } from "@/utils";
import { FormInstance } from "element-plus";

const visible = defineModel<boolean>();

/** 表单标题 */
const title = ref("新增");

/** 表单数据 */
const formData = ref<AddProxyForm>({});

/** 表单校验规则 */
const rules = {
  account: [{ required: true, message: "请选择账号", trigger: "blur" }],
  remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
};
const remoteLoading = ref(false);
const memberList = ref<Awaited<ReturnType<typeof searchMember>>>([]);
async function remoteMethodHandler(res: string) {
  loading.value = true;
  memberList.value = await searchMember({ account: res });
  memberList.value.forEach((i) => {
    i.value = i.label;
  });
  loading.value = false;
}

const formRef = ref<FormInstance>();
const emits = defineEmits(["finish"]);
const loading = ref(false);
/** 提交处理 */
async function submitHandler() {
  const valid = await unref(formRef)?.validate();
  loading.value = true;
  if (!valid) return;
  try {
    await api.add(formData.value);
  } finally {
    loading.value = false;
  }
  visible.value = false;
  emits("finish");
}

/** 关闭处理 */
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>

<style lang="scss" scoped>
.tabBar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .header {
    display: flex;
    gap: 8px;
    & > div {
      padding: 10px 20px;
      font-size: 16px;
      color: black;
      cursor: pointer;
    }
    .checked {
      color: darkgreen;
      border-bottom: 2px solid darkgreen;
    }
  }
}
</style>
