import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 出库药品详情分页查询
 * @param {查询条件} data
 */
export function listOuWarehouset(query) {
  return request({
    url: 'business/OuWarehouset/list',
    method: 'get',
    params: query,
  })
}
export function DaylistOuWarehouset(query) {
  return request({
    url: 'business/OuWarehouset/Alldaylist',
    method: 'get',
    params: query,
  })
}


export function aLLADDplanStock(query) {
  return request({
    url: 'business/OuWarehouset',
    method: 'get',
    params: query,
  })
}
/**
 * 新增出库药品详情
 * @param data
 */
export function addOuWarehouset(data) {
  return request({
    url: 'business/OuWarehouset',
    method: 'post',
    data: data,
  })
}
/**
 * 修改出库药品详情
 * @param data
 */
export function updateOuWarehouset(data) {
  return request({
    url: 'business/OuWarehouset',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取出库药品详情详情
 * @param {Id}
 */
export function getOuWarehouset(id) {
  return request({
    url: 'business/OuWarehouset/' + id,
    method: 'get'
  })
}

/**
 * 删除出库药品详情
 * @param {主键} pid
 */
export function delOuWarehouset(pid) {
  return request({
    url: 'business/OuWarehouset/delete/' + pid,
    method: 'delete'
  })
}
// 清空出库药品详情
export function clearOuWarehouset() {
  return request({
    url: 'business/OuWarehouset/clean',
    method: 'delete'
  })
}
// 导出出库药品详情
export async function exportOuWarehouset(query) {
  await downFile('business/OuWarehouset/export', { ...query })
}
