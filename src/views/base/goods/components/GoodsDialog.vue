<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" @closed="formData = {}" destroy-on-close>
        <el-form :model="formData" label-width="120px">
            <el-form-item label="商品名称">
                <el-input v-model="formData.goodsName" />
            </el-form-item>
            <el-form-item label="商品描述">
                <el-input v-model="formData.goodsDesc" />
            </el-form-item>
            <el-form-item label="商品单位">
                <el-select v-model="formData.goodsUnit" filterable allow-create placeholder="选择或输入">
                    <el-option v-for="i in units" :key="i" :label="i" :value="i" />
                </el-select>
            </el-form-item>
            <el-form-item label="商品状态">
                <el-switch v-model="formData.goodsStatus" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="商品主图">
                <image-uploader :default="formData.goodsImg" @success="selectImage" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { rCode, addGoods, updateGoods, getGoodsUnits } from '@/api'
import type { Goods } from '@/types'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'

const emits = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogTitle = ref('修改商品')
const units = ref<string[]>([])
const formData = ref<Goods>({
})

const showDialog = (user: Goods | undefined) => {
    dialogTitle.value = user ? '修改商品' : '新增商品'
    if (user) {
        formData.value = { ...user }
    } else {
        formData.value.goodsStatus = 1
    }
    getUnitList()
    dialogVisible.value = true
}

const getUnitList = async () => {
    const res = await getGoodsUnits()
    if (res.code === rCode.success) {
        units.value = res.data.list
    }
}

const submit = async () => {
    let res: any
    if (formData.value.goodsId) {
        // 存在ID则为修改操作
        res = await updateGoods(formData.value)
    } else {
        res = await addGoods(formData.value)
    }
    if (res.code === rCode.success) {
        ElMessage.success(`${dialogTitle.value}成功！`)
        dialogVisible.value = false
        emits('success')
        formData.value = {}
    }
}

const selectImage = (img: string) => {
    formData.value.goodsImg = img
}

defineExpose({ showDialog })

</script>

<style lang="less" scoped>

</style>