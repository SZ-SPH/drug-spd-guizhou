import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 入库计划分页查询
 * @param {查询条件} data
 */
export function listPhaInPlan(query) {
  return request({
    url: 'business/PhaInPlan/list',
    method: 'get',
    params: query,
  })
}
export function Tongbu(query) {
  return request({
    url: 'business/PhaInPlan/TongBu',
    method: 'get',
    params: query,
  })
}
/**
 * 新增入库计划
 * @param data
 */
export function addPhaInPlan(data) {
  return request({
    url: 'business/PhaInPlan',
    method: 'post',
    data: data,
  })
}
/**
 * 修改入库计划
 * @param data
 */
export function updatePhaInPlan(data) {
  return request({
    url: 'business/PhaInPlan',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库计划详情
 * @param {Id}
 */
export function getPhaInPlan(id) {
  return request({
    url: 'business/PhaInPlan/' + id,
    method: 'get'
  })
}

/**
 * 删除入库计划
 * @param {主键} pid
 */
export function delPhaInPlan(pid) {
  return request({
    url: 'business/PhaInPlan/delete/' + pid,
    method: 'delete'
  })
}
// 清空入库计划
export function clearPhaInPlan() {
  return request({
    url: 'business/PhaInPlan/clean',
    method: 'delete'
  })
}
// 导出入库计划
export async function exportPhaInPlan(query) {
  await downFile('business/PhaInPlan/export', { ...query })
}
