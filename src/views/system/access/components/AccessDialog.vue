<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @closed="formData = {}">
        <el-form :model="formData" label-width="80px">
            <el-form-item label="权限名称">
                <el-input v-model="formData.accessTitle" />
            </el-form-item>
            <el-form-item label="权限路径">
                <el-input v-model="formData.accessUri" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, updateAccess, addAccess } from '@/api'
import type { Access } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogTitle = ref('修改权限')
const formData = ref<Access>({
    accessTitle: '',
    accessUri: ''
})

const showDialog = (access: Access | undefined) => {
    dialogTitle.value = access ? '修改权限' : '新增权限'
    if (access) {
        formData.value = { ...access }
    }
    dialogVisible.value = true
}

const submit = async () => {
    let res: any
    if (formData.value.accessId) {
        // 存在ID则为修改操作
        res = await updateAccess(formData.value)
    } else {
        res = await addAccess(formData.value)
    }
    if (res.code === rCode.success) {
        ElMessage.success(`${dialogTitle.value}成功！`)
        dialogVisible.value = false
        emits('success')
    }
}

defineExpose({ showDialog })

</script>

<style lang="less" scoped>

</style>