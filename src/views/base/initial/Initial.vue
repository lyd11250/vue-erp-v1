<template>
    <div class="content" v-loading="loading">
        <el-row>
            <el-col :span="5">
                <el-input v-model.number="searchGoodsId" @keyup.enter="search" placeholder="请输入商品ID">
                    <template #prepend>
                        商品ID
                    </template>
                    <template #append>
                        <el-button :icon="Search" @click="search" />
                    </template>
                </el-input>
            </el-col>
        </el-row>
        <template v-if="goodsInfo && inventoryInfo">
            <el-row>
                <h4 style="color:var(--el-text-color-primary)">商品信息</h4>
            </el-row>
            <el-row>
                <el-descriptions :border="true" :column="9" direction="vertical" style="width:100%">
                    <el-descriptions-item label="ID" align="center">{{ goodsInfo.goodsId }}</el-descriptions-item>
                    <el-descriptions-item label="图片" align="center">
                        <a :href="completeImagePath(goodsInfo!.goodsImg!)" target="_blank">
                            <img :src="completeImagePath(goodsInfo!.goodsImg!)" style="height:100px">
                        </a>
                    </el-descriptions-item>
                    <el-descriptions-item label="名称" align="center">{{ goodsInfo.goodsName }}</el-descriptions-item>
                    <el-descriptions-item label="单位" align="center">{{ goodsInfo.goodsUnit }}</el-descriptions-item>
                    <el-descriptions-item label="售价" align="center">
                        {{ goodsInfo.goodsPrice?.toFixed(2) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="库存总数" align="center">{{ inventoryInfo.sum }}</el-descriptions-item>
                    <el-descriptions-item label="库存价格" align="center">
                        {{ inventoryInfo.amount.toFixed(2) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="库存均价" align="center">
                        {{ (inventoryInfo.amount / inventoryInfo.sum).toFixed(2) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="商品状态" align="center">
                        {{ goodsInfo?.goodsStatus === 1 ? '启用' : '停用' }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-row>
            <el-row :span="20">
                <h4 style="color:var(--el-text-color-primary);flex: 1;">库存详情</h4>
                <el-button type="primary" :icon="Plus" @click="dialogRef.showDialog(goodsInfo?.goodsId)">新增库存</el-button>
            </el-row>
            <el-row>
                <el-table :data="inventoryInfo.list" style="width: 100%" :border="true" empty-text="暂无库存"
                    :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }">
                    <el-table-column label="单个成本" align="center">
                        <template #default="{ row }">
                            {{ row.goodsCost.toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="quantity" label="数量" align="center" />
                    <el-table-column label="总价" align="center">
                        <template #default="{ row }">
                            {{ (row.goodsCost * row.quantity).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </template>
        <add-inventory-dialog ref="dialogRef" @success="search" />
    </div>
</template>

<script lang="ts" setup>
import type { Goods, Inventory } from '@/types'
import { ref } from 'vue'
import { completeImagePath } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { rCode, getGoodsById, getGoodsInventory, updateInventory } from '@/api'
import AddInventoryDialog from './components/AddInventoryDialog.vue'

const dialogRef = ref()
const loading = ref(false)
const searchGoodsId = ref<number>()
const goodsInfo = ref<Goods>()
const inventoryInfo = ref<{
    amount: number
    sum: number
    list: Inventory[]
}>()
const getGoodsInfo = async () => {
    if (!searchGoodsId.value) return
    const res = await getGoodsById(searchGoodsId.value)
    if (res.code === rCode.success) {
        goodsInfo.value = res.data
    }
}
const getInventoryInfo = async () => {
    loading.value = true
    if (!searchGoodsId.value) return
    const res = await getGoodsInventory(searchGoodsId.value)
    if (res.code === rCode.success) {
        inventoryInfo.value = res.data
    }
    loading.value = false
}
const search = async () => {
    loading.value = true
    await getGoodsInfo()
    await getInventoryInfo()
    loading.value = false
}
const handleUpdate = async (inventory: Inventory) => {
    const { value } = await ElMessageBox.prompt('请输入库存数量', '修改库存', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    })
    if (value) {
        const res = await updateInventory({
            goodsId: inventory.goodsId,
            goodsCost: inventory.goodsCost,
            quantity: Number(value)
        })
        if (res.code === rCode.success) {
            ElMessage.success('修改库存成功')
            await search()
        }
    }
}
const handleDelete = async (inventory: Inventory) => {
    const confirm = await ElMessageBox.confirm('此操作将永久删除该库存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })

    if (confirm) {
        const res = await updateInventory({
            goodsId: inventory.goodsId,
            goodsCost: inventory.goodsCost,
            quantity: 0
        })
        if (res.code === rCode.success) {
            ElMessage.success('删除库存成功')
            await search()
        }
    }
}
</script>

<style lang="less" scoped>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}
</style>