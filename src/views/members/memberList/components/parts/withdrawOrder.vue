<template>
  <withdrawOrder :uid="memberId"></withdrawOrder>
</template>

<script setup lang="ts">
import withdrawOrder from "@/views/bill/withdrawOrder/index.vue";
const props = defineProps<{ memberId: number }>();
</script>

<style></style>
