<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @closed="formData = {}" destroy-on-close>
        <el-form :model="formData" label-width="80px">
            <el-form-item label="头像">
                <image-uploader :default="formData.userImage" @success="handleImageChange" />
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="formData.userName" />
            </el-form-item>
            <el-form-item label="真实姓名">
                <el-input v-model="formData.userRealName" />
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="formData.userPhone" />
            </el-form-item>
            <el-form-item label="账号状态">
                <el-switch v-model="formData.userStatus" :active-value="1" :inactive-value="0" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, addUser, updateUser } from '@/api'
import type { User } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogTitle = ref('修改用户')
const formData = ref<User>({
})

const showDialog = (user: User | undefined) => {
    dialogTitle.value = user ? '修改用户' : '新增用户'
    if (user) {
        formData.value = { ...user }
    } else {
        formData.value.userStatus = 1
    }
    dialogVisible.value = true
}

const handleImageChange = (filename: string) => {
    formData.value.userImage = filename
}

const submit = async () => {
    let res: any
    if (formData.value.userId) {
        // 存在ID则为修改操作
        res = await updateUser(formData.value)
    } else {
        res = await addUser(formData.value)
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