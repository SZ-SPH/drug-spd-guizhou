import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 采购退货分页查询
 * @param {查询条件} data
 */
export function listOutDrugs(query) {
  return request({
    url: 'business/OutDrugs/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增采购退货
 * @param data
 */
export function addOutDrugs(data) {
  return request({
    url: 'business/OutDrugs',
    method: 'post',
    data: data,
  })
}
/**
 * 修改采购退货
 * @param data
 */
export function updateOutDrugs(data) {
  return request({
    url: 'business/OutDrugs',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取采购退货详情
 * @param {Id}
 */
export function getOutDrugs(id) {
  return request({
    url: 'business/OutDrugs/' + id,
    method: 'get'
  })
}

/**
 * 删除采购退货
 * @param {主键} pid
 */
export function delOutDrugs(pid) {
  return request({
    url: 'business/OutDrugs/delete/' + pid,
    method: 'delete'
  })
}
// 清空采购退货
export function clearOutDrugs() {
  return request({
    url: 'business/OutDrugs/clean',
    method: 'delete'
  })
}
// 导出采购退货
export async function exportOutDrugs(query) {
  await downFile('business/OutDrugs/export', { ...query })
}
