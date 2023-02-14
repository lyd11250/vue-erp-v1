import type { Access, Role, Supplier, Customer, User, Goods } from "@/types"
import { post } from "./http"

export const rCode = {
    success: 0,
    notAuthorized: 61
}

export function getUserById(id?: number) {
    return post('/user/id', { id })
}

export function userLogin(userName: string, userPassword: string) {
    return post('/user/login', { userName, userPassword })
}

export function userLogout() {
    return post('/user/logout', {})
}

export function userList() {
    return post('/user/list', undefined)
}

export function addUser(user: User) {
    return post('/user/add', user)
}

export function updateUser(user: User) {
    return post('/user/update', user)
}

export function roleList() {
    return post('/role/list', undefined)
}

export function addRole(roleName: string) {
    return post('/role/add', { roleName })
}

export function deleteRole(roleId: number) {
    return post('/role/delete', { roleId })
}

export function updateRole(role: Role) {
    return post('/role/update', role)
}

export function roleAccessList(roleId: number) {
    return post('/role/access/list', { roleId })
}

export function addRoleAccess(roleId: number, accessId: number) {
    return post('/role/access/add', { roleId, accessId })
}

export function deleteRoleAccess(roleId: number, accessId: number) {
    return post('/role/access/delete', { roleId, accessId })
}

export function addUserRole(userId: number, roleId: number) {
    return post('/user/role/add', { userId, roleId })
}

export function deleteUserRole(userId: number, roleId: number) {
    return post('/user/role/delete', { userId, roleId })
}

export function accessList() {
    return post('/access/list', undefined)
}

export function deleteAccess(accessId: number) {
    return post('/access/delete', { accessId })
}

export function addAccess(access: Access) {
    return post('/access/add', access)
}

export function updateAccess(access: Access) {
    return post('/access/update', access)
}

export function uploadFile(file: File) {
    const data = new FormData()
    data.append('file', file)
    return post('/file/upload', data)
}

export function addSupplier(supplier: Supplier) {
    return post('/supplier/add', supplier)
}

export function updateSupplier(supplier: Supplier) {
    return post('/supplier/update', supplier)
}

export function getSupplierById(supplierId: number) {
    return post('/supplier/id', { supplierId })
}

export function getSupplierList() {
    return post('/supplier/list', {})
}

export function addCustomer(customer: Customer) {
    return post('/customer/add', customer)
}

export function updateCustomer(customer: Customer) {
    return post('/customer/update', customer)
}

export function getCustomerById(customerId: number) {
    return post('/customer/id', { customerId })
}

export function getCustomerList() {
    return post('/customer/list', {})
}

export function getGoodsUnits() {
    return post('/goods/units', {})
}

export function getGoodsById(goodsId: number) {
    return post('/goods/id', { goodsId })
}

export function getGoodsList(goodsName: string) {
    return post('/goods/list', { goodsName })
}

export function addGoods(goods: Goods) {
    return post('/goods/add', goods)
}

export function updateGoods(goods: Goods) {
    return post('/goods/update', goods)
}