<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="分享任务图片" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item label="奖励类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">佣金账户</el-radio>
          <el-radio :label="2">奖励VIP</el-radio>
          <el-radio :label="3">基础账户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="奖励次数(类型)" prop="reward_type">
        <el-radio-group v-model="formData.reward_type">
          <el-radio :label="1">总共一次</el-radio>
          <el-radio :label="2">每日一次</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="佣金金额" prop="share_amount">
        <el-input-number v-model="formData.share_amount" :min="0" />
      </el-form-item>

      <el-form-item label="奖励VIP等级" prop="reward_vip_level">
        <el-input v-model="formData.reward_vip_level" type="text" />
      </el-form-item>
      <el-form-item label="奖励VIP天数" prop="reward_vip_days">
        <el-input v-model="formData.reward_vip_days" :min="0" />
      </el-form-item>

      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
    </el-form>
    <div class="tabBar">
      <div class="header">
        <div>标题</div>
        <div>步骤</div>
        <div>内容</div>
      </div>
      <div class="content">
        <Content v-model="contentData[0]"></Content>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler">确 定</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/shareTask";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import uploadPart from "@/components/Upload/uploadPart.vue";
import { contentModel } from "@/api/system/lang";

const props = defineProps<{
  data?: Form;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;
    if (props.data) {
      title.value = "编辑";
      formData.value = { ...props.data };
    } else {
      title.value = "新增";
      formData.value = { status: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  show_name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  min_withdraw: [{ required: true, message: "最小提现金额不能为空", trigger: "blur" }],
};

const formRef = ref<FormInstance>();
const emit = defineEmits(["finally"]);
function submitHandler() {
  unref(formRef)?.validate(async (valid) => {
    if (!valid) return;
    console.log(formData.value);
    if (props.data) {
      await api.edit(formData.value);
    } else {
      await api.add(formData.value);
    }
    visible.value = false;
    emit("finally");
  });
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}

const contentData = ref<contentModel[]>([]);
</script>

<style></style>
