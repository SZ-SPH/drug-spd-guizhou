import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 码信息分页查询
 * @param {查询条件} data
 */
export function listCodeDetails(query) {
  return request({
    url: 'business/CodeDetails/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增码信息
 * @param data
 */
export function addCodeDetails(data) {
  return request({
    url: 'business/CodeDetails',
    method: 'post',
    data: data,
  })
}
/**
 * 修改码信息
 * @param data
 */
export function updateCodeDetails(data) {
  return request({
    url: 'business/CodeDetails',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取码信息详情
 * @param {Id}
 */
export function getCodeDetails(id) {
  return request({
    url: 'business/CodeDetails/' + id,
    method: 'get'
  })
}

/**
 * 删除码信息
 * @param {主键} pid
 */
export function delCodeDetails(pid) {
  return request({
    url: 'business/CodeDetails/delete/' + pid,
    method: 'delete'
  })
}
// 清空码信息
export function clearCodeDetails() {
  return request({
    url: 'business/CodeDetails/clean',
    method: 'delete'
  })
}
// 导出码信息
export async function exportCodeDetails(query) {
  await downFile('business/CodeDetails/export', { ...query })
}
