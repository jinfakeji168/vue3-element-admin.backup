<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <!-- <el-form-item label="启用状态" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item> -->
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
      <el-form-item label="等级" prop="level">
        <el-input-number v-model="formData.level" :min="1" v-if="data" />
        <el-select v-model="formData.level" multiple placeholder="请选择" v-else-if="!data && store.vipList">
          <el-option v-for="item of store.vipList" :label="item?.title" :value="item?.level" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-tabs v-model="currentIndex">
      <el-tab-pane label="标题" :name="0">
        <Content class="content" ref="contentRef" v-model="formData" :keys="['title_original', 'title_translation']" type="public" style="height: 50vh"></Content>
      </el-tab-pane>
      <el-tab-pane label="副标题" :name="1">
        <Content class="content" ref="contentRef" v-model="formData" :keys="['subtitle_original', 'subtitle_translation']" type="public" style="height: 50vh"></Content>
      </el-tab-pane>
      <el-tab-pane label="内容" :name="2">
        <Content class="content" v-model="formData" :keys="['content_original', 'content_translation']" style="height: 50vh" />
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
import api, { type Form } from "@/api/system/quantitativeStrategist";
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
const contentRef = ref<InstanceType<typeof Content>>();

const emits = defineEmits(["finish"]);
async function submitHandler() {
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
  emits("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  unref(contentRef)?.clearValidate();
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
