<template>
  <el-dialog v-model="visible" :title="$t('piLiangCaoZuo')" width="80%">
    <el-tabs v-model="activeTab" tab-position="left" type="border-card" :beforeLeave="beforeLeaveHandler">
      <el-tab-pane v-for="(tab, index) of tabs" :key="index" :label="tab.label" :name="index"></el-tab-pane>
      <el-card shadow="never">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
          <el-form-item :label="$t('piLiangFangShi')" prop="batch_type" v-if="tabs[activeTab].batchWay.length">
            <el-radio-group v-model="formData.batch_type">
              <el-radio v-for="item of tabs[activeTab].batchWay" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="formData.batch_type === 1">
            <el-form-item :label="$t('huiYuanZhangHu')" prop="accountInput">
              <el-input type="textarea" v-model="accountInput" :placeholder="$t('qingShuRuHuiYuanZha_1')" />
            </el-form-item>
          </template>
          <template v-else-if="formData.batch_type === 2">
            <el-form-item :label="$t('huiYuanDengJi_0')" prop="old_vip_level">
              <el-select v-model="formData.old_vip_level">
                <el-option v-for="item of store.vipList" :key="item.id" :value="item.level" :label="item.title" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('zhuCeShiJian')" prop="register_time">
              <el-date-picker v-model="formData.register_time" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
          </template>
          <template v-else-if="formData.batch_type === 3">
            <el-form-item :label="$t('chongTiCha')" prop="charge_mention_diff">
              <el-input v-model="formData.charge_mention_diff" :placeholder="$t('qingShuRuChongTiCha')" />
            </el-form-item>
          </template>
          <template v-else-if="formData.batch_type === 4">
            <el-form-item :label="$t('zhiDingHuiYuanSuoYo')" prop="spec_account">
              <el-select v-model="formData.spec_account" :remote-method="remoteHandler" :loading="loading[1]" filterable remote :placeholder="$t('qingShuRuHuiYuanZha_0')">
                <el-option v-for="item in memberList" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
              <span>{{ subordinateNumStr }}</span>
            </el-form-item>
          </template>
          <template v-else-if="formData.batch_type === 5">
            <el-form-item :label="$t('fenZu')" prop="group_id">
              <el-select v-model="formData.group_id">
                <el-option v-for="item of store.groupList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.status == StatusEnum.True" />
              </el-select>
            </el-form-item>
          </template>
          <hr />
          <template v-if="activeTab === 0">
            <el-form-item :label="$t('tiaoZhengHouDengJi')" prop="new_vip_level">
              <el-select v-model="formData.new_vip_level">
                <el-option v-for="item of store.vipList" :key="item.id" :value="item.level" :label="item.title" />
              </el-select>
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 1">
            <el-form-item :label="$t('shengJiCaiNengZuoLi')" prop="is_upgrade_quant">
              <el-radio-group v-model="formData.is_upgrade_quant">
                <el-radio :label="1">{{ $t("shi") }}</el-radio>
                <el-radio :label="2">{{ $t("fou") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 2">
            <el-form-item :label="$t('liangHuaKaiGuan')" prop="is_quant">
              <el-radio-group v-model="formData.is_quant">
                <el-radio :label="1">{{ $t("kaiQi") }}</el-radio>
                <el-radio :label="2">{{ $t("guanBi") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 3">
            <el-form-item :label="$t('shouYiZheKou')" prop="quant_final_earnings_discount">
              <el-input v-model="formData.quant_final_earnings_discount" :placeholder="$t('qingShuRuShouYiZhe')" />
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 4">
            <el-form-item :label="$t('yongJinQuanBuZhuanL')">
              <el-radio-group v-model="trueConst">
                <el-radio :label="true">{{ $t("shi") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 5">
            <el-form-item :label="$t('yaoQingLiangHua')" prop="is_invite_user_quant">
              <el-radio-group v-model="formData.is_invite_user_quant">
                <el-radio :label="1">{{ $t("shi") }}</el-radio>
                <el-radio :label="2">{{ $t("fou") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('yaoQingYongHuShuLia')" prop="quant_invite_user_number">
              <el-input v-model.number="formData.quant_invite_user_number" :placeholder="$t('qingShuRuYaoQingYon')" />
            </el-form-item>
            <el-form-item :label="$t('yaoQingChongZhiJinE')" prop="quant_invite_user_recharge_amount">
              <el-input v-model.number="formData.quant_invite_user_recharge_amount" :placeholder="$t('qingShuRuYaoQingYon_0')" />
            </el-form-item>
            <el-form-item :label="$t('youXiaoShiJian')" prop="quant_invite_user_effective_time">
              <el-date-picker v-model="formData.quant_invite_user_effective_time" type="datetime" :placeholder="$t('xuanZeYouXiaoShiJia_0')" />
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 6">
            <el-form-item :label="$t('fengJinLeiXing')" prop="ban_type">
              <el-checkbox-group v-model="formData.ban_type">
                <el-checkbox :label="1">{{ $t("dengLu") }}</el-checkbox>
                <el-checkbox :label="2">{{ $t("tiKuan") }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('caoZuoLeiXing')" prop="operation">
              <el-radio-group v-model="formData.operation">
                <el-radio :label="1">{{ $t("jieFeng") }}</el-radio>
                <el-radio :label="2">{{ $t("fengJin") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 7">
            <el-form-item :label="$t('caoZuoDuiXiang')" prop="op_type">
              <el-radio-group v-model="formData.op_type">
                <el-radio :label="1">{{ $t("liangHuaZhangHuYuE") }}</el-radio>
                <el-radio :label="2">{{ $t("chongZhiJinE_0") }}</el-radio>
                <el-radio :label="3">{{ $t("yongJinZhangHuYuE") }}</el-radio>
                <el-radio :label="4">{{ $t("zhiNengZhangHuYuE") }}</el-radio>
                <el-radio :label="5">{{ $t("tiYanJinYuE") }}</el-radio>
                <el-radio :label="6">{{ $t("miaoHeYueYuE") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('bianDongLeiXing')" prop="change_type">
              <el-radio-group v-model="formData.change_type">
                <el-radio :label="1">{{ $t("jianShao") }}</el-radio>
                <el-radio :label="2">{{ $t("zengJia") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('bianDongJinE')" prop="change_amount">
              <el-input v-model.number="formData.change_amount" :placeholder="$t('qingShuRuBianDongJi')" />
            </el-form-item>
            <el-form-item :label="$t('beiZhu')" prop="change_remark">
              <el-input v-model="formData.change_remark" :placeholder="$t('qingShuRuBeiZhu_0')" />
            </el-form-item>
          </template>

          <template v-else-if="activeTab === 8">
            <el-form-item :label="$t('zengSongLeiXing')" prop="lottery_type">
              <el-radio-group v-model="formData.lottery_type">
                <el-radio :label="1">{{ $t("zhuCeZengSongCiShu") }}</el-radio>
                <el-radio :label="2">{{ $t("yaoQingZengSongCiSh") }}</el-radio>
                <el-radio :label="3">{{ $t("chongZhiZengSongCiS") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('zengSongCiShu')" prop="gift_number">
              <el-input v-model.number="formData.gift_number" :placeholder="$t('qingShuRuZengSongCi')" />
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 9">
            <el-form-item :label="$t('touZiLeiXing')" prop="invest_type">
              <el-radio-group v-model="formData.invest_type">
                <el-radio :label="1">{{ $t("tiXianMaiTouZi") }}</el-radio>
                <el-radio :label="2">{{ $t("liangHuaMaiTouZi") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('touZiChanPin')" prop="invest_product">
              <el-checkbox-group v-model="formData.invest_product">
                <el-checkbox label="product1">{{ $t("chanPin_1") }}</el-checkbox>
                <el-checkbox label="product2">{{ $t("chanPin_2") }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('youXiaoShiJian_0')" prop="effective_time">
              <el-date-picker v-model="formData.effective_time" type="datetime" :placeholder="$t('xuanZeYouXiaoShiJia_0')" />
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 10">
            <el-form-item :label="$t('shuYingGaiShuai')" prop="second_contract_win_lose_ratio">
              <el-input v-model.number="formData.second_contract_win_lose_ratio" :placeholder="$t('qingShuRuGaiShuai')" />
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 11">
            <el-form-item :label="$t('shengJiCaiNengTiXia')" prop="is_upgrade_withdrawal">
              <el-radio-group v-model="formData.is_upgrade_withdrawal">
                <el-radio :label="1">{{ $t("shi") }}</el-radio>
                <el-radio :label="2">{{ $t("fou") }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 12">
            <el-form-item :label="$t('yaoQingTiXian')" prop="is_invite_user_withdrawal">
              <el-radio-group v-model="formData.is_invite_user_withdrawal">
                <el-radio :label="1">{{ $t("shi") }}</el-radio>
                <el-radio :label="2">{{ $t("fou") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('tiXianCiShu')" prop="withdrawal_number">
              <el-input v-model.number="formData.withdrawal_number" :placeholder="$t('qingShuRuTiXianCiS')" />
            </el-form-item>
            <el-form-item :label="$t('yaoQingYongHuShuLia')" prop="withdrawal_invite_user_number">
              <el-input v-model.number="formData.withdrawal_invite_user_number" :placeholder="$t('qingShuRuYaoQingYon_1')" />
            </el-form-item>
            <el-form-item :label="$t('yaoQingChongZhiJinE_0')" prop="withdrawal_invite_user_recharge_amount">
              <el-input v-model.number="formData.withdrawal_invite_user_recharge_amount" :placeholder="$t('qingShuRuYaoQingYon_2')" />
            </el-form-item>
            <el-form-item :label="$t('youXiaoShiJian_1')" prop="withdrawal_invite_user_effective_time">
              <el-date-picker v-model="formData.withdrawal_invite_user_effective_time" type="datetime" :placeholder="$t('xuanZeYouXiaoShiJia_0')" />
            </el-form-item>
          </template>
          <template v-else-if="activeTab === 13">
            <el-form-item :label="$t('xinFenZu')" prop="new_group_id">
              <el-select v-model="formData.new_group_id" :placeholder="$t('qingXuanZeXinFenZu')">
                <el-option v-for="item in store.groupList" :key="item.id" :label="item.title" :value="item.id" :disabled="item.status == StatusEnum.True" />
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <template #footer>
          <el-button @click="visible = false">{{ $t("quXiao_0") }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading[0]">{{ $t("queRenXiuGai") }}</el-button>
        </template>
      </el-card>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { Member, type BatchOperationForm } from "@/api/members/memberList";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import { dayjs } from "element-plus";
import systemConfig from "@/api/system/systemConfig";

import { searchMember } from "@/utils";
import { useStore } from "@/store/modules/common";
const store = useStore();
const visible = defineModel<boolean>();
const props = withDefaults(defineProps<{ account?: Member[]; tabIndex: number }>(), {});

const activeTab = ref<number>(0);

watch(activeTab, (val) => {
  //切换的时候重置批量方式
  if (tabs[val].batchWay.length - 1 < formData.value.batch_type) {
    formData.value.batch_type = 1;
  }
});
//获取当前tab下的formdata更改过的数据key
function getChangedFormKey() {
  const obj = [];
  const formKey = tabs[activeTab.value].formKey;

  for (let item of Object.entries(formData.value)) {
    const key = item[0] as keyof BatchOperationForm;
    if (formKey?.includes(key)) {
      if (toRaw(item[1]).toString() != originFormData[key]?.toString()) {
        obj.push(key);
      }
    }
  }
  return obj;
}

//切换批量操作时判断是否保存
async function beforeLeaveHandler() {
  const res = getChangedFormKey();
  if (res.length) {
    return new Promise((resolve, inject) => {
      const res = ElMessageBox.confirm($t("dangQianYeMianYouWe"), $t("tiShi"), {
        confirmButtonText: $t("queDing_0"),
        cancelButtonText: $t("quXiao_0"),
        type: "warning",
      })
        .then(() => {
          //重置值
          formData.value = { ...originFormData };
          return resolve(true);
        })
        .catch(() => {
          return inject();
        });
    });
  }
}

const batchTypeOptions = [
  { label: $t("zhiDingHuiYuan"), value: 1 },
  { label: $t("anDengJi"), value: 2 },
  { label: $t("chongTiCha"), value: 3 },
  { label: $t("zhiDingHuiYuanXiaJi"), value: 4 },
  { label: $t("anFenZu"), value: 5 },
];

const tabs = [
  { label: $t("dengJiXiuGai"), batchWay: batchTypeOptions.slice(0, 2), fu: api.batchLevel, formKey: ["new_vip_level"] },
  { label: $t("shengJiLiangHua"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchQuant, formKey: ["is_upgrade_quant"] },
  { label: $t("liangHuaKaiGuan_0"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchQuantSwitch, formKey: ["is_quant"] },
  { label: $t("shouYiZheKou_0"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchDiscount, formKey: ["quant_final_earnings_discount"] },
  { label: $t("yongJinZhuanLiangHua"), batchWay: batchTypeOptions.slice(0, 1), fu: api.batchCommission },
  {
    label: $t("yaoQingLiangHua"),
    batchWay: batchTypeOptions.slice(0, 5),
    fu: api.batchInvitation,
    formKey: ["is_invite_user_quant", "quant_invite_user_number", "quant_invite_user_recharge_amount", "quant_invite_user_effective_time"],
  },
  { label: $t("fengJin_0"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchBan, formKey: ["ban_type", "operation"] },
  { label: $t("yuexiuGai"), batchWay: batchTypeOptions.slice(0, 1), fu: api.batchBalance, formKey: ["op_type", "change_type", "change_amount", "change_remark"] },
  { label: $t("zengSongChouJiang"), batchWay: batchTypeOptions.slice(0, 1), fu: api.batchLottery, formKey: ["lottery_type", "gift_number"] },
  { label: $t("qiangZhiTouZi"), batchWay: batchTypeOptions.slice(0, 2), fu: api.batchInvest, formKey: ["invest_type", "invest_product", "effective_time"] },
  { label: $t("miaoHeYueGaiShuai"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchProbability, formKey: ["second_contract_win_lose_ratio"] },
  { label: $t("shengJiTiXian"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchWithdrawal, formKey: ["is_upgrade_withdrawal"] },
  {
    label: $t("yaoQingTiXian"),
    batchWay: batchTypeOptions.slice(0, 5),
    fu: api.batchInvitationWithdrawal,
    formKey: ["is_invite_user_withdrawal", "withdrawal_number", "withdrawal_invite_user_number", "withdrawal_invite_user_recharge_amount", "withdrawal_invite_user_effective_time"],
  },
  { label: $t("fenZu_0"), batchWay: batchTypeOptions.slice(0, 5), fu: api.batchGroup, formKey: ["new_group_id"] },
];

const formRef = ref<FormInstance>();

const trueConst = ref(true);
const originFormData: BatchOperationForm = {
  batch_type: 1,
  is_upgrade_quant: 1,
  is_quant: 1,
  is_invite_user_quant: 1,
  ban_type: [],
  operation: 1,
  op_type: 1,
  change_type: 1,
  lottery_type: 1,
  invest_type: 1,
  invest_product: [],
  is_upgrade_withdrawal: 1,
  is_invite_user_withdrawal: 1,
  withdrawal_number: 0,
  gift_number: 0,
};
const formData = ref<BatchOperationForm>({ ...originFormData });

const accountInput = ref<string>();
const rules = {
  batch_type: [{ required: true, message: $t("qingXuanZePiLiangCa"), trigger: "change" }],
  old_vip_level: [{ required: true, message: $t("qingXuanZeYuanDengJ"), trigger: "change" }],
  register_time: [{ required: true, message: $t("qingXuanZeZhuCeShi"), trigger: "change" }],
  new_vip_level: [{ required: true, message: $t("qingXuanZeXinDengJi"), trigger: "change" }],
  is_upgrade_quant: [{ required: true, message: $t("qingXuanZeShiFouShe"), trigger: "change" }],
  is_quant: [{ required: true, message: $t("qingXuanZeLiangHuaK"), trigger: "change" }],
  quant_final_earnings_discount: [{ required: true, message: $t("qingShuRuShouYiZhe_0"), trigger: "blur" }],
  is_invite_user_quant: [{ required: true, message: $t("qingXuanZeShiFouXu"), trigger: "change" }],
  ban_type: [{ required: true, message: $t("qingXuanZeFengJinLe"), trigger: "change" }],
  operation: [{ required: true, message: $t("qingXuanZeCaoZuoLei"), trigger: "change" }],
  op_type: [{ required: true, message: $t("qingXuanZeCaoZuoDui"), trigger: "change" }],
  change_type: [{ required: true, message: $t("qingXuanZeBianDongL"), trigger: "change" }],
  change_amount: [{ required: true, message: $t("qingShuRuBianDongJi_0"), trigger: "blur" }],
  lottery_type: [{ required: true, message: $t("qingXuanZeZengSongL"), trigger: "change" }],
  gift_number: [{ required: true, message: $t("qingShuRuZengSongCi_0"), trigger: "blur" }],
  invest_type: [{ required: true, message: $t("qingXuanZeTouZiLei"), trigger: "change" }],
  invest_product: [{ required: true, message: $t("qingXuanZeTouZiChan"), trigger: "change" }],
  effective_time: [{ required: true, message: $t("qingXuanZeYouXiaoSh"), trigger: "change" }],
  second_contract_win_lose_ratio: [{ required: true, message: $t("qingShuRuGaiShuai"), trigger: "blur" }],
  is_upgrade_withdrawal: [{ required: true, message: $t("qingXuanZeShiFouShe_0"), trigger: "change" }],
  is_invite_user_withdrawal: [{ required: true, message: $t("qingXuanZeShiFouYao"), trigger: "change" }],
  withdrawal_number: [{ required: true, message: $t("qingShuRuTiXianCiS_0"), trigger: "blur" }],
  withdrawal_invite_user_number: [{ required: true, message: $t("qingShuRuYaoQingYon_3"), trigger: "blur" }],
  withdrawal_invite_user_recharge_amount: [{ required: true, message: $t("qingShuRuYaoQingCho"), trigger: "blur" }],
  withdrawal_invite_user_effective_time: [{ required: true, message: $t("qingXuanZeYouXiaoSh_0"), trigger: "change" }],
  new_group_id: [{ required: true, message: $t("qingXuanZeXinFenZu_0"), trigger: "change" }],
};

watch(visible, (val) => {
  if (val) {
    accountInput.value = props.account?.map((val: any) => val.account).join(",");
    Object.assign(formData.value, {
      batch_type: 1,
      is_upgrade_quant: 1,
      is_quant: 1,
      is_invite_user_quant: 1,
      is_upgrade_withdrawal: 1,
      is_invite_user_withdrawal: 1,
    });
    activeTab.value = props.tabIndex;
  } else {
    unref(formRef)?.clearValidate();
    unref(formRef)?.resetFields();
  }
});

const emits = defineEmits(["finish"]);
const loading = ref([false, false]);
async function submitForm() {
  if (!formRef.value) return;
  loading.value[0] = true;
  try {
    await formRef.value.validate();

    // 克隆表单数据避免直接修改
    const postData = { ...formData.value };

    // 处理特殊字段
    if (postData.batch_type === 1 && accountInput.value) {
      // 处理指定会员账户
      postData.account = accountInput.value.split(",").map((item) => item.trim());
    }
    // 处理时间范围
    if (postData.register_time) {
      postData.register_time = [dayjs(postData.register_time[0]).format($t("yyyyMmDdHhMmSs")), dayjs(postData.register_time[1]).format($t("yyyyMmDdHhMmSs"))];
    }

    // 处理单个时间字段
    if (postData.quant_invite_user_effective_time) {
      postData.quant_invite_user_effective_time = dayjs(postData.quant_invite_user_effective_time).format($t("yyyyMmDdHhMmSs"));
    }

    if (postData.effective_time) {
      postData.effective_time = dayjs(postData.effective_time).format($t("yyyyMmDdHhMmSs"));
    }

    if (postData.withdrawal_invite_user_effective_time) {
      postData.withdrawal_invite_user_effective_time = dayjs(postData.withdrawal_invite_user_effective_time).format($t("yyyyMmDdHhMmSs"));
    }
    const enableGoogleVerify = await store.keyByConfigValue("update_money_google_secret");
    if (enableGoogleVerify == 1 && activeTab.value == 7) {
      const res = await ElMessageBox.prompt($t("shuRuGuGeYanZhengM"));
      if (res.action == "confirm" && res.value) {
        await systemConfig.verifyGoogleAuth(res.value);
      } else {
        return;
      }
    }
    // 调用对应tab的API函数
    await tabs[activeTab.value].fu(postData);

    visible.value = false;
    emits("finish");
  } finally {
    loading.value[0] = false;
  }
}

//
const debouncedGetSubordinate = useDebounceFn(async (val: string) => {
  if (val) {
    try {
      const res = await api.getSubordinate(val);
      subordinateNumStr.value = $t("gongResnumberGeXiaJi", [res.number]);
    } catch (err: any) {
      subordinateNumStr.value = err;
    }
  }
}, 1000);

const subordinateNumStr = ref("");
watch(
  () => formData.value.spec_account,
  (val) => {
    if (val) debouncedGetSubordinate(val);
  }
);

const memberList = ref<any>([]);
async function remoteHandler(str: string) {
  loading.value[1] = true;
  memberList.value = await searchMember({ account: str });
  loading.value[1] = false;
}
</script>

<style lang="scss" scoped>
.selected-accounts {
  line-height: 32px;
  color: #666;
}
:deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
  > .el-card__body {
    flex: 1;
    overflow-y: auto;
  }
  > .el-card__footer {
    text-align: right;
  }
}
</style>
