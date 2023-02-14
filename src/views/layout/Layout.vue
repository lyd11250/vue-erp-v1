<template>
    <div class="layout">
        <div class="header">
            <head-bar />
        </div>
        <div class="main">
            <div class="main-side">
                <sidebar />
            </div>
            <div class="main-content">
                <tabs />
                <div class="page">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import HeadBar from './components/HeadBar.vue'
import Sidebar from './components/SideBar.vue'
import Tabs from './components/Tabs.vue';

</script>

<style lang="less" scoped>
.layout {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        width: 100%;
        height: 60px;
        background-color: var(--el-color-primary);
    }

    .main {
        height: calc(100vh - 60px);
        display: flex;

        &-side {
            width: 200px;
        }

        &-content {
            width: calc(100vw - 200px);
            display: flex;
            flex-direction: column;

            .page {
                flex: 1;
                margin-left: 15px;
                overflow: auto;
                border: 1px solid var(--el-border-color);
                border-radius: var(--el-border-radius-base);
                padding: 15px;
            }
        }
    }
}
</style>