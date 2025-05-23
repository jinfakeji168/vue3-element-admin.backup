<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
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
        <el-input v-model="formData.share_amount" :min="0" />
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
    <el-tabs v-model="currentIndex">
      <el-tab-pane label="标题" :name="0">
        <Content
          class="content"
          style="height: 40vh"
          :ref="
            (el: any) => {
              contentRef[0] = el;
            }
          "
          v-model="formData"
          :keys="['title_original', 'title_translation']"
          type="public"
        ></Content>
      </el-tab-pane>
      <el-tab-pane label="步骤" :name="1">
        <Content
          class="content"
          :ref="
            (el: any) => {
              contentRef[1] = el;
            }
          "
          style="height: 40vh"
          v-model="formData"
          :keys="['step_original', 'step_translation']"
        />
      </el-tab-pane>
      <el-tab-pane label="内容" :name="2">
        <Content
          class="content"
          :ref="
            (el: any) => {
              contentRef[2] = el;
            }
          "
          style="height: 40vh"
          v-model="formData"
          :keys="['content_original', 'content_translation']"
        />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/shareTask";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import uploadPart from "@/components/Upload/uploadPart.vue";
import Content from "@/components/WangEditor/content.vue";

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
      formData.value = { sort: 1, reward_type: 1, type: 1, status: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  share_amount: [{ required: true, message: "填写佣金金额", trigger: "blur" }],
};

const formRef = ref<FormInstance>();
const contentRef = ref<InstanceType<typeof Content>[]>([]);

const emits = defineEmits(["finish"]);
const loading = ref(false);
async function submitHandler() {
  const valid = await Promise.all([unref(formRef)?.validate(), ...unref(contentRef).map((el) => el.validate())]);
  if (valid.some((v) => !v)) return;
  loading.value = true;
  try {
    if (props.data) {
      await api.edit(formData.value);
    } else {
      await api.add(formData.value);
    }
  } finally {
    loading.value = false;
  }
  visible.value = false;
  emits("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  unref(contentRef)?.forEach((el) => el.clearValidate());
  visible.value = false;
}

const currentIndex = ref(0);
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
