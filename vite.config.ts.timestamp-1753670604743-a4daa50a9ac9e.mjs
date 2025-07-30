// vite.config.ts
import vue from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vi_ae4cb4aa2ebbd5c3f7b006ab8eed1d33/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { loadEnv, defineConfig } from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/vite@5.4.8_@types+node@22.7.5_sass@1.79.5_terser@5.34.1/node_modules/vite/dist/node/index.js";
import AutoImport from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/unplugin-auto-import@0.18.3_1f860b78bfb036c4d4ef1a6330f7b594/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/unplugin-vue-components@0.2_e54facf876fdbcf6b3562ee244e04a9c/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/unplugin-vue-components@0.2_e54facf876fdbcf6b3562ee244e04a9c/node_modules/unplugin-vue-components/dist/resolvers.js";
import { createSvgIconsPlugin } from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_07ecf178ddfea3551bddaa7aa58cb357/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import mockDevServerPlugin from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/vite-plugin-mock-dev-server_307b49c06816082a0aac78c1e7f9d23d/node_modules/vite-plugin-mock-dev-server/dist/index.js";
import UnoCSS from "file:///D:/vscodeWorkSpace/vue3-element-admin.backup/node_modules/.pnpm/unocss@0.63.4_postcss@8.4.4_e2a790bead5d010319338f67af8e3764/node_modules/unocss/dist/vite.mjs";
import { resolve } from "path";

// package.json
var name = "vue3-element-admin";
var version = "2.18.0";
var dependencies = {
  "@element-plus/icons-vue": "^2.3.1",
  "@stomp/stompjs": "^7.0.0",
  "@vueuse/core": "^10.11.1",
  "@wangeditor/editor": "^5.1.23",
  "@wangeditor/editor-for-vue": "5.1.10",
  "animate.css": "^4.1.1",
  axios: "^1.7.7",
  codemirror: "^5.65.18",
  "codemirror-editor-vue3": "^2.8.0",
  echart: "^0.1.3",
  echarts: "^5.5.1",
  "element-plus": "^2.8.5",
  exceljs: "^4.4.0",
  "lodash-es": "^4.17.21",
  nprogress: "^0.2.0",
  "path-browserify": "^1.0.1",
  "path-to-regexp": "^6.3.0",
  pinia: "^2.2.4",
  qs: "^6.13.0",
  sortablejs: "^1.15.3",
  vue: "^3.5.11",
  "vue-i18n": "9.9.1",
  "vue-qrcode": "^2.2.2",
  "vue-router": "^4.4.5"
};
var devDependencies = {
  "@commitlint/cli": "^19.5.0",
  "@commitlint/config-conventional": "^19.5.0",
  "@eslint/js": "^9.12.0",
  "@types/codemirror": "^5.60.15",
  "@types/lodash": "^4.17.10",
  "@types/node": "^22.7.5",
  "@types/nprogress": "^0.2.3",
  "@types/path-browserify": "^1.0.3",
  "@types/qs": "^6.9.16",
  "@types/sortablejs": "^1.15.8",
  "@typescript-eslint/eslint-plugin": "^8.8.1",
  "@typescript-eslint/parser": "^8.8.1",
  "@vitejs/plugin-vue": "^5.1.4",
  autoprefixer: "^10.4.20",
  commitizen: "^4.3.1",
  "cz-git": "1.9.4",
  eslint: "^9.12.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-prettier": "^5.2.1",
  "eslint-plugin-vue": "^9.29.0",
  globals: "^15.11.0",
  husky: "^9.1.6",
  "lint-staged": "^15.2.10",
  postcss: "^8.4.47",
  "postcss-html": "^1.7.0",
  "postcss-scss": "^4.0.9",
  prettier: "^3.3.3",
  sass: "^1.79.5",
  stylelint: "^16.9.0",
  "stylelint-config-html": "^1.1.0",
  "stylelint-config-recess-order": "^5.1.1",
  "stylelint-config-recommended-scss": "^14.1.0",
  "stylelint-config-recommended-vue": "^1.5.0",
  "stylelint-config-standard": "^36.0.1",
  terser: "^5.34.1",
  typescript: "5.5.4",
  "typescript-eslint": "^8.8.1",
  unocss: "^0.63.4",
  "unplugin-auto-import": "^0.18.3",
  "unplugin-vue-components": "^0.27.4",
  vite: "^5.4.8",
  "vite-plugin-mock-dev-server": "^1.8.0",
  "vite-plugin-svg-icons": "^2.0.1",
  "vue-eslint-parser": "^9.4.3",
  "vue-tsc": "^2.1.6"
};
var engines = {
  node: ">=18.0.0"
};

