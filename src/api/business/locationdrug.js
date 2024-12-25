import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 货位药品分页查询
 * @param {查询条件} data
 */
export function listLocationDrug(query) {
  return request({
    url: 'business/LocationDrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增货位药品
 * @param data
 */
export function addLocationDrug(data) {
  return request({
    url: 'business/LocationDrug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改货位药品
 * @param data
 */
export function updateLocationDrug(data) {
  return request({
    url: 'business/LocationDrug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取货位药品详情
 * @param {Id}
 */
export function getLocationDrug(id) {
  return request({
    url: 'business/LocationDrug/' + id,
    method: 'get'
  })
}

/**
 * 删除货位药品
 * @param {主键} pid
 */
export function delLocationDrug(pid) {
  return request({
    url: 'business/LocationDrug/delete/' + pid,
    method: 'delete'
  })
}
// 清空货位药品
export function clearLocationDrug() {
  return request({
    url: 'business/LocationDrug/clean',
    method: 'delete'
  })
}
// 导出货位药品
export async function exportLocationDrug(query) {
  await downFile('business/LocationDrug/export', { ...query })
}
