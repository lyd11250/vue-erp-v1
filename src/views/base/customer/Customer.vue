<template>
    <div class="content">
        <div class="row">
            <div class="col">筛选：</div>
            <div class="col">
                <el-input v-model="filter.customerId">
                    <template #prepend>ID</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.customerName">
                    <template #prepend>名称</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.customerTelephone">
                    <template #prepend>座机号码</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.customerPhone">
                    <template #prepend>手机号码</template>
                </el-input>
            </div>
            <div class="col">
                <el-button type="primary" plain @click="filter = {}; getCustomerList()">重置</el-button>
            </div>
        </div>
        <div class="row">
            <el-button type="primary" :icon="Plus" @click="dialogRef.showDialog()">新增客户</el-button>
        </div>
        <el-table class="table" :data="tableData" :border="true" v-loading="loading"
            :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }" :cell-style="setRowStyle">
            <el-table-column prop="customerId" label="ID" align="center" />
            <el-table-column prop="customerName" label="名称" align="center" show-overflow-tooltip />
            <el-table-column prop="customerDesc" label="描述" align="center" show-overflow-tooltip />
            <el-table-column prop="customerTelephone" label="座机号码" align="center" />
            <el-table-column prop="customerPhone" label="手机号码" align="center" />
            <el-table-column prop="customerAddress" label="地址" align="center" show-overflow-tooltip />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="primary" @click="dialogRef.showDialog(scope.row)">修改</el-button>
                        <el-button :type="scope.row.customerStatus === 1 ? 'danger' : 'success'"
                            @click="handleDisableCustomer(scope.row)">{{
                                scope.row.customerStatus === 1 ? '禁用' : '启用'
                            }}</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <customer-dialog ref="dialogRef" @success="getCustomerList" />
</template>

<script lang="ts" setup>
import { rCode, getCustomerList as apiGetCustomerList, updateCustomer } from '@/api'
import type { Customer } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import CustomerDialog from './components/CustomerDialog.vue'

const loading = ref(false)
const dialogRef = ref()
const filter = ref<Customer>({})
const data = ref<Customer[]>([])
const tableData = computed(() => data.value.filter(i => {
    return (!filter.value.customerId || filter.value.customerId == i.customerId) &&
        (!filter.value.customerName || i.customerName?.includes(filter.value.customerName)) &&
        (!filter.value.customerTelephone || i.customerTelephone?.includes(filter.value.customerTelephone)) &&
        (!filter.value.customerPhone || i.customerPhone?.includes(filter.value.customerPhone))
}))

const setRowStyle = (cell: any) => ({
    backgroundColor: cell.row.customerStatus === 1 ? '' : 'var(--el-color-danger-light-9)'
})

const getCustomerList = async () => {
    loading.value = true
    const res = await apiGetCustomerList()
    if (res.code === rCode.success) {
        if (res.data.list) {
            data.value = res.data.list
        }
    }
    loading.value = false
}

const handleDisableCustomer = async (customer: Customer) => {
    const status = customer.customerStatus ? 1 : 0
    const confirm = await ElMessageBox.confirm(
        `确认${status == 1 ? '禁用' : '启用'}客户"${customer.customerName}"？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
    if (confirm) {
        const res = await updateCustomer({
            customerId: customer.customerId,
            customerStatus: Math.abs(status - 1)
        })
        if (res.code === rCode.success) {
            ElMessage.success(`${status == 1 ? '禁用' : '启用'}客户"${customer.customerName}"成功！`)
            getCustomerList()
        }
    }
}

onMounted(() => {
    getCustomerList()
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