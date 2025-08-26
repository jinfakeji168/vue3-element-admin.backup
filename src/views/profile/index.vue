<template>
  <div class="app-container">
    <el-tabs tab-position="left">
      <!-- 基本设置 Tab Pane -->
      <el-tab-pane label="账号信息">
        <div class="w-full">
          <el-card>
            <!-- 头像和昵称部分 -->
            <div class="relative w-100px h-100px flex-center">
              <el-avatar :src="userProfile.avatar" :size="100" />
              <el-button type="info" class="absolute bottom-0 right-0 cursor-pointer" circle :icon="Camera" size="small" @click="triggerFileUpload" />
              <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
            </div>
            <div class="mt-5">
              {{ userProfile.nickname }}
              <el-icon class="align-middle cursor-pointer" @click="handleOpenDialog(DialogType.ACCOUNT)">
                <Edit />
              </el-icon>
            </div>
            <!-- 用户信息描述 -->
            <el-descriptions :column="1" class="mt-10">
              <!-- 用户名 -->
              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><User /></el-icon>
                  用户名
                </template>
                {{ userProfile.username }}
                <el-icon v-if="userProfile.gender === 1" class="align-middle color-blue">
                  <Male />
                </el-icon>
                <el-icon v-else class="align-middle color-pink">
                  <Female />
                </el-icon>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><Phone /></el-icon>
                  手机号码
                </template>
                {{ userProfile.mobile }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><Message /></el-icon>
                  邮箱
                </template>
                {{ userProfile.email }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <SvgIcon icon-class="tree" />
                  部门
                </template>
                {{ userProfile.department?.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <SvgIcon icon-class="role" />
                  角色
                </template>
                {{ rolseString }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <el-icon class="align-middle"><Timer /></el-icon>
                  创建日期
                </template>
                {{ userProfile.created_at }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 安全设置  -->
      <el-tab-pane label="安全设置">
        <el-card>
          <!-- 账户密码 -->
          <el-row>
            <el-col :span="16">
              <div class="font-bold">账户密码</div>
              <div class="text-14px mt-2">
                定期修改密码有助于保护账户安全
                <el-button type="primary" plain size="small" class="ml-5" @click="() => handleOpenDialog(DialogType.PASSWORD)">修改</el-button>
              </div>
            </el-col>
          </el-row>
          <!-- 绑定手机 -->
          <div class="mt-5">
            <div class="font-bold">绑定手机</div>
            <div class="text-14px mt-2">
              <span v-if="userProfile.mobile">已绑定手机号：{{ userProfile.mobile }}</span>
              <span v-else>未绑定手机</span>
              <el-button v-if="userProfile.mobile" type="primary" plain size="small" class="ml-5" @click="() => handleOpenDialog(DialogType.MOBILE)">更换</el-button>
              <el-button v-else type="primary" plain size="small" class="ml-5" @click="() => handleOpenDialog(DialogType.MOBILE)">绑定</el-button>
            </div>
          </div>
          <!-- 绑定邮箱 -->
          <div class="mt-5">
            <div class="font-bold">绑定邮箱</div>
            <div class="text-14px mt-2">
              <span v-if="userProfile.email">已绑定邮箱：{{ userProfile.email }}</span>
              <span v-else>未绑定邮箱</span>
              <el-button v-if="userProfile.email" type="primary" plain size="small" class="ml-5" @click="() => handleOpenDialog(DialogType.EMAIL)">更换</el-button>
              <el-button v-else type="primary" plain size="small" class="ml-5" @click="() => handleOpenDialog(DialogType.EMAIL)">绑定</el-button>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" :width="500">
      <!-- 账号资料 -->
      <el-form v-if="dialog.type === DialogType.ACCOUNT" ref="userProfileFormRef" :model="userProfileForm" :label-width="100">
        <el-form-item label="昵称">
          <el-input v-model="userProfileForm.nickname" />
        </el-form-item>
        <el-form-item label="性别">
          <Dict v-model="userProfileForm.gender" code="gender" />
        </el-form-item>
      </el-form>

      <!-- 修改密码 -->
      <el-form v-if="dialog.type === DialogType.PASSWORD" ref="passwordChangeFormRef" :model="passwordChangeForm" :rules="passwordChangeRules" :label-width="100">
        <el-form-item label="原密码" prop="old_password">
          <el-input v-model="passwordChangeForm.old_password" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="passwordChangeForm.new_password" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="passwordChangeForm.confirm_password" type="password" show-password />
        </el-form-item>
      </el-form>
      <!-- 绑定手机 -->
      <el-form v-else-if="dialog.type === DialogType.MOBILE" ref="mobileBindingFormRef" :model="mobileBindingForm" :label-width="100">
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="mobileBindingForm.mobile" style="width: 250px" />
        </el-form-item>
      </el-form>

      <!-- 绑定邮箱 -->
      <el-form v-else-if="dialog.type === DialogType.EMAIL" ref="emailBindingFormRef" :model="emailBindingForm" :label-width="100">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailBindingForm.email" style="width: 250px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import UserAPI, { PasswordChangeForm, MobileBindingForm, EmailBindingForm, UserProfileForm, UserInfo } from "@/api/system/user";

import FileAPI from "@/api/file";

import { Camera } from "@element-plus/icons-vue";

const userProfile = ref<UserInfo>({});
const rolseString = computed(() => userProfile.value?.roles?.map((i) => i.name).join(";"));

enum DialogType {
  ACCOUNT = "account",
  PASSWORD = "password",
  MOBILE = "mobile",
  EMAIL = "email",
}

const dialog = reactive({
  visible: false,
  title: "",
  type: "" as DialogType, // 修改账号资料,修改密码、绑定手机、绑定邮箱
});

const userProfileForm = reactive<UserProfileForm>({});
const passwordChangeForm = reactive<PasswordChangeForm>({});
const mobileBindingForm = reactive<MobileBindingForm>({});
const emailBindingForm = reactive<EmailBindingForm>({});

const mobileTimer = ref<NodeJS.Timeout | null>(null);

const emailTimer = ref<NodeJS.Timeout | null>(null);

// 修改密码校验规则
const passwordChangeRules = {
  old_password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  new_password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirm_password: [{ required: true, message: "请再次输入新密码", trigger: "blur" }],
};

// 手机号校验规则
const mobileBindingRules = {
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

// 邮箱校验规则
const emailBindingRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

/**
 * 打开弹窗
 * @param type 弹窗类型 ACCOUNT: 账号资料 PASSWORD: 修改密码 MOBILE: 绑定手机 EMAIL: 绑定邮箱
 */
const handleOpenDialog = (type: DialogType) => {
  dialog.type = type;
  dialog.visible = true;
  switch (type) {
    case DialogType.ACCOUNT:
      dialog.title = "账号资料";
      // 初始化表单数据
      userProfileForm.id = userProfile.value.id;
      userProfileForm.nickname = userProfile.value.nickname;
      userProfileForm.gender = userProfile.value.gender;
      break;
    case DialogType.PASSWORD:
      dialog.title = "修改密码";
      break;
    case DialogType.MOBILE:
      dialog.title = "绑定手机";
      break;
    case DialogType.EMAIL:
      dialog.title = "绑定邮箱";
      break;
  }
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (dialog.type === DialogType.ACCOUNT) {
    UserAPI.updateProfile(userProfileForm).then(() => {
      ElMessage.success("账号资料修改成功");
      dialog.visible = false;
      loadUserProfile();
    });
    return;
  } else if (dialog.type === DialogType.PASSWORD) {
    if (passwordChangeForm.new_password !== passwordChangeForm.confirm_password) {
      ElMessage.error("两次输入的密码不一致");
      return;
    }
    UserAPI.changePassword(passwordChangeForm).then(() => {
      ElMessage.success("密码修改成功");
      dialog.visible = false;
    });
    return;
  }

  if (dialog.type === DialogType.MOBILE) {
    UserAPI.updateProfile({ mobile: mobileBindingForm.mobile }).then(() => {
      ElMessage.success("手机号修改成功");
      dialog.visible = false;
      loadUserProfile();
    });
  } else if (dialog.type === DialogType.EMAIL) {
    UserAPI.updateProfile({ email: emailBindingForm.email }).then(() => {
      ElMessage.success("邮箱修改成功");
      dialog.visible = false;
      loadUserProfile();
    });
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    // 调用文件上传API
    try {
      const data = await FileAPI.upload(file, "images");
      // 更新用户头像
      userProfile.value.avatar = data.url;
      // 更新用户信息
      await UserAPI.updateProfile({
        avatar: data.url,
      });
    } catch (error) {
      ElMessage.error("头像上传失败");
    }
  }
};

/** 加载用户信息 */
const loadUserProfile = async () => {
  const data = await UserAPI.getInfo();
  userProfile.value = data;
};

onMounted(async () => {
  if (mobileTimer.value) {
    clearInterval(mobileTimer.value);
  }
  if (emailTimer.value) {
    clearInterval(emailTimer.value);
  }
  await loadUserProfile();
});
</script>

<style lang="scss" scoped>
/** 关闭tag标签  */
.app-container {
  /* 50px = navbar = 50px */
  height: calc(100vh - 50px);
  background: var(--el-fill-color-blank);
}

/** 开启tag标签  */
.hasTagsView {
  .app-container {
    /* 84px = navbar + tags-view = 50px + 34px */
    height: calc(100vh - 84px);
  }
}
</style>
