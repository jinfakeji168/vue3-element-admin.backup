<template>
  <el-dialog v-model="dialogVisible" :title="$t('tianJiaHuiYuan')" width="40%">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item :label="$t('yongHuLeiXing')" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio-button :label="1">{{ $t("youXiang") }}</el-radio-button>
          <el-radio-button :label="2">{{ $t("shouJiHao") }}</el-radio-button>
          <el-radio-button :label="3">{{ $t("login.username") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="is_test">
        <el-checkbox v-model="form.is_test" :false-value="2" :true-value="1">{{ $t("tianJiaWeiCeShiZhan") }}</el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('yongHuZhangHu')" prop="account">
        <div class="flex-row">
          <el-input v-model="phoneCode" style="width: 50px" v-if="form.type == 2" />
          <el-input v-model="form.account" style="width: auto" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('yongHuMiMa')" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item :label="$t('anQuanMiMa')" prop="secure_password">
        <el-input v-model="form.secure_password" type="password" />
      </el-form-item>
      <!-- <el-form-item :label="$t('yongHuYaoQingMa')">
        <el-input v-model="form.invita_code" />
      </el-form-item> -->
      <el-form-item :label="$t('shangJi')" prop="invite_id">
        <el-select v-model="form.invite_id" :placeholder="$t('qingShuRuZhangHaoSo_0')" filterable remote :remote-method="searchMemberHandler" :loading="search_loading" clearable>
          <el-option :label="item.label" :value="item.value" v-for="item of memberList" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('yuYanLeiXing')" prop="lang_id">
        <el-select v-model="form.lang_id" :placeholder="$t('qingXuanZeYuYanLei')" filterable>
          <el-option :label="item.name" :value="item.id" v-for="item of store.langList" :key="item.id" :disabled="item.status == StatusEnum.True" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false">{{ $t("quXiao_0") }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">{{ $t("queDing_0") }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { searchMember } from "@/utils";

import { useStore } from "@/store/modules/common";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import api, { type MemberAdd } from "@/api/members/memberList";
import { reactive, ref } from "vue";
const store = useStore();
const dialogVisible = defineModel<boolean>();

const form = ref<MemberAdd>({
  type: 1,
  is_test: 2,
});
const phoneCode = ref("+86");
const formRef = ref();
const rules = reactive({
  type: [{ required: true, message: $t("qingXuanZeYongHuLei"), trigger: "change" }],
  account: [
    { required: true, message: $t("qingShuRuYongHuZhan_0"), trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: $t("qingShuRuYongHuMiM"), trigger: "blur" },
    { min: 6, max: 20, message: "长度在 8 到 20 个字符，要包含字母和数字", trigger: "blur" },
  ],
  // secure_password: [
  //   { required: true, message: $t("qingShuRuAnQuanMiM"), trigger: "blur" },
  //   { min: 6, max: 20, message: "长度在 8 到 20 个字符，要包含字母和数字", trigger: "blur" },
  // ],
});
const loading = ref(false);
const emits = defineEmits(["finish"]);
async function submitForm() {
  const valid = await formRef.value.validate().catch(() => false);
  if (valid) {
    //  提交表单的逻辑
    loading.value = true;
    console.log("form:", form.value);
    try {
      if (form.value.type == 2) {
        form.value.account = phoneCode.value + form.value.account;
      }
      await api.add(form.value);
    } finally {
      loading.value = false;
    }
    dialogVisible.value = false;
    emits("finish");
  } else {
    console.log("error submit!!");
    return false;
  }
}

watch(dialogVisible, (val) => {
  if (!val) {
    formRef.value?.resetFields();
    formRef.value?.clearValidate();
  }
});

const search_loading = ref(false);
const memberList = ref<Awaited<ReturnType<typeof searchMember>>>([]);
async function searchMemberHandler(query: string) {
  search_loading.value = true;
  memberList.value = await searchMember({ account: query });
  search_loading.value = false;
}
</script>
