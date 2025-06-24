<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <span>系统时间GMT+ 08（te）</span>
      </template>
      <template #default>
        <div class="flex flex-row gap-10 flex-wrap">
          <div class="dataItem" v-for="item in list" :key="item.name">
            <el-image fit="contain" :src="item.img" />
            <span>{{ item.value }}</span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="seach_row">
          <el-date-picker v-model="time_range" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          <el-button type="primary">查询</el-button>
        </div>
        <div class="flex flex-row gap-10 mt-20 flex-wrap">
          <div class="dataItem" v-for="item in list2" :key="item.name">
            <el-image fit="contain" :src="item.img" />
            <span>{{ item.value }}</span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="flex flex-row gap-4 mt-20 flex-wrap">
          <div class="dataCard Custom">
            <span>充值人数</span>
            <div>实时</div>
            <span>0</span>
            <span>0</span>
            <span>总充人数</span>
            <span>复充人数</span>
          </div>
          <div class="dataCard">
            <span>总量化佣金</span>
            <div>实时</div>
            <span>23451234</span>
          </div>
          <div class="dataCard">
            <span>用户佣金账户余额</span>
            <div>实时</div>
            <span>23451234</span>
          </div>
          <div class="dataCard">
            <span>预计出款金额</span>
            <div>实时</div>
            <span>23451234</span>
          </div>
        </div>
        <div class="flex flex-row gap-4 mt-20 flex-wrap">
          <div class="dataContent flex flex-col gap-3">
            <div class="flex flex-row gap-3">
              <span>归集钱包</span>
              <el-button size="small" type="primary">点击刷新</el-button>
            </div>
            <div class="flex flex-row gap-3">
              <span>TRC20</span>
              <span>TBAWERAWawigjwerawEWRa</span>
            </div>
            <div class="flex flex-row gap-3">
              <div class="flex flex-row gap-3">
                <span>U余额</span>
                <span>245.12USDT</span>
              </div>
              <div class="flex flex-row gap-3">
                <span>T余额</span>
                <span>245.12</span>
              </div>
            </div>
            <div class="flex flex-row gap-3">
              <span>BEP20</span>
              <span>0x1234dqwerawieidk13dle39d</span>
            </div>
            <div class="flex flex-row gap-3">
              <div class="flex flex-row gap-3">
                <span>USDT</span>
                <span>245.12USDT</span>
              </div>
              <div class="flex flex-row gap-3">
                <span>USDC</span>
                <span>245.12</span>
              </div>
              <div class="flex flex-row gap-3">
                <span>bnb余额</span>
                <span>245.12</span>
              </div>
            </div>
          </div>
          <div class="dataContent flex flex-col gap-3">
            <div class="flex flex-row gap-3">
              <span>打款钱包</span>
              <el-button size="small" type="primary">点击刷新</el-button>
            </div>
            <div class="flex flex-row gap-3">
              <span>TRC20地址</span>
              <span>TBAWERAWawigjwerawEWRa</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>BEP20地址</span>
              <span>TBAWERAWawigjwerawEWRa</span>
            </div>
            <div class="flex flex-row gap-3">
              <div class="flex flex-row gap-3">
                <span>TRC20-U余额</span>
                <span>245.12</span>
              </div>
              <div class="flex flex-row gap-3">
                <span>T余额</span>
                <span>245.12</span>
              </div>
            </div>
            <div class="flex flex-row gap-3">
              <div class="flex flex-row gap-3">
                <span>BEP20-U余额</span>
                <span>245.22</span>
              </div>
              <div class="flex flex-row gap-3">
                <span>USDC</span>
                <span>245.12</span>
              </div>
              <div class="flex flex-row gap-3">
                <span>bnb余额</span>
                <span>245.12</span>
              </div>
            </div>
            <div class="flex flex-row gap-3">
              <div class="flex flex-row gap-3">
                <span>打款钱包能量</span>
                <span>--/--</span>
                <a>能量网站</a>
                <a>Telegram</a>
              </div>
            </div>
            <div style="color: red; font-size: 14px">
              当前剩余能量大约可以支付0笔转账的能量消耗
              <el-tooltip
                content="波场USDT转账规则:对方地址中有USDT，每笔转账消耗64285能量，没有能量则燃烧13.3959TRX；对方地址中没有USDT，每笔转账消耗64895能量，没有能量则燃烧27.2559TRX"
              >
                <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="flex flex-row">
              <span style="white-space: nowrap">快速购买出款能量</span>
              <el-input placeholder="请输入购买数量" />
            </div>
            <div class="flex flex-row gap-1">
              <el-select>
                <el-option label="1天" value="1" />
                <el-option label="3天" value="3" />
              </el-select>
              <el-button type="primary">购买</el-button>
            </div>
          </div>
          <div class="dataContent flex flex-col gap-3">
            <div class="flex flex-row gap-3">
              <span>能量平台</span>
              <el-button size="small" type="primary">点击刷新</el-button>
            </div>
            <div class="flex flex-row gap-3">
              <span>能量平台余额</span>
              <span>212.41234</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>充值二维码,仅支持trx,勿充其他虚拟币</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>充值地址</span>
              <span>0x1234dqwerawieidk13dle39d</span>
            </div>
            <div class="flex flex-row gap-3">
              <qrcode value="ttttttttttttwawerw1qwetqwetqwetawetqwetqwtqwe" :width="100"></qrcode>
            </div>
            <div>
              <el-button type="primary">充值完成</el-button>
              ;
            </div>
          </div>
          <div class="dataContent flex flex-col gap-3">
            <div class="flex flex-row gap-3">
              <span class="flex-center">
                积分
                <el-tooltip content="预计出款金额计算： 排除测试账户，根据当前可提款用户的佣金总额+可做任务用户产生的收益来预估">
                  <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
              <el-button size="small" type="primary">点击刷新</el-button>
            </div>
            <div class="flex flex-row gap-3">
              <span>系统剩余积分</span>
              <span>212.41234</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>tron地址</span>
              <span>TNKds12eawije2231jc134</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>BEP20地址</span>
              <span>0x1234dqwerawieidk13dle39d</span>
            </div>
            <div class="flex flex-row gap-3">
              <qrcode value="ttttttttttttwawerw1qwetqwetqwetawetqwetqwtqwe" :width="100"></qrcode>
              <qrcode value="ttttttttttttwawerw1qwetqwetqwetawetqwetqwtqwe" :width="100"></qrcode>
            </div>
            <div>
              <el-button type="primary">充值完成</el-button>
              ;
            </div>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import qrcode from "vue-qrcode";

