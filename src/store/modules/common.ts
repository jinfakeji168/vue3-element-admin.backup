import langApi, { Form } from "@/api/system/lang";
import api from "@/api/common";
import { StatusEnum } from "@/enums/MenuTypeEnum";

export const useStore = defineStore("common", () => {
  /**语言列表 */
  const _langList = ref<Form[]>();
  async function getLangListAsync() {
    if (!_langList.value) _langList.value = await langApi.getOptions();
    return Promise.resolve(_langList.value);
  }
  const langList = computed<Form[]>(() => {
    if (!_langList.value) getLangListAsync();
    return unref(_langList) || [];
  });

  /**vip列表 */
  const _vipList = ref<vipView[]>();
  async function getVipListAsync() {
    if (!_vipList.value) _vipList.value = await api.getVipList<vipView[]>();
    return Promise.resolve(_vipList.value);
  }
  const vipList = computed<vipView[]>(() => {
    if (!_vipList.value) getVipListAsync();
    return unref(_vipList) || [];
  });

  /**分组列表 */
  const _groupList = ref<groupView[]>();
  async function getGroupListAsync() {
    if (!_groupList.value) _groupList.value = await api.getGroupList<groupView[]>();
    return Promise.resolve(_groupList.value);
  }
  const groupList = computed<groupView[]>(() => {
    if (!_groupList.value) getGroupListAsync();
    return unref(_groupList) || [];
  });

  /**交易对列表 */
  const _tradeList = ref<{ key: number; val: string }[]>();
  async function getTradeListAsync() {
    if (!_tradeList.value) _tradeList.value = await api.getTradeList();
    return Promise.resolve(_tradeList.value);
  }
  const tradeList = computed<{ key: number; val: string }[]>(() => {
    if (!_tradeList.value) getTradeListAsync();
    return unref(_tradeList) || [];
  })
  /**时区列表 */
  const _timeZoneList = ref<{ key: number; val: string }[]>();
  async function getTimeZoneListAsync() {
    if (!_timeZoneList.value) _timeZoneList.value = await api.getTimeZoneList();
    return Promise.resolve(_timeZoneList.value);
  }
  const timeZoneList = computed<{ key: number; val: string }[]>(() => {
    if (!_timeZoneList.value) getTimeZoneListAsync();
    return unref(_timeZoneList) || [];
  })
  return {
    getLangListAsync,
    getVipListAsync,
    getGroupListAsync,
    getTradeListAsync,
    getTimeZoneListAsync,
    vipList,
    langList,
    groupList,
    tradeList,
    timeZoneList
  };
});

type vipView = { id: number; title: string; level: number };
type groupView = { id: number; title: string; status: StatusEnum };
