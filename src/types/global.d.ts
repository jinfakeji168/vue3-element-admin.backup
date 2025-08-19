import type { FormProps } from "element-plus";

declare global {
  /**
   * 响应数据
   */
  interface ResponseData<T = any> {
    code: string;
    data: T;
    msg: string;
  }

  /**
   * 分页查询参数
   */
  interface PageQuery {
    page?: number;
    limit?: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    data: T;
    list: T[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
  }

  /**
   * 页签对象
   */
  interface TagView {
    /** 页签名称 */
    name: string;
    /** 页签标题 */
    title: string;
    /** 页签路由路径 */
    path: string;
    /** 页签路由完整路径 */
    fullPath: string;
    /** 页签图标 */
    icon?: string;
    /** 是否固定页签 */
    affix?: boolean;
    /** 是否开启缓存 */
    keepAlive?: boolean;
    /** 路由查询参数 */
    query?: any;
  }

  /**
   * 系统设置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string;
    /** 系统版本 */
    version: string;
    /** 是否显示设置 */
    showSettings: boolean;
    /** 是否固定头部 */
    fixedHeader: boolean;
    /** 是否显示多标签导航 */
    tagsView: boolean;
    /** 是否显示侧边栏Logo */
    sidebarLogo: boolean;
    /** 导航栏布局(left|top|mix) */
    layout: string;
    /** 主题颜色 */
    themeColor: string;
    /** 主题模式(dark|light) */
    theme: string;
    /** 布局大小(default |large |small) */
    size: string;
    /** 语言( zh-cn| en) */
    language: string;
    /** 是否开启水印 */
    watermarkEnabled: boolean;
    /** 水印内容 */
    watermarkContent: string;
  }

  /**
   * 下拉选项数据类型
   */
  interface OptionType {
    /** 值 */
    value?: string | number;
    /** 文本 */
    label?: string;
    /** 子列表  */
    children?: OptionType[];
    /** 是否禁用 */
    disabled?: boolean;
    /**源数据 */
    item?: any;
  }
  /**多语言对象 */
  export interface TranslationItem {
    name?: string;
    lang?: string;
    content?: string;
  }

  /**
   * 查询部件配置项
   */
  interface QueryConfig extends Partial<FormProps> {
    /** 表单继承Element Plus的Form组件所有属性 */
    formItem: {
      /** 类型:input/select等 */ type: "input" | "select" | "date" | "daterange" | "datetime" | "datetimerange" | "inputnumber" | "radio" | "checkbox" | "textarea";
      rules?: FormRules;
      /** 绑定的键名 */
      modelKey: string | string[];
      /** 显示的标签 */
      label: string;
      /** 选项数据 */
      options?: Ref<OptionType[]> | OptionType[];
      /** 组件属性 */
      props?: {
        /** 是否可过滤 */
        filterable?: boolean;
        /** 样式对象 */
        style?: {
          /** 宽度 */
          width?: string;
          [key: string]: any;
        };
        [key: string]: any;
      };
    }[];
  }
}
export { };

declare global {
  const $t: typeof import('./src/lang/index')['$t']
}
