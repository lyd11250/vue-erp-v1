<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @closed="formData = {}" destroy-on-close>
        <el-form :model="formData" label-width="120px">
            <el-form-item label="客户名称">
                <el-input v-model="formData.customerName" />
            </el-form-item>
            <el-form-item label="客户描述">
                <el-input v-model="formData.customerDesc" />
            </el-form-item>
            <el-form-item label="客户座机号码">
                <el-input v-model="formData.customerTelephone" />
            </el-form-item>
            <el-form-item label="客户手机号码">
                <el-input v-model="formData.customerPhone" />
            </el-form-item>
            <el-form-item label="客户地址">
                <el-input v-model="formData.customerAddress" />
            </el-form-item>
            <el-form-item label="客户状态">
                <el-switch v-model="formData.customerStatus" :active-value="1" :inactive-value="0" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, addCustomer, updateCustomer } from '@/api'
import type { Customer } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogTitle = ref('修改客户')
const formData = ref<Customer>({
})

const showDialog = (user: Customer | undefined) => {
    dialogTitle.value = user ? '修改客户' : '新增客户'
    if (user) {
        formData.value = { ...user }
    } else {
        formData.value.customerStatus = 1
    }
    dialogVisible.value = true
}


const submit = async () => {
    let res: any
    if (formData.value.customerId) {
        // 存在ID则为修改操作
        res = await updateCustomer(formData.value)
    } else {
        res = await addCustomer(formData.value)
    }
    if (res.code === rCode.success) {
        ElMessage.success(`${dialogTitle.value}成功！`)
        dialogVisible.value = false
        emits('success')
        formData.value = {}
    }
}

defineExpose({ showDialog })

</script>

<style lang="less" scoped>

</style>