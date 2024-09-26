import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 货位分页查询
 * @param {查询条件} data
 */
export function listLocation(query) {
  return request({
    url: 'business/Location/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增货位
 * @param data
 */
export function addLocation(data) {
  return request({
    url: 'business/Location',
    method: 'post',
    data: data,
  })
}
/**
 * 修改货位
 * @param data
 */
export function updateLocation(data) {
  return request({
    url: 'business/Location',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取货位详情
 * @param {Id}
 */
export function getLocation(id) {
  return request({
    url: 'business/Location/' + id,
    method: 'get'
  })
}

/**
 * 删除货位
 * @param {主键} pid
 */
export function delLocation(pid) {
  return request({
    url: 'business/Location/delete/' + pid,
    method: 'delete'
  })
}
// 清空货位
export function clearLocation() {
  return request({
    url: 'business/Location/clean',
    method: 'delete'
  })
}
// 导出货位
export async function exportLocation(query) {
  await downFile('business/Location/export', { ...query })
}
