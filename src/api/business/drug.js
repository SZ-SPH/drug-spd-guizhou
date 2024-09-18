import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 药品基础信息分页查询
 * @param {查询条件} data
 */
export function listDrug(query) {
  return request({
    url: 'business/Drug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增药品基础信息
 * @param data
 */
export function addDrug(data) {
  return request({
    url: 'business/Drug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改药品基础信息
 * @param data
 */
export function updateDrug(data) {
  return request({
    url: 'business/Drug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取药品基础信息详情
 * @param {Id}
 */
export function getDrug(id) {
  return request({
    url: 'business/Drug/' + id,
    method: 'get'
  })
}

/**
 * 删除药品基础信息
 * @param {主键} pid
 */
export function delDrug(pid) {
  return request({
    url: 'business/Drug/delete/' + pid,
    method: 'delete'
  })
}
// 清空药品基础信息
export function clearDrug() {
  return request({
    url: 'business/Drug/clean',
    method: 'delete'
  })
}
// 导出药品基础信息
export async function exportDrug(query) {
  await downFile('business/Drug/export', { ...query })
}