<template>
    <div class="content">
        <div class="row">
            <div class="col">筛选：</div>
            <div class="col">
                <el-input v-model="filter.supplierId">
                    <template #prepend>ID</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.supplierName">
                    <template #prepend>名称</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.supplierTelephone">
                    <template #prepend>座机号码</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.supplierPhone">
                    <template #prepend>手机号码</template>
                </el-input>
            </div>
            <div class="col">
                <el-button type="primary" plain @click="filter = {}; getSupplierList()">重置</el-button>
            </div>
        </div>
        <div class="row">
            <el-button type="primary" :icon="Plus" @click="dialogRef.showDialog()">新增供应商</el-button>
        </div>
        <el-table class="table" :data="tableData" :border="true" v-loading="loading"
            :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }" :cell-style="setRowStyle">
            <el-table-column prop="supplierId" label="ID" align="center" />
            <el-table-column prop="supplierName" label="名称" align="center" show-overflow-tooltip />
            <el-table-column prop="supplierDesc" label="描述" align="center" show-overflow-tooltip />
            <el-table-column prop="supplierTelephone" label="座机号码" align="center" />
            <el-table-column prop="supplierPhone" label="手机号码" align="center" />
            <el-table-column prop="supplierAddress" label="地址" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="primary" @click="dialogRef.showDialog(scope.row)">修改</el-button>
                        <el-button :type="scope.row.supplierStatus === 1 ? 'danger' : 'success'"
                            @click="handleDisableSupplier(scope.row)">{{
                                scope.row.supplierStatus === 1 ? '禁用' : '启用'
                            }}</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <supplier-dialog ref="dialogRef" @success="getSupplierList" />
</template>

<script lang="ts" setup>
import { rCode, getSupplierList as apiGetSupplierList, updateSupplier } from '@/api'
import type { Supplier } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import SupplierDialog from './components/SupplierDialog.vue'

const loading = ref(false)
const dialogRef = ref()
const filter = ref<Supplier>({})
const data = ref<Supplier[]>([])
const tableData = computed(() => data.value.filter(i => {
    return (!filter.value.supplierId || filter.value.supplierId == i.supplierId) &&
        (!filter.value.supplierName || i.supplierName?.includes(filter.value.supplierName)) &&
        (!filter.value.supplierTelephone || i.supplierTelephone?.includes(filter.value.supplierTelephone)) &&
        (!filter.value.supplierPhone || i.supplierPhone?.includes(filter.value.supplierPhone))
}))

const setRowStyle = (cell: any) => ({
    backgroundColor: cell.row.supplierStatus === 1 ? '' : 'var(--el-color-danger-light-9)'
})

const getSupplierList = async () => {
    loading.value = true
    const res = await apiGetSupplierList()
    if (res.code === rCode.success) {
        if (res.data.list) {
            data.value = res.data.list
        }
    }
    loading.value = false
}

const handleDisableSupplier = async (supplier: Supplier) => {
    const status = supplier.supplierStatus ? 1 : 0
    const confirm = await ElMessageBox.confirm(
        `确认${status == 1 ? '禁用' : '启用'}供应商"${supplier.supplierName}"？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
    if (confirm) {
        const res = await updateSupplier({
            supplierId: supplier.supplierId,
            supplierStatus: Math.abs(status - 1)
        })
        if (res.code === rCode.success) {
            ElMessage.success(`${status == 1 ? '禁用' : '启用'}供应商"${supplier.supplierName}"成功！`)
            getSupplierList()
        }
    }
}

onMounted(() => {
    getSupplierList()
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
    }
}
</style>