<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('leiXing_0')" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">{{ $t("yeMian") }}</el-radio>
          <el-radio :label="2">{{ $t("ziDingYiNeiRong") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('tiaoZhuanYeMian')" prop="level" v-if="formData?.type == 1">
        <el-select v-model="formData.jump_page" :labelplaceholder="$t('qingXuanZe')">
          <el-option v-for="item of activityList" :label="item?.val" :value="item?.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('tuPian')" prop="icon">
        <upload-part v-model="formData.bg_icon"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('qiYongZhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('xianShiPaiXu')" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="currentIndex">
      <el-tab-pane :label="$t('biaoTi')" :name="0">
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
          style="height: 50vh"
        ></Content>
      </el-tab-pane>
      <el-tab-pane :label="$t('fuBiaoTi')" :name="1">
        <Content
          class="content"
          :ref="
            (el: any) => {
              contentRef[1] = el;
            }
          "
          v-model="formData"
          :keys="['subtitle_original', 'subtitle_translation']"
          type="public"
          style="height: 50vh"
        ></Content>
      </el-tab-pane>
      <el-tab-pane :label="$t('neiRong')" :name="2" :disabled="formData?.type != 2">
        <Content
          class="content"
          :ref="
            (el: any) => {
              contentRef[2] = el;
            }
          "
          v-model="formData"
          :required="formData?.type == 2"
          :keys="['content_original', 'content_translation']"
          style="height: 50vh"
        />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">{{ $t("queDing") }}</el-button>
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
      title.value = $t("bianJi");
      formData.value = { ...props.data };
    } else {
      title.value = $t("xinZeng");
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
  push_time: { required: true, message: $t("qingXuanZeFaBuShiJ"), trigger: "blur" },
};
const formRef = ref<FormInstance>();
const contentRef = ref<InstanceType<typeof Content>[]>([]);

const emits = defineEmits(["finish"]);
async function submitHandler() {
  const valid = await Promise.all([unref(formRef)?.validate(), ...unref(contentRef).map((e) => e.validate())]);
  if (valid.some((v) => !v)) return;
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
  unref(contentRef).forEach((e) => {
    e.clearValidate();
  });
  visible.value = false;
}

const currentIndex = ref(0);
const activityList = inject<any>("activityList", []);
</script>

<style lang="scss" scoped>
.content {
  height: 70vh;
  overflow: auto;
}
</style>
