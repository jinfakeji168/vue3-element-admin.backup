<template>
  <el-dialog v-model="visible" :title="$t('xiaJiXinXi')" width="80%" :close-on-click-modal="false" append-to-body @closed="handleClosed">
    <div class="flex flex-row gap-4">
      <span>
        <span>{{ $t("xiaJiZongShu") }}</span>
        {{ subordinateStatistics?.number }}
      </span>
      <span>
        <span>{{ $t("chongZhiBiShu") }}</span>
        {{ subordinateStatistics?.recharge_count }}
      </span>
      <span>
        <span>{{ $t("chongZhiJine") }}</span>
        {{ subordinateStatistics?.recharge_amount }}
      </span>
      <span>
        <span>{{ $t("tiXianBiShu") }}</span>
        {{ subordinateStatistics?.withdrawal_count }}
      </span>
      <span>
        <span>{{ $t("tiXianJine") }}</span>
        {{ subordinateStatistics?.withdrawal_amount }}
      </span>
    </div>
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <div class="flex">
          <el-button
            v-hasPerm="['memberList:batch']"
            type="success"
            @click="
              table.openHandler(1);
              tabIndex = 0;
            "
          >
            <template #icon>
              <Plus />
            </template>
            {{ $t("piLiangCaoZuo") }}
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="danger"
            @click="
              table.openHandler(1);
              tabIndex = 6;
            "
            :disabled="table.selectList.value.length === 0"
          >
            <template #icon>
              <Plus />
            </template>
            {{ $t("piLiangFengJin") }}
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="danger"
            @click="
              table.openHandler(1);
              tabIndex = 1;
            "
            :disabled="table.selectList.value.length === 0"
          >
            <template #icon>
              <Plus />
            </template>
            {{ $t("shengJiLiangHua") }}
          </el-button>
        </div>
      </template>
      <el-table
        ref="tableRef"
        :data="table.list.value"
        row-key="id"
        @selection-change="table.selectionChangeHandler($event, ['id', 'account'])"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="show_name" :label="$t('yongHuXinXi')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">ID:</span>
                <span class="text-gray-700">{{ row.id }}</span>
                <el-button class="ml-4" type="primary" size="small" @click="getLowerLevelHandler(row)">{{ $t("chaKanXiaJi") }}</el-button>
              </div>
              <span class="text-red ml-1">{{ row.is_test == 1 ? "test" : "" }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="show_name" :label="$t('yongHuXinXi')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">ID:</span>
                <span class="text-gray-700">{{ row.id }}</span>
                <span>{{ $t("diRowlevel_1Ji", [row.level || 1]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhangHao_0") }}</span>
                <span class="text-gray-700">{{ row.account }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("dengJi_1") }}</span>
                <span class="text-gray-700">{{ $t("levelRowviplevelRowiso", [row.vip_level, row.is_online == 1 ? $t("zaiXian") : $t("liXian")]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("yuYan") }}</span>
                <span class="text-gray-700">{{ commonStore.langList.find((i) => i.id == row.lang_id)?.name }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("tiYanJin") }}</span>
                <span class="text-gray-700">{{ row.experience_account }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态设置" min-width="200px"></el-table-column> -->
        <el-table-column :label="$t('yuE')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("yongJinZhangHu_2") }}</span>
                <span class="text-gray-700">{{ row.brokerage_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhiNengZhangHu_0") }}</span>
                <span class="text-gray-700">{{ row.smart_account || "0.0000" }}</span>
              </div>

              <div>
                <span class="text-gray-500">{{ $t("heYueZhangHu_0") }}</span>
                <span class="text-gray-700">{{ row.second_contract_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("liangHuaZhangHu_3") }}</span>
                <span class="text-gray-700">{{ row.quant_account || "0.0000" }}</span>
              </div>
              <!-- <div>
                <span class="text-gray-500">{{ $t("tiYanJin") }}</span>
                <span class="text-gray-700">{{ row.experience_account || "0.0000" }}</span>
              </div> -->
              <div>
                <span class="text-gray-500">{{ $t("chongZhiZhangHu") }}</span>
                <span class="text-gray-700">{{ row.recharge_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("liangHuaShouYi") }}</span>
                <span class="text-gray-700">{{ row.quant_profit || "0.0000" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('qianBaoXinXi')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">trx:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_trx || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">trc20-usdt:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_usdt || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">bnb:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_bnb || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">bep20-usdt/usdc:</span>
                <span class="text-gray-700">{{ row.bep20_recharge_wallet || "--" }}/{{ row.bep20_withdrawal_wallet || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("touZiZonge") }}</span>
                <span class="text-gray-700">{{ row.invest_total || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("touZiWeiJieSuan") }}</span>
                <span class="text-gray-700">{{ row.invest_unsettled || "0.0000" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('zhuCeDengLu')" min-width="250px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("zhuCeFangShi") }}</span>
                <span class="text-gray-700">{{ getRegisterType(row.type) || "后台" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhuCe_0") }}</span>
                <span class="text-gray-700">{{ row.created_at || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhuCeIp_0") }}</span>
                <span class="text-gray-700">{{ $t("rowregisteripHouTaiRo", [row.register_ip || "后台", row.register_area]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zuiHou") }}</span>
                <span class="text-gray-700">{{ row.last_login_at || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zuiHouIp") }}</span>
                <span class="text-gray-700">{{ $t("rowLastLoginIpOrOr_0", [row.last_login_ip || "", row.last_login_area]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("suoZaiCengJi") }}</span>
                <span class="text-gray-700">{{ row.group_id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tuiGuangYuan')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("shangJi") }}</span>
                <span class="text-gray-700">{{ row.top_id || "--" }}/{{ row.top_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("yiJi") }}</span>
                <span class="text-gray-700">{{ row.parent_id || "--" }}/{{ row.parent_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("erJi_0") }}</span>
                <span class="text-gray-700">{{ row.grandpa_id || "--" }}/{{ row.grandpa_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("sanJi_0") }}</span>
                <span class="text-gray-700">{{ row.great_grandpa_id || "--" }}/{{ row.great_grandpa_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("yaoQingMa") }}</span>
                <span class="text-gray-700">{{ row.invita_code || "--" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('chongTiVip')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("chongZhi_0") }}</span>
                <span class="text-gray-700">{{ row.total_recharge_amount || "0.000000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("tiXian_0") }}</span>
                <span class="text-gray-700">{{ row.total_withdrawal_amount || "0.000000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("kaiShiShiJian_3") }}</span>
                <span class="text-gray-700">{{ row.quant_buy_invest_effective_time || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("jieShuShiJian_3") }}</span>
                <span class="text-gray-700">{{ row.withdrawal_buy_invest_effective_time || "--" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('qiTaXinXi')" min-width="250px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("zhiTuiXiaJi") }}</span>
                <span class="text-gray-700">{{ row.direct_subordinate_count || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("youXiang_0") }}</span>
                <span class="text-gray-700">{{ row.email || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("lianXiFangShi_0") }}</span>
                <span class="text-gray-700">{{ row.telephone || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("beiZhu_1") }}</span>
                <span class="text-gray-700">{{ row.remark || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("liangHuaGaiShuai") }}</span>
                <span class="text-gray-700">{{ $t("rowQuantFinalEarnings", [row.quant_final_earnings_discount]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">ws/tg:</span>
                <span class="text-gray-700">{{ row.whatsapp }}/{{ row.telegram }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" fixed="right" width="200px">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-2">
              <el-button type="primary" size="small" @click="table.editHandler(row, 3)">详情</el-button>
              <el-button type="success" size="small">补单</el-button>
              <el-button type="warning" size="small">查钱</el-button>
              <el-button type="info" size="small" @click="table.editHandler(row, 2)">改钱</el-button>
              <el-button type="success" size="small">下级充值</el-button>
              <el-button type="danger" size="small">下线</el-button>
              <el-button type="warning" size="small">模拟登录</el-button>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <batchOperation v-model="table.visible.value[1]" :account="table.selectList.value" :tabIndex="tabIndex" @finish="table.queryHandler()" />
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import TableInstance from "@/utils/tableInstance";
import api, { Member, type MemberSubordinateListData } from "@/api/members/memberList";
import batchOperation from "./batchOperation.vue";
import { useStore } from "@/store/modules/common";
const commonStore = useStore();
const visible = defineModel<boolean>();
const tabIndex = ref(0);
const props = withDefaults(
  defineProps<{
    memberId?: number;
    memberAccount: string;
  }>(),
  {}
);
function getRegisterType(type: number) {
  if (type == 1) return $t("shouJiHao");
  else if (type == 2) return $t("youXiang");
  else if (type == 3) return $t("login.username");
  else if (type == 4) return "telegram";
  else if (type == 5) return $t("autoTelegram");
  else return type;
}

const emit = defineEmits<{
  (e: "finish"): void;
}>();

const formRef = ref<FormInstance>();

// 监听会员ID变化
watch(visible, (val) => {
  if (val) {
    params.uid = props.memberId || 0;
    table.queryHandler();
    getSubordinateStatistics();
  }
});
const params = reactive<{ uid: number }>({ uid: 0 });
const table = new TableInstance<MemberSubordinateListData>({ getList: api.getSubordinateList }, params, 20);

function handleClosed() {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  visible.value = false;
}

const tableRef = ref();
//获取下级
async function getLowerLevelHandler(data: { id: number; level: number }) {
  const res = await api.getSubordinateList({ uid: data.id, page: 1, limit: 999 });
  const temp: any = table.list.value.find((item) => item.id === data.id);

  if (!res.list?.length) {
    ElMessage({ message: $t("zanWuXiaJi"), duration: 1000, type: "warning" });
    return;
  }
  temp.children = res.list;
  temp.children?.forEach((item: any) => {
    item.level = (data.level || 1) + 1;
  });
  nextTick(() => {
    tableRef.value.toggleRowExpansion(temp, true);
  });
}
function tableRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
  if (row.level == 2) {
    return "warning-row";
  } else if (row.level == 3) {
    return "success-row";
  }
  return "";
}
/**下级统计 */
const subordinateStatistics = ref<any>({});
async function getSubordinateStatistics() {
  subordinateStatistics.value = await api.getSubordinateStatistics(props.memberAccount);
}
</script>

<style lang="scss" scoped>
:deep(.cell) {
  display: flex;
  flex-direction: row;
}
:deep(.el-table) .warning-row {
  background: oldlace;
}

:deep(.el-table) .success-row {
  background: #f0f9eb;
}
</style>
