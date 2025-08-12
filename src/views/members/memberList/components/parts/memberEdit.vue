<template>
  <el-form ref="formRef" :model="memberForm" :rules="rules" label-width="140px">
    <div class="flex flex-col">
      <!-- 基础信息 -->
      <el-card class="form-section" shadow="never" :header="$t('jiChuXinXi')">
        <el-form-item :label="$t('yongHuZhangHao')" prop="account">
          <el-input v-model="memberForm.account" disabled />
        </el-form-item>
        <el-form-item :label="$t('yongHuMiMa')" prop="password">
          <el-input v-model="memberForm.password" type="password" :placeholder="$t('weiKongBiaoShiBuXiu')" show-password />
        </el-form-item>
        <el-form-item :label="$t('anQuanMiMa')" prop="secure_password">
          <el-input v-model="memberForm.secure_password" type="password" :placeholder="$t('weiKongBiaoShiBuXiu_0')" show-password />
        </el-form-item>
        <div class="flex flex-row gap2 w-full">
          <el-form-item :label="$t('yongHuYouXiang')" prop="email">
            <el-input v-model="memberForm.email" :placeholder="$t('qingShuRuYongHuYou')" />
          </el-form-item>
          <el-form-item :label="$t('lianXiFangShi')" prop="telephone">
            <el-input v-model="memberForm.telephone" :placeholder="$t('qingShuRuLianXiFang')" />
          </el-form-item>
        </div>
        <div class="flex flex-row gap2 w-full">
          <el-form-item :label="$t('telegram')" prop="telegram">
            <el-input v-model="memberForm.telegram" :placeholder="$t('qingShuRuTelegram')" />
          </el-form-item>
          <el-form-item label="WhatsApp" prop="whatsapp">
            <el-input v-model="memberForm.whatsapp" :placeholder="$t('qingShuRuWhatsapp')" />
          </el-form-item>
        </div>
        <div class="flex flex-row gap2 w-full">
          <el-form-item :label="$t('zhuCeIp')" prop="register_ip">
            <el-input v-model="memberForm.register_ip" :placeholder="$t('10317218382XinJiaPo')" readonly disabled />
          </el-form-item>
          <el-form-item :label="$t('zuiHouDengLuIp')" prop="last_login_ip">
            <el-input v-model="memberForm.last_login_ip" :placeholder="$t('10317218382XinJiaPo_0')" readonly disabled />
          </el-form-item>
        </div>
      </el-card>

      <!-- 钱包信息 -->
      <el-card class="form-section" shadow="never" :header="$t('qianBaoXinXi')">
        <el-form-item :label="$t('trc20TiXianQianBao')" prop="trc20_withdrawal_wallet">
          <el-input v-model="memberForm.trc20_withdrawal_wallet" :placeholder="$t('qingShuRuTrc20TiXia')" />
        </el-form-item>

        <el-form-item :label="$t('bep20TiXianQianBao')" prop="bep20_withdrawal_wallet">
          <el-input v-model="memberForm.bep20_withdrawal_wallet" :placeholder="$t('qingShuRuBep20TiXia')" />
        </el-form-item>

        <el-form-item :label="$t('trc20ChongZhiQianBao')" prop="trc20_recharge_wallet">
          <div class="flex flex-row gap2 w-full">
            <el-input v-model="memberForm.trc20_recharge_wallet" :placeholder="$t('trc20ChongZhiQianBao_0')" disabled />
            <el-button type="primary" @click="changeWallet('trc20')">{{ $t("gengHuanChongZhiQian") }}</el-button>
          </div>
        </el-form-item>

        <el-form-item :label="$t('bep20ChongZhiQianBao')" prop="bep20_recharge_wallet">
          <div class="flex flex-row gap2 w-full">
            <el-input v-model="memberForm.bep20_recharge_wallet" :placeholder="$t('bep20ChongZhiQianBao_0')" disabled />
            <el-button type="primary" @click="changeWallet('bep20')">{{ $t("gengHuanChongZhiQian_0") }}</el-button>
          </div>
        </el-form-item>
      </el-card>

      <!-- 投资设置 -->
      <el-card class="form-section" shadow="never" :header="$t('touZiSheZhi')">
        <el-form-item :label="$t('liangHuaMaiTouZi')" prop="quant_buy_invest">
          <el-select multiple v-model="memberForm.quant_buy_invest" :placeholder="$t('qingXuanZeLiangHuaM')" clearable>
            <el-option v-for="item in investList" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('liangHuaMaiTouZiYou')" prop="quant_buy_invest_effective_time">
          <el-date-picker
            v-model="memberForm.quant_buy_invest_effective_time"
            type="datetime"
            :placeholder="$t('xuanZeYouXiaoShiJia')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item :label="$t('tiXianMaiTouZi')" prop="withdrawal_buy_invest">
          <el-select multiple v-model="memberForm.withdrawal_buy_invest" :placeholder="$t('qingShuRuTiXianMai')" clearable>
            <el-option v-for="item in investList" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('maiTouZiYouXiaoShi')" prop="withdrawal_buy_invest_effective_time">
          <el-date-picker
            v-model="memberForm.withdrawal_buy_invest_effective_time"
            type="datetime"
            :placeholder="$t('xuanZeYouXiaoShiJia_0')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-card>
      <!-- 用户设置 -->
      <el-card class="form-section" shadow="never" :header="$t('yongHuSheZhi')">
        <el-form-item :label="$t('yongHuBeiZhu')" prop="remark">
          <el-input v-model="memberForm.remark" type="textarea" :rows="3" :placeholder="$t('qingShuRuYongHuBei')" />
        </el-form-item>
        <div class="flex flex-row">
          <el-form-item :label="$t('yongHuFenZu')" prop="group_id">
            <el-select v-model="memberForm.group_id" :placeholder="$t('qingXuanZeYongHuFen')" style="width: 200px" clearable>
              <el-option v-for="group of store.groupList" :label="group.title" :value="group?.id" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('vipDengJi')" prop="vip_level">
            <el-select v-model="memberForm.vip_level" :placeholder="$t('qingXuanZeVipDengJi_0')" style="width: 200px" clearable>
              <el-option v-for="i of vipList" :label="i.title" :value="i.level" />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex flex-row">
          <el-form-item :label="$t('liangHuaZuiZhongShou')" prop="quant_final_earnings_discount">
            <template #label>
              <div class="flex-center">
                <span>{{ $t("liangHuaZuiZhongShou_0") }}</span>
                <el-tooltip :content="$t('moRenZhiWei_100DaiB')" placement="top">
                  <el-icon style="font-size: 1rem"><el-icon-question-filled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input-number v-model="memberForm.quant_final_earnings_discount" :min="0" :max="1000" :precision="2" style="width: 200px" />
          </el-form-item>

          <el-form-item :label="$t('miaoHeYueShuYingGai')" prop="second_contract_win_lose_ratio">
            <template #label>
              <div class="flex-center">
                <span>{{ $t("miaoHeYueShuYingGai_0") }}</span>
                <el-tooltip :content="$t('kaiQiMiaoHeYueWanF')" placement="top">
                  <el-icon style="font-size: 1rem"><el-icon-question-filled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-input-number v-model="memberForm.second_contract_win_lose_ratio" :min="0" :max="100" :precision="2" style="width: 200px" />
          </el-form-item>
        </div>
        <div class="flex flex-row">
          <el-form-item :label="$t('zhuCeShengYuChouJia')" prop="register_remain_lottery_num">
            <el-input-number v-model="memberForm.register_remain_lottery_num" style="width: 200px" :min="0" />
          </el-form-item>
          <el-form-item :label="$t('yaoQingShengYuChouJ')" prop="invite_remain_lottery_num">
            <el-input-number v-model="memberForm.invite_remain_lottery_num" style="width: 200px" :min="0" />
          </el-form-item>
        </div>
      </el-card>
      <!-- 提现限额设置 -->
      <el-card class="form-section" shadow="never" :header="$t('tiXianXianesheZhi')">
        <template #header>
          <span class="mr-4">{{ $t("tiXianXianesheZhi") }}</span>
          <span class="color-red">{{ $t("sheZhi_0BiaoShiGenS") }}</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('zuiXiaoTiXianJineusd')" prop="min_withdrawal_amount_usdt">
              <el-input-number v-model="memberForm.min_withdrawal_amount_usdt" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('zuiDaTiXianJineusdtu')" prop="max_withdrawal_amount_usdt">
              <el-input-number v-model="memberForm.max_withdrawal_amount_usdt" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('zuiXiaoTiXianJinetrx')" prop="min_withdrawal_amount_trx">
              <el-input-number v-model="memberForm.min_withdrawal_amount_trx" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('zuiDaTiXianJinetrx')" prop="max_withdrawal_amount_trx">
              <el-input-number v-model="memberForm.max_withdrawal_amount_trx" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('zuiXiaoTiXianJinebnb')" prop="min_withdrawal_amount_bnb">
              <el-input-number v-model="memberForm.min_withdrawal_amount_bnb" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('zuiDaTiXianJinebnb')" prop="max_withdrawal_amount_bnb">
              <el-input-number v-model="memberForm.max_withdrawal_amount_bnb" :precision="2" :min="0" placeholder="0.00" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 状态设置 -->
      <el-card class="form-section" shadow="never" :header="$t('zhuangTaiSheZhi')">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('yongHuZhuangTai')" prop="status">
              <el-switch v-model="memberForm.status" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('tiXianZhuangTai')" prop="withdrawal_status">
              <el-switch v-model="memberForm.withdrawal_status" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('shiFouNengLiangHua')" prop="is_quant">
              <el-switch v-model="memberForm.is_quant" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('yaoQingYongHuCaiNen')" prop="is_invite_user_quant">
              <el-switch v-model="memberForm.is_invite_user_quant" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('shiFouDaiLi')" prop="is_agent">
              <el-switch v-model="memberForm.is_agent" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('shiFouZongDaiLi')" prop="is_total_agent">
              <el-switch v-model="memberForm.is_total_agent" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('shengJiCaiNengZuoLi')" prop="is_upgrade_quant">
              <el-switch v-model="memberForm.is_upgrade_quant" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('shengJiCaiNengTiXia')" prop="is_upgrade_withdrawal">
              <el-switch v-model="memberForm.is_upgrade_withdrawal" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { MemberDetailData } from "@/api/members/memberList";
