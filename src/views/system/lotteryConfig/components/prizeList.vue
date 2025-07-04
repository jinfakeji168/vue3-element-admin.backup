<template>
  <el-dialog v-model="visible" :title="title" width="70%" @closed="closeHandler">
    <el-form class="el_form" ref="formRef" :model="formData![_key]" label-width="100px" :rules="rules">
      <el-form-item :label="`奖项${index + 1}`" v-for="(item, index) of formData![_key]">
        <div class="input_row">
          <div class="input_item">
            <span>ID/唯一值</span>
            <el-input class="el_input" :disabled="disabled" v-model="item.prize_id" placeholder="请输入奖项ID" />
          </div>
          <div class="input_item">
            <span>中奖金额/U</span>
            <el-form-item :prop="`min_prize_num${index}`">
              <el-input class="el_input" :disabled="disabled" v-model="item.min_prize_num" placeholder="请输入中奖金额" />
            </el-form-item>
          </div>
          <div class="input_item">
            <span>概率/%</span>
            <el-input-number class="el_input" :disabled="disabled" v-model="item.probability" :min="0" :max="100" placeholder="请输入概率" />
          </div>
          <el-button type="danger" @click="removeHandler(index)" :disabled="prizeListLength <= 6">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addHandler" :disabled="prizeListLength >= 10">添加奖项</el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :disabled="disabled" :loading="loading">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/system/lotteryConfig";
import { FormInstance } from "element-plus";

const props = defineProps<{
  data: Form;
  _key: "lottery_invite_prize_set" | "lottery_recharge_prize_set" | "lottery_register_prize_set";
  disabled: boolean;
  title: string;
}>();
const visible = defineModel<boolean>();
watch(
  visible,
  () => {
    if (!visible.value) return;
    formData.value = { ...props.data };
  },
  {
    flush: "post",
  }
);

// 定义验证规则
const rules = computed(() => {
  const rules: any = {};
  formData.value[props._key]?.forEach((item, index) => {
    rules[`min_prize_num${index}`] = [
      {
        message: "请输入中奖金额",
        trigger: "blur",
        required: true,
        validator: (rule: any, value: any) => {
          if (item.min_prize_num) return Promise.resolve();
          else return Promise.reject(rule.message);
        },
      },
    ];
  });
  return rules;
});

const formData = ref<Form>({});

const formRef = ref<FormInstance>();
const emit = defineEmits(["finish"]);
const loading = ref(false);
async function submitHandler() {
  loading.value = true;
  try {
    await api.setLotteryConfig(unref(formData as Ref<Form>));
  } finally {
    loading.value = false;
  }
  visible.value = false;
  emit("finish");
}

const prizeListLength = computed(() => formData.value[props._key]?.length || 0);
function addHandler() {
  let id = 0;
  if (prizeListLength.value > 0) {
    id = Math.max(...formData.value[props._key]!.map((item) => Number(item.prize_id))) + 1;
  }

  formData.value[props._key]?.push({ min_prize_num: "", probability: 0, prize_id: String(id) });
}
function removeHandler(index: number) {
  formData.value[props._key]?.splice(index, 1);
}

function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  visible.value = false;
}
</script>
<style scoped lang="scss">
.el_form {
  max-height: 70vh;
  overflow-y: auto;
  .input_row {
    display: flex;
    gap: 10px;
    align-items: center;
    .input_item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .el_input {
      width: 150px;
    }
  }
}
</style>
