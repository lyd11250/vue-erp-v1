<template>
    <el-dialog v-model="dialogVisible" title="商品供应商" width="40%" destroy-on-close>
        <el-row>当前商品：{{ currentGoods?.goodsName }}</el-row>
        <el-row>
            <el-button type="primary" :icon="Plus" @click="addButtonClick">新增供应商</el-button>
        </el-row>
        <el-row v-if="form.visible" :gutter="20">
            <el-col :span="8">
                <el-select v-model="form.data.supplierId" :disabled="form.action == 'update'" placeholder="选择或输入供应商"
                    filterable>
                    <el-option v-for="i in suppliers" :key="i.supplierId" :label="i.supplierName" :value="i.supplierId" />
                </el-select>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.data.supplyPrice" placeholder="请输入供应价格" />
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="subbmit">提交</el-button>
                <el-button @click="cancle">取消</el-button>
            </el-col>
        </el-row>
        <el-table :data="goodsSuppliers" :border="true" v-loading="loading" empty-text="暂无供应商">
            <el-table-column prop="supplierId" label="ID" align="center" width="80px" />
            <el-table-column label="供应商" align="center">
                <template #default="scope">
                    {{ suppliers.find(i => i.supplierId === scope.row.supplierId)?.supplierName }}
                </template>
            </el-table-column>
            <el-table-column label="供应价格" align="center" width="120px">
                <template #default="scope">
                    {{ scope.row.supplyPrice.toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160px">
                <template #default="scope">
                    <el-button type="primary" @click="updateButtonClick(scope.row)">修改</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
</el-dialog>
</template>

<script lang="ts" setup>
import type { Goods, Supplier, GoodsSupplierRel } from '@/types'
import { rCode, getGoodsSuppliers, getSupplierList, addGoodsSupplier, updateGoodsSupplier, deleteGoodsSupplier } from '@/api'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const loading = ref(false)
const dialogVisible = ref(false)
const currentGoods = ref<Goods>()
const suppliers = ref<Supplier[]>([])
const goodsSuppliers = ref<{
    supplierId: number
    supplyPrice: number
}[]>([])
const form = ref<{
    visible: boolean
    action: 'add' | 'update'
    data: GoodsSupplierRel
}>({
    visible: false,
    action: 'add',
    data: {}
})

const addButtonClick = () => {
    form.value.visible = true
    form.value.action = 'add'
}

const updateButtonClick = (row: { supplierId: number, supplyPrice: number }) => {
    form.value.visible = true
    form.value.action = 'update'
    form.value.data.supplierId = row.supplierId
    form.value.data.supplyPrice = row.supplyPrice
}

const subbmit = async () => {
    loading.value = true
    let res: any
    if (form.value.action === 'add') {
        res = await addGoodsSupplier(form.value.data)
    } else {
        res = await updateGoodsSupplier(form.value.data)
    }
    if (res.code === rCode.success) {
        getGoodsSuppliersList(currentGoods.value!.goodsId!)
        ElMessage.success(`${form.value.action === 'add' ? '新增' : '修改'}供应商成功！`)
        cancle()
    }
    loading.value = false
}

const cancle = () => {
    form.value = {
        visible: false,
        action: 'add',
        data: {
            goodsId: currentGoods.value?.goodsId
        }
    }
    goodsSuppliers.value = []
}

const handleDelete = async (row: { supplierId: number, supplyPrice: number }) => {
    const currentGoodsId = currentGoods.value?.goodsId
    if (!currentGoodsId) {
        return
    }
    const confirm = await ElMessageBox.confirm(
        `确认删除商品“${currentGoods.value?.goodsName}”的供应商“${suppliers.value.find(i => i.supplierId === row.supplierId)!.supplierName}”？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
    if (confirm) {
        const res = await deleteGoodsSupplier(currentGoodsId, row.supplierId)
        if (res.code === rCode.success) {
            ElMessage.success('删除商品供应商成功')
            getGoodsSuppliersList(currentGoodsId)
        }
    }
}

const getGoodsSuppliersList = async (goodsId: number) => {
    loading.value = true
    const goodsSuppliersRes = await getGoodsSuppliers(goodsId)
    if (goodsSuppliersRes.code === rCode.success) {
        goodsSuppliers.value = goodsSuppliersRes.data.list
    }
    loading.value = false
}

const showDialog = async (goods: Goods) => {
    cancle()
    loading.value = true
    dialogVisible.value = true
    form.value.data.goodsId = goods.goodsId
    currentGoods.value = goods
    const supplierListRes = await getSupplierList()
    if (supplierListRes.code === rCode.success) {
        suppliers.value = supplierListRes.data.list
    }
    getGoodsSuppliersList(goods.goodsId!)
    loading.value = false
}

defineExpose({ showDialog })
</script>

<style lang="less" scoped>
.el-row {
    margin-bottom: 20px;
}
</style>