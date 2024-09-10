import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 备货单分页查询
 * @param {查询条件} data
 */
export function listStockOrder(query) {
  return request({
    url: 'business/StockOrder/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增备货单
 * @param data
 */
export function addStockOrder(data) {
  return request({
    url: 'business/StockOrder',
    method: 'post',
    data: data,
  })
}
/**
 * 修改备货单
 * @param data
 */
export function updateStockOrder(data) {
  return request({
    url: 'business/StockOrder',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取备货单详情
 * @param {Id}
 */
export function getStockOrder(id) {
  return request({
    url: 'business/StockOrder/' + id,
    method: 'get'
  })
}

/**
 * 删除备货单
 * @param {主键} pid
 */
export function delStockOrder(pid) {
  return request({
    url: 'business/StockOrder/delete/' + pid,
    method: 'delete'
  })
}
// 清空备货单
export function clearStockOrder() {
  return request({
    url: 'business/StockOrder/clean',
    method: 'delete'
  })
}
// 导出备货单
export async function exportStockOrder(query) {
  await downFile('business/StockOrder/export', { ...query })
}
