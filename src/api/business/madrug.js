import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 医嘱药品分页查询
 * @param {查询条件} data
 */
export function listMADrug(query) {
  return request({
    url: 'business/MADrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增医嘱药品
 * @param data
 */
export function addMADrug(data) {
  return request({
    url: 'business/MADrug',
    method: 'post',
    data: data,
  })
}
/**
 * 修改医嘱药品
 * @param data
 */
export function updateMADrug(data) {
  return request({
    url: 'business/MADrug',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取医嘱药品详情
 * @param {Id}
 */
export function getMADrug(id) {
  return request({
    url: 'business/MADrug/' + id,
    method: 'get'
  })
}

/**
 * 删除医嘱药品
 * @param {主键} pid
 */
export function delMADrug(pid) {
  return request({
    url: 'business/MADrug/delete/' + pid,
    method: 'delete'
  })
}
// 清空医嘱药品
export function clearMADrug() {
  return request({
    url: 'business/MADrug/clean',
    method: 'delete'
  })
}
// 导出医嘱药品
export async function exportMADrug(query) {
  await downFile('business/MADrug/export', { ...query })
}
