import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 科室分页查询
 * @param {查询条件} data
 */
export function listDepartments(query) {
  return request({
    url: 'business/Departments/list',
    method: 'get',
    params: query,
  })
}

export function TongBu(query) {
  return request({
    url: 'business/Departments/TongBu',
    method: 'get',
    params: query,
  })
}
/**
 * 新增科室
 * @param data
 */
export function addDepartments(data) {
  return request({
    url: 'business/Departments',
    method: 'post',
    data: data,
  })
}
/**
 * 修改科室
 * @param data
 */
export function updateDepartments(data) {
  return request({
    url: 'business/Departments',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取科室详情
 * @param {Id}
 */
export function getDepartments(id) {
  return request({
    url: 'business/Departments/' + id,
    method: 'get'
  })
}

/**
 * 删除科室
 * @param {主键} pid
 */
export function delDepartments(pid) {
  return request({
    url: 'business/Departments/delete/' + pid,
    method: 'delete'
  })
}
// 清空科室
export function clearDepartments() {
  return request({
    url: 'business/Departments/clean',
    method: 'delete'
  })
}
// 导出科室
export async function exportDepartments(query) {
  await downFile('business/Departments/export', { ...query })
}
