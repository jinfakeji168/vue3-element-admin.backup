<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
      <!-- <el-form-item label="发布时间" prop="push_time">
        <el-date-picker v-model="formData.push_time" type="datetime" placeholder="选择发布时间" />
      </el-form-item> -->
    </el-form>
    <el-tabs v-model="currentIndex">
      <el-tab-pane label="标题" :name="0">
        <Content
          class="content"
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
      <el-tab-pane label="内容" :name="1">
        <Content
          class="content"
          :ref="
            (el: any) => {
              contentRef[1] = el;
            }
          "
          v-model="formData"
          :keys="['content_original', 'content_translation']"
          type="public"
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
import api, { type Form } from "@/api/system/rollingNotice";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs, FormInstance } from "element-plus";
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
      formData.value = { sort: 1, status: StatusEnum.False };
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
const contentRef = ref<InstanceType<typeof Content>[]>([]);

const emits = defineEmits(["finish"]);
async function submitHandler() {
  const valid = await Promise.all([unref(formRef)?.validate(), ...unref(contentRef).map((el) => el.validate())]);
  if (valid.some((v) => !v)) return;
  loading.value = true;
  try {
    if (props.data) {
      await api.edit(unref(formData));
    } else {
      await api.add(unref(formData));
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
.content {
  height: 70vh;
  overflow: auto;
}
</style>
