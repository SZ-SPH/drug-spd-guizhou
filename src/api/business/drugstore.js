import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 药房分页查询
 * @param {查询条件} data
 */
export function listDrugStore(query) {
  return request({
    url: 'business/DrugStore/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增药房
 * @param data
 */
export function addDrugStore(data) {
  return request({
    url: 'business/DrugStore',
    method: 'post',
    data: data,
  })
}
/**
 * 修改药房
 * @param data
 */
export function updateDrugStore(data) {
  return request({
    url: 'business/DrugStore',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取药房详情
 * @param {Id}
 */
export function getDrugStore(id) {
  return request({
    url: 'business/DrugStore/' + id,
    method: 'get'
  })
}

/**
 * 删除药房
 * @param {主键} pid
 */
export function delDrugStore(pid) {
  return request({
    url: 'business/DrugStore/delete/' + pid,
    method: 'delete'
  })
}
// 清空药房
export function clearDrugStore() {
  return request({
    url: 'business/DrugStore/clean',
    method: 'delete'
  })
}
// 导出药房
export async function exportDrugStore(query) {
  await downFile('business/DrugStore/export', { ...query })
}
