import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 库存分页查询
 * @param {查询条件} data
 */
export function listPhaStorage(query) {
  return request({
    url: 'business/PhaStorage/list',
    method: 'get',
    params: query,
  })
}
export function TongBu(query) {
  return request({
    url: 'business/PhaStorage/TongBu',
    method: 'post',
    params: query,
  })
}
export function SUMPrices(query) {
  return request({
    url: 'business/PhaStorage/allprice',
    method: 'get',
    params: query,
  })
}
// export function SUMPrices(code) {
//   return request({
//     url: 'business/PhaStorage/allprice' + code,
//     method: 'get'
//   })
// }

/**
 * 新增库存
 * @param data
 */
export function addPhaStorage(data) {
  return request({
    url: 'business/PhaStorage',
    method: 'post',
    data: data,
  })
}
/**
 * 修改库存
 * @param data
 */
export function updatePhaStorage(data) {
  return request({
    url: 'business/PhaStorage',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取库存详情
 * @param {Id}
 */
export function getPhaStorage(id) {
  return request({
    url: 'business/PhaStorage/' + id,
    method: 'get'
  })
}

/**
 * 删除库存
 * @param {主键} pid
 */
export function delPhaStorage(pid) {
  return request({
    url: 'business/PhaStorage/delete/' + pid,
    method: 'delete'
  })
}
// 清空库存
export function clearPhaStorage() {
  return request({
    url: 'business/PhaStorage/clean',
    method: 'delete'
  })
}
// 导出库存
export async function exportPhaStorage(query) {
  await downFile('business/PhaStorage/export', { ...query })
}
