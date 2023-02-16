<template>
    <div class="content">
        <div class="row">
            <div class="col">
                <el-input v-model="searchId" placeholder="通过ID搜索" @keyup.enter="getList">
                    <template #append>
                        <el-button :icon="Search" @click="getList('id')" />
                    </template>
                </el-input>
            </div>

            <div class="col">
                <el-input v-model="searchName" placeholder="通过名称搜索" @keyup.enter="getList">
                    <template #append>
                        <el-button :icon="Search" @click="getList('name')" />
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
    </div>
    <goods-dialog ref="goodsDialogRef" />
    <goods-supplier-dialog ref="goodsSupplierDialogRef" />
</template>

<script lang="ts" setup>
import { rCode, getGoodsList, getGoodsById } from '@/api'
import type { Goods } from '@/types'
import { ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { completeImagePath } from '@/utils'
import GoodsDialog from './components/GoodsDialog.vue'
import GoodsSupplierDialog from './components/GoodsSupplierDialog.vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const goodsDialogRef = ref()
const goodsSupplierDialogRef = ref()
const searchName = ref<string>('')
const searchId = ref<number>()
const data = ref<Goods[]>([])


const getList = async (search: 'id' | 'name') => {
    loading.value = true
    let res: any
    if (search === 'id') {
        if (!searchId.value) {
            ElMessage.error('请输入商品ID')
            return
        }
        res = await getGoodsById(searchId.value)
        if (res.code === rCode.success) {
            data.value = [res.data]
        }
    } else {
        res = await getGoodsList(searchName.value)
        if (res.code === rCode.success) {
            data.value = res.data.list
        }
    }
    loading.value = false
}

const setRowStyle = (cell: any) => ({
    backgroundColor: cell.row.goodsStatus === 1 ? '' : 'var(--el-color-danger-light-9)'
})


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