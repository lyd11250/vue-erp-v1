import axios from 'axios'
import { ElMessage } from 'element-plus'
import { rCode } from '.'
import router from '@/router'

// 创建axios实例
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(config => {

    return config
}, error => {
    ElMessage.error('请求出错，请联系系统管理员')
    console.error(error)
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        let code = response.data.code
        if (code !== rCode.success) {
            ElMessage.error(response.data.msg)
            switch (code) {
                // 登录状态失效或权限认证失败
                case rCode.notAuthorized:
                    router.push('/login')
                    break

                default:
                    break
            }
        }
        return response.data
    },
    error => {
        let errMsg = error.message
        switch (error.code) {
            // 请求超时
            case 'ECONNABORTED':
                errMsg = '请求超时，请检查网络连接'
                break

            default:
                errMsg = error.message
                break
        }
        ElMessage.error(errMsg)
        return Promise.reject(error)
    })

const post = (url: string, data: any) => {
    return new Promise((resolve: (value: any) => void, reject) => {
        instance
            .post(url, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export { post }