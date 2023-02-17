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
                children: [
                    {
                        path: '/purchase/purchase',
                        meta: {
                            title: '采购入库',
                        },
                        component: () => import('@/views/purchase/purchase/Purchase.vue')
                    },
                    {
                        path: '/purchase/return',
                        meta: {
                            title: '采购退货',
                        },
                        component: () => import('@/views/purchase/return/Return.vue')
                    },
                ]
            },
            {
                path: '/sale',
                meta: {
                    title: '销售管理',
                    icon: markRaw(Sell)
                },
                children: [
                    {
                        path: '/sale/sale',
                        meta: {
                            title: '销售出库',
                        },
                        component: () => import('@/views/sale/sale/Sale.vue')
                    },
                    {
                        path: '/sale/return',
                        meta: {
                            title: '销售退货',
                        },
                        component: () => import('@/views/sale/return/Return.vue')
                    },
                ]
            },
            {
                path: '/stock',
                meta: {
                    title: '库存管理',
                    icon: markRaw(TakeawayBox)
                },
                children: [
                    {
                        path: '/stock/current',
                        meta: {
                            title: '当前库存',
                        },
                        component: () => import('@/views/stock/current/Current.vue')
                    },
                    {
                        // 报损
                        path: '/stock/loss',
                        meta: {
                            title: '商品报损',
                        },
                        component: () => import('@/views/stock/loss/Loss.vue')
                    },
                    {
                        // 报溢
                        path: '/stock/excess',
                        meta: {
                            title: '商品报溢',
                        },
                        component: () => import('@/views/stock/excess/Excess.vue')
                    },
                    {
                        // 库存警报
                        path: '/stock/warning',
                        meta: {
                            title: '库存警报',
                        },
                        component: () => import('@/views/stock/warning/Warning.vue')
                    },
                ]
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
                    {
                        path: '/base/initial',
                        meta: {
                            title: '期初库存管理'
                        },
                        component: () => import('@/views/base/initial/Initial.vue')
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