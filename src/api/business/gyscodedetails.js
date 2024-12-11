import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 送货单追溯码分页查询
 * @param {查询条件} data
 */
export function listGYSCodeDetails(query) {
  return request({
    url: 'business/GYSCodeDetails/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增送货单追溯码
 * @param data
 */
export function addGYSCodeDetails(data) {
  return request({
    url: 'business/GYSCodeDetails',
    method: 'post',
    data: data,
  })
}
/**
 * 修改送货单追溯码
 * @param data
 */
export function updateGYSCodeDetails(data) {
  return request({
    url: 'business/GYSCodeDetails',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取送货单追溯码详情
 * @param {Id}
 */
export function getGYSCodeDetails(id) {
  return request({
    url: 'business/GYSCodeDetails/' + id,
    method: 'get'
  })
}

/**
 * 删除送货单追溯码
 * @param {主键} pid
 */
export function delGYSCodeDetails(pid) {
  return request({
    url: 'business/GYSCodeDetails/delete/' + pid,
    method: 'delete'
  })
}
// 清空送货单追溯码
export function clearGYSCodeDetails() {
  return request({
    url: 'business/GYSCodeDetails/clean',
    method: 'delete'
  })
}
// 导出送货单追溯码
export async function exportGYSCodeDetails(query) {
  await downFile('business/GYSCodeDetails/export', { ...query })
}
