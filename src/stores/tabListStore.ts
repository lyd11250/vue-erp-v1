import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter, type RouteLocationNormalizedLoaded } from "vue-router"

export const useTabListStore = defineStore('tabList', () => {
    const router = useRouter()
    const storageTabs = sessionStorage.getItem('tabs')
    const tabList = ref<RouteLocationNormalizedLoaded[]>(storageTabs ? JSON.parse(storageTabs) : [router.currentRoute.value])

    router.afterEach((to) => {
        if (to.path === '/login') {
            return
        }
        for (let i = 0; i < tabList.value.length; i++) {
            if (tabList.value[i].path == to.path) {
                return
            }
        }
        tabList.value.push(to)
        sessionStorage.setItem('tabs', JSON.stringify(tabList.value))
    })

    const removeTab = (tabName: string) => {
        let activeName = router.currentRoute.value.path
        if (activeName === tabName) {
            tabList.value.forEach((tab, index) => {
                if (tab.path === tabName) {
                    const nextTab = tabList.value[index + 1] || tabList.value[index - 1]
                    if (nextTab) {
                        activeName = nextTab.path
                    }
                }
            })
        }
        router.push(activeName)
        tabList.value = tabList.value.filter(i => i.path != tabName)
        sessionStorage.setItem('tabs', JSON.stringify(tabList.value))
    }

    return { tabList, removeTab }
})