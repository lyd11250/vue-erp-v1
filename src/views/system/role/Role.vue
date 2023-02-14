<template>
    <div class="role-page">
        <div class="role-page-left card">
            <div class="card-title">
                <div class="card-title-left">
                    角色列表
                </div>
                <div class="card-title-right">
                    <el-input v-model="roleFilter" placeholder="根据名称筛选" />
                </div>
            </div>
            <div class="list">
                <div class="list-item" v-for="r in roleList.filter(i => i.roleName?.includes(roleFilter))"
                    :key="r.roleId" @click="changeRole(r.roleId!)" :class="{ active: activeRole === r }">
                    <div class="list-item-left">
                        {{ r.roleName }}
                    </div>
                    <div class="list-item-right">
                        <el-button type="primary" @click.stop="dialogRef.showDialog(r)">修改</el-button>
                        <el-button type="danger" @click.stop="handleDeleteRole(r)">删除</el-button>
                    </div>
                </div>
            </div>
            <div class="card-bottom" @click="dialogRef.showDialog()">
                新增角色
            </div>
        </div>
        <div class="role-page-right card">
            <div class="card-title">
                <div class="card-title-left">
                    权限列表
                    <el-tag>{{ activeRole.roleName }}</el-tag>
                </div>
                <div class="card-title-right">
                    <el-input v-model="accessFilter" placeholder="根据名称筛选" />
                </div>
            </div>
            <el-table :data="accessList.filter(i => i.accessTitle?.includes(accessFilter))" :border="true"
                v-loading="loading" style="flex:1"
                :header-cell-style="{ backgroundColor: 'var(--el-border-color-extra-light)' }">
                <el-table-column prop="accessTitle" label="名称" align="center" />
                <el-table-column prop="accessUri" label="URI" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div class="switch" @click="handleSwitch(scope.row)"
                            :class="{ 'switch-on': roleAccessList && roleAccessList.find(i => i.accessId == scope.row.accessId) }">
                            <div class="switch-button"></div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <role-dialog ref="dialogRef" @success="refreshRoleList" />
</template>

<script lang="ts" setup>
import { roleList as getRoleList, accessList as getAccessList, roleAccessList as getRoleAccessList, addRoleAccess, deleteRoleAccess, rCode, deleteRole } from '@/api'
import type { Access, Role } from '@/types'
import { ref, onMounted } from 'vue'
import RoleDialog from './components/RoleDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const dialogRef = ref()
const roleList = ref<Role[]>([])
const accessList = ref<Access[]>([])
const roleAccessList = ref<Access[]>([])
const activeRole = ref<Role>({})
const loading = ref(false)
const roleFilter = ref('')
const accessFilter = ref('')

const changeRole = async (id: number) => {
    loading.value = true
    const res = await getRoleAccessList(id)
    if (res.code === rCode.success) {
        activeRole.value = roleList.value.find(i => i.roleId == id)!
        roleAccessList.value = res.data.list
    }
    loading.value = false
}

const handleDeleteRole = async (role: Role) => {
    ElMessageBox.confirm(
        `确认删除角色“${role.roleName}”？`,
        '确认',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
        }
    ).then(() => {
        deleteRole(role.roleId!).then(res => {
            if (res.code == rCode.success) {
                ElMessage.success('删除角色成功！')
                refreshRoleList()
            }
        })
    })
}

const handleSwitch = async (access: Access) => {
    loading.value = true
    let res: any
    if (roleAccessList.value && roleAccessList.value.filter(i => i.accessId == access.accessId).length) {
        // 删除角色权限
        res = await deleteRoleAccess(activeRole.value.roleId!, access.accessId!)
    } else {
        // 赋予角色权限
        res = await addRoleAccess(activeRole.value.roleId!, access.accessId!)
    }
    if (res.code === rCode.success) {
        changeRole(activeRole.value.roleId!)
    }
    loading.value = false
}

const refreshRoleList = async () => {
    const roleRes: any = await getRoleList()
    if (roleRes.code === rCode.success) {
        roleList.value = roleRes.data.list
    }
}

const init = async () => {
    await refreshRoleList()
    changeRole(roleList.value[0].roleId!)
    const accessRes = await getAccessList()
    if (accessRes.code === rCode.success) {
        accessList.value = accessRes.data.list
    }
}

onMounted(() => {
    init()
})
</script>

<style lang="less" scoped>
.role-page {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .card {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--el-border-color);
        border-radius: var(--el-border-radius-base);
        overflow: hidden;

        &-title {
            background-color: var(--el-border-color-extra-light);
            padding: 10px;
            font-size: 20px;
            border-bottom: 1px solid var(--el-border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .list {
            flex: 1;
            overflow-y: auto;

            &-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 15px;
                cursor: pointer;
                color: var(--el-text-color-regular);
                transition: all var(--el-transition-duration);

                &-left {
                    display: flex;
                    align-items: center;
                }

                &:hover,
                &.active {
                    background-color: var(--el-menu-hover-bg-color);
                }
            }
        }

        &-bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid var(--el-border-color);
            background-color: var(--el-color-primary-light-9);
            padding: 10px;
            cursor: pointer;
            transition: all var(--el-transition-duration);

            &:hover {
                background-color: var(--el-color-primary);
                color: white;
            }
        }
    }
}

.switch {
    width: 40px;
    height: 20px;
    border-radius: 10px;
    padding: 2px;
    background-color: var(--el-color-info);
    position: relative;
    transition: all var(--el-transition-duration);
    margin: auto;
    cursor: pointer;

    &.switch-on {
        background-color: var(--el-color-primary);

        .switch-button {
            left: 22px;
        }
    }

    &-button {
        position: absolute;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #fff;
        transition: all var(--el-transition-duration);
    }
}
</style>