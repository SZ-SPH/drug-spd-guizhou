import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 备货单药品分页查询
 * @param {查询条件} data
 */
export function listStockOrderDrug(query) {
  return request({
    url: 'business/StockOrderDrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增备货单药品
 * @param data
 */
export function addStockOrderDrug(data) {
  return request({
    url: 'business/StockOrderDrug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改备货单药品
 * @param data
 */
export function updateStockOrderDrug(data) {
  return request({
    url: 'business/StockOrderDrug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取备货单药品详情
 * @param {Id}
 */
export function getStockOrderDrug(id) {
  return request({
    url: 'business/StockOrderDrug/' + id,
    method: 'get'
  })
}

/**
 * 删除备货单药品
 * @param {主键} pid
 */
export function delStockOrderDrug(pid) {
  return request({
    url: 'business/StockOrderDrug/delete/' + pid,
    method: 'delete'
  })
}
// 清空备货单药品
export function clearStockOrderDrug() {
  return request({
    url: 'business/StockOrderDrug/clean',
    method: 'delete'
  })
}
// 导出备货单药品
export async function exportStockOrderDrug(query) {
  await downFile('business/StockOrderDrug/export', { ...query })
}
