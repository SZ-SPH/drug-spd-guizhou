import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 仓库分页查询
 * @param {查询条件} data
 */
export function listWarehouse(query) {
  return request({
    url: 'business/Warehouse/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增仓库
 * @param data
 */
export function addWarehouse(data) {
  return request({
    url: 'business/Warehouse',
    method: 'post',
    data: data,
  })
}
/**
 * 修改仓库
 * @param data
 */
export function updateWarehouse(data) {
  return request({
    url: 'business/Warehouse',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取仓库详情
 * @param {Id}
 */
export function getWarehouse(id) {
  return request({
    url: 'business/Warehouse/' + id,
    method: 'get'
  })
}

/**
 * 删除仓库
 * @param {主键} pid
 */
export function delWarehouse(pid) {
  return request({
    url: 'business/Warehouse/delete/' + pid,
    method: 'delete'
  })
}
// 清空仓库
export function clearWarehouse() {
  return request({
    url: 'business/Warehouse/clean',
    method: 'delete'
  })
}
// 导出仓库
export async function exportWarehouse(query) {
  await downFile('business/Warehouse/export', { ...query })
}