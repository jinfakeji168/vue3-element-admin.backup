<template>
  <memberLog :member-id="memberId"></memberLog>
</template>

<script setup lang="ts">
import memberLog from "@/views/members/memberLog/index.vue";
const props = defineProps<{ memberId: number }>();
</script>

<style></style>
