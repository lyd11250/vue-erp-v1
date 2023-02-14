<template>
    <div class="content">
        <div class="row">
            <div class="col">
                <el-input v-model="searchName" placeholder="通过名称搜索" @keyup.enter="getList">
                    <template #append>
                        <el-button :icon="Search" @click="getList" />
                    </template>
                </el-input>
            </div>
        </div>
        <div class="row">
            <el-button type="primary" :icon="Plus" @click="dialogRef.showDialog()">新增商品</el-button>
        </div>
        <el-table class="table" v-if="data.length > 0" :data="data" :border="true" v-loading="loading"
            :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }">
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
            <el-table-column prop="goodsStatus" label="状态" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="primary" @click="dialogRef.showDialog(scope.row)">修改</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <goods-dialog ref="dialogRef" @success="getList" />
</template>

<script lang="ts" setup>
import { rCode, getGoodsList } from '@/api'
import type { Goods } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { completeImagePath } from '@/utils'
import GoodsDialog from './components/GoodsDialog.vue'

const loading = ref(false)
const dialogRef = ref()
const searchName = ref<string>('')
const data = ref<Goods[]>([])


const getList = async () => {
    loading.value = true
    const res = await getGoodsList(searchName.value)
    if (res.code === rCode.success) {
        data.value = res.data.list
    }
    loading.value = false
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