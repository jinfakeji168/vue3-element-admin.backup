<template>
  <div class="app-container">
    <div class="seach_row">
      <el-date-picker v-model="time_range" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button type="primary">查询</el-button>
    </div>
    <el-card>
      <template #header>注册国家分布</template>
      <template #default>
        <div id="chart" style="width: 100%; height: 400px"></div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { getConfig } from "./config";
const time_range = ref([]);
onMounted(() => {
  const myChart = echarts.init(document.getElementById("chart"));
  myChart.setOption(getConfig());
});
</script>

<style></style>
