<template>
  <div class="login">
    <!-- 登录页头部 -->
    <div class="login-header">
      <div class="flex-y-center">
        <el-image :src="logo" class="logo" />
        <span class="title">
          {{ defaultSettings.title }}
        </span>
        <el-tag size="small" type="success">
          {{ defaultSettings.version }}
        </el-tag>
      </div>

      <div class="flex-y-center">
        <el-switch
          v-model="isDark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="toggleTheme"
        />
        <lang-select class="ml-2 cursor-pointer" />
      </div>
    </div>

    <!-- 登录页内容 -->
    <div class="login-content">
      <div class="login-img">
        <el-image :src="loginImage" style="width: 210px" />
      </div>
      <div class="login-form">
        <el-form ref="loginFormRef" :model="loginData" :rules="loginRules">
          <div class="form-title">
            {{ $t("login.login") }}
            <el-dropdown style="position: absolute; right: 0">
              <div class="cursor-pointer">
                <el-icon>
                  <arrow-down />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="setLoginCredentials('root', '123456')"
                  >
                    超级管理员：root/123456
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="setLoginCredentials('root@example.com', 'password')"
                  >
                    系统管理员：admin/123456
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="setLoginCredentials('test', '123456')"
                  >
                    测试小游客：test/123456
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <!-- 用户名 -->
          <el-form-item prop="username">
            <div class="input-wrapper">
              <el-icon class="mx-2">
                <User />
              </el-icon>
              <el-input
                ref="username"
                v-model="loginData.username"
                :placeholder="$t('login.username')"
                name="username"
                size="large"
                class="h-[48px]"
              />
            </div>
          </el-form-item>

          <!-- 密码 -->
          <el-tooltip
            :visible="isCapslock"
            :content="$t('login.capsLock')"
            placement="right"
          >
            <el-form-item prop="password">
              <div class="input-wrapper">
                <el-icon class="mx-2">
                  <Lock />
                </el-icon>
                <el-input
                  v-model="loginData.password"
                  :placeholder="$t('login.password')"
                  type="password"
                  name="password"
                  size="large"
                  class="h-[48px] pr-2"
                  show-password
                  @keyup="checkCapslock"
                  @keyup.enter="handleLoginSubmit"
                />
              </div>
            </el-form-item>
          </el-tooltip>
          <div class="flex-x-between w-full py-1">
            <el-checkbox>
              {{ $t("login.rememberMe") }}
            </el-checkbox>

            <el-link type="primary" href="/forget-password">
              {{ $t("login.forgetPassword") }}
            </el-link>
          </div>

          <!-- 登录按钮 -->
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            @click.prevent="handleLoginSubmit"
          >
            {{ $t("login.login") }}
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocationQuery, useRoute } from "vue-router";

import AuthAPI, { type LoginData } from "@/api/auth";
import router from "@/router";

import type { FormInstance } from "element-plus";

import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";

import { useSettingsStore, useUserStore, useDictStore } from "@/store";
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const dictStore = useDictStore();

const route = useRoute();
const { t } = useI18n();
const loginFormRef = ref<FormInstance>();

const isDark = ref(settingsStore.theme === ThemeEnum.DARK); // 是否暗黑模式
const loading = ref(false); // 按钮 loading 状态
const isCapslock = ref(false); // 是否大写锁定
const captchaBase64 = ref(); // 验证码图片Base64字符串

const logo = ref(new URL("../../assets/logo.png", import.meta.url).href);
const loginImage = ref(
  new URL("../../assets/images/login-image.svg", import.meta.url).href
);

const loginData = ref<LoginData>({
  username: "admin",
  password: "Admin123",
  captchaKey: "",
  captchaCode: "",
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 1,
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.captchaCode.required"),
      },
    ],
  };
});

/** 获取验证码 */
function getCaptcha() {
  AuthAPI.getCaptcha().then((data) => {
    loginData.value.captchaKey = data.captchaKey;
    captchaBase64.value = data.captchaBase64;
  });
}

/** 登录表单提交 */
async function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(async () => {
          await userStore.getUserInfo();
          //await dictStore.loadDictionaries(); // 需要在路由跳转前加载字典数据，否则会出现字典数据未加载完成导致页面渲染异常
          // 跳转到登录前的页面
          const { path, queryParams } = parseRedirect();
          router.push({ path: path, query: queryParams });
        })
        .catch(() => {
          // getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

/**
 * 解析 redirect 字符串 为 path 和  queryParams
 *
 * @returns { path: string, queryParams: Record<string, string> } 解析后的 path 和 queryParams
 */
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

// 主题切换
const toggleTheme = () => {
  const newTheme =
    settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};

// 检查输入大小写
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

// 设置登录凭证
const setLoginCredentials = (username: string, password: string) => {
  loginData.value.username = username;
  loginData.value.password = password;
};

onMounted(() => {
  // getCaptcha();
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: url("@/assets/images/login-background-light.jpg") no-repeat center
    right;

  .login-header {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 15px;

    .logo {
      width: 26px;
      height: 26px;
    }

    .title {
      margin: auto 5px;
      font-size: 26px;
      font-weight: bold;
      color: transparent;
      background: linear-gradient(to right, #3b82f6, #14b8a6);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .login-content {
    display: flex;
    width: 850px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: var(--el-box-shadow-light);

    @media (width <=768px) {
      flex-direction: column;
      max-width: 100%;
      height: 100vh;
      border-radius: 0;
      box-shadow: none;
    }

    .login-img {
      display: flex;
      flex: 3;
      align-items: center;
      justify-content: center;
      background: linear-gradient(60deg, #165dff, #6aa1ff);

      @media (width <=768px) {
        display: none;
      }
    }

    .login-form {
      display: flex;
      flex: 2;
      flex-direction: column;
      justify-content: center;
      min-width: 400px;
      padding: 30px;

      @media (width <=768px) {
        width: 100%;
        padding: 0 20px;
      }

      .form-title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        font-size: 20px;
        text-align: center;
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .captcha-img {
        height: 48px;
        cursor: pointer;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      .third-party-login {
        display: flex;
        justify-content: center;
        width: 100%;
        color: var(--el-text-color-secondary);

        *:not(:first-child) {
          margin-left: 20px;
        }

        .icon {
          cursor: pointer;
        }
      }
    }
  }

  .login-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
}

:deep(.el-form-item) {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}

html.dark {
  .login {
    background: url("@/assets/images/login-background-dark.jpg") no-repeat
      center right;

    .login-content {
      background: transparent;
      box-shadow: var(--el-box-shadow);
    }
  }
}
</style>
