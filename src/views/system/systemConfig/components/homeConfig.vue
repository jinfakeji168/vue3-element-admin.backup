<template>
  <el-form label-width="240px">
    <el-form-item label="首页是否需要登录">
      <el-switch v-model="getI('index_is_login').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="首页强制弹窗公告">
      <el-switch v-model="getI('index_force_notice').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item label="弹窗公告">
      <el-button type="primary" @click="visible[0] = true">编辑公告</el-button>
    </el-form-item>
    <el-form-item label="首页显示假数据">
      <el-switch v-model="getI('is_show_fake_data').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="首页显示行情数据">
      <el-switch v-model="getI('index_show_market_data').values" :active-value="1" :inactive-value="2" />
    </el-form-item>

    <el-form-item label="首页是否展示视频">
      <el-switch v-model="getI('index_video_is_show').values" :active-value="1" :inactive-value="2" />
    </el-form-item>
    <el-form-item label="首页视频地址">
      <el-input v-model="getI('index_video_url').values" />
    </el-form-item>
    <el-form-item label="首页顶部提示栏名称">
      <el-input v-model="getI('home_top_tips_name').values" />
    </el-form-item>

    <el-form-item label="首页顶部提示栏链接">
      <el-input v-model="getI('home_top_tips_url').values" />
    </el-form-item>

    <el-form-item label="白皮书地址">
      <uploadPart v-model="getI('white_paper_url').values" type="files" />
    </el-form-item>

    <el-form-item label="首页滚动会员收益最小值">
      <el-input-number v-model="getI('index_user_income_min').values" :min="0" />
    </el-form-item>

    <el-form-item label="首页滚动会员收益最大值">
      <el-input-number v-model="getI('index_user_income_max').values" :min="0" />
    </el-form-item>

    <el-form-item label="首页累计利润">
      <el-input-number v-model="getI('index_profit_fake_num').values" :min="0" />
    </el-form-item>

    <el-form-item label="累计利润增长下限">
      <el-input-number v-model="getI('index_profit_fake_increase_low').values" :min="0" />
    </el-form-item>

    <el-form-item label="累计利润增长上限">
      <el-input-number v-model="getI('index_profit_fake_increase_up').values" :min="0" />
    </el-form-item>

    <el-form-item label="系统安全运行开始日期">
      <el-date-picker v-model="getI('start_operation_time').values" type="date" />
    </el-form-item>
  </el-form>
  <explain v-model="visible[0]" :data="getI('index_notice_content')" />
</template>

<script setup lang="ts">
import { type Form } from "@/api/system/systemConfig";
import { useStore } from "@/store/modules/common";
import explain from "./parts/explain.vue";
const store = useStore();
const props = defineProps<{ configData: Form[] }>();
function getI(key: string): Form {
  return props.configData?.find((item) => item.name === key) || {};
}
const visible = ref([false]);
const groupLevelOptions = [
  { label: "全部", value: 0 },
  { label: "二级", value: 2 },
  { label: "三级", value: 3 },
  { label: "四级", value: 4 },
  { label: "五级", value: 5 },
  { label: "六级", value: 6 },
];
</script>

<style></style>
