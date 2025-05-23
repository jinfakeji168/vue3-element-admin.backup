<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="[10, 20, 30, 50]"
    background
    layout=" prev, pager, next, jumper,->,total,sizes"
  />
</template>

<script setup lang="ts">
/**分页相关属性配置接口*/
interface Props {
  total: number;
}

/**页码和每页条数的model*/
const currentPage = defineModel("currentPage", { default: 1 });
const pageSize = defineModel("pageSize", { default: 20 });

const props = withDefaults(defineProps<Props>(), {
  total: 0,
});
</script>
