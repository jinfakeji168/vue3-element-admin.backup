<template>
  <el-dialog v-model="visible" :title="title" width="600px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="产品类型" prop="type">
        <template #label>
          <div class="flex-center">
            <span>产品类型</span>
            <el-tooltip content="普通投资产品所有会员可购买，提现投资产品仅设置了提现需要购买该产品的会员可购买" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-radio-group v-model="formData.type" :disabled="Boolean(data)">
          <el-radio v-for="item of productTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="名称" prop="title">
        <el-input v-model="formData.title" placeholder="" />
      </el-form-item>
      <el-form-item label="图片" prop="icon">
        <upload-part v-model="formData.icon"></upload-part>
      </el-form-item>
      <el-form-item label="购买价格" prop="purchase_price">
        <el-input v-model="formData.purchase_price" />
      </el-form-item>
      <el-form-item label="投资周期" prop="invest_cycle">
        <el-input-number v-model="formData.invest_cycle" :min="0" />
      </el-form-item>
      <el-form-item label="每日收益率" prop="daily_yield">
        <el-input v-model="formData.daily_yield" />
      </el-form-item>
      <el-form-item label="收益类型" prop="yield_type">
        <el-select v-model="formData.yield_type" placeholder="请选择收益类型">
          <el-option v-for="item in yieldTypeOptions" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="限购数量" prop="sales_quota">
        <template #label>
          <div class="flex-center">
            <span>限购数量</span>
            <el-tooltip content="0表示不限制" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input-number v-model="formData.sales_quota" :min="0" />
      </el-form-item>
      <el-form-item label="剩余数量" prop="residual_num">
        <el-input-number v-model="formData.residual_num" :min="0" />
      </el-form-item>
      <el-form-item label="剩余数量是否显示" prop="show_residual_num">
        <el-switch v-model="formData.show_residual_num" :active-value="1" :inactive-value="2" :active-text="'开启'" :inactive-text="'关闭'" />
      </el-form-item>
      <el-form-item label="销售状态" prop="sales_status">
        <el-switch v-model="formData.sales_status" :active-value="1" :inactive-value="2" :active-text="'开启'" :inactive-text="'关闭'" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="2" :active-text="'开启'" :inactive-text="'关闭'" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitHandler">确 定</el-button>
        <el-button @click="closeHandler">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form, yieldTypeOptions, productTypeOptions } from "@/api/system/investmentConfig"; // 确保api路径正确
import { FormInstance } from "element-plus";
import uploadPart from "@/components/Upload/uploadPart.vue";
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
      formData.value = {
        type: 1, // 设置默认值
        sort: 0,
        status: 1,
        title: "",
        icon: "",
        purchase_price: "",
        invest_cycle: 0,
        daily_yield: "",
        yield_type: 1,
        sales_quota: 0,
        residual_num: 0,
        show_residual_num: 1,
        sales_status: 1,
      };
    }
  },
  {
    flush: "post",
  }
);
const formData = ref<Form>({});

const rules = {
  type: [{ required: true, message: "产品类型不能为空", trigger: "change" }],
  sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
  status: [{ required: true, message: "状态不能为空", trigger: "change" }],
  title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  icon: [{ required: true, message: "图片不能为空", trigger: "blur" }],
  purchase_price: [{ required: true, message: "购买价格不能为空", trigger: "blur" }],
  invest_cycle: [{ required: true, message: "投资周期不能为空", trigger: "blur" }],
  daily_yield: [{ required: true, message: "每日收益率不能为空", trigger: "blur" }],
  yield_type: [{ required: true, message: "收益类型不能为空", trigger: "change" }],
  sales_quota: [{ required: true, message: "限购数量不能为空", trigger: "blur" }],
  residual_num: [{ required: true, message: "剩余数量不能为空", trigger: "blur" }],
  show_residual_num: [{ required: true, message: "剩余数量是否显示不能为空", trigger: "change" }],
  sales_status: [{ required: true, message: "销售状态不能为空", trigger: "change" }],
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
</script>

<style></style>
