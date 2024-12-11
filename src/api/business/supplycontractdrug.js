import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 合同药品分页查询
 * @param {查询条件} data
 */
export function listSupplyContractDrug(query) {
  return request({
    url: 'business/SupplyContractDrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增合同药品
 * @param data
 */
export function addSupplyContractDrug(data) {
  return request({
    url: 'business/SupplyContractDrug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改合同药品
 * @param data
 */
export function updateSupplyContractDrug(data) {
  return request({
    url: 'business/SupplyContractDrug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取合同药品详情
 * @param {Id}
 */
export function getSupplyContractDrug(id) {
  return request({
    url: 'business/SupplyContractDrug/' + id,
    method: 'get'
  })
}

/**
 * 删除合同药品
 * @param {主键} pid
 */
export function delSupplyContractDrug(pid) {
  return request({
    url: 'business/SupplyContractDrug/delete/' + pid,
    method: 'delete'
  })
}
// 清空合同药品
export function clearSupplyContractDrug() {
  return request({
    url: 'business/SupplyContractDrug/clean',
    method: 'delete'
  })
}
// 导出合同药品
export async function exportSupplyContractDrug(query) {
  await downFile('business/SupplyContractDrug/export', { ...query })
}
