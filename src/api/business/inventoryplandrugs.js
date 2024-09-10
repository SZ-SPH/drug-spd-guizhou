import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 入库计划药品分页查询
 * @param {查询条件} data
 */
export function listInventoryPlanDrugs(query) {
  return request({
    url: 'business/InventoryPlanDrugs/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增入库计划药品
 * @param data
 */
export function addInventoryPlanDrugs(data) {
  return request({
    url: 'business/InventoryPlanDrugs',
    method: 'post',
    data: data,
  })
}
/**
 * 修改入库计划药品
 * @param data
 */
export function updateInventoryPlanDrugs(data) {
  return request({
    url: 'business/InventoryPlanDrugs',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库计划药品详情
 * @param {Id}
 */
export function getInventoryPlanDrugs(id) {
  return request({
    url: 'business/InventoryPlanDrugs/' + id,
    method: 'get'
  })
}

/**
 * 删除入库计划药品
 * @param {主键} pid
 */
export function delInventoryPlanDrugs(pid) {
  return request({
    url: 'business/InventoryPlanDrugs/delete/' + pid,
    method: 'delete'
  })
}
// 清空入库计划药品
export function clearInventoryPlanDrugs() {
  return request({
    url: 'business/InventoryPlanDrugs/clean',
    method: 'delete'
  })
}
// 导出入库计划药品
export async function exportInventoryPlanDrugs(query) {
  await downFile('business/InventoryPlanDrugs/export', { ...query })
}
