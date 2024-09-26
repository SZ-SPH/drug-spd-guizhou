import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 库存分页查询
 * @param {查询条件} data
 */
export function listStock(query) {
  return request({
    url: 'business/Stock/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增库存
 * @param data
 */
export function addStock(data) {
  return request({
    url: 'business/Stock',
    method: 'post',
    data: data,
  })
}
/**
 * 修改库存
 * @param data
 */
export function updateStock(data) {
  return request({
    url: 'business/Stock',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取库存详情
 * @param {Id}
 */
export function getStock(id) {
  return request({
    url: 'business/Stock/' + id,
    method: 'get'
  })
}

/**
 * 删除库存
 * @param {主键} pid
 */
export function delStock(pid) {
  return request({
    url: 'business/Stock/delete/' + pid,
    method: 'delete'
  })
}
// 清空库存
export function clearStock() {
  return request({
    url: 'business/Stock/clean',
    method: 'delete'
  })
}
// 导出库存
export async function exportStock(query) {
  await downFile('business/Stock/export', { ...query })
}