const time_range = ref([]);
const list = reactive([
  { name: "总会员数", value: 666, img: "https://iconfont.alicdn.com/p/illus_3d/file/ZsWruISgVCKK/9fb07d50-4d27-4c9f-bd25-db023a9d2d51.png" },
  { name: "提充差", value: -12344, img: "https://iconfont.alicdn.com/p/illus_3d/file/2OEYpu98KSmI/c460aace-bd9c-42fe-b128-b888832c80c6.png" },
  { name: "总充值", value: -12344, img: "https://iconfont.alicdn.com/p/illus/preview_image/1p80dDcss13Y/0b3c370e-1e53-4203-a0ed-331b12f74876.png" },
  { name: "总提现", value: -12344, img: "https://iconfont.alicdn.com/p/illus/preview_image/iL3OasGQR3yM/eb9afa6b-abaf-4c7b-994a-710d7b32adc9.png" },
  { name: "总归集", value: -12344, img: "https://iconfont.alicdn.com/p/illus/preview_image/DupfXz8v7LiU/34a90dac-3b5f-48fa-8c3a-8334151b96d9.png" },
]);
const list2 = reactive([
  { name: "注册", value: 666, img: "https://iconfont.alicdn.com/p/illus_3d/file/ZsWruISgVCKK/9fb07d50-4d27-4c9f-bd25-db023a9d2d51.png" },
  { name: "注册有做量化", value: 666, img: "https://iconfont.alicdn.com/p/illus_3d/file/ZsWruISgVCKK/9fb07d50-4d27-4c9f-bd25-db023a9d2d51.png" },
  { name: "归集TRC20-U", value: "0(0笔)", img: "https://iconfont.alicdn.com/p/illus/preview_image/DupfXz8v7LiU/34a90dac-3b5f-48fa-8c3a-8334151b96d9.png" },
  { name: "归集TRX", value: "0(0笔)", img: "https://iconfont.alicdn.com/p/illus/preview_image/DupfXz8v7LiU/34a90dac-3b5f-48fa-8c3a-8334151b96d9.png" },
  { name: "归集BEP20-U", value: "0(0笔)", img: "https://iconfont.alicdn.com/p/illus/preview_image/DupfXz8v7LiU/34a90dac-3b5f-48fa-8c3a-8334151b96d9.png" },
  { name: "归集BNB", value: "0(0笔)", img: "https://iconfont.alicdn.com/p/illus/preview_image/DupfXz8v7LiU/34a90dac-3b5f-48fa-8c3a-8334151b96d9.png" },
  { name: "充值金额", value: "0(0人)", img: "https://iconfont.alicdn.com/p/illus/preview_image/1p80dDcss13Y/0b3c370e-1e53-4203-a0ed-331b12f74876.png" },
  { name: "提现金额", value: "0(0人)", img: "https://iconfont.alicdn.com/p/illus/preview_image/iL3OasGQR3yM/eb9afa6b-abaf-4c7b-994a-710d7b32adc9.png" },
  { name: "首充人数", value: "0", img: "https://iconfont.alicdn.com/p/illus_3d/file/ZsWruISgVCKK/9fb07d50-4d27-4c9f-bd25-db023a9d2d51.png" },
  { name: "签到人数", value: "0", img: "https://iconfont.alicdn.com/p/illus_3d/file/ZsWruISgVCKK/9fb07d50-4d27-4c9f-bd25-db023a9d2d51.png" },
  { name: "完成量化次数", value: "0", img: "https://iconfont.alicdn.com/p/illus_3d/file/XpvF1zkqkapr/377d9db0-8c65-4700-a67f-2807b9facf71.png" },
  { name: "量化总佣金", value: "0", img: "https://iconfont.alicdn.com/p/illus_3d/file/zU85lU7qn0P4/fd041d38-97f0-4527-a647-a74e115a69ea.png" },
]);
</script>

<style lang="scss" scoped>
.dataItem {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  flex-basis: 220px;
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
.seach_row {
  width: 60%;
  display: flex;
  gap: 40px;
  margin-top: 40px;
}
.dataCard {
  display: grid;
  width: 340px;
  grid-template-columns: repeat(2, 1fr);
  color: white;
  background: rgb(29, 139, 241);
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  gap: 10px;
  > span:first-of-type {
    font-size: 12px;
  }
  > span:last-of-type {
    font-size: 22px;
  }
  > div:first-of-type {
    justify-self: flex-end;
    font-size: 10px;
    background: color-mix(in srgb, black 100%, transparent 80%);
    padding: 2px 4px;
    border-radius: 4px;
  }
}
.Custom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  > span:last-of-type,
  > span:nth-last-of-type(2) {
    font-size: 12px;
  }
  > span:nth-of-type(2),
  > span:nth-of-type(3) {
    font-size: 22px;
  }
}
.dataContent {
  width: 340px;
  div {
    align-items: center;
    > span {
      font-size: 13px;
      &:first-of-type {
        color: #555;
        &::after {
          content: ":";
        }
      }
      &:last-of-type {
        font-weight: bold;
      }
    }
  }
}
</style>
