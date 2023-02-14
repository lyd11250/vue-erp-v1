<template>
    <el-tabs class="tabs" v-model="activeName" type="card" closable @tab-change="changeTab" @tab-remove="removeTab">
        <el-tab-pane v-for="t in tabListStore.tabList" :key="t.path" :name="t.path" :label="t.meta!.title" />
    </el-tabs>
</template>

<script lang="ts" setup>
import { useTabListStore } from '@/stores/tabListStore'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const tabListStore = useTabListStore()
const activeName = ref('')

watch(() => route.path, (val) => {
    activeName.value = val
}, { immediate: true })

const changeTab = (tabName: string) => {
    router.push(tabName)
}

const removeTab = (tabName: string) => {
    tabListStore.removeTab(tabName)
}

</script>

<style lang="less" scoped>
.tabs {
    width: 100%;
}
</style>