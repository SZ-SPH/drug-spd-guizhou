import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 出库记录分页查询
 * @param {查询条件} data
 */
export function listPhaOut(query) {
  return request({
    url: 'business/PhaOut/list',
    method: 'get',
    params: query,
  })
}
export function Tongbu(query) {
  return request({
    url: 'business/PhaOut/TongBu',
    method: 'get',
    params: query,
  })
}

/**
 * 新增出库记录
 * @param data
 */
export function addPhaOut(data) {
  return request({
    url: 'business/PhaOut',
    method: 'post',
    data: data,
  })
}


export function addOut(data) {
  return request({
    url: 'business/PhaOut/Addout',
    method: 'post',
    data: data,
  })
}
/**
 * 修改出库记录
 * @param data
 */
export function updatePhaOut(data) {
  return request({
    url: 'business/PhaOut',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取出库记录详情
 * @param {Id}
 */
export function getPhaOut(id) {
  return request({
    url: 'business/PhaOut/' + id,
    method: 'get'
  })
}

/**
 * 删除出库记录
 * @param {主键} pid
 */
export function delPhaOut(pid) {
  return request({
    url: 'business/PhaOut/delete/' + pid,
    method: 'delete'
  })
}
// 清空出库记录
export function clearPhaOut() {
  return request({
    url: 'business/PhaOut/clean',
    method: 'delete'
  })
}
// 导出出库记录
export async function exportPhaOut(query) {
  await downFile('business/PhaOut/export', { ...query })
}
