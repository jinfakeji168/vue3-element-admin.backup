<template>
  <flow :uid="memberId"></flow>
</template>

<script setup lang="ts">
import flow from "@/views/members/memberFlow/index.vue";
const props = defineProps<{ memberId: number }>();
</script>

<style></style>