import api from "@/api/members/memberList";
import commApi from "@/api/common";
import { useStore } from "@/store/modules/common";
const store = useStore();
const vipList = ref();
async function getVipList() {
  let result = await store.getVipListAsync();
  result = JSON.parse(JSON.stringify(result));
  result?.splice(0, 0, { id: 0, level: 0, title: "普通用户" });
  vipList.value = result;
}

getVipList();
const props = withDefaults(
  defineProps<{
    memberId?: number;
  }>(),
  {}
);
const memberForm = ref<MemberDetailData>({});
const rules = {};
async function getDetailData(id: number) {
  const result = await api.getMemberDetail(id);
  memberForm.value = result;
}
watch(
  () => props.memberId,
  (val) => {
    if (val) {
      getDetailData(val);
    }
  },
  { immediate: true }
);

const investList = ref<Awaited<ReturnType<typeof commApi.getInvestProductList>>>([]);
async function getInvestList() {
  const result = await commApi.getInvestProductList({ type: 2 });
  investList.value = result;
}
getInvestList();
async function submitForm() {
  return api.saveMemberDetail(memberForm.value);
}

async function changeWallet(type: "trc20" | "bep20") {
  await ElMessageBox.confirm($t("shiFouQueRenGengHua"), $t("jingGao"), {});

  const result = await api.changeWallet({
    id: memberForm.value.id,
    type,
  });
  if (type === "trc20") memberForm.value.trc20_recharge_wallet = result.address;
  else if (type === "bep20") memberForm.value.bep20_recharge_wallet = result.address;
}

defineExpose({
  submitForm,
});
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  line-height: normal;
  display: flex;
  align-items: center;
  text-align: right;
}
.thebox {
  // width: 1600px;
}
.form-section {
  // width: 600px;
}
</style>
