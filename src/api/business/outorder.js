import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 出库单分页查询
 * @param {查询条件} data
 */
export function listOutOrder(query) {
  return request({
    url: 'business/OutOrder/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增出库单
 * @param data
 */
export function addOutOrder(data) {
  return request({
    url: 'business/OutOrder',
    method: 'post',
    data: data,
  })
}
/**
 * 修改出库单
 * @param data
 */
export function updateOutOrder(data) {
  return request({
    url: 'business/OutOrder',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取出库单详情
 * @param {Id}
 */
export function getOutOrder(id) {
  return request({
    url: 'business/OutOrder/' + id,
    method: 'get'
  })
}

/**
 * 删除出库单
 * @param {主键} pid
 */
export function delOutOrder(pid) {
  return request({
    url: 'business/OutOrder/delete/' + pid,
    method: 'delete'
  })
}
// 清空出库单
export function clearOutOrder() {
  return request({
    url: 'business/OutOrder/clean',
    method: 'delete'
  })
}
// 导出出库单
export async function exportOutOrder(query) {
  await downFile('business/OutOrder/export', { ...query })
}
