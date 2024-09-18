import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 送货单药品分页查询
 * @param {查询条件} data
 */
export function listDeliveryOrderDrug(query) {
  return request({
    url: 'business/DeliveryOrderDrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增送货单药品
 * @param data
 */
export function addDeliveryOrderDrug(data) {
  return request({
    url: 'business/DeliveryOrderDrug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改送货单药品
 * @param data
 */
export function updateDeliveryOrderDrug(data) {
  return request({
    url: 'business/DeliveryOrderDrug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取送货单药品详情
 * @param {Id}
 */
export function getDeliveryOrderDrug(id) {
  return request({
    url: 'business/DeliveryOrderDrug/' + id,
    method: 'get'
  })
}

/**
 * 删除送货单药品
 * @param {主键} pid
 */
export function delDeliveryOrderDrug(pid) {
  return request({
    url: 'business/DeliveryOrderDrug/delete/' + pid,
    method: 'delete'
  })
}
// 清空送货单药品
export function clearDeliveryOrderDrug() {
  return request({
    url: 'business/DeliveryOrderDrug/clean',
    method: 'delete'
  })
}
// 导出送货单药品
export async function exportDeliveryOrderDrug(query) {
  await downFile('business/DeliveryOrderDrug/export', { ...query })
}
