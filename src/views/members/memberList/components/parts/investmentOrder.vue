<template>
  <investmentRecord :member-id="memberId"></investmentRecord>
</template>

<script setup lang="ts">
import investmentRecord from "@/views/bill/investmentRecord/index.vue";
const props = defineProps<{ memberId: number }>();
</script>

<style></style>