// vite.config.ts
var __vite_injected_original_dirname = "D:\\vscodeWorkSpace\\vue3-element-admin.backup";
var __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now()
};
var pathSrc = resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "./",
    resolve: {
      alias: {
        "@": pathSrc
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          api: "modern-compiler",
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    server: {
      // 主机地址
      host: "0.0.0.0",
      // 端口号
      port: +env.VITE_APP_PORT,
      // 是否自动在浏览器中打开
      open: false,
      proxy: {
        // 代理前缀为 /dev-api 的请求
        [env.VITE_APP_API_URL]: {
          changeOrigin: true,
          // 代理目标真实接口地址：https://api.youlai.tech
          target: "http://47.108.251.42:8169",
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_API_URL), "")
        }
      }
    },
    plugins: [
      vue(),
      // MOCK 服务
      env.VITE_MOCK_DEV_SERVER === "true" ? mockDevServerPlugin() : null,
      UnoCSS({
        hmrTopLevelAwait: false
      }),
      /**
       * 自动导入配置
       *
       * @see https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts1
       */
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver()
        ],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后设置 false
          enabled: false,
          // 指定自动导入函数 eslint 规则的文件
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/types/auto-imports.d.ts",
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver()
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/types/components.d.ts",
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(pathSrc, "assets/icons")],
        symbolId: "icon-[dir]-[name]"
      })
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "sortablejs",
        "exceljs",
        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "path-browserify",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/notification/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/statistic/style/css",
        "element-plus/es/components/watermark/style/css",
        "element-plus/es/components/config-provider/style/css",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/drawer/style/css",
        "element-plus/es/components/color-picker/style/css",
        "element-plus/es/components/backtop/style/css",
        "element-plus/es/components/message-box/style/css",
        "element-plus/es/components/skeleton/style/css",
        "element-plus/es/components/skeleton/style/css",
        "element-plus/es/components/skeleton-item/style/css",
        "element-plus/es/components/badge/style/css",
        "element-plus/es/components/steps/style/css",
        "element-plus/es/components/step/style/css",
        "element-plus/es/components/avatar/style/css",
        "element-plus/es/components/descriptions/style/css",
        "element-plus/es/components/descriptions-item/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/progress/style/css",
        "element-plus/es/components/image-viewer/style/css",
        "element-plus/es/components/empty/style/css"
      ]
    },
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2e3,
      // 消除打包大小超过500kb警告
      minify: "terser",
      // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true,
          // 生产环境去除 console
          drop_debugger: true
          // 生产环境去除 debugger
        },
        format: {
          comments: false
          // 删除注释
        }
      },
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          }
        }
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcdnNjb2RlV29ya1NwYWNlXFxcXHZ1ZTMtZWxlbWVudC1hZG1pbi5iYWNrdXBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHZzY29kZVdvcmtTcGFjZVxcXFx2dWUzLWVsZW1lbnQtYWRtaW4uYmFja3VwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi92c2NvZGVXb3JrU3BhY2UvdnVlMy1lbGVtZW50LWFkbWluLmJhY2t1cC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgeyB0eXBlIFVzZXJDb25maWcsIHR5cGUgQ29uZmlnRW52LCBsb2FkRW52LCBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnNcIjtcclxuXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xyXG5pbXBvcnQgbW9ja0RldlNlcnZlclBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tbW9jay1kZXYtc2VydmVyXCI7XHJcblxyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgbmFtZSwgdmVyc2lvbiwgZW5naW5lcywgZGVwZW5kZW5jaWVzLCBkZXZEZXBlbmRlbmNpZXMgfSBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcclxuXHJcbi8vIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTQwRFx1NzlGMFx1MzAwMVx1NzI0OFx1NjcyQ1x1MzAwMVx1OEZEMFx1ODg0Q1x1NjI0MFx1OTcwMFx1NzY4NGBub2RlYFx1NzI0OFx1NjcyQ1x1MzAwMVx1NEY5RFx1OEQ1Nlx1MzAwMVx1Njc4NFx1NUVGQVx1NjVGNlx1OTVGNFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NjNEMFx1NzkzQVxyXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XHJcbiAgcGtnOiB7IG5hbWUsIHZlcnNpb24sIGVuZ2luZXMsIGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzIH0sXHJcbiAgYnVpbGRUaW1lc3RhbXA6IERhdGUubm93KCksXHJcbn07XHJcblxyXG5jb25zdCBwYXRoU3JjID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xyXG4vKipcclxuICogVml0ZVx1OTE0RFx1N0Y2RSBAc2VlIGh0dHBzOi8vY24udml0ZWpzLmRldi9jb25maWdcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6ICcuLycsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGhTcmMsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIC8vIENTUyBcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIC8vIFx1NUI5QVx1NEU0OVx1NTE2OFx1NUM0MCBTQ1NTIFx1NTNEOFx1OTFDRlxyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgYXBpOiBcIm1vZGVybi1jb21waWxlclwiLFxyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICAgICAgQHVzZSBcIkAvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcclxuICAgICAgICAgIGAsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gXHU0RTNCXHU2NzNBXHU1NzMwXHU1NzQwXHJcbiAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgICAvLyBcdTdBRUZcdTUzRTNcdTUzRjdcclxuICAgICAgcG9ydDogK2Vudi5WSVRFX0FQUF9QT1JULFxyXG4gICAgICAvLyBcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTRFMkRcdTYyNTNcdTVGMDBcclxuICAgICAgb3BlbjogZmFsc2UsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgLy8gXHU0RUUzXHU3NDA2XHU1MjREXHU3RjAwXHU0RTNBIC9kZXYtYXBpIFx1NzY4NFx1OEJGN1x1NkM0MlxyXG4gICAgICAgIFtlbnYuVklURV9BUFBfQVBJX1VSTF06IHtcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIC8vIFx1NEVFM1x1NzQwNlx1NzZFRVx1NjgwN1x1NzcxRlx1NUI5RVx1NjNBNVx1NTNFM1x1NTczMFx1NTc0MFx1RkYxQWh0dHBzOi8vYXBpLnlvdWxhaS50ZWNoXHJcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vNDcuMTA4LjI1MS40Mjo4MTY5JyxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIGVudi5WSVRFX0FQUF9BUElfVVJMKSwgXCJcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICAvLyBNT0NLIFx1NjcwRFx1NTJBMVxyXG4gICAgICBlbnYuVklURV9NT0NLX0RFVl9TRVJWRVIgPT09IFwidHJ1ZVwiID8gbW9ja0RldlNlcnZlclBsdWdpbigpIDogbnVsbCxcclxuICAgICAgVW5vQ1NTKHtcclxuICAgICAgICBobXJUb3BMZXZlbEF3YWl0OiBmYWxzZSxcclxuICAgICAgfSksXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTkxNERcdTdGNkVcclxuICAgICAgICpcclxuICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3h6ei9lbGVtZW50LXBsdXMtYmVzdC1wcmFjdGljZXMvYmxvYi9tYWluL3ZpdGUuY29uZmlnLnRzMVxyXG4gICAgICAgKi9cclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcclxuICAgICAgICBpbXBvcnRzOiBbXCJ2dWVcIiwgXCJAdnVldXNlL2NvcmVcIiwgXCJwaW5pYVwiLCBcInZ1ZS1yb3V0ZXJcIiwgXCJ2dWUtaTE4blwiXSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKFx1NUUyNlx1NjgzN1x1NUYwRilcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTAgZXNsaW50IFx1ODlDNFx1NTIxOVx1RkYwQ1x1NUVGQVx1OEJBRVx1NzUxRlx1NjIxMFx1NEU0Qlx1NTQwRVx1OEJCRVx1N0Y2RSBmYWxzZVxyXG4gICAgICAgICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTUxRkRcdTY1NzAgZXNsaW50IFx1ODlDNFx1NTIxOVx1NzY4NFx1NjU4N1x1NEVGNlxyXG4gICAgICAgICAgZmlsZXBhdGg6IFwiLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvblwiLFxyXG4gICAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFx1NjYyRlx1NTQyNlx1NTcyOCB2dWUgXHU2QTIxXHU2NzdGXHU0RTJEXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHJcbiAgICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXHJcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1MUZEXHU2NTcwVFNcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdThERUZcdTVGODQgKGZhbHNlOlx1NTE3M1x1OTVFRFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMClcclxuICAgICAgICBkdHM6IGZhbHNlLFxyXG4gICAgICAgIC8vIGR0czogXCJzcmMvdHlwZXMvYXV0by1pbXBvcnRzLmQudHNcIixcclxuICAgICAgfSksXHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IEVsZW1lbnQgUGx1cyBcdTdFQzRcdTRFRjZcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1ODFFQVx1NUI5QVx1NEU0OVx1N0VDNFx1NEVGNlx1NEY0RFx1N0Y2RShcdTlFRDhcdThCQTQ6c3JjL2NvbXBvbmVudHMpXHJcbiAgICAgICAgZGlyczogW1wic3JjL2NvbXBvbmVudHNcIiwgXCJzcmMvKiovY29tcG9uZW50c1wiXSxcclxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZUU1x1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRVx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NCAoZmFsc2U6XHU1MTczXHU5NUVEXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwKVxyXG4gICAgICAgIGR0czogZmFsc2UsXHJcbiAgICAgICAgLy8gZHRzOiBcInNyYy90eXBlcy9jb21wb25lbnRzLmQudHNcIixcclxuICAgICAgfSksXHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTk3MDBcdTg5ODFcdTdGMTNcdTVCNThcdTc2ODRcdTU2RkVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcclxuICAgICAgICBpY29uRGlyczogW3Jlc29sdmUocGF0aFNyYywgXCJhc3NldHMvaWNvbnNcIildLFxyXG4gICAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIC8vIFx1OTg4NFx1NTJBMFx1OEY3RFx1OTg3OVx1NzZFRVx1NUZDNVx1OTcwMFx1NzY4NFx1N0VDNFx1NEVGNlxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFtcclxuICAgICAgICBcInZ1ZVwiLFxyXG4gICAgICAgIFwidnVlLXJvdXRlclwiLFxyXG4gICAgICAgIFwicGluaWFcIixcclxuICAgICAgICBcImF4aW9zXCIsXHJcbiAgICAgICAgXCJAdnVldXNlL2NvcmVcIixcclxuICAgICAgICBcInNvcnRhYmxlanNcIixcclxuICAgICAgICBcImV4Y2VsanNcIixcclxuICAgICAgICBcInBhdGgtdG8tcmVnZXhwXCIsXHJcbiAgICAgICAgXCJlY2hhcnRzXCIsXHJcbiAgICAgICAgXCJAd2FuZ2VkaXRvci9lZGl0b3JcIixcclxuICAgICAgICBcIkB3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlXCIsXHJcbiAgICAgICAgXCJ2dWUtaTE4blwiLFxyXG4gICAgICAgIFwicGF0aC1icm93c2VyaWZ5XCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb3JtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZm9ybS1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnV0dG9uL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW5wdXQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbnB1dC1udW1iZXIvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zd2l0Y2gvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy91cGxvYWQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaWNvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Jvdy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhZy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RpYWxvZy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xvYWRpbmcvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3JhZGlvLWdyb3VwL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcG9wb3Zlci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Njcm9sbGJhci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Rvb2x0aXAvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duLW1lbnUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3ViLW1lbnUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51LWl0ZW0vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaXZpZGVyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2FyZC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xpbmsvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9icmVhZGNydW1iL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFibGUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlLXNlbGVjdC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYmxlLWNvbHVtbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NlbGVjdC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL29wdGlvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BhZ2luYXRpb24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYWxlcnQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1idXR0b24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC1ncm91cC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NoZWNrYm94L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFicy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYi1wYW5lL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcmF0ZS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RhdGUtcGlja2VyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW1hZ2Uvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zdGF0aXN0aWMvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy93YXRlcm1hcmsvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb25maWctcHJvdmlkZXIvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90ZXh0L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJhd2VyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sb3ItcGlja2VyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFja3RvcC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lc3NhZ2UtYm94L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc2tlbGV0b24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9za2VsZXRvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NrZWxldG9uLWl0ZW0vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9iYWRnZS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3N0ZXBzL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3RlcC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2F2YXRhci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Rlc2NyaXB0aW9ucy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Rlc2NyaXB0aW9ucy1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2hlY2tib3gtZ3JvdXAvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wcm9ncmVzcy9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ltYWdlLXZpZXdlci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2VtcHR5L3N0eWxlL2Nzc1wiLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICAgIC8vIFx1Njc4NFx1NUVGQVx1OTE0RFx1N0Y2RVxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLCAvLyBcdTZEODhcdTk2NjRcdTYyNTNcdTUzMDVcdTU5MjdcdTVDMEZcdThEODVcdThGQzc1MDBrYlx1OEI2Nlx1NTQ0QVxyXG4gICAgICBtaW5pZnk6IFwidGVyc2VyXCIsIC8vIFZpdGUgMi42LnggXHU0RUU1XHU0RTBBXHU5NzAwXHU4OTgxXHU5MTREXHU3RjZFIG1pbmlmeTogXCJ0ZXJzZXJcIiwgdGVyc2VyT3B0aW9ucyBcdTYyNERcdTgwRkRcdTc1MUZcdTY1NDhcclxuICAgICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgICBrZWVwX2luZmluaXR5OiB0cnVlLCAvLyBcdTk2MzJcdTZCNjIgSW5maW5pdHkgXHU4OEFCXHU1MzhCXHU3RjI5XHU2MjEwIDEvMFx1RkYwQ1x1OEZEOVx1NTNFRlx1ODBGRFx1NEYxQVx1NUJGQ1x1ODFGNCBDaHJvbWUgXHU0RTBBXHU3Njg0XHU2MDI3XHU4MEZEXHU5NUVFXHU5ODk4XHJcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTNCQlx1OTY2NCBjb25zb2xlXHJcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLCAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzQkJcdTk2NjQgZGVidWdnZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdDoge1xyXG4gICAgICAgICAgY29tbWVudHM6IGZhbHNlLCAvLyBcdTUyMjBcdTk2NjRcdTZDRThcdTkxQ0FcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAvLyBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgIC8vICAgXCJ2dWUtaTE4blwiOiBbXCJ2dWUtaTE4blwiXSxcclxuICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAvLyBcdTc1MjhcdTRFOEVcdTRFQ0VcdTUxNjVcdTUzRTNcdTcwQjlcdTUyMUJcdTVFRkFcdTc2ODRcdTU3NTdcdTc2ODRcdTYyNTNcdTUzMDVcdThGOTNcdTUxRkFcdTY4M0NcdTVGMEZbbmFtZV1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTU0MEQsW2hhc2hdXHU4ODY4XHU3OTNBXHU4QkU1XHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5aGFzaFx1NTAzQ1xyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwianMvW25hbWVdLltoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU1NDdEXHU1NDBEXHU0RUUzXHU3ODAxXHU2MkM2XHU1MjA2XHU2NUY2XHU1MjFCXHU1RUZBXHU3Njg0XHU1MTcxXHU0RUFCXHU1NzU3XHU3Njg0XHU4RjkzXHU1MUZBXHU1NDdEXHU1NDBEXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJqcy9bbmFtZV0uW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgICAvLyBcdTc1MjhcdTRFOEVcdThGOTNcdTUxRkFcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTc2ODRcdTU0N0RcdTU0MERcdUZGMENbZXh0XVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NjI2OVx1NUM1NVx1NTQwRFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm86IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gYXNzZXRJbmZvLm5hbWUuc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgICAgICBsZXQgZXh0VHlwZSA9IGluZm9baW5mby5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1x1NjU4N1x1NEVGNlx1NEZFMVx1NjA2RicsIGFzc2V0SW5mby5uYW1lKVxyXG4gICAgICAgICAgICBpZiAoL1xcLihtcDR8d2VibXxvZ2d8bXAzfHdhdnxmbGFjfGFhYykoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xyXG4gICAgICAgICAgICAgIGV4dFR5cGUgPSBcIm1lZGlhXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcLihwbmd8anBlP2d8Z2lmfHN2ZykoXFw/LiopPyQvLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgZXh0VHlwZSA9IFwiaW1nXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcLih3b2ZmMj98ZW90fHR0ZnxvdGYpKFxcPy4qKT8kL2kudGVzdChhc3NldEluZm8ubmFtZSkpIHtcclxuICAgICAgICAgICAgICBleHRUeXBlID0gXCJmb250c1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtleHRUeXBlfS9bbmFtZV0uW2hhc2hdLltleHRdYDtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19BUFBfSU5GT19fOiBKU09OLnN0cmluZ2lmeShfX0FQUF9JTkZPX18pLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIiwgIntcclxuICBcIm5hbWVcIjogXCJ2dWUzLWVsZW1lbnQtYWRtaW5cIixcclxuICBcInZlcnNpb25cIjogXCIyLjE4LjBcIixcclxuICBcInByaXZhdGVcIjogdHJ1ZSxcclxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXHJcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZCAtLW1vZGUgZXhhbXBsZVwiLFxyXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXHJcbiAgICBcImJ1aWxkLW9ubHlcIjogXCJ2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInR5cGUtY2hlY2tcIjogXCJ2dWUtdHNjIC0tbm9FbWl0XCIsXHJcbiAgICBcImxpbnQ6ZXNsaW50XCI6IFwiZXNsaW50IC0tZml4IC4vc3JjXCIsXHJcbiAgICBcImxpbnQ6cHJldHRpZXJcIjogXCJwcmV0dGllciAtLXdyaXRlIFxcXCIqKi8qLntqcyxjanMsdHMsanNvbix0c3gsY3NzLGxlc3Msc2Nzcyx2dWUsaHRtbCxtZH1cXFwiXCIsXHJcbiAgICBcImxpbnQ6c3R5bGVsaW50XCI6IFwic3R5bGVsaW50ICBcXFwiKiovKi57Y3NzLHNjc3MsdnVlfVxcXCIgLS1maXhcIixcclxuICAgIFwibGludDpsaW50LXN0YWdlZFwiOiBcImxpbnQtc3RhZ2VkXCIsXHJcbiAgICBcInByZWluc3RhbGxcIjogXCJucHggb25seS1hbGxvdyBwbnBtXCIsXHJcbiAgICBcInByZXBhcmVcIjogXCJodXNreVwiLFxyXG4gICAgXCJjb21taXRcIjogXCJnaXQtY3pcIlxyXG4gIH0sXHJcbiAgXCJjb25maWdcIjoge1xyXG4gICAgXCJjb21taXRpemVuXCI6IHtcclxuICAgICAgXCJwYXRoXCI6IFwibm9kZV9tb2R1bGVzL2N6LWdpdFwiXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImxpbnQtc3RhZ2VkXCI6IHtcclxuICAgIFwiKi57anMsdHN9XCI6IFtcclxuICAgICAgXCJlc2xpbnQgLS1maXhcIixcclxuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCJcclxuICAgIF0sXHJcbiAgICBcIioue2Nqcyxqc29ufVwiOiBbXHJcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXHJcbiAgICBdLFxyXG4gICAgXCIqLnt2dWUsaHRtbH1cIjogW1xyXG4gICAgICBcImVzbGludCAtLWZpeFwiLFxyXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIixcclxuICAgICAgXCJzdHlsZWxpbnQgLS1maXhcIlxyXG4gICAgXSxcclxuICAgIFwiKi57c2Nzcyxjc3N9XCI6IFtcclxuICAgICAgXCJzdHlsZWxpbnQgLS1maXhcIixcclxuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCJcclxuICAgIF0sXHJcbiAgICBcIioubWRcIjogW1xyXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxyXG4gICAgXVxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjMuMVwiLFxyXG4gICAgXCJAc3RvbXAvc3RvbXBqc1wiOiBcIl43LjAuMFwiLFxyXG4gICAgXCJAdnVldXNlL2NvcmVcIjogXCJeMTAuMTEuMVwiLFxyXG4gICAgXCJAd2FuZ2VkaXRvci9lZGl0b3JcIjogXCJeNS4xLjIzXCIsXHJcbiAgICBcIkB3YW5nZWRpdG9yL2VkaXRvci1mb3ItdnVlXCI6IFwiNS4xLjEwXCIsXHJcbiAgICBcImFuaW1hdGUuY3NzXCI6IFwiXjQuMS4xXCIsXHJcbiAgICBcImF4aW9zXCI6IFwiXjEuNy43XCIsXHJcbiAgICBcImNvZGVtaXJyb3JcIjogXCJeNS42NS4xOFwiLFxyXG4gICAgXCJjb2RlbWlycm9yLWVkaXRvci12dWUzXCI6IFwiXjIuOC4wXCIsXHJcbiAgICBcImVjaGFydFwiOiBcIl4wLjEuM1wiLFxyXG4gICAgXCJlY2hhcnRzXCI6IFwiXjUuNS4xXCIsXHJcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjguNVwiLFxyXG4gICAgXCJleGNlbGpzXCI6IFwiXjQuNC4wXCIsXHJcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXHJcbiAgICBcIm5wcm9ncmVzc1wiOiBcIl4wLjIuMFwiLFxyXG4gICAgXCJwYXRoLWJyb3dzZXJpZnlcIjogXCJeMS4wLjFcIixcclxuICAgIFwicGF0aC10by1yZWdleHBcIjogXCJeNi4zLjBcIixcclxuICAgIFwicGluaWFcIjogXCJeMi4yLjRcIixcclxuICAgIFwicXNcIjogXCJeNi4xMy4wXCIsXHJcbiAgICBcInNvcnRhYmxlanNcIjogXCJeMS4xNS4zXCIsXHJcbiAgICBcInZ1ZVwiOiBcIl4zLjUuMTFcIixcclxuICAgIFwidnVlLWkxOG5cIjogXCI5LjkuMVwiLFxyXG4gICAgXCJ2dWUtcXJjb2RlXCI6IFwiXjIuMi4yXCIsXHJcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC40LjVcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAY29tbWl0bGludC9jbGlcIjogXCJeMTkuNS4wXCIsXHJcbiAgICBcIkBjb21taXRsaW50L2NvbmZpZy1jb252ZW50aW9uYWxcIjogXCJeMTkuNS4wXCIsXHJcbiAgICBcIkBlc2xpbnQvanNcIjogXCJeOS4xMi4wXCIsXHJcbiAgICBcIkB0eXBlcy9jb2RlbWlycm9yXCI6IFwiXjUuNjAuMTVcIixcclxuICAgIFwiQHR5cGVzL2xvZGFzaFwiOiBcIl40LjE3LjEwXCIsXHJcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIyLjcuNVwiLFxyXG4gICAgXCJAdHlwZXMvbnByb2dyZXNzXCI6IFwiXjAuMi4zXCIsXHJcbiAgICBcIkB0eXBlcy9wYXRoLWJyb3dzZXJpZnlcIjogXCJeMS4wLjNcIixcclxuICAgIFwiQHR5cGVzL3FzXCI6IFwiXjYuOS4xNlwiLFxyXG4gICAgXCJAdHlwZXMvc29ydGFibGVqc1wiOiBcIl4xLjE1LjhcIixcclxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeOC44LjFcIixcclxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl44LjguMVwiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNS4xLjRcIixcclxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMjBcIixcclxuICAgIFwiY29tbWl0aXplblwiOiBcIl40LjMuMVwiLFxyXG4gICAgXCJjei1naXRcIjogXCIxLjkuNFwiLFxyXG4gICAgXCJlc2xpbnRcIjogXCJeOS4xMi4wXCIsXHJcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcclxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl41LjIuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjI5LjBcIixcclxuICAgIFwiZ2xvYmFsc1wiOiBcIl4xNS4xMS4wXCIsXHJcbiAgICBcImh1c2t5XCI6IFwiXjkuMS42XCIsXHJcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjE1LjIuMTBcIixcclxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuNDdcIixcclxuICAgIFwicG9zdGNzcy1odG1sXCI6IFwiXjEuNy4wXCIsXHJcbiAgICBcInBvc3Rjc3Mtc2Nzc1wiOiBcIl40LjAuOVwiLFxyXG4gICAgXCJwcmV0dGllclwiOiBcIl4zLjMuM1wiLFxyXG4gICAgXCJzYXNzXCI6IFwiXjEuNzkuNVwiLFxyXG4gICAgXCJzdHlsZWxpbnRcIjogXCJeMTYuOS4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctaHRtbFwiOiBcIl4xLjEuMFwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY2Vzcy1vcmRlclwiOiBcIl41LjEuMVwiLFxyXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY29tbWVuZGVkLXNjc3NcIjogXCJeMTQuMS4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctcmVjb21tZW5kZWQtdnVlXCI6IFwiXjEuNS4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmRcIjogXCJeMzYuMC4xXCIsXHJcbiAgICBcInRlcnNlclwiOiBcIl41LjM0LjFcIixcclxuICAgIFwidHlwZXNjcmlwdFwiOiBcIjUuNS40XCIsXHJcbiAgICBcInR5cGVzY3JpcHQtZXNsaW50XCI6IFwiXjguOC4xXCIsXHJcbiAgICBcInVub2Nzc1wiOiBcIl4wLjYzLjRcIixcclxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xOC4zXCIsXHJcbiAgICBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzXCI6IFwiXjAuMjcuNFwiLFxyXG4gICAgXCJ2aXRlXCI6IFwiXjUuNC44XCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLW1vY2stZGV2LXNlcnZlclwiOiBcIl4xLjguMFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjogXCJeMi4wLjFcIixcclxuICAgIFwidnVlLWVzbGludC1wYXJzZXJcIjogXCJeOS40LjNcIixcclxuICAgIFwidnVlLXRzY1wiOiBcIl4yLjEuNlwiXHJcbiAgfSxcclxuICBcImVuZ2luZXNcIjoge1xyXG4gICAgXCJub2RlXCI6IFwiPj0xOC4wLjBcIlxyXG4gIH0sXHJcbiAgXCJyZXBvc2l0b3J5XCI6IFwiaHR0cHM6Ly9naXRlZS5jb20veW91bGFpb3JnL3Z1ZTMtZWxlbWVudC1hZG1pbi5naXRcIixcclxuICBcImF1dGhvclwiOiBcIlx1NjcwOVx1Njc2NVx1NUYwMFx1NkU5MFx1N0VDNFx1N0VDN1wiLFxyXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VCxPQUFPLFNBQVM7QUFDNVUsU0FBMEMsU0FBUyxvQkFBb0I7QUFFdkUsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFFcEMsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyx5QkFBeUI7QUFFaEMsT0FBTyxZQUFZO0FBQ25CLFNBQVMsZUFBZTs7O0FDVnRCLFdBQVE7QUFDUixjQUFXO0FBMkNYLG1CQUFnQjtBQUFBLEVBQ2QsMkJBQTJCO0FBQUEsRUFDM0Isa0JBQWtCO0FBQUEsRUFDbEIsZ0JBQWdCO0FBQUEsRUFDaEIsc0JBQXNCO0FBQUEsRUFDdEIsOEJBQThCO0FBQUEsRUFDOUIsZUFBZTtBQUFBLEVBQ2YsT0FBUztBQUFBLEVBQ1QsWUFBYztBQUFBLEVBQ2QsMEJBQTBCO0FBQUEsRUFDMUIsUUFBVTtBQUFBLEVBQ1YsU0FBVztBQUFBLEVBQ1gsZ0JBQWdCO0FBQUEsRUFDaEIsU0FBVztBQUFBLEVBQ1gsYUFBYTtBQUFBLEVBQ2IsV0FBYTtBQUFBLEVBQ2IsbUJBQW1CO0FBQUEsRUFDbkIsa0JBQWtCO0FBQUEsRUFDbEIsT0FB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
