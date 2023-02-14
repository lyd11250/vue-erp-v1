<template>
    <div class="head-bar">
        <div class="logo">
            <img src="@/assets/image/logo_white.svg">
            <div>进销存系统</div>
        </div>
        <div class="sep"></div>
        <el-dropdown class="user">
            <div class="user-info">
                <div class="user-info-left">
                    <el-avatar v-if="currentUser" :src="completeImagePath(currentUser?.userImage!)" />
                </div>
                <div class="user-info-right">
                    <div>{{ currentUser?.userName }}</div>
                    <div>{{ currentUser?.userRealName }}</div>
                </div>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts" setup>
import { useCurrenUserStore } from '@/stores/currentUser'
import { computed } from 'vue'
import { rCode, userLogout } from '@/api'
import { ElMessage } from 'element-plus'
import { completeImagePath } from '@/utils'
import { useRouter } from 'vue-router'
const currentUserStore = useCurrenUserStore()
const currentUser = computed(() => currentUserStore.currentUser)
const router = useRouter()
const handleLogout = async () => {
    const res = await userLogout()
    if (res.code === rCode.success) {
        ElMessage.success('退出登录成功！')
        router.push('/login')
    }
}
</script>

<style lang="less" scoped>
.head-bar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .logo {
        width: 200px;
        height: 60%;
        display: flex;
        align-items: center;
        color: white;
        font-size: 20px;
        cursor: pointer;

        img {
            margin: 0 20px;
            height: 100%;
        }

        &:hover {
            color: rgba(255, 255, 255, 0.7);
        }
    }

    .sep {
        flex: 1;
    }

    .user {
        height: 60%;
        margin-right: 15px;
        display: flex;
        align-items: center;
        color: white;

        &-info {
            height: 100%;
            display: flex;
            align-items: center;

            &-left {
                margin-right: 10px;
            }

            &-right {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }

        }
    }

}
</style>