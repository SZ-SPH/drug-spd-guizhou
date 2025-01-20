import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 采购退货分页查询
 * @param {查询条件} data
 */
export function listDrugInventory(query) {
  return request({
    url: 'business/DrugInventory/list',
    method: 'get',
    params: query,
  })
}
export function TongBu(query) {
  return request({
    url: 'business/DrugInventory/TongBu',
    method: 'get',
    params: query,
  })
}
export function addOut(data) {
  return request({
    url: 'business/DrugInventory/Addout',
       method: 'post',
    data: data,
  })
}

/**
 * 新增采购退货
 * @param data
 */
export function addDrugInventory(data) {
  return request({
    url: 'business/DrugInventory',
    method: 'post',
    data: data,
  })
}
/**
 * 修改采购退货
 * @param data
 */
export function updateDrugInventory(data) {
  return request({
    url: 'business/DrugInventory',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取采购退货详情
 * @param {Id}
 */
export function getDrugInventory(id) {
  return request({
    url: 'business/DrugInventory/' + id,
    method: 'get'
  })
}

/**
 * 删除采购退货
 * @param {主键} pid
 */
export function delDrugInventory(pid) {
  return request({
    url: 'business/DrugInventory/delete/' + pid,
    method: 'delete'
  })
}
// 清空采购退货
export function clearDrugInventory() {
  return request({
    url: 'business/DrugInventory/clean',
    method: 'delete'
  })
}
// 导出采购退货
export async function exportDrugInventory(query) {
  await downFile('business/DrugInventory/export', { ...query })
}
