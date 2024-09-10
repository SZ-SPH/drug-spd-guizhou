import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 送货单分页查询
 * @param {查询条件} data
 */
export function listDeliveryOrder(query) {
  return request({
    url: 'business/DeliveryOrder/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增送货单
 * @param data
 */
export function addDeliveryOrder(data) {
  return request({
    url: 'business/DeliveryOrder',
    method: 'post',
    data: data,
  })
}
/**
 * 修改送货单
 * @param data
 */
export function updateDeliveryOrder(data) {
  return request({
    url: 'business/DeliveryOrder',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取送货单详情
 * @param {Id}
 */
export function getDeliveryOrder(id) {
  return request({
    url: 'business/DeliveryOrder/' + id,
    method: 'get'
  })
}

/**
 * 删除送货单
 * @param {主键} pid
 */
export function delDeliveryOrder(pid) {
  return request({
    url: 'business/DeliveryOrder/delete/' + pid,
    method: 'delete'
  })
}
// 清空送货单
export function clearDeliveryOrder() {
  return request({
    url: 'business/DeliveryOrder/clean',
    method: 'delete'
  })
}
// 导出送货单
export async function exportDeliveryOrder(query) {
  await downFile('business/DeliveryOrder/export', { ...query })
}
