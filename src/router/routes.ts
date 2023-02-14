import { markRaw } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { Setting, ShoppingCart, Sell, TakeawayBox, HomeFilled, Document } from '@element-plus/icons-vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/views/layout/Layout.vue'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                meta: {
                    title: '首页',
                    icon: markRaw(HomeFilled)
                },
                component: () => import('@/views/index/Index.vue')
            },
            {
                path: '/purchase',
                meta: {
                    title: '采购管理',
                    icon: markRaw(ShoppingCart)
                },
                children: []
            },
            {
                path: '/sale',
                meta: {
                    title: '销售管理',
                    icon: markRaw(Sell)
                },
                children: []
            },
            {
                path: '/stock',
                meta: {
                    title: '库存管理',
                    icon: markRaw(TakeawayBox)
                },
                children: []
            },
            {
                path: '/base',
                meta: {
                    title: '基础资料管理',
                    icon: markRaw(Document)
                },
                children: [
                    {
                        path: '/base/goods',
                        meta: {
                            title: '商品信息'
                        },
                        component: () => import('@/views/base/goods/Goods.vue')
                    },
                    {
                        path: '/base/supplier',
                        meta: {
                            title: '供应商信息'
                        },
                        component: () => import('@/views/base/supplier/Supplier.vue')
                    },
                    {
                        path: '/base/customer',
                        meta: {
                            title: '客户信息'
                        },
                        component: () => import('@/views/base/customer/Customer.vue')
                    },
                ]
            },
            {
                path: '/system',
                meta: {
                    title: '系统管理',
                    icon: markRaw(Setting)
                },
                children: [
                    {
                        path: '/system/user',
                        meta: {
                            title: '用户信息',
                        },
                        component: () => import('@/views/system/user/User.vue')
                    },
                    {
                        path: '/system/role',
                        meta: {
                            title: '角色信息',
                        },
                        component: () => import('@/views/system/role/Role.vue')
                    },
                    {
                        path: '/system/access',
                        meta: {
                            title: '权限信息',
                        },
                        component: () => import('@/views/system/access/Access.vue')
                    },
                ]
            },
        ]
    }
]

export default routes