<template>
  <rechargeOrder :uid="memberId"></rechargeOrder>
</template>

<script setup lang="ts">
import rechargeOrder from "@/views/bill/rechargeOrder/index.vue";
const props = defineProps<{ memberId: number }>();
</script>

<style></style>
