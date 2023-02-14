import type { User } from "@/types"
import { defineStore } from "pinia"
import { ref, onMounted } from "vue"
import { getUserById, rCode } from '@/api'

export const useCurrenUserStore = defineStore('currentUser', () => {
    const currentUser = ref<User>()
    const setCurrentUser = (user: User) => {
        currentUser.value = user
    }
    const getCurrentUser = async () => {
        if (!currentUser.value) {
            const res = await getUserById()
            if (res.code === rCode.success) {
                currentUser.value = res.data
            }
        }
    }
    onMounted(() => {
        getCurrentUser()
    })
    return { setCurrentUser, currentUser }
})