import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 生产厂家分页查询
 * @param {查询条件} data
 */
export function listManufacturer(query) {
  return request({
    url: 'business/Manufacturer/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增生产厂家
 * @param data
 */
export function addManufacturer(data) {
  return request({
    url: 'business/Manufacturer',
    method: 'post',
    data: data,
  })
}
/**
 * 修改生产厂家
 * @param data
 */
export function updateManufacturer(data) {
  return request({
    url: 'business/Manufacturer',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取生产厂家详情
 * @param {Id}
 */
export function getManufacturer(id) {
  return request({
    url: 'business/Manufacturer/' + id,
    method: 'get'
  })
}

/**
 * 删除生产厂家
 * @param {主键} pid
 */
export function delManufacturer(pid) {
  return request({
    url: 'business/Manufacturer/delete/' + pid,
    method: 'delete'
  })
}
// 清空生产厂家
export function clearManufacturer() {
  return request({
    url: 'business/Manufacturer/clean',
    method: 'delete'
  })
}
// 导出生产厂家
export async function exportManufacturer(query) {
  await downFile('business/Manufacturer/export', { ...query })
}
