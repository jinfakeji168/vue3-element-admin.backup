<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="success" @click="table.editHandler()" v-hasPerm="['proxyList:add']">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button type="danger" :disabled="!table.selectList.value.length" @click="table.deleteHandler()" v-hasPerm="['proxyList:delete']">
          <template #icon>
            <Delete />
          </template>
          {{ $t("piLiangShanChu") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="80" />
        <el-table-column prop="account" :label="$t('yongHuZhangHao')" min-width="120" />
        <el-table-column prop="agent_name" :label="$t('daiLiMingCheng')" min-width="120" />
        <el-table-column :label="$t('daiLiLeiXing')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.agent_type === 1 ? 'success' : 'warning'">
              {{ row.agent_type === 1 ? "普通代理" : "总代理" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="register_count" :label="$t('zhuCeRenShu')" min-width="100" />
        <el-table-column prop="total_recharge_amount" :label="$t('zongChongZhiJinE')" min-width="120" />
        <el-table-column prop="total_withdrawal_amount" :label="$t('tiXianJinE')" min-width="120" />
        <el-table-column prop="recharge_withdrawal_diff" :label="$t('chongTiCha')" min-width="100" />
        <el-table-column prop="quant_balance" :label="$t('liangHuaYuE')" min-width="120" />
        <el-table-column prop="brokerage_balance" :label="$t('yongJinYuE')" min-width="120" />
        <el-table-column :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('chuangJianShiJian')" min-width="180" />
        <el-table-column :label="$t('caoZuo')" min-width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="table.editHandler(row, 1)" v-hasPerm="['proxyList:view']">
              <template #icon>
                <Edit />
              </template>
              {{ $t("chaKan") }}
            </el-button>
            <el-button type="danger" link size="small" @click="table.deleteHandler(row.uid)" v-hasPerm="['proxyList:delete']">
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
    <edit v-model="table.visible.value[0]" @finish="table.handleResetQuery()" />
    <lowerLevel v-model="table.visible.value[1]" :member-id="table.currentData.value?.uid" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/report/proxyList";
import { searchMember } from "@/utils";
import lowerLevel from "@/views/members/memberList/components/lowerLevel.vue";

import TableInstance from "@/utils/tableInstance";
import edit from "./components/edit.vue";
/** 抽奖状态选项 */
const state_options = [
  { value: 1, label: $t("weiChouJiang") },
  { value: 2, label: $t("yiChouJiang") },
];

/** 类型选项 */
const type_options = [
  { value: 1, label: $t("chongZhiZengSong") },
  { value: 2, label: $t("zhuCeZengSong") },
  { value: 3, label: $t("yaoQingZengSong") },
];

const memberList = ref<any>([]);
const loading = ref(false);

/** 查询配置 */
/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "agent_name",
      label: $t("daiLiMingCheng_0"),
      props: {
        placeholder: $t("qingShuRuDaiLiMing"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "account",
      label: $t("yongHuZhangHu"),
      props: {
        placeholder: $t("qingShuRuYongHuZhan_0"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "agent_type",
      label: $t("daiLiLeiXing_0"),
      options: [
        { value: 1, label: $t("puTongDaiLi") },
        { value: 2, label: $t("zongDaiLi") },
      ],
      props: {
        placeholder: $t("qingXuanZeDaiLiLei"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: $t("tongJiLeiXing"),
      options: [
        { value: "direct", label: $t("xiaYiJi") },
        { value: "all_line", label: $t("zhengTiaoXian") },
        { value: "three_levels", label: $t("daoXiaSanJi") },
      ],
      props: {
        placeholder: $t("qingXuanZeTongJiLei"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { value: 1, label: $t("zhengChang") },
        { value: 2, label: $t("jinYong") },
      ],
      props: {
        placeholder: $t("qingXuanZeZhuangTai"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "created_at",
      label: $t("chuangJianShiJian"),
      props: {
        style: { width: "400px" },
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
/** 查询参数 */
const queryParams = reactive<Query>({
  agent_name: undefined,
  account: undefined,
  agent_type: undefined,
  type: undefined,
  status: undefined,
  created_at: undefined,
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>
