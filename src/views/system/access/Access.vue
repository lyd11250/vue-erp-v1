<template>
    <div class="content">
        <div class="row">
            <div class="col">筛选：</div>
            <div class="col">
                <el-input v-model="filter.accessId">
                    <template #prepend>ID</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.accessTitle">
                    <template #prepend>名称</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.accessUri">
                    <template #prepend>路径</template>
                </el-input>
            </div>
            <div class="col">
                <el-button type="primary" plain @click="filter = {}; getAccessList()">重置</el-button>
            </div>
        </div>
        <div class="row">
            <el-button type="primary" :icon="Plus" @click="dialogRef.showDialog()">新增权限</el-button>
        </div>
        <el-table class="table" :data="tableData" :border="true" v-loading="loading"
            :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }">
            <el-table-column prop="accessId" label="ID" align="center" />
            <el-table-column prop="accessTitle" label="名称" align="center" />
            <el-table-column prop="accessUri" label="路径" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="primary" @click="dialogRef.showDialog(scope.row)">修改</el-button>
                        <el-button type="danger" @click="handleDeleteAccess(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <access-dialog ref="dialogRef" @success="getAccessList" />
</template>

<script lang="ts" setup>
import { rCode, accessList, deleteAccess } from '@/api'
import type { Access } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import AccessDialog from './components/AccessDialog.vue'

const loading = ref(false)
const dialogRef = ref()
const filter = ref<Access>({})
const data = ref<Access[]>([])
const tableData = computed(() => data.value.filter(i => {
    return (!filter.value.accessId || filter.value.accessId == i.accessId) &&
        (!filter.value.accessTitle || i.accessTitle?.includes(filter.value.accessTitle)) &&
        (!filter.value.accessUri || i.accessUri?.includes(filter.value.accessUri))
}))

const getAccessList = async () => {
    loading.value = true
    const res = await accessList()
    if (res.code === rCode.success) {
        data.value = res.data.list
    }
    loading.value = false
}

const handleDeleteAccess = (access: Access) => {
    ElMessageBox.confirm(
        `确认删除权限“${access.accessTitle}”？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(() => {
        deleteAccess(access.accessId!).then(res => {
            if (res.code == rCode.success) {
                ElMessage.success('删除权限成功！')
                getAccessList()
            }
        })
    })
}

onMounted(() => {
    getAccessList()
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