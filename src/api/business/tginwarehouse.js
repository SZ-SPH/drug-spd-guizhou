import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 采购计划入库分页查询
 * @param {查询条件} data
 */
export function listTGInwarehouse(query) {
  return request({
    url: 'business/TGInwarehouse/list',
    method: 'get',
    params: query
  })
}

export function listInwarehouse(query) {
  return request({
    url: 'business/Inwarehouse/list',
    method: 'get',
    params: query
  })
}

export function listInwarehouseitem(query) {
  return request({
    url: 'business/Inwarehousedetail/list',
    method: 'get',
    params: query
  })
}

export function updateInwarehouseDetailItem(query) {
  return request({
    url: 'business/Inwarehousedetail',
    method: 'PUT',
    data: query
  })
}

//获取入库明细详情
export function getTInwarehousedetail(id) {
  return request({
    url: 'business/Inwarehousedetail/' + id,
    method: 'get'
  })
}

//修改主单
export function updateInwarehouse(data) {
  return request({
    url: 'business/Inwarehouse',
    method: 'PUT',
    data: data
  })
}

//获取主单详情
export function getInwarehouse(id) {
  return request({
    url: 'business/Inwarehouse/' + id,
    method: 'get'
  })
}

export function delTInwarehousedetail(id) {
  return request({
    url: 'business/Inwarehousedetail/delete/' + id,
    method: 'delete'
  })
}

/**
 * 新增采购计划入库
 * @param data
 */
export function addTGInwarehouse(data) {
  return request({
    url: 'business/TGInwarehouse',
    method: 'post',
    data: data
  })
}

export function generateInwarehouse(data) {
  return request({
    url: 'business/TGInwarehouse/generateInwarehouse',
    method: 'post',
    data: data
  })
}

export function generateSelectiveInwarehouse(data) {
  return request({
    url: 'business/TGInwarehouse/generateSelectiveInwarehouse',
    method: 'post',
    data: data
  })
}

//追加采购单
export function AppendSelectiveInwarehouse(data) {
  return request({
    url: 'business/TGInwarehouse/AppendSelectiveInwarehouse',
    method: 'post',
    data: data
  })
}

/**
 * 修改采购计划入库
 * @param data
 */
export function updateTGInwarehouse(data) {
  return request({
    url: 'business/TGInwarehouse',
    method: 'PUT',
    data: data
  })
}
/**
 * 获取采购计划入库详情
 * @param {Id}
 */
export function getTGInwarehouse(id) {
  return request({
    url: 'business/TGInwarehouse/' + id,
    method: 'get'
  })
}

/**
 * 删除采购计划入库
 * @param {主键} pid
 */
export function delTGInwarehouse(pid) {
  return request({
    url: 'business/TGInwarehouse/delete/' + pid,
    method: 'delete'
  })
}

/**
 * 删除采购计划入库
 * @param {主键} pid
 */
export function delInwarehouse(pid) {
  return request({
    url: 'business/Inwarehouse/delete/' + pid,
    method: 'delete'
  })
}

// 导出采购计划入库
export async function exportTGInwarehouse(query) {
  await downFile('business/TGInwarehouse/export', { ...query })
}

//推送入库单
export function pushInwarehouseOrder(data) {
  return request({
    url: 'business/TGInwarehouse/push',
    method: 'post',
    data: data
  })
}//推送入库单
export function returnPush(data) {
  return request({
    url: 'business/TGInwarehouse/returnPush',
    method: 'post',
    data: data
  })
}

//查询进销商
export function getSupplierInfoList(query) {
  return request({
    url: 'Guiz/CompanyInfo/list',
    method: 'get',
    params: query
  })
}
// 导出出库单
export async function Exports(query) {
  await downFile('business/TGInwarehouse/Exports', { ...query })
}


export function addplan(query) {
  return request({
    url: 'business/TGInwarehouse/Addplan',
    method: 'get',
    params: query
  })
}
export function TongBu(query) {
  return request({
    url: 'business/PhaInPlan/TongBu',
    method: 'get',
    params: query,
  })
}




export function getDepartmentsList(query) {
  return request({
    url: 'business/Departments/list',
    method: 'get',
    params: query
  })
}