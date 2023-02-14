<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @closed="formData = {}">
        <el-form :model="formData" label-width="80px">
            <el-form-item label="角色名称">
                <el-input v-model="formData.roleName" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, addRole, updateRole } from '@/api'
import type { Role } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogTitle = ref('修改角色')
const formData = ref<Role>({
    roleName: ''
})

const showDialog = (role: Role | undefined) => {
    dialogTitle.value = role ? '修改角色' : '新增角色'
    if (role) {
        formData.value = { ...role }
    }
    dialogVisible.value = true
}

const submit = async () => {
    let res: any
    if (formData.value.roleId) {
        // 存在ID则为修改操作
        res = await updateRole(formData.value)
    } else {
        res = await addRole(formData.value.roleName!)
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