<template>
    <el-dialog v-model="dialogVisible" title="增加库存" width="30%" @closed="formData = {}" destroy-on-close>
        <el-form :model="formData" label-width="120px">
            <el-form-item label="商品ID">
                <el-input v-model="formData.goodsId" disabled />
            </el-form-item>
            <el-form-item label="商品成本">
                <el-input v-model="formData.goodsCost" />
            </el-form-item>
            <el-form-item label="库存数量">
                <el-input v-model.number="formData.quantity" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, addInventory } from '@/api'
import type { Inventory } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const formData = ref<Inventory>({
})

const showDialog = (goodsId: number) => {
    formData.value.goodsId = goodsId
    dialogVisible.value = true
}

const submit = async () => {
    const res = await addInventory(formData.value)
    if (res.code === rCode.success) {
        ElMessage.success(`增加库存成功！`)
        dialogVisible.value = false
        emits('success')
        formData.value = {}
    }
}

defineExpose({ showDialog })

</script>

<style lang="less" scoped></style>