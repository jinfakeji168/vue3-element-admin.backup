<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('fenXiangRenWuTuPian')" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item :label="$t('jiangLiLeiXing')" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">{{ $t("yongJinZhangHu_1") }}</el-radio>
          <el-radio :label="2">{{ $t("jiangLiVip") }}</el-radio>
          <el-radio :label="3">{{ $t("jiChuZhangHu") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('jiangLiCiShuLeiXing')" prop="reward_type">
        <el-radio-group v-model="formData.reward_type">
          <el-radio :label="1">{{ $t("zongGongYiCi") }}</el-radio>
          <el-radio :label="2">{{ $t("meiRiYiCi") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('yongJinJinE')" prop="share_amount">
        <el-input-number v-model="formData.share_amount" :min="0" :precision="2" />
      </el-form-item>

      <el-form-item :label="$t('jiangLiVipDengJi')" prop="reward_vip_level">
        <el-select v-model="formData.reward_vip_level">
          <el-option v-for="item of commonStore.vipList" :key="item.level" :label="item.title" :value="item.level" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('jiangLiVipTianShu')" prop="reward_vip_days">
        <el-input-number v-model="formData.reward_vip_days" :min="0" type="number" />
      </el-form-item>

      <el-form-item :label="$t('qiYongZhuangTai')" prop="status">
        <el-switch v-model="formData.status" :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" />
      </el-form-item>
      <el-form-item :label="$t('xianShiPaiXu')" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="currentIndex">
      <el-tab-pane :label="$t('biaoTi')" :name="0">
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
      <el-tab-pane :label="$t('buZhou')" :name="1">
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
      <el-tab-pane :label="$t('neiRong')" :name="2">
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
        <el-button @click="closeHandler">{{ $t("quXiao") }}</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading">{{ $t("queDing") }}</el-button>
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
import { useStore } from "@/store/modules/common";
const commonStore = useStore();
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
      formData.value = { sort: 1, reward_type: 1, type: 1, status: StatusEnum.False };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = ref();
watch(
  () => formData.value.type,
  (val) => {
    unref(formRef)?.clearValidate();
    if (val == 2) {
      rules.value = {
        reward_vip_level: [{ required: true, message: $t("qingXuanZeVipDengJi"), trigger: "blur" }],
        reward_vip_days: [{ required: true, message: $t("tianXieJiangLiTianS"), trigger: "blur" }],
      };
    } else {
      rules.value = {
        share_amount: [{ required: true, message: $t("tianXieYongJinJinE"), trigger: "blur" }],
      };
    }
  }
);

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
