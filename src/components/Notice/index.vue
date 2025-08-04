<template>
  <div>
    <el-dropdown class="flex-center wh-full align-middle">
      <div class="wh-full">
        <el-badge v-if="notices.length > 0" :offset="[-10, 15]" :value="notices.length" :max="99" class="wh-full">
          <el-icon class="notification-icon h-full">
            <Bell />
          </el-icon>
        </el-badge>
        <el-badge v-else class="wh-full">
          <el-icon class="notification-icon h-full">
            <Bell />
          </el-icon>
        </el-badge>
      </div>

      <template #dropdown>
        <div class="p-2">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="通知" name="notice">
              <template v-if="notices.length > 0">
                <div v-for="(item, index) in notices" :key="index" class="w400px flex-x-between p-1">
                  <div class="flex-center">
                    <DictLabel v-model="item.type" code="notice_type" size="small" class="mr-1" />
                    <el-text type="primary" size="small" class="w200px cursor-pointer" truncated @click="gotoPage()">
                      {{ item.title }}
                    </el-text>
                  </div>
                  <div>
                    {{ item.publishTime }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex-center h150px w350px">
                  <el-empty :image-size="50" description="暂无通知" />
                </div>
              </template>
              <el-divider />
              <div class="flex-x-between">
                <!-- <el-link type="primary" :underline="false" @click="viewMore">
                  <span class="text-xs">查看更多</span>
                  <el-icon class="text-xs">
                    <ArrowRight />
                  </el-icon>
                </el-link> -->
                <!-- <el-link v-if="notices.length > 0" type="primary" :underline="false" @click="markAllAsRead">
                  <span class="text-xs">全部已读</span>
                </el-link> -->
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </el-dropdown>

    <NoticeDetail ref="noticeDetailRef" />
  </div>
</template>

<script setup lang="ts">
import NoticeAPI, { NoticePageVO } from "@/api/system/notice";
import configApi from "@/api/system/systemConfig";
import router from "@/router";
import api from "@/api/bill/withdrawOrder";
import { useStore } from "@/store/modules/common";
const activeTab = ref("notice");
const notices = ref<NoticePageVO[]>([]);
const noticeDetailRef = ref();

const pendingCount = ref(0);

async function getOrderNum() {
  async function getMessage() {
    const res = await api.getUnprocessedCount();
    pendingCount.value = res.pending_count;
    if (res.pending_count) {
      notices.value = [
        {
          id: "1",
          title: `您有${res.pending_count}条提现订单待处理`,
          type: 1,
        },
      ];
    } else {
      notices.value = [];
    }
  }
  getMessage();
  const intervalId = setInterval(() => {
    getMessage();
  }, 10000);
  sessionStorage.setItem("intervalId", intervalId.toString());
}
getOrderNum();

const commonStore = useStore();

let audio: HTMLAudioElement | null = null;
watch(pendingCount, async (val) => {
  const open = await commonStore.keyByConfigValue("voice_reminder_switch");
  const repeat = await commonStore.keyByConfigValue("voice_is_repeat_extract_voice");
  const mp3 = await commonStore.keyByConfigValue("voice_withdraw_voice_file");
  if (open == 2) return;
  audio ??= new Audio(mp3);
  if (repeat == 1) {
    audio.loop = true;
  }
  if (val <= 0) {
    pauseAudio();
    return;
  }
  try {
    await audio?.play();
  } catch (e) {
    document.documentElement.addEventListener(
      "click",
      () => {
        audio?.play();
      },
      { once: true }
    );
  }
});
let firstPaly = 0;
function pauseAudio() {
  if (firstPaly > 1) {
    audio?.pause();
    audio?.currentTime && (audio.currentTime = 0);
  }
  firstPaly += 1;
}
const route = useRoute();
watch(
  () => route.name,
  (val) => {
    if (val == "withdrawOrder") {
      pauseAudio();
      console.log("0----------------", audio);
      document.removeEventListener("click", pauseAudio);
      document.addEventListener("click", pauseAudio);
    } else {
      document.removeEventListener("click", pauseAudio);
    }
  },
  {
    immediate: true,
  }
);

function gotoPage() {
  audio?.pause();
  router.push("/bill/withdrawOrder");
}
</script>

<style lang="scss" scoped>
.layout-top .notification-icon,
.layout-mix .notification-icon {
  color: #fff;
}
</style>
