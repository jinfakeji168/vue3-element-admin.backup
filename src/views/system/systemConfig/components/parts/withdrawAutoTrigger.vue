<template>
  <el-dialog v-model="visible" :title="title" width="70vw">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['lotteryConfig:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['lotteryConfig:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)" style="height: 40vh">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="120" />
        <el-table-column prop="withdrawal_ratio" :label="$t('tiXianBiLi')" min-width="120" />
        <el-table-column prop="type" :label="$t('chuFaLeiXing')" width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="auto">
          <template #default="{ row }">
            <el-button v-hasPerm="['lotteryConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['lotteryConfig:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </el-dialog>
  <el-dialog v-model="table.visible.value[0]" :title="dialogTitle" width="50vw">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item :label="$t('tiXianBiLi_0')" prop="withdrawal_ratio">
        <el-input v-model="formData.withdrawal_ratio" :placeholder="$t('tiXianDaDaoChongZhi')" @blur="formData.withdrawal_ratio = parserHandler(formData.withdrawal_ratio)" />
      </el-form-item>
      <el-form-item :label="$t('chuFaLeiXing_0')" prop="type">
        <el-select v-model="formData.type" :placeholder="$t('qingXuanZeChuFaLei')">
          <el-option v-for="item in Object.keys(typeMap)" :key="item" :label="typeMap[item]" :value="Number(item)" />
        </el-select>
      </el-form-item>
      <template v-if="formData.type === 4 || formData.type === 6">
        <el-form-item :label="$t('yaoQingYongHuShuLia')" prop="withdrawal_ratio">
          <el-input-number v-model="formData.invite_user_number" placeholder="" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('yaoQingYongHuChongZ')" prop="withdrawal_ratio">
          <el-input-number v-model="formData.invite_users_recharge_amount" placeholder="" :min="0" />
        </el-form-item>
      </template>
      <el-form-item :label="$t('nengTiXianCiShu')" prop="withdrawal_ratio" v-if="formData.type === 6">
        <el-input-number v-model="formData.withdrawal_number" placeholder="" :min="0" />
      </el-form-item>
      <el-form-item :label="$t('chuFaYongHu')" prop="trigger_user_type">
        <el-radio v-model="formData.trigger_user_type" :value="1">{{ $t("suoYouYongHu") }}</el-radio>
        <el-radio v-model="formData.trigger_user_type" :value="2">{{ $t("buFenYongHu") }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('yongHu')" v-if="formData.trigger_user_type == 2">
        <el-select v-model="formData.user_id_array" filterable remote multiple :placeholder="$t('qingShuRuZhangHaoSo')" :loading="searchLoading" :remote-method="searchUser">
          <el-option v-for="item in memberList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type WithdrawAutoTriggerForm } from "@/api/system/systemConfig";
import { searchMember, parserHandler } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
const props = withDefaults(defineProps<{}>(), {});
const visible = defineModel<boolean>();
const formRef = ref<FormInstance>();
const queryParams = reactive({});
const table = new TableInstance<WithdrawAutoTriggerForm>(api.withdrawAutoTrigger, queryParams, 20);

const typeMap: Record<string, any> = {
  1: $t("jinTi"),
  2: $t("jinZhiLiangHua"),
  3: $t("shengJiLiangHua"),
  4: $t("yaoQingLiangHua"),
  5: $t("shengJiTiXian"),
  6: $t("yaoQingTiXian"),
};

const title = ref($t("tiKuanZiDongChuFaS"));
/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "select",
      modelKey: "type",
      label: $t("chuFaLeiXing_1"),
      options: Object.keys(typeMap).map((key) => ({ label: typeMap[key], value: Number(key) })),
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
  ],
};
watch(visible, (val) => {
  if (val) {
    table.queryHandler();
  }
});
const memberList = ref<any>([]);
const searchLoading = ref(false);
const formUser = ref("");
/**搜索用户 */
async function searchUser(query: string) {
  searchLoading.value = true;
  memberList.value = await searchMember({ account: query });
  searchLoading.value = false;
}

const dialogTitle = ref("");
const formData = reactive<WithdrawAutoTriggerForm>({
  trigger_user_type: 1,
  type: 1,
});

watch(
  () => unref(table.visible)[0],
  (val) => {
    if (val) {
      nextTick(() => {
        if (unref(table.currentData)) {
          Object.assign(formData, unref(table.currentData));
          dialogTitle.value = $t("bianJi");
          if (formData.trigger_user_type == 2) echoUsers();
        } else {
          dialogTitle.value = $t("xinZeng");
          Object.assign(formData, { id: undefined });
        }
      });
    } else {
      unref(formRef)!.resetFields();
      unref(formRef)!.clearValidate();
    }
  }
);
//回显多选用户
function echoUsers() {
  formData.user_id_array?.forEach(async (val: any) => {
    memberList.value = await searchMember({ id: val });
  });
}

const rules = {
  reach_amount: [{ required: true, message: $t("qingShuRuChongZhiJi_1"), trigger: "blur" }],
  gift_num: [{ required: true, message: $t("qingShuRuChongZhiZe"), trigger: "blur" }],
};
const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (table.currentData.value) await api.withdrawAutoTrigger.edit(formData);
      else await api.withdrawAutoTrigger.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

onMounted(() => {});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
