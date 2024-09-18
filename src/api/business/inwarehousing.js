import request from '@/utils/request'
import { downFile } from '@/utils/request'


/**
 * 获取码信息
 * @param {codes}
 */
export function getcodedetail(codes) {
  return request({
    url: 'Mtaobo/' + codes,
    method: 'get'
  })
}

// QueryInWarehousingDrug
/**
 * 入库信息分页查询
 * @param {查询条件} data
 */
export function listInWarehousing(query) {
  return request({
    url: 'business/InWarehousingDrug/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增入库信息
 * @param data
 */
export function addInWarehousing(data) {
  return request({
    url: 'business/InWarehousing',
    method: 'post',
    data: data,
  })
}
/**
 * 修改入库信息
 * @param data
 */
export function updateInWarehousing(data) {
  return request({
    url: 'business/InWarehousing',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取入库信息详情
 * @param {Id}
 */
export function getInWarehousing(id) {
  return request({
    url: 'business/InWarehousing/' + id,
    method: 'get'
  })
}

/**
 * 删除入库信息
 * @param {主键} pid
 */
export function delInWarehousing(pid) {
  return request({
    url: 'business/InWarehousing/delete/' + pid,
    method: 'delete'
  })
}
// 导出入库信息
export async function exportInWarehousing(query) {
  await downFile('business/InWarehousing/export', { ...query })
}