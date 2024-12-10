import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 入库详情分页查询
 * @param {查询条件} data
 */
export function listPhaInput(query) {
  return request({
    url: 'business/PhaInput/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增入库详情
 * @param data
 */
export function addPhaInput(data) {
  return request({
    url: 'business/PhaInput',
    method: 'post',
    data: data,
  })
}
/**
 * 修改入库详情
 * @param data
 */
export function updatePhaInput(data) {
  return request({
    url: 'business/PhaInput',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库详情详情
 * @param {Id}
 */
export function getPhaInput(id) {
  return request({
    url: 'business/PhaInput/' + id,
    method: 'get'
  })
}

/**
 * 删除入库详情
 * @param {主键} pid
 */
export function delPhaInput(pid) {
  return request({
    url: 'business/PhaInput/delete/' + pid,
    method: 'delete'
  })
}
// 清空入库详情
export function clearPhaInput() {
  return request({
    url: 'business/PhaInput/clean',
    method: 'delete'
  })
}
// 导出入库详情
export async function exportPhaInput(query) {
  await downFile('business/PhaInput/export', { ...query })
}
