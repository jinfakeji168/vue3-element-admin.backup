import init from "@/api/basicAPI";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs } from "element-plus";

export default class TableInstance<FormT> {
  private api: any;
  loading: Ref<boolean> = ref(false);
  pageInfo = reactive({
    page: 1,
    limit: 20,
  });
  pageTotal: Ref<number> = ref(0);
  private queryParams: Record<string, any> = {};
  /**数据list */
  list: Ref<FormT[]> = ref([]);
  private queryFormRef: Ref | undefined;
  private editFormRef: Ref | undefined;
  /**多选选择的列表 */
  private selectList: Ref<number[]> = ref([]);
  /**编辑选中的form对象 */
  currentData = ref<FormT>();
  /**控制弹窗显示 */
  visible = ref<boolean[]>([]);
  constructor(api: any, queryParams?: Record<string, any>, limit: number = 20, queryFormRef?: Ref, editFormRef?: Ref) {
    this.api = api;
    this.pageInfo.limit = limit;
    if (queryParams) this.queryParams = queryParams;
    this.queryFormRef = queryFormRef;
    this.editFormRef = editFormRef;
    watch(
      () => this.pageInfo.page,
      (val) => {
        this.queryHandler();
      }
    );
  }
  async queryHandler() {
    this.loading.value = true;

    const obj: Record<string, any> = {};
    //如果queryParams里面有dayjs对象，就转换成时间秒戳
    for (const key in this.queryParams) {
      // debugger;
      if (this.queryParams[key]?.constructor === Array) {
        obj[key] = this.queryParams[key].map((val: any) => {
          if (val.constructor === Date) return dayjs(val).unix();
        });
      } else if (this.queryParams[key]?.constructor === Date) {
        obj[key] = dayjs(this.queryParams[key]).unix();
      }
    }

    const temp = await this.api.getList({ ...this.pageInfo, ...this.queryParams, ...obj });
    this.pageTotal.value = temp.total;
    this.loading.value = false;
    this.list.value = Object.hasOwn(temp, "list") ? temp.list : temp.data;
  }
  async deleteHandler(id?: number) {
    const params = id ? [id] : unref(this.selectList.value);
    const res = await this.api.delete(params);
    if (res) this.queryHandler();
  }
  selectionChangeHandler(data: any[], key = "id") {
    this.selectList.value = data.map((val) => <number>val[key]);
  }

  handleResetQuery() {
    if (this.queryFormRef) this.queryFormRef.value.resetFields();
    this.pageInfo.page = 1;
    nextTick(() => {
      this.queryHandler();
    });
  }
  async changeStatus(item: FormT) {
    await this.api.changeStatus(item, item.status == StatusEnum.True ? StatusEnum.False : StatusEnum.True);
    this.queryHandler();
  }
  /**是否选择了多选 */
  ischecked() {
    return unref(this.selectList).length > 0;
  }
  /**
   * index：多个弹窗索引
   */
  editHandler(item?: FormT, index: number = 0) {
    this.visible.value[index] = true;
    this.currentData.value = item;
  }
}
