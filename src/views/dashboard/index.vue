<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="98500">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Daily active users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one day"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="693700">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Monthly Active Users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one month"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="72000" title="New transactions today">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                New transactions today
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="693700">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Monthly Active Users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one month"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="98500">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Daily active users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one day"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="693700">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Monthly Active Users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one month"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="72000" title="New transactions today">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                New transactions today
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="statistic-card">
          <el-statistic :value="693700">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                Monthly Active Users
                <el-tooltip
                  effect="dark"
                  content="Number of users who logged into the product in one month"
                  placement="top"
                >
                  <el-icon style="margin-left: 4px" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
} from "@element-plus/icons-vue";
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
</style>
