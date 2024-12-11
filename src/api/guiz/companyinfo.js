import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 厂家和供应商分页查询
 * @param {查询条件} data
 */
export function listCompanyInfo(query) {
  return request({
    url: 'Guiz/CompanyInfo/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增厂家和供应商
 * @param data
 */
export function addCompanyInfo(data) {
  return request({
    url: 'Guiz/CompanyInfo',
    method: 'post',
    data: data,
  })
}
/**
 * 修改厂家和供应商
 * @param data
 */
export function updateCompanyInfo(data) {
  return request({
    url: 'Guiz/CompanyInfo',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取厂家和供应商详情
 * @param {facCode}
 */
export function getCompanyInfo(facCode) {
  return request({
    url: 'Guiz/CompanyInfo/' + facCode,
    method: 'get'
  })
}

/**
 * 删除厂家和供应商
 * @param {主键} pid
 */
export function delCompanyInfo(pid) {
  return request({
    url: 'Guiz/CompanyInfo/delete/' + pid,
    method: 'delete'
  })
}
// 清空厂家和供应商
export function clearCompanyInfo() {
  return request({
    url: 'Guiz/CompanyInfo/clean',
    method: 'delete'
  })
}
// 导出厂家和供应商
export async function exportCompanyInfo(query) {
  await downFile('Guiz/CompanyInfo/export', { ...query })
}
