import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 合同管理分页查询
 * @param {查询条件} data
 */
export function listSupplyContract(query) {
  return request({
    url: 'business/SupplyContract/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增合同管理
 * @param data
 */
export function addSupplyContract(data) {
  return request({
    url: 'business/SupplyContract',
    method: 'post',
    data: data,
  })
}
/**
 * 修改合同管理
 * @param data
 */
export function updateSupplyContract(data) {
  return request({
    url: 'business/SupplyContract',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取合同管理详情
 * @param {Id}
 */
export function getSupplyContract(id) {
  return request({
    url: 'business/SupplyContract/' + id,
    method: 'get'
  })
}

/**
 * 删除合同管理
 * @param {主键} pid
 */
export function delSupplyContract(pid) {
  return request({
    url: 'business/SupplyContract/delete/' + pid,
    method: 'delete'
  })
}
// 清空合同管理
export function clearSupplyContract() {
  return request({
    url: 'business/SupplyContract/clean',
    method: 'delete'
  })
}
// 导出合同管理
export async function exportSupplyContract(query) {
  await downFile('business/SupplyContract/export', { ...query })
}
