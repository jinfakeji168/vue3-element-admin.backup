<template>
  <el-dialog v-model="visible" :title="title" width="800px" @closed="closeHandler">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <!-- 新增表单项 -->
      <el-form-item label="发送方式" prop="send_type">
        <el-radio-group v-model="formData.send_type">
          <el-radio :label="1">按等级</el-radio>
          <el-radio :label="2">指定会员下级</el-radio>
          <el-radio :label="3">按分组</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="formData.send_type === 1" label="VIP等级" prop="vip_level">
        <el-select v-model="formData.vip_level" multiple placeholder="请选择VIP等级">
          <el-option v-for="i of store.vipList" :key="i.id" :label="i.title" :value="i.level" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.send_type === 1" label="指定会员账号" prop="account">
        <el-input type="textarea" v-model="formData.account" placeholder="请输入会员账号,用英文逗号分隔" />
      </el-form-item>
      <el-form-item v-if="formData.send_type === 2" label="指定会员所有下级" prop="spe_account">
        <el-select v-model="formData.spe_account" :remote-method="remoteHandler" :loading="loading[1]" filterable remote placeholder="请输入会员账号">
          <el-option v-for="item in memberList" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
        {{ subordinateNumStr }}
      </el-form-item>

      <el-form-item v-if="formData.send_type === 3" label="会员分组" prop="group_ids">
        <el-select v-model="formData.group_ids" multiple placeholder="请选择会员分组">
          <el-option v-for="group in store.groupList" :key="group.id" :label="group.title" :value="group.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否弹窗" prop="is_window">
        <el-switch v-model="formData.is_window" :active-value="StatusEnum.True" :inactive-value="StatusEnum.False" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="currentIndex">
      <el-tab-pane label="标题" :name="0">
        <Content
          class="content"
          style="height: 40vh"
          :ref="
            (el: any) => {
              contentRef[0] = el;
            }
          "
          v-model="formData"
          :keys="['title_original', 'title_translation']"
          type="public"
        ></Content>
      </el-tab-pane>

      <el-tab-pane label="内容" :name="2">
        <Content
          class="content"
          :ref="
            (el: any) => {
              contentRef[1] = el;
            }
          "
          style="height: 40vh"
          v-model="formData"
          :keys="['content_original', 'content_translation']"
        />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading[0]" :disabled="formData.send_type == 2 && !enabled">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type FormData } from "@/api/members/message";
import Lapi from "@/api/members/memberList";
import { searchMember } from "@/utils";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { FormInstance } from "element-plus";
import Content from "@/components/WangEditor/content.vue";
import { useStore } from "@/store/modules/common";
const store = useStore();

const props = defineProps<{
  data?: FormData;
}>();
const visible = defineModel<boolean>();
const title = ref("");
watch(
  visible,
  () => {
    if (!visible.value) return;

    title.value = "新增";
    formData.value = { send_type: 1 };
  },
  {
    flush: "post",
  }
);
const formData = ref<FormData>({});

/** 会员分组列表类型 */
interface GroupItem {
  id: number;
  name: string;
}

// 添加表单验证规则
const rules = {
  send_type: [{ required: true, message: "请选择发送方式", trigger: "change" }],
  vip_level: [{ required: true, message: "请选择VIP等级", trigger: "change" }],
  spe_account: [{ required: true, message: "请输入会员账号", trigger: "blur" }],
  group_ids: [{ required: true, message: "请选择会员分组", trigger: "change" }],
  share_amount: [{ required: true, message: "填写佣金金额", trigger: "blur" }],
};

const formRef = ref<FormInstance>();
const contentRef = ref<InstanceType<typeof Content>[]>([]);

const emits = defineEmits(["finish"]);
const loading = ref([false, false]);
async function submitHandler() {
  const valid = await Promise.all([unref(formRef)?.validate(), ...unref(contentRef).map((el) => el.validate())]);
  debugger;
  if (valid.some((v) => !v)) return;
  loading.value[0] = true;
  try {
    formData.value.account = (formData.value.account as string)?.split(",");
    await api.add(formData.value);
  } finally {
    loading.value[0] = false;
  }
  visible.value = false;
  emits("finish");
}
function closeHandler() {
  unref(formRef)?.clearValidate();
  unref(formRef)?.resetFields();
  unref(contentRef)?.forEach((el) => el.clearValidate());
  visible.value = false;
}

const currentIndex = ref(0);

const memberList = ref<any>([]);
async function remoteHandler(str: string) {
  loading.value[1] = true;
  memberList.value = await searchMember({ account: str });
  loading.value[1] = false;
}

const debouncedGetSubordinate = useDebounceFn(async (val: string) => {
  if (val) {
    try {
      const res = await Lapi.getSubordinate(val);
      subordinateNumStr.value = `共${res.number}个下级`;
      enabled.value = res.number > 0;
    } catch (err: any) {
      subordinateNumStr.value = err;
    }
  }
}, 1000);
const enabled = ref(true);
const subordinateNumStr = ref("");
watch(
  () => formData.value.spe_account,
  (val) => {
    if (val) debouncedGetSubordinate(val);
  }
);
</script>

<style lang="scss" scoped>
.tabBar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .header {
    display: flex;
    gap: 8px;
    & > div {
      padding: 10px 20px;
      font-size: 16px;
      color: black;
      cursor: pointer;
    }
    .checked {
      color: darkgreen;
      border-bottom: 2px solid darkgreen;
    }
  }
}
</style>
