import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 申请计划分页查询
 * @param {查询条件} data
 */
export function listApplicationPlan(query) {
  return request({
    url: 'business/ApplicationPlan/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增申请计划
 * @param data
 */
export function addApplicationPlan(data) {
  return request({
    url: 'business/ApplicationPlan',
    method: 'post',
    data: data,
  })
}
/**
 * 修改申请计划
 * @param data
 */
export function updateApplicationPlan(data) {
  return request({
    url: 'business/ApplicationPlan',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取申请计划详情
 * @param {Id}
 */
export function getApplicationPlan(id) {
  return request({
    url: 'business/ApplicationPlan/' + id,
    method: 'get'
  })
}

/**
 * 删除申请计划
 * @param {主键} pid
 */
export function delApplicationPlan(pid) {
  return request({
    url: 'business/ApplicationPlan/delete/' + pid,
    method: 'delete'
  })
}
// 清空申请计划
export function clearApplicationPlan() {
  return request({
    url: 'business/ApplicationPlan/clean',
    method: 'delete'
  })
}
// 导出申请计划
export async function exportApplicationPlan(query) {
  await downFile('business/ApplicationPlan/export', { ...query })
}
