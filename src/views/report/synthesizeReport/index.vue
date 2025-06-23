<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <span>系统时间GMT+ 08（te）</span>
      </template>
      <template #default>
        <div class="flex flex-row gap-10">
          <div class="dataItem">
            <el-image fit="contain" src="https://iconfont.alicdn.com/p/illus_3d/file/ZsWruISgVCKK/9fb07d50-4d27-4c9f-bd25-db023a9d2d51.png" />
            <span>666</span>
            <span>总会员数</span>
          </div>
          <div class="dataItem">
            <el-image fit="contain" src="https://iconfont.alicdn.com/p/illus_3d/file/2OEYpu98KSmI/c460aace-bd9c-42fe-b128-b888832c80c6.png" />
            <span>-12344</span>
            <span>提充差</span>
          </div>
          <div class="dataItem">
            <el-image fit="contain" src="https://iconfont.alicdn.com/p/illus/preview_image/1p80dDcss13Y/0b3c370e-1e53-4203-a0ed-331b12f74876.png" />
            <span>-12344</span>
            <span>总充值</span>
          </div>
          <div class="dataItem">
            <el-image fit="contain" src="https://iconfont.alicdn.com/p/illus/preview_image/iL3OasGQR3yM/eb9afa6b-abaf-4c7b-994a-710d7b32adc9.png" />
            <span>-12344</span>
            <span>总提现</span>
          </div>
          <div class="dataItem">
            <el-image fit="contain" src="https://iconfont.alicdn.com/p/illus/preview_image/DupfXz8v7LiU/34a90dac-3b5f-48fa-8c3a-8334151b96d9.png" />
            <span>-12344</span>
            <span>总归集</span>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.dataItem {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  > .el-image {
    grid-column: 1/2;
    grid-row: 1/3;
    width: 60px;
    height: 60px;
  }
  > span:first-of-type {
    font-weight: bold;
  }
}
</style>
