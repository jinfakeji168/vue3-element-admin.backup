import langApi, { contentModel, Form } from "@/api/system/lang";

export const useStore = defineStore("common", () => {
  /**语言列表 */
  const langList = ref<Form[]>([]);
  async function getOptions() {
    langList.value = await langApi.getOpenOptions();
  }
  getOptions();
  return {
    langList,
  };
});
