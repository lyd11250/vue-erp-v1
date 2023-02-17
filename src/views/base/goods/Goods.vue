<template>
    <div class="content">
        <div class="row">
            <div class="col">
                <el-input v-model="search.value" placeholder="搜索商品" @keyup.enter="getList">
                    <template #prepend>
                        <el-select v-model="search.type" style="width:100px">
                            <el-option label="商品ID" value="id" />
                            <el-option label="商品名称" value="name" />
                        </el-select>
                    </template>
                    <template #append>
                        <el-button :icon="Search" @click="getList" />
                    </template>
                </el-input>
            </div>
        </div>
        <div class="row">
            <el-button type="primary" :icon="Plus" @click="goodsDialogRef.showDialog()">新增商品</el-button>
        </div>
        <el-table class="table" v-if="data.length > 0" :data="data" :border="true" v-loading="loading"
            :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }" :cell-style="setRowStyle">
            <el-table-column prop="goodsId" label="ID" align="center" />
            <el-table-column label="图片" align="center">
                <template #default="scope">
                    <a :href="completeImagePath(scope.row.goodsImg)" target="_blank">
                        <img :src="completeImagePath(scope.row.goodsImg)" alt="">
                    </a>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="名称" align="center" />
            <el-table-column prop="goodsDesc" label="描述" align="center" />
            <el-table-column prop="goodsUnit" label="单位" align="center" />
            <el-table-column label="售价" align="center">
                <template #default="scope">
                    {{ scope.row.goodsPrice.toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="primary" @click="goodsDialogRef.showDialog(scope.row)">修改</el-button>
                        <el-button type="primary" plain
                            @click="goodsSupplierDialogRef.showDialog(scope.row)">选择供应商</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <goods-dialog ref="goodsDialogRef" @success="addOrUpdateCallback" />
        <goods-supplier-dialog ref="goodsSupplierDialogRef" />
</div>
</template>

<script lang="ts" setup>
import { rCode, getGoodsByName, getGoodsById } from '@/api'
import type { Goods } from '@/types'
import { ref, reactive } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { completeImagePath } from '@/utils'
import GoodsDialog from './components/GoodsDialog.vue'
import GoodsSupplierDialog from './components/GoodsSupplierDialog.vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const goodsDialogRef = ref()
const goodsSupplierDialogRef = ref()
const search = reactive({
    type: 'id',
    value: ''
})
const data = ref<Goods[]>([])


const getList = async () => {
    loading.value = true
    let res: any
    if (search.type === 'id') {
        if (!search.value) {
            ElMessage.error('请输入商品ID')
            return
        }
        res = await getGoodsById(parseInt(search.value))
        if (res.code === rCode.success) {
            if (!res.data) {
                ElMessage.error('商品不存在')
                return
            }
            data.value = [res.data]
        }
    } else {
        res = await getGoodsByName(search.value)
        if (res.code === rCode.success) {
            if (res.data.list.length === 0) {
                ElMessage.error('商品不存在')
                return
            }
            data.value = res.data.list
        }
    }
    loading.value = false
}

const setRowStyle = (cell: any) => ({
    backgroundColor: cell.row.goodsStatus === 1 ? '' : 'var(--el-color-danger-light-9)'
})

const addOrUpdateCallback = (goodsId?: number) => {
    if (goodsId) {
        search.type = 'id'
        search.value = goodsId.toString()
    }
    getList()
}

</script>

<style lang="less" scoped>
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .row {
        display: flex;
        margin-bottom: 15px;

        .col {
            display: flex;
            align-items: center;
            margin-right: 15px;
        }
    }

    .table {
        flex: 1;

        .expand {
            margin: 0 15px;
            display: flex;
            align-items: center;

            .tag {
                margin-right: 15px;
            }
        }

        a {
            img {
                width: 100%;
            }
        }
    }
}
</style>