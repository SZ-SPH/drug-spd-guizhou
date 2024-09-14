import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 医嘱分页查询
 * @param {查询条件} data
 */
export function listMedicalAdvice(query) {
  return request({
    url: 'business/MedicalAdvice/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增医嘱
 * @param data
 */
export function addMedicalAdvice(data) {
  return request({
    url: 'business/MedicalAdvice',
    method: 'post',
    data: data,
  })
}
/**
 * 修改医嘱
 * @param data
 */
export function updateMedicalAdvice(data) {
  return request({
    url: 'business/MedicalAdvice',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取医嘱详情
 * @param {Id}
 */
export function getMedicalAdvice(id) {
  return request({
    url: 'business/MedicalAdvice/' + id,
    method: 'get'
  })
}

/**
 * 删除医嘱
 * @param {主键} pid
 */
export function delMedicalAdvice(pid) {
  return request({
    url: 'business/MedicalAdvice/delete/' + pid,
    method: 'delete'
  })
}
// 清空医嘱
export function clearMedicalAdvice() {
  return request({
    url: 'business/MedicalAdvice/clean',
    method: 'delete'
  })
}
// 导出医嘱
export async function exportMedicalAdvice(query) {
  await downFile('business/MedicalAdvice/export', { ...query })
}