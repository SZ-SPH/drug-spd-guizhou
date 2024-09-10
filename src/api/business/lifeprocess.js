import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 生命周期分页查询
 * @param {查询条件} data
 */
export function listLifeProcess(query) {
  return request({
    url: 'business/LifeProcess/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增生命周期
 * @param data
 */
export function addLifeProcess(data) {
  return request({
    url: 'business/LifeProcess',
    method: 'post',
    data: data,
  })
}
/**
 * 修改生命周期
 * @param data
 */
export function updateLifeProcess(data) {
  return request({
    url: 'business/LifeProcess',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取生命周期详情
 * @param {Id}
 */
export function getLifeProcess(id) {
  return request({
    url: 'business/LifeProcess/' + id,
    method: 'get'
  })
}

/**
 * 删除生命周期
 * @param {主键} pid
 */
export function delLifeProcess(pid) {
  return request({
    url: 'business/LifeProcess/delete/' + pid,
    method: 'delete'
  })
}
// 清空生命周期
export function clearLifeProcess() {
  return request({
    url: 'business/LifeProcess/clean',
    method: 'delete'
  })
}
// 导出生命周期
export async function exportLifeProcess(query) {
  await downFile('business/LifeProcess/export', { ...query })
}