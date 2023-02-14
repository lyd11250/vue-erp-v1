<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @closed="formData = {}" destroy-on-close>
        <el-form :model="formData" label-width="120px">
            <el-form-item label="供应商名称">
                <el-input v-model="formData.supplierName" />
            </el-form-item>
            <el-form-item label="供应商描述">
                <el-input v-model="formData.supplierDesc" />
            </el-form-item>
            <el-form-item label="供应商座机号码">
                <el-input v-model="formData.supplierTelephone" />
            </el-form-item>
            <el-form-item label="供应商手机号码">
                <el-input v-model="formData.supplierPhone" />
            </el-form-item>
            <el-form-item label="供应商地址">
                <el-input v-model="formData.supplierAddress" />
            </el-form-item>
            <el-form-item label="供应商状态">
                <el-switch v-model="formData.supplierStatus" :active-value="1" :inactive-value="0" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, addSupplier, updateSupplier } from '@/api'
import type { Supplier } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogTitle = ref('修改供应商')
const formData = ref<Supplier>({
})

const showDialog = (user: Supplier | undefined) => {
    dialogTitle.value = user ? '修改供应商' : '新增供应商'
    if (user) {
        formData.value = { ...user }
    } else {
        formData.value.supplierStatus = 1
    }
    dialogVisible.value = true
}


const submit = async () => {
    let res: any
    if (formData.value.supplierId) {
        // 存在ID则为修改操作
        res = await updateSupplier(formData.value)
    } else {
        res = await addSupplier(formData.value)
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