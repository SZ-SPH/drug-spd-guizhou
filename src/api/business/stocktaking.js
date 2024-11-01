import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 盘点单分页查询
 * @param {查询条件} data
 */
export function listStocktaking(query) {
  return request({
    url: 'business/Stocktaking/list',
    method: 'get',
    params: query
  })
}

/**
 * 新增盘点单
 * @param data
 */
export function addStocktaking() {
  return request({
    url: 'business/Stocktaking',
    method: 'post'
  })
}
/**
 * 修改盘点单
 * @param data
 */
export function updateStocktaking(data) {
  return request({
    url: 'business/Stocktaking',
    method: 'PUT',
    data: data
  })
}
/**
 * 获取盘点单详情
 * @param {Id}
 */
export function getStocktaking(id) {
  return request({
    url: 'business/Stocktaking/' + id,
    method: 'get'
  })
}

/**
 * 删除盘点单
 * @param {主键} pid
 */
export function delStocktaking(pid) {
  return request({
    url: 'business/Stocktaking/delete/' + pid,
    method: 'delete'
  })
}
// 导出盘点单
export async function exportStocktaking(query) {
  await downFile('business/Stocktaking/export', { ...query })
}
