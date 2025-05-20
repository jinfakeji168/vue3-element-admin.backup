<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">页面</el-radio>
          <el-radio :label="2">自定义内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转页面" prop="level" v-if="formData?.type == 1">
        <el-select v-model="formData.jump_page" placeholder="请选择">
          <el-option v-for="item of activityList" :label="item?.val" :value="item?.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="icon">
        <upload-part v-model="formData.bg_icon"></upload-part>
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="currentIndex">
      <el-tab-pane label="标题" :name="0">
        <Content class="content" ref="contentRef" v-model="formData" :keys="['title_original', 'title_translation']" type="public" style="height: 50vh"></Content>
      </el-tab-pane>
      <el-tab-pane label="副标题" :name="1">
        <Content class="content" ref="contentRef" v-model="formData" :keys="['subtitle_original', 'subtitle_translation']" type="public" style="height: 50vh"></Content>
      </el-tab-pane>
      <el-tab-pane label="内容" :name="2" :disabled="formData?.type != 2">
        <Content class="content" ref="contentRef" v-model="formData" :required="formData?.type == 2" :keys="['content_original', 'content_translation']" style="height: 50vh" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler" :loading="loading">确 定</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { Activity, type Form } from "@/api/system/activitySetting";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs, FormInstance } from "element-plus";
import Content from "@/components/WangEditor/content.vue";
import { useStore } from "@/store/modules/common";
const store = useStore();

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
      formData.value = { sort: 1, status: StatusEnum.False, type: 1 };
    }
  },
  {
    flush: "post",
  }
);
const loading = ref(false);
const formData = ref<Form>({});

const rules = {
  push_time: { required: true, message: "请选择发布时间", trigger: "blur" },
};
const formRef = ref<FormInstance>();
const contentRef = ref<InstanceType<typeof Content>>();

const emits = defineEmits(["finally"]);
async function submitHandler() {
  console.log("🚀 ~ submitHandler ~ submitHandler:", contentRef.value);

  const valid = await unref(formRef)?.validate();
  const valid1 = await unref(contentRef)?.validate();
  if (!valid || !valid1) return;
  loading.value = true;
  try {
    if (props.data) {
      await api.edit(unref(formData));
    } else {
      await api.add({ ...unref(formData) });
    }
  } finally {
    loading.value = false;
  }
  visible.value = false;
  emits("finally");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  unref(contentRef)?.clearValidate();
  visible.value = false;
}

const currentIndex = ref(0);

const activityList = ref<Activity[]>([]);
async function getActivityList() {
  const res = await api.getJumpPageList();
  activityList.value = res;
}
getActivityList();
</script>

<style lang="scss" scoped>
.content {
  height: 70vh;
  overflow: auto;
}
</style>
