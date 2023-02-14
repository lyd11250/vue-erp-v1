<template>
    <div class="login-page">
        <div class="login-box">
            <div class="head">
                <img class="logo" src="@/assets/image/logo.svg">
                <div class="title">进销存管理系统</div>
            </div>
            <el-input class="row" v-model="loginForm.username" size="large" :prefix-icon="User" placeholder="请输入用户名"
                @keyup.enter="handleLogin" />
            <el-input class="row" v-model="loginForm.password" type="password" size="large" :prefix-icon="Lock"
                placeholder="请输入密码" @keyup.enter="handleLogin" />
            <el-button class="row" type="primary" size="large" :icon="Check" @click="handleLogin">登录</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { userLogin, rCode } from '@/api'
import { reactive } from 'vue'
import { useCurrenUserStore } from '@/stores/currentUser'
import { User, Lock, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loginForm = reactive({
    username: '',
    password: ''
})

const handleLogin = async () => {
    const res = await userLogin(loginForm.username, loginForm.password)
    if (res.code === rCode.success) {
        ElMessage.success('登录成功！')
        useCurrenUserStore().setCurrentUser(res.data)
        location.href = '/'
    }
}
</script>

<style lang="less" scoped>
.login-page {
    height: 100%;
    background-image: url('@/assets/image/login_bg.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-box {
        width: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .head {
            height: 60px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            .logo {
                height: 100%;
            }

            .title {
                margin-left: 20px;
                font-size: 50px;
            }
        }

        .row {
            width: 100%;
            margin-top: 20px;
        }
    }
}
</style>