export interface Access {
    accessId?: number
    accessTitle?: string
    accessUri?: string
}

export interface Role {
    roleId?: number
    roleName?: string
}

export interface User {
    userId?: number
    userName?: string
    userPassword?: string
    userImage?: string
    userPhone?: string
    userRealName?: string
    userStatus?: number
    userRoles?: Role[]
}

export interface Supplier {
    supplierId?: number // 供应商ID
    supplierName?: string // 供应商名称
    supplierDesc?: string // 供应商描述
    supplierTelephone?: string // 供应商座机号码
    supplierPhone?: string // 供应商手机号码
    supplierAddress?: string // 供应商地址
    supplierStatus?: number // 供应商状态
}

export interface Customer {
    customerId?: number // 客户ID
    customerName?: string // 客户名称
    customerDesc?: string // 客户描述
    customerTelephone?: string // 客户座机号码
    customerPhone?: string // 客户手机号码
    customerAddress?: string // 客户地址
    customerStatus?: number // 客户状态
}

export interface Goods {
    goodsId?: number
    goodsName?: string
    goodsDesc?: string
    goodsUnit?: string
    goodsPrice?: number
    goodsImg?: string
    goodsStatus?: number
}

export interface GoodsSupplierRel {
    goodsId?: number
    supplierId?: number
    supplyPrice?: number
}

export interface Inventory {
    goodsId?: number
    goodsCost?: number
    quantity?: number
}