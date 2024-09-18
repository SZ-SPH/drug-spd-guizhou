import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 入库计划分页查询
 * @param {查询条件} data
 */
export function listInventoryPlan(query) {
  return request({
    url: 'business/InventoryPlan/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增入库计划
 * @param data
 */
export function addInventoryPlan(data) {
  return request({
    url: 'business/InventoryPlan',
    method: 'post',
    data: data,
  })
}
/**
 * 修改入库计划
 * @param data
 */
export function updateInventoryPlan(data) {
  return request({
    url: 'business/InventoryPlan',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库计划详情
 * @param {Id}
 */
export function getInventoryPlan(id) {
  return request({
    url: 'business/InventoryPlan/' + id,
    method: 'get'
  })
}

/**
 * 删除入库计划
 * @param {主键} pid
 */
export function delInventoryPlan(pid) {
  return request({
    url: 'business/InventoryPlan/delete/' + pid,
    method: 'delete'
  })
}
// 清空入库计划
export function clearInventoryPlan() {
  return request({
    url: 'business/InventoryPlan/clean',
    method: 'delete'
  })
}
// 导出入库计划
export async function exportInventoryPlan(query) {
  await downFile('business/InventoryPlan/export', { ...query })
}
