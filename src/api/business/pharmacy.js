import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 药房分页查询
 * @param {查询条件} data
 */
export function listPharmacy(query) {
  return request({
    url: 'business/Pharmacy/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增药房
 * @param data
 */
export function addPharmacy(data) {
  return request({
    url: 'business/Pharmacy',
    method: 'post',
    data: data,
  })
}
/**
 * 修改药房
 * @param data
 */
export function updatePharmacy(data) {
  return request({
    url: 'business/Pharmacy',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取药房详情
 * @param {Id}
 */
export function getPharmacy(id) {
  return request({
    url: 'business/Pharmacy/' + id,
    method: 'get'
  })
}

/**
 * 删除药房
 * @param {主键} pid
 */
export function delPharmacy(pid) {
  return request({
    url: 'business/Pharmacy/delete/' + pid,
    method: 'delete'
  })
}
// 清空药房
export function clearPharmacy() {
  return request({
    url: 'business/Pharmacy/clean',
    method: 'delete'
  })
}
// 导出药房
export async function exportPharmacy(query) {
  await downFile('business/Pharmacy/export', { ...query })
}
