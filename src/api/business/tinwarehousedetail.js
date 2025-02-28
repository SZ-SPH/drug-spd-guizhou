import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 入库详情分页查询
 * @param {查询条件} data
 */
export function listTInwarehousedetail(query) {
  return request({
    url: 'business/TInwarehousedetail/list',
    method: 'get',
    params: query,
  })
}
export function listTInwarehousedetails(query) {
  return request({
    url: 'business/TInwarehousedetail/lists',
    method: 'get',
    params: query,
  })
}
/**
 * 新增入库详情
 * @param data
 */
export function addTInwarehousedetail(data) {
  return request({
    url: 'business/TInwarehousedetail',
    method: 'post',
    data: data,
  })
}
/**
 * 修改入库详情
 * @param data
 */
export function updateTInwarehousedetail(data) {
  return request({
    url: 'business/TInwarehousedetail',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库详情详情
 * @param {Id}
 */
export function getTInwarehousedetail(id) {
  return request({
    url: 'business/TInwarehousedetail/' + id,
    method: 'get'
  })
}

/**
 * 删除入库详情
 * @param {主键} pid
 */
export function delTInwarehousedetail(pid) {
  return request({
    url: 'business/TInwarehousedetail/delete/' + pid,
    method: 'delete'
  })
}
// 清空入库详情
export function clearTInwarehousedetail() {
  return request({
    url: 'business/TInwarehousedetail/clean',
    method: 'delete'
  })
}
// 导出入库详情
export async function exportTInwarehousedetail(query) {
  await downFile('business/TInwarehousedetail/export', { ...query })
}
