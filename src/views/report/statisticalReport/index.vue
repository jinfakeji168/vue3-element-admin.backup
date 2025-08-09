<template>
  <div class="app-container">
    <el-card>
      <el-date-picker v-model="time_range" type="daterange" :range-separator="$t('zhi')" :start-placeholder="$t('kaiShiRiQi')" :end-placeholder="$t('jieShuRiQi')" />
      <el-button class="ml-8" type="primary" @click="getData">{{ $t("chaXun") }}</el-button>
    </el-card>
    <el-card>
      <template #header>{{ $t("zhuCeGuoJiaFenBu") }}</template>
      <template #default>
        <div id="chart1" style="width: 100%; height: 400px"></div>
      </template>
    </el-card>
    <el-card>
      <template #header>{{ $t("zhuCeSheBeiFenBu") }}</template>
      <template #default>
        <div id="chart2" style="width: 100%; height: 400px"></div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { getConfig } from "./config";
import api from "@/api/report/statisticalReport";
const time_range = ref([]);
let charts: echarts.ECharts[] = [];
onMounted(() => {
  charts[0] = echarts.init(document.getElementById("chart1"));
  charts[1] = echarts.init(document.getElementById("chart2"));
});

async function getData() {
  const res = await api.getData({ datetime: time_range.value });
  charts[0].setOption(getConfig(res.register_country));
  charts[1].setOption(getConfig(res.login_device));
}
getData();
</script>

<style lang="scss" scoped>
.app-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  > .el-card:first-of-type {
    grid-column: 1/3;
  }
}
</style>
