<template>
    <div class="content">
        <div class="row">
            <div class="col">
                筛选：
            </div>
            <div class="col">
                <el-input v-model="filter.userId">
                    <template #prepend>ID</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.userName">
                    <template #prepend>用户名</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.userRealName">
                    <template #prepend>真实姓名</template>
                </el-input>
            </div>
            <div class="col">
                <el-input v-model="filter.userPhone">
                    <template #prepend>手机号</template>
                </el-input>
            </div>
            <div class="col">
                <el-button type="primary" plain @click="filter = {}; getUserList()">重置</el-button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <el-button type="primary" :icon="Plus" @click="dialogRef.showDialog()">新增用户</el-button>
            </div>
        </div>
        <el-table class="table" :data="tableData" :border="true" v-loading="loading"
            :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }"
            @expand-change.once="getRoleList">
            <el-table-column type="expand">
                <template #default="props">
                    <div class="expand">
                        <div>角色列表：</div>
                        <el-tag class="tag" v-for="r in props.row.userRoles" :key="r.roleId" closable
                            @close="handleDeleteUserRole(props.row, r)">
                            {{ r.roleName }}
                        </el-tag>
                        <el-dropdown trigger="click">
                            <el-button :icon="Plus"></el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="r in allRoles" :key="r.roleId"
                                        @click="handleAddUserRole(props.row, r)">{{
                                            r.roleName
                                        }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="userId" label="ID" align="center" />
            <el-table-column label="头像" align="center">
                <template #default="scope">
                    <div style="display: flex; align-items: center;justify-content: center;">
                        <el-avatar :src="completeImagePath(scope.row.userImage)" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户名" align="center" />
            <el-table-column prop="userRealName" label="真实姓名" align="center" />
            <el-table-column prop="userPhone" label="手机号" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-button type="primary" @click="dialogRef.showDialog(scope.row)">修改</el-button>
                        <el-button type="warning" @click="handleResetUser(scope.row)">重置</el-button>
                        <el-button type="danger" v-if="scope.row.userStatus === 1"
                            @click="changeUserStatus(scope.row, 0)">注销</el-button>
                        <el-button type="success" v-else @click="changeUserStatus(scope.row, 1)">激活</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <user-dialog ref="dialogRef" @success="getUserList" />
</template>

<script lang="ts" setup>
import { rCode, userList, roleList, addUserRole, deleteUserRole, updateUser } from '@/api'
import type { User, Role } from '@/types'
import { onMounted, ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { completeImagePath } from '@/utils'
import UserDialog from './components/UserDialog.vue'

const loading = ref(false)
const dialogRef = ref()
const allRoles = ref<Role[]>([])
const data = ref<User[]>([])
const filter = ref<User>({})
const tableData = computed(() => data.value.filter(i => {
    return (!filter.value.userId || i.userId == filter.value.userId) &&
        (!filter.value.userName || i.userName?.includes(filter.value.userName)) &&
        (!filter.value.userRealName || i.userRealName?.includes(filter.value.userRealName)) &&
        (!filter.value.userPhone || i.userPhone?.includes(filter.value.userPhone))
}))

const getUserList = async () => {
    loading.value = true
    const res = await userList()
    if (res.code == rCode.success) {
        data.value = res.data.list
    }
    loading.value = false
}

const getRoleList = async () => {
    const res = await roleList()
    if (res.code == rCode.success) {
        allRoles.value = res.data.list
    }
}

const handleAddUserRole = (user: User, role: Role) => {
    for (let i = 0; user.userRoles && i < user.userRoles.length; i++) {
        if (user.userRoles![i].roleId == role.roleId) {
            ElMessage.warning(`用户已具有角色"${role.roleName}"`)
            return
        }
    }
    ElMessageBox.confirm(
        `确认为用户“${user.userName}”添加角色“${role.roleName}”？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(() => {
        addUserRole(user.userId!, role.roleId!).then(res => {
            if (res.code == rCode.success) {
                ElMessage.success('添加成功！')
                getUserList()
            }
        })
    })
}

const handleDeleteUserRole = (user: User, role: Role) => {
    ElMessageBox.confirm(
        `确认删除用户“${user.userName}”的角色“${role.roleName}”？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(() => {
        deleteUserRole(user.userId!, role.roleId!).then(res => {
            if (res.code == rCode.success) {
                ElMessage.success('删除成功！')
                getUserList()
            }
        })
    })
}

const changeUserStatus = async (user: User, userStatus: 1 | 0) => {
    const confirm = await ElMessageBox.confirm(
        `确认${userStatus === 0 ? '注销' : '激活'}用户“${user.userName}”？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
    if (confirm) {
        const res = await updateUser({ userId: user.userId, userStatus })
        if (res.code === rCode.success) {
            ElMessage.success(`${userStatus === 0 ? '注销' : '激活'}用户成功！`)
            getUserList()
        }
    }
}

const handleResetUser = async (user: User) => {
    const confirm = await ElMessageBox.confirm(
        `确认重置用户“${user.userName}”的密码？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
    if (confirm) {
        const res = await updateUser({ userId: user.userId, userPassword: "123456" })
        if (res.code === rCode.success) {
            ElMessage.success(`用户${user.userName}密码重置成功！`)
        }
    }
}


onMounted(() => {
    getUserList()
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