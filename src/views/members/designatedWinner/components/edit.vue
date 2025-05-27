<template>
  <el-dialog 
    v-model="visible" 
    :title="title" 
    width="800px" 
    :close-on-click-modal="false"
    append-to-body
    @closed="closeHandler"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="批量方式" prop="batch_type">
        <el-radio-group v-model="formData.batch_type">
          <el-radio :label="1">指定会员</el-radio>
          <el-radio :label="2">按等级</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="formData.batch_type === 1"
        label="指定会员账号"
        prop="account"
      >
        <el-input
          v-model="formData.account"
          type="textarea"
          placeholder="请输入会员账号，多个账号用英文逗号分隔"
          :rows="3"
        />
      </el-form-item>

      <el-form-item
        v-if="formData.batch_type === 2"
        label="VIP等级"
        prop="vip_level"
      >
        <el-select v-model="formData.vip_level" placeholder="请选择VIP等级">
          <el-option 
            v-for="i of store.vipList" 
            :key="i.id" 
            :label="i.title" 
            :value="i.level"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio-button label="1">充值赠送</el-radio-button>
          <el-radio-button label="2">注册赠送</el-radio-button>
          <el-radio-button label="3">邀请赠送</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="奖项" prop="bonus">
        <el-select v-model="formData.bonus" placeholder="请选择奖项">
          <el-option
            v-for="item in getPrizeList"
            :key="item.prize_id"
            :label="`${item.min_prize_num} (${item.probability}%)`"
            :value="item.prize_id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="loading[0]">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, unref, reactive, watch, computed } from 'vue'
import commonApi from "@/api/common"
import type { FormInstance, FormRules } from 'element-plus'
import api, { type addForm } from '@/api/members/designatedWinner'
import { useStore } from "@/store/modules/common"

const store = useStore()
const visible = defineModel<boolean>()
const title = ref("")

const lotteryConfig = ref<any>(null)

async function getLotteryConfig() {
  const res = await commonApi.getPrizeList()
  lotteryConfig.value = res
}

const getPrizeList = computed(() => {
  if (!lotteryConfig.value) return []
  switch (formData.value.type) {
    case '1':
      return lotteryConfig.value.lottery_recharge_prize_set || []
    case '2':
      return lotteryConfig.value.lottery_register_prize_set || []
    case '3':
      return lotteryConfig.value.lottery_invite_prize_set || []
    default:
      return []
  }
})

const formData = ref<addForm>({
  batch_type: 1,
  account: '',
  vip_level: '',
  type: '1',
  bonus: undefined
})
watch(()=>unref(formData).type,val=>{
  formData.value.bonus=undefined
})


const rules = reactive<FormRules>({
  batch_type: [{ required: true, message: '请选择批量方式', trigger: 'change' }],
  account: [{ required: true, message: '请输入会员账号', trigger: 'blur' }],
  vip_level: [{ required: true, message: '请选择VIP等级', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  bonus: [{ required: true, message: '请选择奖项', trigger: 'change' }]
})

const formRef = ref<FormInstance>()
const loading = ref([false, false])
const emits = defineEmits(['finish'])

async function submitHandler() {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  
  loading.value[0] = true
  try {
    if (formData.value.batch_type === 1) {
      formData.value.account = (formData.value.account as string)?.split(',')
    }
    await api.add(formData.value)
    visible.value = false
    emits('finish')
  } finally {
    loading.value[0] = false
  }
}

function closeHandler() {
  unref(formRef)?.clearValidate()
  unref(formRef)?.resetFields()
  visible.value = false
}

// 监听对话框显示状态
watch(
  visible,
  async () => {
    if (!visible.value) return
    title.value = "新增"
    await getLotteryConfig()
  },
  {
    flush: "post",
  }
)
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
